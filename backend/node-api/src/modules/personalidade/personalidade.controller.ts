import { Request, Response, NextFunction } from 'express';
import { PersonalidadeService } from './personalidade.service';
import { SubmitPersonalityTestSchema } from './personalidade.types';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

const personalidadeService = new PersonalidadeService();

export class PersonalidadeController {
  async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await personalidadeService.getQuestions();
      
      res.status(200).json({
        status: 'success',
        data: { questions },
      });
    } catch (error) {
      next(error);
    }
  }

  async submitTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401);
      }

      const validated = SubmitPersonalityTestSchema.parse(req.body);
      const result = await personalidadeService.submitTest(req.userId, validated);
      
      res.status(201).json({
        status: 'success',
        data: { result },
      });
    } catch (error) {
      next(error);
    }
  }

  async getResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401);
      }

      const results = await personalidadeService.getUserResults(req.userId);
      
      res.status(200).json({
        status: 'success',
        data: { results },
      });
    } catch (error) {
      next(error);
    }
  }
}
