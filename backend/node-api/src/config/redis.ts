import { createClient } from 'redis';
import { logger } from './logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};

export const getRedisClient = () => redisClient;

export default redisClient;
