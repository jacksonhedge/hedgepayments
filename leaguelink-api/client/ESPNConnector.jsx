import React, { useState, useEffect, useCallback } from 'react';

/**
 * ESPN Connector Component
 * Provides a beautiful, secure-looking button to connect ESPN accounts
 */
const ESPNConnector = ({ 
  clientId, 
  clientSecret,
  onSuccess, 
  onError, 
  environment = 'sandbox',
  className = '',
  children,
  buttonText = 'Connect ESPN Account',
  style = {}
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);

  const baseUrl = environment === 'production' 
    ? 'https://api.leaguelink.io' 
    : 'http://localhost:3000';

  useEffect(() => {
    // Cleanup popup on unmount
    return () => {
      if (popup && !popup.closed) {
        popup.close();
      }
    };
  }, [popup]);

  const handleConnect = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Step 1: Initialize connection
      const linkResponse = await fetch(`${baseUrl}/api/v1/auth/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: 'espn',
          client_id: clientId,
          redirect_uri: window.location.origin + '/callback'
        })
      });

      if (!linkResponse.ok) {
        const errorData = await linkResponse.json();
        throw new Error(errorData.error_message || 'Failed to initialize connection');
      }

      const linkData = await linkResponse.json();

      // Step 2: Open popup window
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popupWindow = window.open(
        linkData.auth_url,
        'leaguelink-auth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popupWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      setPopup(popupWindow);

      // Step 3: Listen for auth completion
      const authResult = await new Promise((resolve, reject) => {
        const messageHandler = (event) => {
          // Verify origin for security
          if (!event.origin.includes(baseUrl.replace(/^https?:\/\//, ''))) {
            return;
          }

          if (event.data.type === 'LEAGUELINK_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            popupWindow.close();
            setPopup(null);
            
            resolve({
              public_token: event.data.public_token,
              platform: event.data.platform,
              leagues_found: event.data.leagues_found
            });
          } else if (event.data.type === 'LEAGUELINK_AUTH_ERROR') {
            window.removeEventListener('message', messageHandler);
            popupWindow.close();
            setPopup(null);
            reject(new Error(event.data.error || 'Authentication failed'));
          } else if (event.data.type === 'LEAGUELINK_AUTH_CANCELLED') {
            window.removeEventListener('message', messageHandler);
            setPopup(null);
            reject(new Error('Authentication cancelled by user'));
          }
        };

        window.addEventListener('message', messageHandler);

        // Handle popup being closed manually
        const checkClosed = setInterval(() => {
          if (popupWindow.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            setPopup(null);
            reject(new Error('Authentication window closed'));
          }
        }, 1000);

        // Timeout after 10 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          if (!popupWindow.closed) {
            popupWindow.close();
          }
          setPopup(null);
          reject(new Error('Authentication timeout'));
        }, 600000);
      });

      // Step 4: Exchange public token for access token
      if (clientSecret) {
        const exchangeResponse = await fetch(`${baseUrl}/api/v1/auth/exchange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_token: authResult.public_token,
            client_id: clientId,
            secret: clientSecret
          })
        });

        if (!exchangeResponse.ok) {
          const errorData = await exchangeResponse.json();
          throw new Error(errorData.error_message || 'Token exchange failed');
        }

        const tokenData = await exchangeResponse.json();
        authResult.access_token = tokenData.access_token;
      }

      // Success callback
      if (onSuccess) {
        onSuccess(authResult);
      }

      return authResult;

    } catch (err) {
      const errorMessage = err.message || 'Failed to connect ESPN account';
      setError(errorMessage);
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [clientId, clientSecret, baseUrl, onSuccess, onError, isConnecting]);

  // Render prop pattern
  if (children && typeof children === 'function') {
    return children({
      connect: handleConnect,
      isConnecting,
      error,
      clearError: () => setError(null)
    });
  }

  // Custom children
  if (children) {
    return (
      <div onClick={handleConnect} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }

  // Default button
  return (
    <div className={`espn-connector ${className}`}>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="espn-connect-button"
        style={{
          background: isConnecting 
            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minWidth: '200px',
          boxShadow: isConnecting ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
          ...style
        }}
        onMouseEnter={(e) => {
          if (!isConnecting) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isConnecting) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        {isConnecting ? (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeDasharray="20"
                strokeDashoffset="15"
              />
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '20px' }}>🏆</span>
            <span>{buttonText}</span>
          </>
        )}
      </button>
      
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            animation: 'slideDown 0.3s ease'
          }}
        >
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Custom React Hook for ESPN Connection
 */
export const useESPNConnector = (clientId, clientSecret = null, environment = 'sandbox') => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [popup, setPopup] = useState(null);

  const baseUrl = environment === 'production' 
    ? 'https://api.leaguelink.io' 
    : 'http://localhost:3000';

  useEffect(() => {
    // Cleanup popup on unmount
    return () => {
      if (popup && !popup.closed) {
        popup.close();
      }
    };
  }, [popup]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Initialize connection
      const linkResponse = await fetch(`${baseUrl}/api/v1/auth/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: 'espn',
          client_id: clientId,
          redirect_uri: window.location.origin + '/callback'
        })
      });

      if (!linkResponse.ok) {
        throw new Error('Failed to initialize connection');
      }

      const linkData = await linkResponse.json();

      // Open popup
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popupWindow = window.open(
        linkData.auth_url,
        'leaguelink-auth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popupWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      setPopup(popupWindow);

      // Wait for authentication
      const authResult = await new Promise((resolve, reject) => {
        const messageHandler = (event) => {
          if (event.data.type === 'LEAGUELINK_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            popupWindow.close();
            
            resolve({
              public_token: event.data.public_token,
              platform: event.data.platform,
              leagues_found: event.data.leagues_found
            });
          }
        };

        window.addEventListener('message', messageHandler);

        const checkClosed = setInterval(() => {
          if (popupWindow.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);
      });

      // Exchange token if secret provided
      if (clientSecret) {
        const exchangeResponse = await fetch(`${baseUrl}/api/v1/auth/exchange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_token: authResult.public_token,
            client_id: clientId,
            secret: clientSecret
          })
        });

        if (exchangeResponse.ok) {
          const tokenData = await exchangeResponse.json();
          authResult.access_token = tokenData.access_token;
        }
      }

      setResult(authResult);
      setPopup(null);
      return authResult;

    } catch (err) {
      setError(err.message);
      setPopup(null);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [clientId, clientSecret, baseUrl]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    connect,
    isConnecting,
    error,
    result,
    reset
  };
};

export default ESPNConnector;