/**
 * Main Hedge SDK class
 */
import { EventEmitter } from 'eventemitter3';
import {
  HedgeConfig,
  HedgeEvent,
  HEDGE_CONSTANTS,
  Environment,
  validateRequired,
} from '@hedge/shared';

import { HttpClient, RequestInterceptor, ResponseInterceptor } from './client/http-client';
import { WebSocketClient } from './client/websocket-client';
import { UsersApi } from './api/users-api';
import { AccountsApi } from './api/accounts-api';
import { RoundupsApi } from './api/roundups-api';
import { TransfersApi } from './api/transfers-api';

export interface HedgeSDKConfig {
  apiKey: string;
  partnerId: string;
  environment?: Environment;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableWebSocket?: boolean;
}

export class HedgeSDK extends EventEmitter {
  private httpClient: HttpClient;
  private wsClient?: WebSocketClient;
  private config: HedgeConfig;

  // API instances
  public readonly users: UsersApi;
  public readonly accounts: AccountsApi;
  public readonly roundups: RoundupsApi;
  public readonly transfers: TransfersApi;

  constructor(config: HedgeSDKConfig) {
    super();

    // Validate required config
    validateRequired(config.apiKey, 'apiKey');
    validateRequired(config.partnerId, 'partnerId');

    // Set up full config with defaults
    this.config = {
      environment: 'production',
      timeout: HEDGE_CONSTANTS.DEFAULT_TIMEOUT,
      retryAttempts: HEDGE_CONSTANTS.DEFAULT_RETRY_ATTEMPTS,
      retryDelay: HEDGE_CONSTANTS.DEFAULT_RETRY_DELAY,
      ...config,
    };

    // Initialize HTTP client
    this.httpClient = new HttpClient(this.config);
    this.setupHttpClientListeners();

    // Initialize API instances
    this.users = new UsersApi(this.httpClient);
    this.accounts = new AccountsApi(this.httpClient);
    this.roundups = new RoundupsApi(this.httpClient);
    this.transfers = new TransfersApi(this.httpClient);

    // Initialize WebSocket client if enabled
    if (config.enableWebSocket !== false) {
      this.initializeWebSocket();
    }
  }

  /**
   * Initialize WebSocket connection for real-time events
   */
  private initializeWebSocket(): void {
    this.wsClient = new WebSocketClient(this.config);
    this.setupWebSocketListeners();
  }

  /**
   * Set up HTTP client event listeners
   */
  private setupHttpClientListeners(): void {
    this.httpClient.on('request:start', (data) => {
      this.emit('request:start', data);
    });

    this.httpClient.on('request:success', (data) => {
      this.emit('request:success', data);
    });

    this.httpClient.on('request:error', (data) => {
      this.emit('request:error', data);
    });

    this.httpClient.on('request:retry', (data) => {
      this.emit('request:retry', data);
    });
  }

  /**
   * Set up WebSocket client event listeners
   */
  private setupWebSocketListeners(): void {
    if (!this.wsClient) return;

    this.wsClient.on('connected', () => {
      this.emit('websocket:connected');
    });

    this.wsClient.on('disconnected', (data) => {
      this.emit('websocket:disconnected', data);
    });

    this.wsClient.on('error', (error) => {
      this.emit('websocket:error', error);
    });

    this.wsClient.on('event', (event: HedgeEvent) => {
      this.emit('event', event);
      this.emit(`event:${event.type}`, event);
    });

    this.wsClient.on('reconnect:scheduled', (data) => {
      this.emit('websocket:reconnect', data);
    });

    this.wsClient.on('state:change', (data) => {
      this.emit('websocket:state', data);
    });
  }

  /**
   * Connect to WebSocket for real-time events
   */
  public connectWebSocket(): void {
    if (!this.wsClient) {
      this.initializeWebSocket();
    }
    this.wsClient?.connect();
  }

  /**
   * Disconnect WebSocket
   */
  public disconnectWebSocket(): void {
    this.wsClient?.disconnect();
  }

  /**
   * Subscribe to specific event types
   */
  public subscribeToEvents(eventTypes: string[]): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized. Call connectWebSocket() first.');
    }
    this.wsClient.subscribe(eventTypes);
  }

  /**
   * Unsubscribe from specific event types
   */
  public unsubscribeFromEvents(eventTypes: string[]): void {
    if (!this.wsClient) {
      throw new Error('WebSocket client not initialized.');
    }
    this.wsClient.unsubscribe(eventTypes);
  }

  /**
   * Get WebSocket connection state
   */
  public getWebSocketState(): string {
    return this.wsClient?.getState() || 'not_initialized';
  }

  /**
   * Add request interceptor
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.httpClient.addRequestInterceptor(interceptor);
  }

  /**
   * Add response interceptor
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.httpClient.addResponseInterceptor(interceptor);
  }

  /**
   * Remove request interceptor
   */
  public removeRequestInterceptor(id: number): void {
    this.httpClient.removeRequestInterceptor(id);
  }

  /**
   * Remove response interceptor
   */
  public removeResponseInterceptor(id: number): void {
    this.httpClient.removeResponseInterceptor(id);
  }

  /**
   * Update SDK configuration
   */
  public updateConfig(newConfig: Partial<HedgeSDKConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.httpClient.updateConfig(newConfig);
  }

  /**
   * Get current configuration
   */
  public getConfig(): HedgeConfig {
    return { ...this.config };
  }

  /**
   * Test API connectivity
   */
  public async ping(): Promise<{
    success: boolean;
    timestamp: string;
    latency: number;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await this.httpClient.get<{
        status: string;
        timestamp: string;
      }>('/ping');

      return {
        success: true,
        timestamp: response.data.timestamp,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
        latency: Date.now() - startTime,
      };
    }
  }

  /**
   * Get API health status
   */
  public async getHealth(): Promise<{
    status: string;
    timestamp: string;
    services: Record<string, 'healthy' | 'unhealthy' | 'degraded'>;
  }> {
    const response = await this.httpClient.get<{
      status: string;
      timestamp: string;
      services: Record<string, 'healthy' | 'unhealthy' | 'degraded'>;
    }>('/health');

    return response.data;
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.wsClient?.disconnect();
    this.removeAllListeners();
    this.httpClient.removeAllListeners();
    if (this.wsClient) {
      this.wsClient.removeAllListeners();
    }
  }
}