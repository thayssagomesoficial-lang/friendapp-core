import { Request, Response, NextFunction } from 'express';
import { FeedService } from './feed.service';
import { CreatePostSchema, InteractPostSchema } from './feed.types';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

const feedService = new FeedService();

export class FeedController {
  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401);
      }

      const validated = CreatePostSchema.parse(req.body);
      const post = await feedService.createPost(req.userId, validated);
      
      res.status(201).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401);
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const feed = await feedService.getFeed(req.userId, limit, offset);
      
      res.status(200).json({
        status: 'success',
        data: { feed, count: feed.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId;
      const post = await feedService.getPost(postId, req.userId);
      
      res.status(200).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }

  async interactWithPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401);
      }

      const postId = req.params.postId;
      const validated = InteractPostSchema.parse(req.body);
      
      await feedService.interactWithPost(req.userId, postId, validated);
      
      res.status(200).json({
        status: 'success',
        message: 'Interação registrada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
