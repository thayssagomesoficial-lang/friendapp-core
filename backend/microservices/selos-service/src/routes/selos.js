const express = require('express');
const router = express.Router();
const selosController = require('../controllers/selosController');

router.post('/atribuir', selosController.atribuirSelo);
router.get('/usuario/:userId', selosController.listarSelosUsuario);
router.get('/catalogo', selosController.listarCatalogoSelos);
router.post('/validar', selosController.validarCondicoesS elo);

module.exports = router;
