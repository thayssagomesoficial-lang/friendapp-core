const axios = require('axios');
const logger = require('../utils/logger');

const chamarUnico = async (userId, tipoVerificacao) => {
  try {
    logger.info(`Chamando Unico para usuário ${userId}, tipo ${tipoVerificacao}`);
    
    return {
      url: `https://unico.mock/verify/${userId}`,
      session_id: `unico_${Date.now()}`,
      provider: 'unico'
    };

  } catch (error) {
    logger.error('Erro ao chamar Unico:', error);
    throw error;
  }
};

const chamarIdWall = async (userId, tipoVerificacao) => {
  try {
    logger.info(`Chamando IdWall para usuário ${userId}, tipo ${tipoVerificacao}`);
    
    return {
      url: `https://idwall.mock/verify/${userId}`,
      session_id: `idwall_${Date.now()}`,
      provider: 'idwall'
    };

  } catch (error) {
    logger.error('Erro ao chamar IdWall:', error);
    throw error;
  }
};

module.exports = {
  chamarUnico,
  chamarIdWall
};
