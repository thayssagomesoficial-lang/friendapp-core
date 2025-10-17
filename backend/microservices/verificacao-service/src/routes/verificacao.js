const express = require('express');
const router = express.Router();
const verificacaoController = require('../controllers/verificacaoController');

router.post('/iniciar', verificacaoController.iniciarVerificacao);
router.post('/validar', verificacaoController.validarVerificacao);
router.get('/status/:userId', verificacaoController.consultarStatus);
router.post('/webhook', verificacaoController.receberWebhook);

module.exports = router;
