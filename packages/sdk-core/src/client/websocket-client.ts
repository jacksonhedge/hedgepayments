/**
 * WebSocket Client for real-time events
 */
import { EventEmitter } from 'eventemitter3';
import {
  HedgeConfig,
  HedgeEvent,
  HEDGE_CONSTANTS,
  HedgeError,
} from '@hedge/shared';

export type WebSocketState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: string;
}

export class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: HedgeConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private state: WebSocketState = 'disconnected';

  constructor(config: HedgeConfig) {
    super();
    this.config = config;
  }

  public connect(): void {
    if (this.state === 'connected' || this.state === 'connecting') {
      return;
    }

    this.setState('connecting');
    
    const wsUrl = this.buildWebSocketUrl();
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketListeners();
      
      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.state === 'connecting') {
          this.handleError(new HedgeError('WebSocket connection timeout', 'CONNECTION_TIMEOUT'));
        }
      }, 10000);
    } catch (error) {
      this.handleError(new HedgeError('Failed to create WebSocket connection', 'CONNECTION_ERROR'));
    }
  }

  public disconnect(): void {
    if (this.state === 'disconnected' || this.state === 'disconnecting') {
      return;
    }

    this.setState('disconnecting');
    this.cleanup();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
    }
  }

  public send(message: WebSocketMessage): void {
    if (this.state !== 'connected' || !this.ws) {
      throw new HedgeError('WebSocket is not connected', 'NOT_CONNECTED');
    }

    try {
      this.ws.send(JSON.stringify(message));
      this.emit('message:sent', message);
    } catch (error) {
      this.emit('error', new HedgeError('Failed to send message', 'SEND_ERROR'));
    }
  }

  public subscribe(eventTypes: string[]): void {
    this.send({
      type: 'subscribe',
      data: { eventTypes },
      timestamp: new Date().toISOString(),
    });
  }

  public unsubscribe(eventTypes: string[]): void {
    this.send({
      type: 'unsubscribe', 
      data: { eventTypes },
      timestamp: new Date().toISOString(),
    });
  }

  public getState(): WebSocketState {
    return this.state;
  }

  private buildWebSocketUrl(): string {
    const baseUrl = HEDGE_CONSTANTS.WEBSOCKET_URLS[this.config.environment];
    const params = new URLSearchParams({
      apiKey: this.config.apiKey,
      partnerId: this.config.partnerId,
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  private setupWebSocketListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.clearConnectionTimeout();
      this.setState('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('connected');
    };

    this.ws.onclose = (event) => {
      this.cleanup();
      this.setState('disconnected');
      
      if (event.code !== 1000) { // Not a normal closure
        this.emit('disconnected', { 
          code: event.code, 
          reason: event.reason, 
          wasClean: event.wasClean 
        });
        
        if (this.shouldReconnect(event.code)) {
          this.scheduleReconnect();
        }
      } else {
        this.emit('disconnected');
      }
    };

    this.ws.onerror = () => {
      this.handleError(new HedgeError('WebSocket error occurred', 'WEBSOCKET_ERROR'));
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        this.emit('error', new HedgeError('Failed to parse WebSocket message', 'PARSE_ERROR'));
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    this.emit('message', message);

    switch (message.type) {
      case 'event':
        this.emit('event', message.data as HedgeEvent);
        // Emit specific event types
        if (message.data?.type) {
          this.emit(`event:${message.data.type}`, message.data);
        }
        break;
      
      case 'pong':
        this.emit('pong');
        break;
      
      case 'error':
        this.emit('error', new HedgeError(
          message.data?.message || 'Server error',
          message.data?.code || 'SERVER_ERROR'
        ));
        break;
      
      case 'subscribed':
        this.emit('subscribed', message.data);
        break;
      
      case 'unsubscribed':
        this.emit('unsubscribed', message.data);
        break;
    }
  }

  private shouldReconnect(code: number): boolean {
    // Don't reconnect for authentication errors or client errors
    if (code >= 4000 && code < 5000) {
      return false;
    }
    
    return this.reconnectAttempts < this.maxReconnectAttempts;
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnect:failed');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.emit('reconnect:scheduled', { 
      attempt: this.reconnectAttempts, 
      delay 
    });

    setTimeout(() => {
      if (this.state === 'disconnected') {
        this.connect();
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.state === 'connected') {
        this.send({
          type: 'ping',
          timestamp: new Date().toISOString(),
        });
      }
    }, 30000); // Send ping every 30 seconds
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.clearConnectionTimeout();
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  private setState(newState: WebSocketState): void {
    if (this.state !== newState) {
      const previousState = this.state;
      this.state = newState;
      this.emit('state:change', { previous: previousState, current: newState });
    }
  }

  private handleError(error: HedgeError): void {
    this.setState('error');
    this.emit('error', error);
    this.cleanup();
  }
}