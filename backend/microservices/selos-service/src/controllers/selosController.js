const { getDb, getFirestore } = require('../config/database');
const logger = require('../utils/logger');
const { CATALOGO_SELOS } = require('../config/catalogoSelos');

const atribuirSelo = async (req, res) => {
  try {
    const { user_id, seal_type, vibration_score, metadata } = req.body;

    if (!user_id || !seal_type) {
      return res.status(400).json({ 
        error: 'user_id e seal_type são obrigatórios' 
      });
    }

    const db = getDb();
    
    const result = await db.query(
      `INSERT INTO user_seals (user_id, seal_type, vibration_score, metadata) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, seal_type) DO NOTHING
       RETURNING *`,
      [user_id, seal_type, vibration_score || null, JSON.stringify(metadata || {})]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ 
        error: 'Selo já atribuído para este usuário' 
      });
    }

    const firestore = getFirestore();
    await firestore.collection('user_seals').doc(user_id).set({
      [seal_type]: {
        earned_at: new Date().toISOString(),
        vibration_score: vibration_score || null
      }
    }, { merge: true });

    logger.info(`Selo ${seal_type} atribuído para usuário ${user_id}`);

    res.status(201).json({
      success: true,
      seal: result.rows[0]
    });

  } catch (error) {
    logger.error('Erro ao atribuir selo:', error);
    res.status(500).json({ error: 'Erro ao atribuir selo' });
  }
};

const listarSelosUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    const db = getDb();
    const result = await db.query(
      'SELECT * FROM user_seals WHERE user_id = $1 ORDER BY earned_at DESC',
      [userId]
    );

    res.json({
      user_id: userId,
      seals: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    logger.error('Erro ao listar selos:', error);
    res.status(500).json({ error: 'Erro ao listar selos' });
  }
};

const listarCatalogoSelos = async (req, res) => {
  try {
    res.json({
      catalogo: CATALOGO_SELOS,
      total: CATALOGO_SELOS.length
    });
  } catch (error) {
    logger.error('Erro ao listar catálogo:', error);
    res.status(500).json({ error: 'Erro ao listar catálogo' });
  }
};

const validarCondicoesSelo = async (req, res) => {
  try {
    const { user_id, seal_type } = req.body;

    if (!user_id || !seal_type) {
      return res.status(400).json({ 
        error: 'user_id e seal_type são obrigatórios' 
      });
    }

    const selo = CATALOGO_SELOS.find(s => s.type === seal_type);
    
    if (!selo) {
      return res.status(404).json({ error: 'Selo não encontrado no catálogo' });
    }

    res.json({
      seal_type,
      conditions: selo.conditions,
      can_earn: false,
      message: 'Validação de condições em desenvolvimento'
    });

  } catch (error) {
    logger.error('Erro ao validar condições:', error);
    res.status(500).json({ error: 'Erro ao validar condições' });
  }
};

module.exports = {
  atribuirSelo,
  listarSelosUsuario,
  listarCatalogoSelos,
  validarCondicoesSelo
};
