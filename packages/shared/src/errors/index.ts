/**
 * Custom error classes for Hedge SDKs
 */

export class HedgeError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, any>;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message);
    this.name = 'HedgeError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HedgeError);
    }
  }
}

export class HedgeApiError extends HedgeError {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, code, statusCode, details, requestId);
    this.name = 'HedgeApiError';
  }
}

export class HedgeValidationError extends HedgeError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'HedgeValidationError';
  }
}

export class HedgeAuthenticationError extends HedgeError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'HedgeAuthenticationError';
  }
}

export class HedgeAuthorizationError extends HedgeError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'HedgeAuthorizationError';
  }
}

export class HedgeNotFoundError extends HedgeError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'HedgeNotFoundError';
  }
}

export class HedgeRateLimitError extends HedgeError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'HedgeRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class HedgeNetworkError extends HedgeError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'HedgeNetworkError';
  }
}

export class HedgeTimeoutError extends HedgeError {
  constructor(message: string = 'Request timeout') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'HedgeTimeoutError';
  }
}

/**
 * Factory function to create appropriate error instances from API responses
 */
export function createHedgeError(
  message: string,
  code: string,
  statusCode?: number,
  details?: Record<string, any>,
  requestId?: string
): HedgeError {
  switch (statusCode) {
    case 400:
      return new HedgeValidationError(message, details);
    case 401:
      return new HedgeAuthenticationError(message);
    case 403:
      return new HedgeAuthorizationError(message);
    case 404:
      return new HedgeNotFoundError(message);
    case 429:
      return new HedgeRateLimitError(message, details?.retryAfter);
    default:
      if (statusCode && statusCode >= 400) {
        return new HedgeApiError(message, code, statusCode, details, requestId);
      }
      return new HedgeError(message, code, statusCode, details, requestId);
  }
}