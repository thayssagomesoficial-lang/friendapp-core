const { getDb } = require('../config/database');
const logger = require('../utils/logger');
const { processHumanReview, getPendingReviews } = require('../services/moderationService');

/**
 * Lista talentos pendentes de revisao humana
 */
const listPendingReviews = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const pendingTalents = await getPendingReviews(parseInt(limit));

    res.json({
      pending_reviews: pendingTalents,
      count: pendingTalents.length
    });

  } catch (error) {
    logger.error('Error listing pending reviews:', error);
    res.status(500).json({ error: 'Erro ao listar revisoes pendentes' });
  }
};

/**
 * Processa uma revisao humana
 */
const submitReview = async (req, res) => {
  try {
    const { talentId } = req.params;
    const { decision, reason } = req.body;
    const reviewerId = req.headers['x-user-id'];

    if (!decision) {
      return res.status(400).json({
        error: 'decision e obrigatorio (approved, rejected, limited)'
      });
    }

    const validDecisions = ['approved', 'rejected', 'limited'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({
        error: 'Decisao invalida. Use: approved, rejected ou limited'
      });
    }

    const result = await processHumanReview(talentId, reviewerId, decision, reason);

    logger.info(`Human review submitted: ${decision} for talent ${talentId} by ${reviewerId}`);

    res.json({
      success: true,
      talent_id: talentId,
      decision,
      new_status: result.status,
      new_visibility: result.visibility
    });

  } catch (error) {
    logger.error('Error submitting review:', error);
    res.status(500).json({ error: 'Erro ao processar revisao' });
  }
};

/**
 * Obtem historico de moderacao de um talento
 */
const getModerationHistory = async (req, res) => {
  try {
    const { talentId } = req.params;
    const db = getDb();

    const result = await db.query(`
      SELECT * FROM mst_moderation_reviews
      WHERE talent_id = $1
      ORDER BY created_at DESC
    `, [talentId]);

    res.json({
      talent_id: talentId,
      reviews: result.rows
    });

  } catch (error) {
    logger.error('Error getting moderation history:', error);
    res.status(500).json({ error: 'Erro ao buscar historico de moderacao' });
  }
};

/**
 * Obtem estatisticas de moderacao
 */
const getModerationStats = async (req, res) => {
  try {
    const db = getDb();

    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN reviewer_type = 'auto' THEN 1 END) as auto_reviews,
        COUNT(CASE WHEN reviewer_type = 'human' THEN 1 END) as human_reviews,
        COUNT(CASE WHEN decision = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN decision = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN decision = 'limited' THEN 1 END) as limited,
        COUNT(CASE WHEN decision = 'escalated' THEN 1 END) as escalated,
        AVG(risk_score_at_review) as avg_risk_score
      FROM mst_moderation_reviews
    `);

    const pendingResult = await db.query(`
      SELECT COUNT(*) as pending_count
      FROM talent_items
      WHERE status = 'review'
    `);

    const stats = statsResult.rows[0];
    const pending = pendingResult.rows[0];

    res.json({
      total_reviews: parseInt(stats.total_reviews) || 0,
      auto_reviews: parseInt(stats.auto_reviews) || 0,
      human_reviews: parseInt(stats.human_reviews) || 0,
      decisions: {
        approved: parseInt(stats.approved) || 0,
        rejected: parseInt(stats.rejected) || 0,
        limited: parseInt(stats.limited) || 0,
        escalated: parseInt(stats.escalated) || 0
      },
      pending_reviews: parseInt(pending.pending_count) || 0,
      avg_risk_score: Math.round((parseFloat(stats.avg_risk_score) || 0) * 100) / 100,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error getting moderation stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatisticas de moderacao' });
  }
};

module.exports = {
  listPendingReviews,
  submitReview,
  getModerationHistory,
  getModerationStats
};
