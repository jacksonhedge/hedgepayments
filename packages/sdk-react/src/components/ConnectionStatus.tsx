/**
 * Connection Status Component
 */
import React from 'react';
import { useHedge } from '../hooks/useHedge';

export interface ConnectionStatusProps {
  showDetails?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ConnectionStatus({
  showDetails = false,
  onConnect,
  onDisconnect,
  className = '',
  style,
}: ConnectionStatusProps) {
  const { isConnected, isConnecting, error, webSocketState, connect, disconnect } = useHedge();

  const getStatusColor = () => {
    if (error) return '#ef4444'; // red
    if (isConnected) return '#10b981'; // green
    if (isConnecting) return '#f59e0b'; // yellow
    return '#6b7280'; // gray
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isConnected) return 'Connected';
    if (isConnecting) return 'Connecting...';
    return 'Disconnected';
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnect();
      onDisconnect?.();
    } else if (!isConnecting) {
      connect();
      onConnect?.();
    }
  };

  return (
    <div 
      className={`hedge-connection-status ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        ...style,
      }}
    >
      {/* Status indicator dot */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          flexShrink: 0,
        }}
      />
      
      {/* Status text */}
      <span style={{ fontSize: '14px', color: '#374151' }}>
        {getStatusText()}
      </span>

      {/* Connection toggle button */}
      <button
        onClick={handleToggleConnection}
        disabled={isConnecting}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '3px',
          backgroundColor: '#ffffff',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          opacity: isConnecting ? 0.6 : 1,
        }}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>

      {/* Details */}
      {showDetails && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          State: {webSocketState}
          {error && (
            <div style={{ color: '#ef4444', marginTop: '2px' }}>
              {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}