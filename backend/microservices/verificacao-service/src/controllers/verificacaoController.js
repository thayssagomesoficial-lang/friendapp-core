const { getDb, getFirestore } = require('../config/database');
const logger = require('../utils/logger');
const { chamarUnico, chamarIdWall } = require('../services/externalProviders');

const iniciarVerificacao = async (req, res) => {
  try {
    const { user_id, tipo_verificacao, provider } = req.body;

    if (!user_id || !tipo_verificacao) {
      return res.status(400).json({ 
        error: 'user_id e tipo_verificacao são obrigatórios' 
      });
    }

    const db = getDb();
    
    const result = await db.query(
      `INSERT INTO verifications (user_id, provider, verification_type, status) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         provider = $2, 
         verification_type = $3, 
         status = $4, 
         updated_at = NOW()
       RETURNING *`,
      [user_id, provider || 'unico', tipo_verificacao, 'pendente']
    );

    let externalResponse;
    if (provider === 'idwall') {
      externalResponse = await chamarIdWall(user_id, tipo_verificacao);
    } else {
      externalResponse = await chamarUnico(user_id, tipo_verificacao);
    }

    logger.info(`Verificação iniciada para usuário ${user_id}`);

    res.status(201).json({
      success: true,
      verification_id: result.rows[0].id,
      external_url: externalResponse.url,
      status: 'pendente'
    });

  } catch (error) {
    logger.error('Erro ao iniciar verificação:', error);
    res.status(500).json({ error: 'Erro ao iniciar verificação' });
  }
};

const validarVerificacao = async (req, res) => {
  try {
    const { user_id, verification_result } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório' });
    }

    const db = getDb();
    
    const status = verification_result?.success ? 'aprovado' : 'rejeitado';
    
    const result = await db.query(
      `UPDATE verifications 
       SET status = $1, verified_at = NOW(), metadata = $2, updated_at = NOW()
       WHERE user_id = $3
       RETURNING *`,
      [status, JSON.stringify(verification_result || {}), user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Verificação não encontrada' });
    }

    const firestore = getFirestore();
    await firestore.collection('verifications').doc(user_id).set({
      status,
      verified_at: new Date().toISOString(),
      provider: result.rows[0].provider
    });

    if (status === 'aprovado') {
      logger.info(`Usuário ${user_id} verificado com sucesso`);
    }

    res.json({
      success: true,
      verification: result.rows[0]
    });

  } catch (error) {
    logger.error('Erro ao validar verificação:', error);
    res.status(500).json({ error: 'Erro ao validar verificação' });
  }
};

const consultarStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const db = getDb();
    const result = await db.query(
      'SELECT * FROM verifications WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        verified: false,
        message: 'Verificação não encontrada' 
      });
    }

    const verification = result.rows[0];

    res.json({
      user_id: userId,
      verified: verification.status === 'aprovado',
      status: verification.status,
      provider: verification.provider,
      verified_at: verification.verified_at,
      type: verification.verification_type
    });

  } catch (error) {
    logger.error('Erro ao consultar status:', error);
    res.status(500).json({ error: 'Erro ao consultar status' });
  }
};

const receberWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    logger.info('Webhook recebido:', webhookData);

    if (webhookData.user_id && webhookData.status) {
      await validarVerificacao({ body: {
        user_id: webhookData.user_id,
        verification_result: webhookData
      }}, res);
    } else {
      res.status(200).json({ received: true });
    }

  } catch (error) {
    logger.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

module.exports = {
  iniciarVerificacao,
  validarVerificacao,
  consultarStatus,
  receberWebhook
};
