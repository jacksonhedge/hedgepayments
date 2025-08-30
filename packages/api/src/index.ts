import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes will be added here
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/accounts', accountsRouter);
// app.use('/api/v1/roundups', roundupsRouter);
// app.use('/api/v1/transfers', transfersRouter);
// app.use('/api/v1/webhooks', webhooksRouter);

// Error handling
app.use(errorHandler);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`=€ Hedge API Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});