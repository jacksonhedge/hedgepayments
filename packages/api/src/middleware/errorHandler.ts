import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || 500;
  logger.error('Unhandled error', { message: err.message, status });
  res.status(status).json({ error: err.publicMessage || 'Internal error' });
}
