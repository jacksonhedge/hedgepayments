/**
 * Hedge SDK Core
 * @packageDocumentation
 */

// Main SDK class
export { HedgeSDK } from './hedge-sdk';
export type { HedgeSDKConfig } from './hedge-sdk';

// HTTP Client
export { HttpClient } from './client/http-client';
export type { RequestInterceptor, ResponseInterceptor } from './client/http-client';

// WebSocket Client
export { WebSocketClient } from './client/websocket-client';
export type { WebSocketState, WebSocketMessage } from './client/websocket-client';

// API Classes
export { UsersApi } from './api/users-api';
export { AccountsApi } from './api/accounts-api';
export { RoundupsApi } from './api/roundups-api';
export { TransfersApi } from './api/transfers-api';

// Re-export shared types and utilities
export * from '@hedge/shared';