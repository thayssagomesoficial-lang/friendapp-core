const fastify = require('fastify');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
const proxy = require('@fastify/http-proxy');
const { v4: uuidv4 } = require('uuid');
const promClient = require('prom-client');
const jwksManager = require('./jwks');
require('dotenv').config();

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  serviceName: 'api-gateway',
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

const register = new promClient.Register();

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpErrorsTotal = new promClient.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

promClient.collectDefaultMetrics({ register });

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  requestIdHeader: 'x-request-id',
  genReqId: () => uuidv4()
});

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3001,http://localhost:8080').split(',');

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
});

app.register(rateLimit, {
  max: async (req, key) => {
    const routeLimits = {
      '/api/v1/auth/token': 10,
      '/api/v1/verificacao': 20,
      default: parseInt(process.env.RATE_LIMIT_MAX) || 100
    };
    
    for (const [route, limit] of Object.entries(routeLimits)) {
      if (req.url.startsWith(route)) {
        return limit;
      }
    }
    return routeLimits.default;
  },
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
  keyGenerator: (req) => {
    return req.ip + ':' + req.url.split('?')[0];
  },
  errorResponseBuilder: (req, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`
    };
  }
});

app.addHook('onRequest', async (request, reply) => {
  const end = httpRequestDuration.startTimer();
  
  reply.addHeader('x-request-id', request.id);
  
  reply.then(() => {
    const route = request.routerPath || request.url.split('?')[0];
    const labels = { method: request.method, route, status_code: reply.statusCode };
    
    end(labels);
    httpRequestTotal.inc(labels);
    
    if (reply.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });
});

app.addHook('onRequest', async (request, reply) => {
  request.log.info({
    requestId: request.id,
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    correlationId: request.headers['x-correlation-id'] || request.id
  }, 'Incoming request');
});

app.addHook('onResponse', async (request, reply) => {
  const duration = reply.getResponseTime();
  request.log.info({
    requestId: request.id,
    correlationId: request.headers['x-correlation-id'] || request.id,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: `${duration.toFixed(2)}ms`,
    userAgent: request.headers['user-agent']
  }, 'Request completed');
});

app.get('/health', async (request, reply) => {
  return { 
    status: 'healthy', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    requestId: request.id
  };
});

app.get('/ready', async (request, reply) => {
  const services = [
    { name: 'selos', url: process.env.SELOS_SERVICE_URL },
    { name: 'verificacao', url: process.env.VERIFICACAO_SERVICE_URL },
    { name: 'reputacao', url: process.env.REPUTACAO_SERVICE_URL },
    { name: 'seguranca', url: process.env.SEGURANCA_SERVICE_URL },
    { name: 'economia', url: process.env.ECONOMIA_SERVICE_URL },
    { name: 'antifraude', url: process.env.ANTIFRAUDE_SERVICE_URL }
  ];

  const checks = await Promise.allSettled(
    services.map(async (service) => {
      const axios = require('axios');
      try {
        await axios.get(`${service.url}/health`, { timeout: 2000 });
        return { service: service.name, status: 'healthy' };
      } catch (error) {
        return { service: service.name, status: 'unhealthy', error: error.message };
      }
    })
  );

  const results = checks.map(check => check.value || check.reason);
  const allHealthy = results.every(r => r.status === 'healthy');

  if (!allHealthy) {
    reply.code(503);
  }

  return {
    ready: allHealthy,
    services: results,
    timestamp: new Date().toISOString()
  };
});

app.get('/metrics', async (request, reply) => {
  reply.type('text/plain');
  return register.metrics();
});

app.get('/.well-known/jwks.json', async (request, reply) => {
  const keys = await jwksManager.getJWKS();
  return { keys };
});

app.post('/api/v1/auth/token', async (request, reply) => {
  const { userId, email } = request.body;

  if (!userId || !email) {
    reply.code(400);
    return { error: 'userId and email are required' };
  }

  const token = await jwksManager.sign(
    { userId, email, sub: userId },
    { expiresIn: '24h' }
  );

  return { token, expiresIn: '24h' };
});

app.decorate('authenticate', async function(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    
    const token = authHeader.substring(7);
    const payload = await jwksManager.verify(token);
    request.user = payload;
  } catch (err) {
    reply.code(401);
    throw new Error('Unauthorized: ' + err.message);
  }
});

app.register(async function(fastify) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.register(proxy, {
    upstream: process.env.SELOS_SERVICE_URL,
    prefix: '/api/v1/selos',
    rewritePrefix: '/api/selos'
  });

  fastify.register(proxy, {
    upstream: process.env.VERIFICACAO_SERVICE_URL,
    prefix: '/api/v1/verificacao',
    rewritePrefix: '/api/verificacao'
  });

  fastify.register(proxy, {
    upstream: process.env.REPUTACAO_SERVICE_URL,
    prefix: '/api/v1/reputacao',
    rewritePrefix: '/api/reputacao'
  });

  fastify.register(proxy, {
    upstream: process.env.SEGURANCA_SERVICE_URL,
    prefix: '/api/v1/seguranca',
    rewritePrefix: '/api/seguranca'
  });

  fastify.register(proxy, {
    upstream: process.env.ECONOMIA_SERVICE_URL,
    prefix: '/api/v1/economia',
    rewritePrefix: '/api/economia'
  });

  fastify.register(proxy, {
    upstream: process.env.ANTIFRAUDE_SERVICE_URL,
    prefix: '/api/v1/antifraude',
    rewritePrefix: '/api/antifraude'
  });
});

const start = async () => {
  try {
    await jwksManager.initialize();
    app.log.info('🔑 JWKS Manager initialized');
    
    const port = parseInt(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`API Gateway running on port ${port}`);
    app.log.info(`📊 Metrics: http://localhost:${port}/metrics`);
    app.log.info(`🔑 JWKS: http://localhost:${port}/.well-known/jwks.json`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await sdk.shutdown();
  await app.close();
});

start();
