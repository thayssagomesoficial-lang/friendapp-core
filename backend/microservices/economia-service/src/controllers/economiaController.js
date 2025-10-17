const { getDb, getFirestore } = require('../config/database');
const logger = require('../utils/logger');
const { calcularFriendCoins } = require('../services/calculator');

const calcularRecompensa = async (req, res) => {
  try {
    const { 
      user_id, 
      acao, 
      peso_acao, 
      indice_impacto, 
      fator_surpresa, 
      reducao_repeticao 
    } = req.body;

    if (!user_id || !acao) {
      return res.status(400).json({ 
        error: 'user_id e acao são obrigatórios' 
      });
    }

    const friendcoins = calcularFriendCoins(
      peso_acao || 5,
      indice_impacto || 1.0,
      fator_surpresa || 1.0,
      reducao_repeticao || 1.0
    );

    res.json({
      user_id,
      acao,
      friendcoins_calculados: friendcoins,
      detalhes: {
        peso_acao: peso_acao || 5,
        indice_impacto: indice_impacto || 1.0,
        fator_surpresa: fator_surpresa || 1.0,
        reducao_repeticao: reducao_repeticao || 1.0
      }
    });

  } catch (error) {
    logger.error('Erro ao calcular recompensa:', error);
    res.status(500).json({ error: 'Erro ao calcular recompensa' });
  }
};

const creditarFriendCoins = async (req, res) => {
  try {
    const { 
      user_id, 
      valor, 
      tipo, 
      indice_impacto, 
      fator_surpresa, 
      reducao_repeticao,
      metadata 
    } = req.body;

    if (!user_id || !valor) {
      return res.status(400).json({ 
        error: 'user_id e valor são obrigatórios' 
      });
    }

    const db = getDb();
    
    await db.query(
      `INSERT INTO user_wallets (user_id, saldo_fc) 
       VALUES ($1, $2)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         saldo_fc = user_wallets.saldo_fc + $2,
         updated_at = NOW()`,
      [user_id, valor]
    );

    await db.query(
      `INSERT INTO transactions_log 
       (user_id, tipo, valor, indice_impacto, fator_surpresa, reducao_repeticao, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user_id, 
        tipo || 'ganho', 
        valor, 
        indice_impacto || null, 
        fator_surpresa || null, 
        reducao_repeticao || null,
        JSON.stringify(metadata || {})
      ]
    );

    const firestore = getFirestore();
    await firestore.collection('users_wallet').doc(user_id).set({
      ultima_transacao: new Date().toISOString(),
      tipo: 'credito',
      valor
    }, { merge: true });

    logger.info(`${valor} FriendCoins creditados para usuário ${user_id}`);

    res.status(200).json({
      success: true,
      user_id,
      valor_creditado: valor,
      tipo: tipo || 'ganho'
    });

  } catch (error) {
    logger.error('Erro ao creditar FriendCoins:', error);
    res.status(500).json({ error: 'Erro ao creditar FriendCoins' });
  }
};

const debitarFriendCoins = async (req, res) => {
  try {
    const { user_id, valor, tipo, metadata } = req.body;

    if (!user_id || !valor) {
      return res.status(400).json({ 
        error: 'user_id e valor são obrigatórios' 
      });
    }

    const db = getDb();
    
    const result = await db.query(
      'SELECT saldo_fc FROM user_wallets WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0 || result.rows[0].saldo_fc < valor) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente' 
      });
    }

    await db.query(
      `UPDATE user_wallets 
       SET saldo_fc = saldo_fc - $1, updated_at = NOW()
       WHERE user_id = $2`,
      [valor, user_id]
    );

    await db.query(
      `INSERT INTO transactions_log (user_id, tipo, valor, metadata)
       VALUES ($1, $2, $3, $4)`,
      [user_id, tipo || 'gasto', -valor, JSON.stringify(metadata || {})]
    );

    logger.info(`${valor} FriendCoins debitados do usuário ${user_id}`);

    res.status(200).json({
      success: true,
      user_id,
      valor_debitado: valor,
      tipo: tipo || 'gasto'
    });

  } catch (error) {
    logger.error('Erro ao debitar FriendCoins:', error);
    res.status(500).json({ error: 'Erro ao debitar FriendCoins' });
  }
};

const consultarCarteira = async (req, res) => {
  try {
    const { userId } = req.params;

    const db = getDb();
    const result = await db.query(
      'SELECT * FROM user_wallets WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        user_id: userId,
        saldo_fc: 0,
        status_premium: 'inativo',
        premium_expira_em: null
      });
    }

    const wallet = result.rows[0];

    res.json({
      user_id: wallet.user_id,
      saldo_fc: wallet.saldo_fc,
      status_premium: wallet.status_premium,
      premium_expira_em: wallet.premium_expira_em
    });

  } catch (error) {
    logger.error('Erro ao consultar carteira:', error);
    res.status(500).json({ error: 'Erro ao consultar carteira' });
  }
};

const ativarPremium = async (req, res) => {
  try {
    const { user_id, duracao_dias } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório' });
    }

    const dias = duracao_dias || 30;
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + dias);

    const db = getDb();
    
    await db.query(
      `INSERT INTO user_wallets (user_id, status_premium, premium_expira_em)
       VALUES ($1, 'ativo', $2)
       ON CONFLICT (user_id)
       DO UPDATE SET 
         status_premium = 'ativo',
         premium_expira_em = $2,
         updated_at = NOW()`,
      [user_id, dataExpiracao]
    );

    logger.info(`Premium ativado para usuário ${user_id} até ${dataExpiracao}`);

    res.json({
      success: true,
      user_id,
      status_premium: 'ativo',
      expira_em: dataExpiracao
    });

  } catch (error) {
    logger.error('Erro ao ativar premium:', error);
    res.status(500).json({ error: 'Erro ao ativar premium' });
  }
};

const consultarHistorico = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 50;

    const db = getDb();
    const result = await db.query(
      `SELECT * FROM transactions_log 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      user_id: userId,
      transacoes: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    logger.error('Erro ao consultar histórico:', error);
    res.status(500).json({ error: 'Erro ao consultar histórico' });
  }
};

module.exports = {
  calcularRecompensa,
  creditarFriendCoins,
  debitarFriendCoins,
  consultarCarteira,
  ativarPremium,
  consultarHistorico
};
