const express = require('express');
const router = express.Router();
const economiaController = require('../controllers/economiaController');

router.post('/calcular-recompensa', economiaController.calcularRecompensa);
router.post('/creditar', economiaController.creditarFriendCoins);
router.post('/debitar', economiaController.debitarFriendCoins);
router.get('/carteira/:userId', economiaController.consultarCarteira);
router.post('/premium/ativar', economiaController.ativarPremium);
router.get('/historico/:userId', economiaController.consultarHistorico);

module.exports = router;
