import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { chanceRouter } from './routes/chance';
import { chanceWebhook } from './routes/chanceWebhook';

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors(config.cors));
// Stripe webhook needs the RAW body — mount BEFORE express.json().
app.post('/api/v1/chance/funding/webhook', express.raw({ type: 'application/json' }), chanceWebhook);

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

app.use('/api/v1/chance', chanceRouter);

// Error handling
app.use(errorHandler);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`=� Hedge API Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});