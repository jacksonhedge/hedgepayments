const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Default error values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    errorCode = 'UNAUTHORIZED';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    errorCode = 'INVALID_ID';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service temporarily unavailable';
    errorCode = 'SERVICE_UNAVAILABLE';
  }

  // Prepare error response
  const errorResponse = {
    error: {
      message,
      code: errorCode,
      statusCode
    },
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Include additional details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err.details || null;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;