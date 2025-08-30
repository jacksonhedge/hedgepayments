/**
 * Constants used across Hedge SDKs
 */

export const HEDGE_CONSTANTS = {
  // API Configuration
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  DEFAULT_RETRY_ATTEMPTS: 3,
  DEFAULT_RETRY_DELAY: 1000, // 1 second
  MAX_RETRY_DELAY: 30000, // 30 seconds

  // Base URLs by environment
  BASE_URLS: {
    development: 'http://localhost:3000/api/v1',
    staging: 'https://api-staging.hedgepay.com/v1',
    production: 'https://api.hedgepay.com/v1',
  },

  // WebSocket URLs by environment
  WEBSOCKET_URLS: {
    development: 'ws://localhost:3001',
    staging: 'wss://ws-staging.hedgepay.com',
    production: 'wss://ws.hedgepay.com',
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Event Types
  EVENT_TYPES: {
    // User events
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',

    // Account events
    ACCOUNT_CONNECTED: 'account.connected',
    ACCOUNT_UPDATED: 'account.updated',
    ACCOUNT_DISCONNECTED: 'account.disconnected',
    ACCOUNT_ERROR: 'account.error',

    // Transaction events
    TRANSACTION_CREATED: 'transaction.created',
    TRANSACTION_UPDATED: 'transaction.updated',

    // Roundup events
    ROUNDUP_CREATED: 'roundup.created',
    ROUNDUP_PROCESSED: 'roundup.processed',
    ROUNDUP_FAILED: 'roundup.failed',

    // Transfer events
    TRANSFER_INITIATED: 'transfer.initiated',
    TRANSFER_PROCESSING: 'transfer.processing',
    TRANSFER_COMPLETED: 'transfer.completed',
    TRANSFER_FAILED: 'transfer.failed',
  },

  // Headers
  HEADERS: {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    USER_AGENT: 'User-Agent',
    X_API_KEY: 'X-API-Key',
    X_PARTNER_ID: 'X-Partner-ID',
    X_REQUEST_ID: 'X-Request-ID',
    X_CLIENT_VERSION: 'X-Client-Version',
  },

  // Default pagination
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
  },

  // Currency codes
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const,

  // Roundup rules
  ROUNDUP_RULES: {
    NEAREST_DOLLAR: 'nearest_dollar',
    NEAREST_FIVE: 'nearest_five',
    CUSTOM: 'custom',
  } as const,

  // Transfer frequencies
  TRANSFER_FREQUENCIES: {
    IMMEDIATE: 'immediate',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
  } as const,
} as const;