const { getDb } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Obtem insights do criador (dashboard)
 */
const getCreatorInsights = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const requesterId = req.headers['x-user-id'];

    // Apenas o proprio criador pode ver seus insights
    if (requesterId !== creatorId) {
      return res.status(403).json({ error: 'Nao autorizado' });
    }

    const db = getDb();

    // Busca metricas agregadas
    const metricsResult = await db.query(`
      SELECT 
        COUNT(DISTINCT t.id) as total_talents,
        COUNT(DISTINCT CASE WHEN t.status = 'approved' THEN t.id END) as approved_talents,
        COUNT(DISTINCT CASE WHEN t.status = 'review' THEN t.id END) as pending_review,
        AVG(t.impact_score) as avg_impact_score,
        MAX(t.impact_score) as max_impact_score
      FROM talent_items t
      WHERE t.creator_id = $1
    `, [creatorId]);

    // Busca engajamentos
    const engagementResult = await db.query(`
      SELECT 
        COUNT(CASE WHEN e.type = 'view' THEN 1 END) as total_views,
        COUNT(CASE WHEN e.type = 'wave' THEN 1 END) as total_waves,
        COUNT(CASE WHEN e.type = 'share' THEN 1 END) as total_shares,
        COALESCE(SUM(CASE WHEN e.type = 'donation' THEN e.amount END), 0) as total_donations,
        COUNT(DISTINCT e.user_id) as unique_viewers
      FROM talent_engagements e
      JOIN talent_items t ON e.talent_id = t.id
      WHERE t.creator_id = $1
    `, [creatorId]);

    // Busca top talentos
    const topTalentsResult = await db.query(`
      SELECT 
        t.id, t.title, t.impact_score, t.created_at,
        COUNT(CASE WHEN e.type = 'view' THEN 1 END) as views,
        COUNT(CASE WHEN e.type = 'wave' THEN 1 END) as waves,
        COALESCE(SUM(CASE WHEN e.type = 'donation' THEN e.amount END), 0) as donations
      FROM talent_items t
      LEFT JOIN talent_engagements e ON t.id = e.talent_id
      WHERE t.creator_id = $1 AND t.status = 'approved'
      GROUP BY t.id
      ORDER BY views DESC, waves DESC
      LIMIT 5
    `, [creatorId]);

    // Busca engajamento por dia (ultimos 30 dias)
    const dailyEngagementResult = await db.query(`
      SELECT 
        DATE(e.created_at) as date,
        COUNT(CASE WHEN e.type = 'view' THEN 1 END) as views,
        COUNT(CASE WHEN e.type = 'wave' THEN 1 END) as waves,
        COALESCE(SUM(CASE WHEN e.type = 'donation' THEN e.amount END), 0) as donations
      FROM talent_engagements e
      JOIN talent_items t ON e.talent_id = t.id
      WHERE t.creator_id = $1 
        AND e.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(e.created_at)
      ORDER BY date DESC
    `, [creatorId]);

    // Busca distribuicao de arquetipos
    const archetypeResult = await db.query(`
      SELECT archetype_scores
      FROM talent_items
      WHERE creator_id = $1 AND status = 'approved'
    `, [creatorId]);

    // Calcula media dos arquetipos
    const archetypeAverages = {};
    if (archetypeResult.rows.length > 0) {
      const archetypes = ['expressivo', 'tecnico', 'emocional', 'energetico', 'narrativo', 'visual', 'sonoro'];
      archetypes.forEach(arch => {
        const sum = archetypeResult.rows.reduce((acc, row) => {
          const scores = typeof row.archetype_scores === 'string' 
            ? JSON.parse(row.archetype_scores) 
            : row.archetype_scores;
          return acc + (scores[arch] || 0);
        }, 0);
        archetypeAverages[arch] = Math.round((sum / archetypeResult.rows.length) * 100) / 100;
      });
    }

    const metrics = metricsResult.rows[0];
    const engagement = engagementResult.rows[0];

    res.json({
      creator_id: creatorId,
      overview: {
        total_talents: parseInt(metrics.total_talents) || 0,
        approved_talents: parseInt(metrics.approved_talents) || 0,
        pending_review: parseInt(metrics.pending_review) || 0,
        avg_impact_score: Math.round(parseFloat(metrics.avg_impact_score) || 0),
        max_impact_score: Math.round(parseFloat(metrics.max_impact_score) || 0)
      },
      engagement: {
        total_views: parseInt(engagement.total_views) || 0,
        total_waves: parseInt(engagement.total_waves) || 0,
        total_shares: parseInt(engagement.total_shares) || 0,
        total_donations: parseFloat(engagement.total_donations) || 0,
        unique_viewers: parseInt(engagement.unique_viewers) || 0
      },
      top_talents: topTalentsResult.rows.map(t => ({
        id: t.id,
        title: t.title,
        impact_score: Math.round(parseFloat(t.impact_score) || 0),
        views: parseInt(t.views) || 0,
        waves: parseInt(t.waves) || 0,
        donations: parseFloat(t.donations) || 0
      })),
      daily_engagement: dailyEngagementResult.rows.map(d => ({
        date: d.date,
        views: parseInt(d.views) || 0,
        waves: parseInt(d.waves) || 0,
        donations: parseFloat(d.donations) || 0
      })),
      archetype_profile: archetypeAverages,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error getting creator insights:', error);
    res.status(500).json({ error: 'Erro ao buscar insights' });
  }
};

/**
 * Obtem estatisticas globais do MST (para admin)
 */
const getGlobalStats = async (req, res) => {
  try {
    const db = getDb();

    const statsResult = await db.query(`
      SELECT 
        COUNT(DISTINCT t.id) as total_talents,
        COUNT(DISTINCT t.creator_id) as total_creators,
        COUNT(DISTINCT CASE WHEN t.status = 'approved' THEN t.id END) as approved_talents,
        COUNT(DISTINCT CASE WHEN t.status = 'review' THEN t.id END) as pending_review,
        COUNT(DISTINCT CASE WHEN t.status = 'rejected' THEN t.id END) as rejected_talents,
        AVG(t.impact_score) as avg_impact_score
      FROM talent_items t
    `);

    const engagementResult = await db.query(`
      SELECT 
        COUNT(*) as total_engagements,
        COUNT(CASE WHEN type = 'view' THEN 1 END) as total_views,
        COUNT(CASE WHEN type = 'wave' THEN 1 END) as total_waves,
        COALESCE(SUM(CASE WHEN type = 'donation' THEN amount END), 0) as total_donations
      FROM talent_engagements
    `);

    const stats = statsResult.rows[0];
    const engagement = engagementResult.rows[0];

    res.json({
      talents: {
        total: parseInt(stats.total_talents) || 0,
        approved: parseInt(stats.approved_talents) || 0,
        pending_review: parseInt(stats.pending_review) || 0,
        rejected: parseInt(stats.rejected_talents) || 0
      },
      creators: {
        total: parseInt(stats.total_creators) || 0
      },
      engagement: {
        total: parseInt(engagement.total_engagements) || 0,
        views: parseInt(engagement.total_views) || 0,
        waves: parseInt(engagement.total_waves) || 0,
        donations: parseFloat(engagement.total_donations) || 0
      },
      quality: {
        avg_impact_score: Math.round(parseFloat(stats.avg_impact_score) || 0)
      },
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error getting global stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatisticas' });
  }
};

module.exports = {
  getCreatorInsights,
  getGlobalStats
};
