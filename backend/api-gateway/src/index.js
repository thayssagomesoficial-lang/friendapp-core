const fastify = require('fastify');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
const jwt = require('@fastify/jwt');
const proxy = require('@fastify/http-proxy');
const { v4: uuidv4 } = require('uuid');
const promClient = require('prom-client');
require('dotenv').config();

const register = new promClient.Register();

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
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

app.register(cors, {
  origin: true,
  credentials: true
});

app.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'friendapp-secret-key-change-in-production'
});

app.addHook('onRequest', async (request, reply) => {
  const end = httpRequestDuration.startTimer();
  reply.then(() => {
    end({ method: request.method, route: request.routerPath || request.url, status_code: reply.statusCode });
  });
});

app.addHook('onRequest', async (request, reply) => {
  request.log.info({
    requestId: request.id,
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  }, 'Incoming request');
});

app.addHook('onResponse', async (request, reply) => {
  request.log.info({
    requestId: request.id,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: reply.getResponseTime()
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

app.post('/api/v1/auth/token', async (request, reply) => {
  const { userId, email } = request.body;

  if (!userId || !email) {
    reply.code(400);
    return { error: 'userId and email are required' };
  }

  const token = app.jwt.sign(
    { userId, email },
    { expiresIn: '24h' }
  );

  return { token, expiresIn: '24h' };
});

app.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401);
    throw new Error('Unauthorized');
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
    const port = parseInt(process.env.PORT) || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`API Gateway running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
