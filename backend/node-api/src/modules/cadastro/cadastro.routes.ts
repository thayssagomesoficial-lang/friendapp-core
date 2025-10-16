import { Router } from 'express';
import { CadastroController } from './cadastro.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const controller = new CadastroController();

router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/login', (req, res, next) => controller.login(req, res, next));
router.get('/profile', authenticateToken, (req, res, next) => controller.getProfile(req, res, next));
router.patch('/profile', authenticateToken, (req, res, next) => controller.updateProfile(req, res, next));

export default router;
