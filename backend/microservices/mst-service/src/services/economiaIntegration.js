const axios = require('axios');
const logger = require('../utils/logger');

const ECONOMIA_SERVICE_URL = process.env.ECONOMIA_SERVICE_URL || 'http://localhost:3008';

/**
 * Integra com o servico de economia para processar doacoes e recompensas
 */

/**
 * Processa uma doacao de FriendCoins para um criador
 */
const processDonation = async (donorId, creatorId, amount, talentId) => {
  try {
    // Debita do doador
    const debitResponse = await axios.post(`${ECONOMIA_SERVICE_URL}/api/economia/debitar`, {
      user_id: donorId,
      valor: amount,
      tipo: 'doacao_mst',
      metadata: {
        talent_id: talentId,
        recipient_id: creatorId,
        timestamp: new Date().toISOString()
      }
    });

    if (!debitResponse.data.success) {
      throw new Error('Failed to debit donor');
    }

    // Credita para o criador (com taxa de 10%)
    const creatorAmount = Math.floor(amount * 0.90);
    await axios.post(`${ECONOMIA_SERVICE_URL}/api/economia/creditar`, {
      user_id: creatorId,
      valor: creatorAmount,
      tipo: 'recebimento_doacao',
      metadata: {
        talent_id: talentId,
        donor_id: donorId,
        original_amount: amount,
        fee_percentage: 10,
        timestamp: new Date().toISOString()
      }
    });

    logger.info(`Donation processed: ${amount} FC from ${donorId} to ${creatorId} for talent ${talentId}`);

    return {
      success: true,
      donor_debited: amount,
      creator_credited: creatorAmount,
      platform_fee: amount - creatorAmount
    };
  } catch (error) {
    logger.error('Error processing donation:', error.message);
    throw error;
  }
};

/**
 * Recompensa o criador por engajamento (views, waves)
 */
const rewardCreatorEngagement = async (creatorId, engagementType, talentId, impactScore) => {
  try {
    // Calcula recompensa baseada no tipo de engajamento e impacto
    const baseRewards = {
      view: 0.1,
      wave: 1,
      share: 2
    };

    const baseAmount = baseRewards[engagementType] || 0;
    const impactMultiplier = 1 + (impactScore / 1000); // 1.0 a 2.0
    const rewardAmount = Math.round(baseAmount * impactMultiplier * 100) / 100;

    if (rewardAmount <= 0) {
      return { success: true, rewarded: 0 };
    }

    await axios.post(`${ECONOMIA_SERVICE_URL}/api/economia/creditar`, {
      user_id: creatorId,
      valor: rewardAmount,
      tipo: `recompensa_${engagementType}`,
      indice_impacto: impactMultiplier,
      metadata: {
        talent_id: talentId,
        engagement_type: engagementType,
        impact_score: impactScore,
        timestamp: new Date().toISOString()
      }
    });

    logger.info(`Creator ${creatorId} rewarded ${rewardAmount} FC for ${engagementType} on talent ${talentId}`);

    return {
      success: true,
      rewarded: rewardAmount,
      engagement_type: engagementType
    };
  } catch (error) {
    logger.error('Error rewarding creator:', error.message);
    return { success: false, rewarded: 0, error: error.message };
  }
};

/**
 * Consulta o saldo do usuario
 */
const getUserBalance = async (userId) => {
  try {
    const response = await axios.get(`${ECONOMIA_SERVICE_URL}/api/economia/carteira/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Error getting user balance:', error.message);
    return { user_id: userId, saldo_fc: 0 };
  }
};

module.exports = {
  processDonation,
  rewardCreatorEngagement,
  getUserBalance
};
