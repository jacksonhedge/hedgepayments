/**
 * Account List Component
 */
import React from 'react';
import { BankAccount } from '@hedge/shared';
import { useAccounts } from '../hooks/useAccounts';

export interface AccountListProps {
  userId: string;
  onAccountSelect?: (account: BankAccount) => void;
  onAccountUpdate?: (account: BankAccount) => void;
  onError?: (error: Error) => void;
  showBalance?: boolean;
  showActions?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark' | 'auto';
}

export function AccountList({
  userId,
  onAccountSelect,
  onAccountUpdate,
  onError,
  showBalance = false,
  showActions = true,
  className = '',
  style,
  theme = 'light',
}: AccountListProps) {
  const { 
    accounts, 
    loading, 
    error, 
    enableRoundups, 
    disableRoundups, 
    refreshAccount,
    disconnectAccount 
  } = useAccounts(userId);

  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const getThemeStyles = () => {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    };
  };

  const formatAccountType = (type: string, subtype?: string) => {
    const formatted = type.charAt(0).toUpperCase() + type.slice(1);
    return subtype ? `${formatted} (${subtype})` : formatted;
  };

  const formatBalance = (balance?: { available: number; current: number; currency: string }) => {
    if (!balance) return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: balance.currency || 'USD',
    });
    
    return formatter.format(balance.available);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'; // green
      case 'inactive': return '#6b7280'; // gray
      case 'pending': return '#f59e0b'; // yellow
      case 'error': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  const handleToggleRoundups = async (account: BankAccount) => {
    try {
      const updatedAccount = account.isRoundupsEnabled
        ? await disableRoundups(account.id)
        : await enableRoundups(account.id);
      
      onAccountUpdate?.(updatedAccount);
    } catch (err) {
      console.error('Failed to toggle roundups:', err);
    }
  };

  const handleRefresh = async (accountId: string) => {
    try {
      const updatedAccount = await refreshAccount(accountId);
      onAccountUpdate?.(updatedAccount);
    } catch (err) {
      console.error('Failed to refresh account:', err);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        await disconnectAccount(accountId);
      } catch (err) {
        console.error('Failed to disconnect account:', err);
      }
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div 
        style={{ 
          padding: '20px', 
          textAlign: 'center',
          ...getThemeStyles(),
          borderRadius: '8px',
        }}
      >
        Loading accounts...
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div 
        style={{ 
          padding: '20px', 
          textAlign: 'center',
          ...getThemeStyles(),
          borderRadius: '8px',
        }}
      >
        No accounts connected. Connect your first account to get started.
      </div>
    );
  }

  return (
    <div 
      className={`hedge-account-list ${className}`}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        ...getThemeStyles(),
        ...style,
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Connected Accounts ({accounts.length})
        </h3>
      </div>

      <div>
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => onAccountSelect?.(account)}
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              cursor: onAccountSelect ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (onAccountSelect) {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (onAccountSelect) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Account Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                    {account.accountName}
                  </h4>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(account.status),
                    }}
                  />
                </div>
                
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  {account.institutionName} • {formatAccountType(account.accountType, account.accountSubtype)}
                </div>
                
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  •••• {account.mask}
                </div>

                {showBalance && account.balance && (
                  <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px' }}>
                    {formatBalance(account.balance)}
                  </div>
                )}

                {/* Roundups Status */}
                <div style={{ 
                  marginTop: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontSize: '14px',
                }}>
                  <span>Roundups:</span>
                  <span style={{ 
                    color: account.isRoundupsEnabled ? '#10b981' : '#6b7280',
                    fontWeight: '500',
                  }}>
                    {account.isRoundupsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRoundups(account);
                    }}
                    disabled={loading}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: account.isRoundupsEnabled ? '#fee2e2' : '#dcfce7',
                      color: account.isRoundupsEnabled ? '#dc2626' : '#16a34a',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {account.isRoundupsEnabled ? 'Disable' : 'Enable'} Roundups
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefresh(account.id);
                    }}
                    disabled={loading}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Refresh
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisconnect(account.id);
                    }}
                    disabled={loading}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ 
          padding: '16px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          fontSize: '14px',
        }}>
          {error.message}
        </div>
      )}
    </div>
  );
}