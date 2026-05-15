import React, { useState, useEffect, CSSProperties } from 'react';
import { useCoverPay, Customer, Provider, PaymentPlan, CheckoutResult } from './useCoverPay';

export interface CoverPayButtonProps {
  amount: number;
  currency?: string;
  orderId?: string;
  customer?: Customer;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
  onSuccess?: (result: CheckoutResult) => void;
  onDeclined?: (declined: Array<{ id: string; reason?: string }>) => void;
  onError?: (error: Error) => void;
  onProviderSelect?: (provider: Provider, plan: PaymentPlan | null) => void;
  buttonText?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  showProviderSelector?: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  klarna: '#FFB3C7',
  affirm: '#0FA0EA',
  afterpay: '#B2FCE4',
  sezzle: '#382757',
  zip: '#AA8FFF',
  paypal: '#003087',
};

const defaultStyles: Record<string, CSSProperties> = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#3EB489',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '200px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    background: 'linear-gradient(135deg, #3EB489 0%, #2E8B6D 100%)',
    color: 'white',
    padding: '24px',
    textAlign: 'center' as const,
  },
  body: {
    padding: '24px',
  },
  provider: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s',
  },
  providerSelected: {
    borderColor: '#3EB489',
    backgroundColor: '#f0fdf4',
  },
  providerLogo: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '20px',
    marginRight: '16px',
    flexShrink: 0,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontWeight: 600,
    color: '#1f2937',
    fontSize: '15px',
  },
  providerPlan: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
  continueButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #3EB489 0%, #2E8B6D 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '16px',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '16px',
    fontSize: '12px',
    color: '#9ca3af',
    borderTop: '1px solid #f3f4f6',
  },
};

export function CoverPayButton({
  amount,
  currency = 'USD',
  orderId,
  customer,
  successUrl,
  cancelUrl,
  metadata,
  onSuccess,
  onDeclined,
  onError,
  onProviderSelect,
  buttonText = 'Pay Later',
  className,
  style,
  disabled,
  showProviderSelector = true,
}: CoverPayButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    status,
    eligibility,
    selectedProvider,
    selectedPlan,
    error,
    isLoading,
    createSession,
    checkEligibility,
    selectProvider,
    checkout,
    reset,
  } = useCoverPay();

  // Initialize session when modal opens
  useEffect(() => {
    if (showModal && !initialized) {
      const init = async () => {
        try {
          await createSession({
            amount,
            currency,
            orderId,
            customer,
            successUrl: successUrl || window.location.href,
            cancelUrl: cancelUrl || window.location.href,
            metadata,
          });
          await checkEligibility();
          setInitialized(true);
        } catch (err) {
          onError?.(err instanceof Error ? err : new Error('Initialization failed'));
        }
      };
      init();
    }
  }, [showModal, initialized, amount, currency, orderId, customer, successUrl, cancelUrl, metadata, createSession, checkEligibility, onError]);

  // Handle declined
  useEffect(() => {
    if (status === 'declined' && eligibility) {
      onDeclined?.(eligibility.declined);
    }
  }, [status, eligibility, onDeclined]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Handle provider selection callback
  useEffect(() => {
    if (selectedProvider) {
      onProviderSelect?.(selectedProvider, selectedPlan);
    }
  }, [selectedProvider, selectedPlan, onProviderSelect]);

  const handleClick = () => {
    if (showProviderSelector) {
      setShowModal(true);
    } else {
      // Direct checkout without modal
      handleCheckout();
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
    setInitialized(false);
  };

  const handleProviderClick = (providerId: string) => {
    selectProvider(providerId);
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout();
      onSuccess?.(result);
      // Redirect to provider
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      // Error already handled in hook
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const buttonStyle = {
    ...defaultStyles.button,
    ...(disabled || isLoading ? defaultStyles.buttonDisabled : {}),
    ...style,
  };

  return (
    <>
      <button
        className={className}
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled || isLoading}
        type="button"
      >
        {isLoading && <span style={defaultStyles.spinner} />}
        {buttonText}
      </button>

      {showModal && (
        <div style={defaultStyles.modal} onClick={handleClose}>
          <div style={defaultStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={defaultStyles.header}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>CoverPay</div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {formatCurrency(amount)}
              </div>
            </div>

            <div style={defaultStyles.body}>
              {isLoading && !eligibility && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ ...defaultStyles.spinner, margin: '0 auto 16px', borderColor: '#e5e7eb', borderTopColor: '#3EB489', width: '32px', height: '32px' }} />
                  <div style={{ color: '#6b7280' }}>Finding payment options...</div>
                </div>
              )}

              {eligibility && eligibility.providers.length > 0 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 600, color: '#1f2937' }}>
                    Choose how to pay
                  </div>
                  {eligibility.providers.map((provider) => {
                    const isSelected = selectedProvider?.id === provider.id;
                    const color = PROVIDER_COLORS[provider.id] || '#6b7280';

                    return (
                      <div
                        key={provider.id}
                        style={{
                          ...defaultStyles.provider,
                          ...(isSelected ? defaultStyles.providerSelected : {}),
                        }}
                        onClick={() => handleProviderClick(provider.id)}
                      >
                        <div
                          style={{
                            ...defaultStyles.providerLogo,
                            backgroundColor: `${color}30`,
                            color,
                          }}
                        >
                          {provider.name.charAt(0)}
                        </div>
                        <div style={defaultStyles.providerInfo}>
                          <div style={defaultStyles.providerName}>{provider.name}</div>
                          <div style={defaultStyles.providerPlan}>
                            {provider.plans.length > 0
                              ? `${provider.plans[0].installments} payments of ${formatCurrency(provider.plans[0].amount)}`
                              : 'Pay later'}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            border: `2px solid ${isSelected ? '#3EB489' : '#d1d5db'}`,
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#3EB489' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    style={{
                      ...defaultStyles.continueButton,
                      opacity: !selectedProvider || isLoading ? 0.5 : 1,
                      cursor: !selectedProvider || isLoading ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleCheckout}
                    disabled={!selectedProvider || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span style={{ ...defaultStyles.spinner, marginRight: '8px' }} />
                        Connecting...
                      </>
                    ) : (
                      `Continue with ${selectedProvider?.name || 'Pay Later'}`
                    )}
                  </button>
                </>
              )}

              {eligibility && eligibility.providers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    <span role="img" aria-label="sorry">😔</span>
                  </div>
                  <p>Sorry, no pay-later options are available for this order.</p>
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                  <p>{error.message}</p>
                </div>
              )}
            </div>

            <div style={defaultStyles.footer}>
              Powered by{' '}
              <a
                href="https://hedgepayments.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3EB489', textDecoration: 'none', fontWeight: 500 }}
              >
                Hedge Payments
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
