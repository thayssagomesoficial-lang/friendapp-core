const logger = require('../utils/logger');
const { getDb } = require('../config/database');

/**
 * Servico de moderacao automatica do MST
 * Aplica regras deterministicas baseadas em RiskScore e Confidence
 */

const THRESHOLDS = {
  RISK_AUTO_REJECT: 0.70,
  RISK_HUMAN_REVIEW: 0.30,
  CONFIDENCE_LOW: 0.55,
  IMPACT_LOW_NEW_CREATOR: 280,
  SIMILARITY_REPETITIVE: 0.92,
  NEW_CREATOR_DAYS: 7
};

/**
 * Decide o status de publicacao baseado nas regras de negocio
 */
const decidePublicationStatus = async (talent, creatorInfo = {}) => {
  const {
    risk_score = 0,
    confidence = 0,
    impact_score = 0,
    creator_id
  } = talent;

  const decision = {
    status: 'approved',
    visibility: 'public',
    reason: null,
    flags: []
  };

  // Regra 1: RiskScore alto - auto rejeicao
  if (risk_score >= THRESHOLDS.RISK_AUTO_REJECT) {
    decision.status = 'rejected';
    decision.visibility = 'private';
    decision.reason = 'high_risk';
    decision.flags.push('auto_rejected');
    
    await logModerationDecision(talent.id, 'auto', 'rejected', 'high_risk', risk_score);
    return decision;
  }

  // Regra 2: RiskScore medio - revisao humana
  if (risk_score >= THRESHOLDS.RISK_HUMAN_REVIEW) {
    decision.status = 'review';
    decision.visibility = 'private';
    decision.reason = 'medium_risk';
    decision.flags.push('needs_human_review');
    
    await logModerationDecision(talent.id, 'auto', 'escalated', 'medium_risk', risk_score);
    return decision;
  }

  // Regra 3: Confianca baixa da IA - revisao humana
  if (confidence < THRESHOLDS.CONFIDENCE_LOW) {
    decision.status = 'review';
    decision.visibility = 'private';
    decision.reason = 'low_confidence';
    decision.flags.push('needs_human_review');
    
    await logModerationDecision(talent.id, 'auto', 'escalated', 'low_confidence', risk_score);
    return decision;
  }

  // Regra 4: Criador novo com baixo impacto - visibilidade limitada
  const isNewCreator = await checkIfNewCreator(creator_id);
  if (isNewCreator && impact_score < THRESHOLDS.IMPACT_LOW_NEW_CREATOR) {
    decision.visibility = 'limited';
    decision.reason = 'new_creator_low_impact';
    decision.flags.push('limited_visibility');
  }

  // Regra 5: Conteudo repetitivo - visibilidade limitada
  const isRepetitive = await checkRepetitiveContent(creator_id, talent.feature_vector);
  if (isRepetitive) {
    decision.visibility = 'limited';
    decision.reason = 'repetitive_content';
    decision.flags.push('repetition_detected');
  }

  await logModerationDecision(talent.id, 'auto', decision.status, decision.reason || 'approved', risk_score);
  
  return decision;
};

/**
 * Verifica se o criador e novo (menos de 7 dias)
 */
const checkIfNewCreator = async (creatorId) => {
  try {
    const db = getDb();
    if (!db) return true; // Assume novo se nao conseguir verificar

    const result = await db.query(
      `SELECT MIN(created_at) as first_talent 
       FROM talent_items 
       WHERE creator_id = $1`,
      [creatorId]
    );

    if (!result.rows[0]?.first_talent) {
      return true;
    }

    const firstTalentDate = new Date(result.rows[0].first_talent);
    const daysSinceFirst = (Date.now() - firstTalentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceFirst < THRESHOLDS.NEW_CREATOR_DAYS;
  } catch (error) {
    logger.error('Error checking if new creator:', error);
    return true;
  }
};

/**
 * Verifica se o conteudo e repetitivo (similaridade > 92% com conteudos anteriores)
 */
const checkRepetitiveContent = async (creatorId, featureVector) => {
  if (!featureVector || featureVector.length === 0) {
    return false;
  }

  try {
    const db = getDb();
    if (!db) return false;

    // Busca os ultimos 3 conteudos do criador
    const result = await db.query(
      `SELECT feature_vector 
       FROM talent_items 
       WHERE creator_id = $1 
         AND feature_vector IS NOT NULL 
         AND status = 'approved'
       ORDER BY created_at DESC 
       LIMIT 3`,
      [creatorId]
    );

    for (const row of result.rows) {
      if (row.feature_vector) {
        const similarity = cosineSimilarity(featureVector, row.feature_vector);
        if (similarity >= THRESHOLDS.SIMILARITY_REPETITIVE) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    logger.error('Error checking repetitive content:', error);
    return false;
  }
};

/**
 * Registra a decisao de moderacao no banco
 */
const logModerationDecision = async (talentId, reviewerType, decision, reason, riskScore) => {
  try {
    const db = getDb();
    if (!db) return;

    await db.query(
      `INSERT INTO mst_moderation_reviews 
       (talent_id, reviewer_type, decision, reason, risk_score_at_review)
       VALUES ($1, $2, $3, $4, $5)`,
      [talentId, reviewerType, decision, reason, riskScore]
    );

    logger.info(`Moderation decision logged: ${decision} for talent ${talentId}`);
  } catch (error) {
    logger.error('Error logging moderation decision:', error);
  }
};

/**
 * Processa revisao humana
 */
const processHumanReview = async (talentId, reviewerId, decision, reason) => {
  try {
    const db = getDb();
    
    // Atualiza o status do talento
    const statusMap = {
      'approved': { status: 'approved', visibility: 'public' },
      'rejected': { status: 'rejected', visibility: 'private' },
      'limited': { status: 'approved', visibility: 'limited' }
    };

    const newStatus = statusMap[decision] || statusMap['rejected'];

    await db.query(
      `UPDATE talent_items 
       SET status = $1, 
           visibility = $2, 
           published_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END,
           updated_at = NOW()
       WHERE id = $3`,
      [newStatus.status, newStatus.visibility, talentId]
    );

    // Registra a revisao humana
    await db.query(
      `INSERT INTO mst_moderation_reviews 
       (talent_id, reviewer_id, reviewer_type, decision, reason)
       VALUES ($1, $2, 'human', $3, $4)`,
      [talentId, reviewerId, decision, reason]
    );

    logger.info(`Human review completed: ${decision} for talent ${talentId} by ${reviewerId}`);

    return { success: true, status: newStatus.status, visibility: newStatus.visibility };
  } catch (error) {
    logger.error('Error processing human review:', error);
    throw error;
  }
};

/**
 * Obtem talentos pendentes de revisao
 */
const getPendingReviews = async (limit = 50) => {
  try {
    const db = getDb();
    
    const result = await db.query(
      `SELECT t.*, 
              (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id) as engagement_count
       FROM talent_items t
       WHERE t.status = 'review'
       ORDER BY t.risk_score DESC, t.created_at ASC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error getting pending reviews:', error);
    throw error;
  }
};

// Funcao auxiliar de similaridade
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = {
  decidePublicationStatus,
  checkIfNewCreator,
  checkRepetitiveContent,
  processHumanReview,
  getPendingReviews,
  THRESHOLDS
};
