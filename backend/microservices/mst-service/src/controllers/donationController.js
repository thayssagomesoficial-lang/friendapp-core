const { getDb, getFirestore } = require('../config/database');
const logger = require('../utils/logger');
const { processDonation, getUserBalance } = require('../services/economiaIntegration');

/**
 * Processa uma doacao para um criador
 */
const makeDonation = async (req, res) => {
  try {
    const { talentId } = req.params;
    const { donor_id, amount, message } = req.body;

    if (!donor_id || !amount) {
      return res.status(400).json({
        error: 'donor_id e amount sao obrigatorios'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Valor da doacao deve ser positivo'
      });
    }

    const db = getDb();

    // Verifica se o talento existe e obtem o criador
    const talentResult = await db.query(
      'SELECT creator_id, title FROM talent_items WHERE id = $1 AND status = $2',
      [talentId, 'approved']
    );

    if (talentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Talento nao encontrado' });
    }

    const talent = talentResult.rows[0];

    // Nao permite doacao para si mesmo
    if (donor_id === talent.creator_id) {
      return res.status(400).json({ error: 'Nao e possivel doar para si mesmo' });
    }

    // Verifica saldo do doador
    const balance = await getUserBalance(donor_id);
    if (balance.saldo_fc < amount) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente',
        saldo_atual: balance.saldo_fc,
        valor_necessario: amount
      });
    }

    // Processa a doacao via servico de economia
    const donationResult = await processDonation(
      donor_id, 
      talent.creator_id, 
      amount, 
      talentId
    );

    // Registra o engajamento de doacao
    await db.query(
      `INSERT INTO talent_engagements 
       (talent_id, user_id, type, amount)
       VALUES ($1, $2, 'donation', $3)`,
      [talentId, donor_id, amount]
    );

    // Notifica via Firestore
    const firestore = getFirestore();
    if (firestore) {
      await firestore.collection('mst_donations').add({
        talent_id: talentId,
        talent_title: talent.title,
        donor_id,
        creator_id: talent.creator_id,
        amount,
        message: message || null,
        created_at: new Date().toISOString()
      });

      // Notifica o criador
      await firestore.collection('notifications').add({
        user_id: talent.creator_id,
        type: 'donation_received',
        title: 'Nova doacao recebida!',
        body: `Voce recebeu ${donationResult.creator_credited} FriendCoins pelo seu talento "${talent.title}"`,
        data: {
          talent_id: talentId,
          donor_id,
          amount: donationResult.creator_credited
        },
        read: false,
        created_at: new Date().toISOString()
      });
    }

    logger.info(`Donation of ${amount} FC from ${donor_id} to ${talent.creator_id} for talent ${talentId}`);

    res.json({
      success: true,
      donation: {
        talent_id: talentId,
        donor_id,
        creator_id: talent.creator_id,
        amount_donated: amount,
        creator_received: donationResult.creator_credited,
        platform_fee: donationResult.platform_fee
      }
    });

  } catch (error) {
    logger.error('Error processing donation:', error);
    res.status(500).json({ error: 'Erro ao processar doacao' });
  }
};

/**
 * Lista doacoes recebidas por um criador
 */
const getCreatorDonations = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const requesterId = req.headers['x-user-id'];

    // Apenas o proprio criador pode ver suas doacoes
    if (requesterId !== creatorId) {
      return res.status(403).json({ error: 'Nao autorizado' });
    }

    const db = getDb();

    const result = await db.query(`
      SELECT e.*, t.title as talent_title
      FROM talent_engagements e
      JOIN talent_items t ON e.talent_id = t.id
      WHERE t.creator_id = $1 AND e.type = 'donation'
      ORDER BY e.created_at DESC
      LIMIT $2 OFFSET $3
    `, [creatorId, parseInt(limit), parseInt(offset)]);

    const totalResult = await db.query(`
      SELECT COALESCE(SUM(e.amount), 0) as total_donations
      FROM talent_engagements e
      JOIN talent_items t ON e.talent_id = t.id
      WHERE t.creator_id = $1 AND e.type = 'donation'
    `, [creatorId]);

    res.json({
      creator_id: creatorId,
      donations: result.rows,
      total_received: parseFloat(totalResult.rows[0].total_donations) || 0,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: result.rows.length
      }
    });

  } catch (error) {
    logger.error('Error getting creator donations:', error);
    res.status(500).json({ error: 'Erro ao buscar doacoes' });
  }
};

/**
 * Lista doacoes feitas por um usuario
 */
const getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const requesterId = req.headers['x-user-id'];

    // Apenas o proprio usuario pode ver suas doacoes
    if (requesterId !== userId) {
      return res.status(403).json({ error: 'Nao autorizado' });
    }

    const db = getDb();

    const result = await db.query(`
      SELECT e.*, t.title as talent_title, t.creator_id
      FROM talent_engagements e
      JOIN talent_items t ON e.talent_id = t.id
      WHERE e.user_id = $1 AND e.type = 'donation'
      ORDER BY e.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, parseInt(limit), parseInt(offset)]);

    const totalResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) as total_donated
      FROM talent_engagements
      WHERE user_id = $1 AND type = 'donation'
    `, [userId]);

    res.json({
      user_id: userId,
      donations: result.rows,
      total_donated: parseFloat(totalResult.rows[0].total_donated) || 0,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: result.rows.length
      }
    });

  } catch (error) {
    logger.error('Error getting user donations:', error);
    res.status(500).json({ error: 'Erro ao buscar doacoes' });
  }
};

module.exports = {
  makeDonation,
  getCreatorDonations,
  getUserDonations
};
