require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const espnRoutes = require('./api/routes/espn');
const authRoutes = require('./api/routes/auth');
// const sleeperRoutes = require('./api/routes/sleeper');
// const yahooRoutes = require('./api/routes/yahoo');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:4001', 'http://localhost:8080', 'null'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple session middleware (replace with express-session in production)
app.use((req, res, next) => {
  req.session = req.session || {};
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    api: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };
  
  // Check ESPN Bridge health
  try {
    const ESPNBridgeClient = require('./services/platforms/espn/espn-bridge');
    const espnClient = new ESPNBridgeClient();
    const espnHealth = await espnClient.healthCheck();
    checks.espnBridge = espnHealth.status;
  } catch (error) {
    checks.espnBridge = 'unavailable';
  }
  
  res.json({
    status: 'healthy',
    service: 'LeagueLink API',
    checks
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'LeagueLink API',
    version: '1.0.0',
    description: 'Unified API for fantasy sports platform integration',
    status: 'operational',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      platforms: {
        espn: '/api/v1/espn',
        sleeper: '/api/v1/sleeper',
        yahoo: '/api/v1/yahoo'
      }
    }
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/espn', espnRoutes);
// app.use('/api/v1/sleeper', sleeperRoutes);
// app.use('/api/v1/yahoo', yahooRoutes);

// Platform status endpoint
app.get('/api/v1/platforms', (req, res) => {
  res.json({
    platforms: [
      { 
        id: 'espn', 
        name: 'ESPN Fantasy', 
        status: 'active',
        authentication: 'automated',
        endpoints: [
          '/api/v1/auth/link',
          '/api/v1/auth/exchange',
          '/api/v1/espn/connect',
          '/api/v1/espn/leagues',
          '/api/v1/espn/league/:id',
          '/api/v1/espn/status'
        ]
      },
      { 
        id: 'sleeper', 
        name: 'Sleeper', 
        status: 'planned',
        authentication: 'username',
        endpoints: []
      },
      { 
        id: 'yahoo', 
        name: 'Yahoo Fantasy', 
        status: 'planned',
        authentication: 'oauth',
        endpoints: []
      },
      { 
        id: 'nfl', 
        name: 'NFL.com', 
        status: 'planned',
        authentication: 'tbd',
        endpoints: []
      },
      { 
        id: 'cbs', 
        name: 'CBS Sports', 
        status: 'planned',
        authentication: 'tbd',
        endpoints: []
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🏆 LeagueLink API running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`🏈 ESPN Bridge: ${process.env.ESPN_BRIDGE_URL || 'http://localhost:3001'}`);
  
  // Log available endpoints
  logger.info('📚 Available endpoints:');
  logger.info('  - GET  /health');
  logger.info('  - GET  /api/v1/platforms');
  logger.info('  - POST /api/v1/auth/link');
  logger.info('  - POST /api/v1/auth/exchange');
  logger.info('  - POST /api/v1/auth/espn/credentials');
  logger.info('  - POST /api/v1/espn/connect');
  logger.info('  - GET  /api/v1/espn/leagues');
  logger.info('  - GET  /api/v1/espn/league/:id');
  logger.info('  - GET  /api/v1/espn/status');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;