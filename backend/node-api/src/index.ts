import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import cadastroRoutes from './modules/cadastro/cadastro.routes';
import personalidadeRoutes from './modules/personalidade/personalidade.routes';
import feedRoutes from './modules/feed/feed.routes';
import { initDatabase } from './database/init';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'friendapp-node-api',
    version: '1.0.0'
  });
});

app.use('/api/v1/cadastro', cadastroRoutes);
app.use('/api/v1/personalidade', personalidadeRoutes);
app.use('/api/v1/feed', feedRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await initDatabase();
    logger.info('Database initialized successfully');

    app.listen(PORT, () => {
      logger.info(`FriendApp Node API running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
