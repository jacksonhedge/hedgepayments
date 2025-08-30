/**
 * React Context for Hedge SDK
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { HedgeSDK, HedgeSDKConfig, HedgeEvent } from '@hedge/sdk-core';

export interface HedgeContextValue {
  sdk: HedgeSDK | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  lastEvent: HedgeEvent | null;
  webSocketState: string;
}

const HedgeContext = createContext<HedgeContextValue | undefined>(undefined);

export interface HedgeProviderProps extends HedgeSDKConfig {
  children: ReactNode;
  enableAutoConnect?: boolean;
  onEvent?: (event: HedgeEvent) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function HedgeProvider({
  children,
  enableAutoConnect = true,
  onEvent,
  onError,
  onConnected,
  onDisconnected,
  ...config
}: HedgeProviderProps) {
  const [sdk, setSdk] = useState<HedgeSDK | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEvent, setLastEvent] = useState<HedgeEvent | null>(null);
  const [webSocketState, setWebSocketState] = useState('not_initialized');

  // Initialize SDK
  useEffect(() => {
    try {
      setError(null);
      const hedgeSDK = new HedgeSDK(config);
      
      // Set up event listeners
      hedgeSDK.on('event', (event: HedgeEvent) => {
        setLastEvent(event);
        onEvent?.(event);
      });

      hedgeSDK.on('request:error', (error: any) => {
        setError(error);
        onError?.(error);
      });

      hedgeSDK.on('websocket:connected', () => {
        setIsConnected(true);
        setIsConnecting(false);
        onConnected?.();
      });

      hedgeSDK.on('websocket:disconnected', () => {
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnected?.();
      });

      hedgeSDK.on('websocket:error', (error: Error) => {
        setError(error);
        setIsConnecting(false);
        onError?.(error);
      });

      hedgeSDK.on('websocket:state', ({ current }) => {
        setWebSocketState(current);
        setIsConnecting(current === 'connecting');
        setIsConnected(current === 'connected');
      });

      setSdk(hedgeSDK);

      // Auto-connect WebSocket if enabled
      if (enableAutoConnect && config.enableWebSocket !== false) {
        setIsConnecting(true);
        hedgeSDK.connectWebSocket();
      }

    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }

    return () => {
      if (sdk) {
        sdk.destroy();
      }
    };
  }, [
    config.apiKey,
    config.partnerId,
    config.environment,
    config.baseUrl,
    enableAutoConnect
  ]);

  const contextValue: HedgeContextValue = {
    sdk,
    isConnected,
    isConnecting,
    error,
    lastEvent,
    webSocketState,
  };

  return (
    <HedgeContext.Provider value={contextValue}>
      {children}
    </HedgeContext.Provider>
  );
}

export function useHedgeContext(): HedgeContextValue {
  const context = useContext(HedgeContext);
  if (context === undefined) {
    throw new Error('useHedgeContext must be used within a HedgeProvider');
  }
  return context;
}