const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const selosRoutes = require('./routes/selos');
const { initDatabase, pool } = require('./config/database');
const promClient = require('prom-client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

const register = new promClient.Register();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

app.use('/api/selos', selosRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'selos-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      ready: true, 
      service: 'selos-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({ 
      ready: false, 
      service: 'selos-service',
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

initDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`Selos Service running on port ${PORT}`);
  });
}).catch(error => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});
