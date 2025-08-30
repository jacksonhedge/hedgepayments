/**
 * Main Hedge SDK hook
 */
import { HedgeSDK } from '@hedge/sdk-core';
import { useHedgeContext } from '../context/HedgeContext';

export function useHedge(): {
  sdk: HedgeSDK | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  webSocketState: string;
  connect: () => void;
  disconnect: () => void;
} {
  const { sdk, isConnected, isConnecting, error, webSocketState } = useHedgeContext();

  const connect = () => {
    if (sdk && !isConnected && !isConnecting) {
      sdk.connectWebSocket();
    }
  };

  const disconnect = () => {
    if (sdk && isConnected) {
      sdk.disconnectWebSocket();
    }
  };

  return {
    sdk,
    isConnected,
    isConnecting,
    error,
    webSocketState,
    connect,
    disconnect,
  };
}