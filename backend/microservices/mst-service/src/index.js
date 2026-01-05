const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const mstRoutes = require('./routes/mst');
const { initDatabase, initFirestore, pool } = require('./config/database');
const promClient = require('prom-client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const talentsCreated = new promClient.Counter({
  name: 'mst_talents_created_total',
  help: 'Total number of talents created',
  registers: [register]
});

const engagementsTotal = new promClient.Counter({
  name: 'mst_engagements_total',
  help: 'Total number of engagements',
  labelNames: ['type'],
  registers: [register]
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }, 'Incoming request');
  next();
});

app.use('/api/mst', mstRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'mst-service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      ready: true, 
      service: 'mst-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({ 
      ready: false, 
      service: 'mst-service',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const start = async () => {
  try {
    await initDatabase();
    initFirestore();
    
    app.listen(PORT, () => {
      logger.info(`MST Service running on port ${PORT}`);
      logger.info(`Health: http://localhost:${PORT}/health`);
      logger.info(`Metrics: http://localhost:${PORT}/metrics`);
    });
  } catch (error) {
    logger.error('Failed to start MST service:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

start();

module.exports = { app, talentsCreated, engagementsTotal };
