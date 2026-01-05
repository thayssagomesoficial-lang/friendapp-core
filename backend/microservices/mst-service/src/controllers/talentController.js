const { v4: uuidv4 } = require('uuid');
const { getDb, getFirestore } = require('../config/database');
const logger = require('../utils/logger');
const { 
  calculateImpactScore, 
  calculateRiskScore, 
  calculateArchetypeScores,
  calculateConfidence,
  calculateFeedScore
} = require('../services/impactCalculator');
const { decidePublicationStatus } = require('../services/moderationService');
const { rewardCreatorEngagement } = require('../services/economiaIntegration');

/**
 * Cria um novo talento (upload de conteudo)
 */
const createTalent = async (req, res) => {
  try {
    const {
      creator_id,
      title,
      description,
      type,
      intent,
      language,
      media_refs,
      thumbnail_url,
      duration_seconds,
      transcription,
      feature_vector
    } = req.body;

    if (!creator_id || !title || !type) {
      return res.status(400).json({
        error: 'creator_id, title e type sao obrigatorios'
      });
    }

    const db = getDb();
    const talentId = uuidv4();

    // Calcula scores baseados no feature vector
    const impactScore = calculateImpactScore(feature_vector);
    const riskScore = calculateRiskScore(feature_vector);
    const archetypeScores = calculateArchetypeScores(feature_vector);
    const confidence = calculateConfidence(feature_vector);

    // Insere o talento no banco
    const result = await db.query(
      `INSERT INTO talent_items 
       (id, creator_id, title, description, type, intent, language, media_refs, 
        thumbnail_url, duration_seconds, transcription, feature_vector,
        impact_score, risk_score, archetype_scores, confidence, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'processing')
       RETURNING *`,
      [
        talentId, creator_id, title, description, type, intent, 
        language || 'pt-BR', JSON.stringify(media_refs || []),
        thumbnail_url, duration_seconds, transcription, feature_vector,
        impactScore, riskScore, JSON.stringify(archetypeScores), confidence
      ]
    );

    const talent = result.rows[0];

    // Decide o status de publicacao
    const moderationDecision = await decidePublicationStatus({
      id: talentId,
      risk_score: riskScore,
      confidence: confidence,
      impact_score: impactScore,
      creator_id: creator_id,
      feature_vector: feature_vector
    });

    // Atualiza o status baseado na decisao de moderacao
    await db.query(
      `UPDATE talent_items 
       SET status = $1, 
           visibility = $2,
           moderation_flags = $3,
           published_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END,
           updated_at = NOW()
       WHERE id = $4`,
      [
        moderationDecision.status,
        moderationDecision.visibility,
        JSON.stringify({ flags: moderationDecision.flags, reason: moderationDecision.reason }),
        talentId
      ]
    );

    // Atualiza insights do criador
    await updateCreatorInsights(creator_id);

    // Notifica via Firestore (real-time)
    const firestore = getFirestore();
    if (firestore) {
      await firestore.collection('mst_talents').doc(talentId).set({
        creator_id,
        title,
        status: moderationDecision.status,
        impact_score: impactScore,
        created_at: new Date().toISOString()
      });
    }

    logger.info(`Talent created: ${talentId} by ${creator_id} with status ${moderationDecision.status}`);

    res.status(201).json({
      id: talentId,
      creator_id,
      title,
      type,
      status: moderationDecision.status,
      visibility: moderationDecision.visibility,
      impact_score: impactScore,
      risk_score: riskScore,
      archetype_scores: archetypeScores,
      confidence,
      moderation: {
        flags: moderationDecision.flags,
        reason: moderationDecision.reason
      }
    });

  } catch (error) {
    logger.error('Error creating talent:', error);
    res.status(500).json({ error: 'Erro ao criar talento' });
  }
};

/**
 * Obtem um talento por ID
 */
const getTalent = async (req, res) => {
  try {
    const { talentId } = req.params;
    const db = getDb();

    const result = await db.query(
      `SELECT t.*, 
              ci.followers_count as creator_followers,
              (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'view') as total_views,
              (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'wave') as total_waves,
              (SELECT COALESCE(SUM(amount), 0) FROM talent_engagements WHERE talent_id = t.id AND type = 'donation') as total_donations
       FROM talent_items t
       LEFT JOIN creator_insights ci ON t.creator_id = ci.creator_id
       WHERE t.id = $1`,
      [talentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talento nao encontrado' });
    }

    const talent = result.rows[0];

    // Nao retorna talentos privados ou rejeitados para usuarios nao autorizados
    if (talent.status === 'rejected' || talent.visibility === 'private') {
      const requesterId = req.headers['x-user-id'];
      if (requesterId !== talent.creator_id) {
        return res.status(404).json({ error: 'Talento nao encontrado' });
      }
    }

    res.json(talent);

  } catch (error) {
    logger.error('Error getting talent:', error);
    res.status(500).json({ error: 'Erro ao buscar talento' });
  }
};

/**
 * Lista talentos do feed (discovery)
 */
const getFeed = async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      type,
      archetype,
      creator_id
    } = req.query;

    const userId = req.headers['x-user-id'];
    const db = getDb();

    let query = `
      SELECT t.*, 
             (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'view') as total_views,
             (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'wave') as total_waves
      FROM talent_items t
      WHERE t.status = 'approved' 
        AND t.visibility IN ('public', 'limited')
    `;
    const params = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND t.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (creator_id) {
      query += ` AND t.creator_id = $${paramIndex}`;
      params.push(creator_id);
      paramIndex++;
    }

    query += ` ORDER BY t.impact_score DESC, t.published_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Calcula feed score para cada talento
    const talents = result.rows.map(talent => ({
      ...talent,
      feed_score: calculateFeedScore(talent)
    }));

    // Ordena por feed score
    talents.sort((a, b) => b.feed_score - a.feed_score);

    res.json({
      talents,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: talents.length
      }
    });

  } catch (error) {
    logger.error('Error getting feed:', error);
    res.status(500).json({ error: 'Erro ao buscar feed' });
  }
};

/**
 * Registra engajamento (view, wave, share)
 */
const registerEngagement = async (req, res) => {
  try {
    const { talentId } = req.params;
    const { 
      user_id, 
      type, 
      wave_type,
      seconds_watched 
    } = req.body;

    if (!user_id || !type) {
      return res.status(400).json({
        error: 'user_id e type sao obrigatorios'
      });
    }

    const validTypes = ['view', 'wave', 'share'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Tipo de engajamento invalido'
      });
    }

    const db = getDb();

    // Verifica se o talento existe
    const talentResult = await db.query(
      'SELECT creator_id, impact_score FROM talent_items WHERE id = $1',
      [talentId]
    );

    if (talentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Talento nao encontrado' });
    }

    const talent = talentResult.rows[0];

    // Registra o engajamento
    await db.query(
      `INSERT INTO talent_engagements 
       (talent_id, user_id, type, wave_type, seconds_watched)
       VALUES ($1, $2, $3, $4, $5)`,
      [talentId, user_id, type, wave_type, seconds_watched]
    );

    // Recompensa o criador
    if (user_id !== talent.creator_id) {
      await rewardCreatorEngagement(
        talent.creator_id, 
        type, 
        talentId, 
        talent.impact_score
      );
    }

    // Atualiza Firestore para real-time
    const firestore = getFirestore();
    if (firestore) {
      await firestore.collection('mst_talents').doc(talentId).update({
        [`engagement_${type}_count`]: require('firebase-admin').firestore.FieldValue.increment(1),
        last_engagement_at: new Date().toISOString()
      });
    }

    logger.info(`Engagement registered: ${type} on talent ${talentId} by ${user_id}`);

    res.json({
      success: true,
      talent_id: talentId,
      engagement_type: type
    });

  } catch (error) {
    logger.error('Error registering engagement:', error);
    res.status(500).json({ error: 'Erro ao registrar engajamento' });
  }
};

/**
 * Lista talentos de um criador
 */
const getCreatorTalents = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { limit = 20, offset = 0, status } = req.query;
    const requesterId = req.headers['x-user-id'];

    const db = getDb();

    let query = `
      SELECT t.*,
             (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'view') as total_views,
             (SELECT COUNT(*) FROM talent_engagements WHERE talent_id = t.id AND type = 'wave') as total_waves,
             (SELECT COALESCE(SUM(amount), 0) FROM talent_engagements WHERE talent_id = t.id AND type = 'donation') as total_donations
      FROM talent_items t
      WHERE t.creator_id = $1
    `;
    const params = [creatorId];
    let paramIndex = 2;

    // Se nao for o proprio criador, mostra apenas aprovados e publicos
    if (requesterId !== creatorId) {
      query += ` AND t.status = 'approved' AND t.visibility = 'public'`;
    } else if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY t.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      creator_id: creatorId,
      talents: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (error) {
    logger.error('Error getting creator talents:', error);
    res.status(500).json({ error: 'Erro ao buscar talentos do criador' });
  }
};

/**
 * Deleta um talento
 */
const deleteTalent = async (req, res) => {
  try {
    const { talentId } = req.params;
    const requesterId = req.headers['x-user-id'];

    const db = getDb();

    // Verifica se o talento pertence ao usuario
    const result = await db.query(
      'SELECT creator_id FROM talent_items WHERE id = $1',
      [talentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Talento nao encontrado' });
    }

    if (result.rows[0].creator_id !== requesterId) {
      return res.status(403).json({ error: 'Nao autorizado' });
    }

    await db.query('DELETE FROM talent_items WHERE id = $1', [talentId]);

    // Remove do Firestore
    const firestore = getFirestore();
    if (firestore) {
      await firestore.collection('mst_talents').doc(talentId).delete();
    }

    logger.info(`Talent deleted: ${talentId} by ${requesterId}`);

    res.json({ success: true, deleted: talentId });

  } catch (error) {
    logger.error('Error deleting talent:', error);
    res.status(500).json({ error: 'Erro ao deletar talento' });
  }
};

/**
 * Atualiza insights do criador
 */
const updateCreatorInsights = async (creatorId) => {
  try {
    const db = getDb();

    await db.query(`
      INSERT INTO creator_insights (creator_id, talents_count, last_calculated_at)
      SELECT 
        $1,
        COUNT(*),
        NOW()
      FROM talent_items 
      WHERE creator_id = $1 AND status = 'approved'
      ON CONFLICT (creator_id) 
      DO UPDATE SET 
        talents_count = EXCLUDED.talents_count,
        last_calculated_at = NOW(),
        updated_at = NOW()
    `, [creatorId]);

  } catch (error) {
    logger.error('Error updating creator insights:', error);
  }
};

module.exports = {
  createTalent,
  getTalent,
  getFeed,
  registerEngagement,
  getCreatorTalents,
  deleteTalent
};
