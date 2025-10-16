import { Router } from 'express';
import { FeedController } from './feed.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const controller = new FeedController();

router.post('/posts', authenticateToken, (req, res, next) => controller.createPost(req, res, next));
router.get('/posts', authenticateToken, (req, res, next) => controller.getFeed(req, res, next));
router.get('/posts/:postId', authenticateToken, (req, res, next) => controller.getPost(req, res, next));
router.post('/posts/:postId/interact', authenticateToken, (req, res, next) => controller.interactWithPost(req, res, next));

export default router;
