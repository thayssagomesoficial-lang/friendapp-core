import { Router } from 'express';
import { PersonalidadeController } from './personalidade.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const controller = new PersonalidadeController();

router.get('/questions', (req, res, next) => controller.getQuestions(req, res, next));
router.post('/submit', authenticateToken, (req, res, next) => controller.submitTest(req, res, next));
router.get('/results', authenticateToken, (req, res, next) => controller.getResults(req, res, next));

export default router;
