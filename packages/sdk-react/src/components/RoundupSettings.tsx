/**
 * Roundup Settings Component
 */
import React, { useState, useEffect } from 'react';
import { UpdateRoundupSettingsRequest } from '@hedge/shared';
import { useRoundupSettings } from '../hooks/useRoundups';

export interface RoundupSettingsProps {
  userId: string;
  onSettingsChange?: (settings: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'light' | 'dark' | 'auto';
}

export function RoundupSettings({
  userId,
  onSettingsChange,
  onError,
  className = '',
  style,
  theme = 'light',
}: RoundupSettingsProps) {
  const { settings, loading, error, updateSettings, enable, disable } = useRoundupSettings(userId);
  
  const [localSettings, setLocalSettings] = useState<UpdateRoundupSettingsRequest>({
    isEnabled: false,
    roundupRule: 'nearest_dollar',
    minimumPurchase: 1,
    maximumRoundup: 5,
    transferFrequency: 'weekly',
    excludedCategories: [],
    excludedMerchants: [],
  });

  const [isDirty, setIsDirty] = useState(false);

  // Update local settings when remote settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        isEnabled: settings.isEnabled,
        roundupRule: settings.roundupRule,
        customAmount: settings.customAmount,
        minimumPurchase: settings.minimumPurchase,
        maximumRoundup: settings.maximumRoundup,
        transferFrequency: settings.transferFrequency,
        excludedCategories: settings.excludedCategories || [],
        excludedMerchants: settings.excludedMerchants || [],
        destinationAccountId: settings.destinationAccountId,
      });
      setIsDirty(false);
    }
  }, [settings]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const handleInputChange = (field: keyof UpdateRoundupSettingsRequest, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      const updatedSettings = await updateSettings(localSettings);
      setIsDirty(false);
      onSettingsChange?.(updatedSettings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleToggleEnabled = async () => {
    try {
      if (localSettings.isEnabled) {
        await disable();
      } else {
        await enable();
      }
    } catch (err) {
      console.error('Failed to toggle roundups:', err);
    }
  };

  const getThemeStyles = () => {
    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
    };
  };

  if (loading && !settings) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading roundup settings...
      </div>
    );
  }

  return (
    <div 
      className={`hedge-roundup-settings ${className}`}
      style={{
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        ...getThemeStyles(),
        ...style,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Roundup Settings</h3>

      {/* Enable/Disable Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={localSettings.isEnabled}
            onChange={handleToggleEnabled}
            disabled={loading}
          />
          <span>Enable Roundups</span>
        </label>
      </div>

      {localSettings.isEnabled && (
        <>
          {/* Roundup Rule */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Roundup Rule
            </label>
            <select
              value={localSettings.roundupRule}
              onChange={(e) => handleInputChange('roundupRule', e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            >
              <option value="nearest_dollar">Nearest Dollar</option>
              <option value="nearest_five">Nearest $5</option>
              <option value="custom">Custom Amount</option>
            </select>
          </div>

          {/* Custom Amount */}
          {localSettings.roundupRule === 'custom' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Custom Roundup Amount ($)
              </label>
              <input
                type="number"
                min="0.01"
                max="10"
                step="0.01"
                value={localSettings.customAmount || ''}
                onChange={(e) => handleInputChange('customAmount', parseFloat(e.target.value))}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
          )}

          {/* Minimum Purchase */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Minimum Purchase Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localSettings.minimumPurchase || ''}
              onChange={(e) => handleInputChange('minimumPurchase', parseFloat(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* Maximum Roundup */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Maximum Roundup Amount ($)
            </label>
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={localSettings.maximumRoundup || ''}
              onChange={(e) => handleInputChange('maximumRoundup', parseFloat(e.target.value))}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* Transfer Frequency */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Transfer Frequency
            </label>
            <select
              value={localSettings.transferFrequency}
              onChange={(e) => handleInputChange('transferFrequency', e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button
              onClick={handleSave}
              disabled={!isDirty || loading}
              style={{
                padding: '8px 16px',
                backgroundColor: isDirty && !loading ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isDirty && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            {isDirty && (
              <button
                onClick={() => {
                  if (settings) {
                    setLocalSettings({
                      isEnabled: settings.isEnabled,
                      roundupRule: settings.roundupRule,
                      customAmount: settings.customAmount,
                      minimumPurchase: settings.minimumPurchase,
                      maximumRoundup: settings.maximumRoundup,
                      transferFrequency: settings.transferFrequency,
                      excludedCategories: settings.excludedCategories || [],
                      excludedMerchants: settings.excludedMerchants || [],
                      destinationAccountId: settings.destinationAccountId,
                    });
                    setIsDirty(false);
                  }
                }}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </>
      )}

      {error && (
        <div style={{ 
          marginTop: '16px',
          padding: '8px 12px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '4px',
          fontSize: '14px',
        }}>
          {error.message}
        </div>
      )}
    </div>
  );
}