import { useState, useCallback } from 'react';
import { useCoverPayConfig } from './CoverPayProvider';

export interface Customer {
  email?: string;
  phone?: string;
  name?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  installments: number;
  amount: number;
  apr?: number;
}

export interface Provider {
  id: string;
  name: string;
  plans: PaymentPlan[];
  limit?: number;
}

export interface Session {
  id: string;
  token: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  providers: Provider[];
}

export interface EligibilityResult {
  eligible: boolean;
  providers: Provider[];
  declined: Array<{ id: string; name: string; reason?: string }>;
  recommendedProvider: Provider | null;
}

export interface CheckoutResult {
  provider: string;
  providerName: string;
  checkoutUrl: string;
  sessionId: string;
  orderId: string;
}

export interface CoverPayCheckoutOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  customer?: Customer;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
}

export type CoverPayStatus =
  | 'idle'
  | 'creating_session'
  | 'checking_eligibility'
  | 'selecting_provider'
  | 'redirecting'
  | 'success'
  | 'declined'
  | 'error';

export interface UseCoverPayReturn {
  status: CoverPayStatus;
  session: Session | null;
  eligibility: EligibilityResult | null;
  selectedProvider: Provider | null;
  selectedPlan: PaymentPlan | null;
  error: Error | null;
  isLoading: boolean;
  createSession: (options: CoverPayCheckoutOptions) => Promise<Session>;
  checkEligibility: () => Promise<EligibilityResult>;
  selectProvider: (providerId: string, planId?: string) => void;
  checkout: () => Promise<CheckoutResult>;
  reset: () => void;
}

export function useCoverPay(): UseCoverPayReturn {
  const { publishableKey, apiBase } = useCoverPayConfig();

  const [status, setStatus] = useState<CoverPayStatus>('idle');
  const [session, setSession] = useState<Session | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const createSession = useCallback(
    async (options: CoverPayCheckoutOptions): Promise<Session> => {
      setStatus('creating_session');
      setError(null);

      try {
        const response = await fetch(`${apiBase}/coverpay/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publishableKey,
            ...options,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to create session');
        }

        setSession(data.session);
        return data.session;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create session');
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [apiBase, publishableKey]
  );

  const checkEligibility = useCallback(async (): Promise<EligibilityResult> => {
    if (!session) {
      throw new Error('No active session. Call createSession first.');
    }

    setStatus('checking_eligibility');
    setError(null);

    try {
      const response = await fetch(`${apiBase}/coverpay/sessions/${session.token}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to check eligibility');
      }

      setEligibility(data.eligibility);

      // Auto-select recommended provider
      if (data.eligibility.recommendedProvider) {
        setSelectedProvider(data.eligibility.recommendedProvider);
        if (data.eligibility.recommendedProvider.plans.length > 0) {
          setSelectedPlan(data.eligibility.recommendedProvider.plans[0]);
        }
      }

      if (data.eligibility.providers.length === 0) {
        setStatus('declined');
      } else {
        setStatus('idle');
      }

      return data.eligibility;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check eligibility');
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [apiBase, session]);

  const selectProvider = useCallback(
    (providerId: string, planId?: string) => {
      if (!eligibility) return;

      const provider = eligibility.providers.find((p) => p.id === providerId);
      if (!provider) return;

      setSelectedProvider(provider);

      if (planId) {
        const plan = provider.plans.find((p) => p.id === planId);
        setSelectedPlan(plan || null);
      } else if (provider.plans.length > 0) {
        setSelectedPlan(provider.plans[0]);
      } else {
        setSelectedPlan(null);
      }
    },
    [eligibility]
  );

  const checkout = useCallback(async (): Promise<CheckoutResult> => {
    if (!session) {
      throw new Error('No active session. Call createSession first.');
    }
    if (!selectedProvider) {
      throw new Error('No provider selected. Call selectProvider first.');
    }

    setStatus('selecting_provider');
    setError(null);

    try {
      const response = await fetch(`${apiBase}/coverpay/sessions/${session.token}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          planId: selectedPlan?.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Check if we should try next provider (waterfall)
        if (data.tryNext && eligibility) {
          const currentIndex = eligibility.providers.findIndex(
            (p) => p.id === selectedProvider.id
          );
          const nextProvider = eligibility.providers[currentIndex + 1];

          if (nextProvider) {
            setSelectedProvider(nextProvider);
            if (nextProvider.plans.length > 0) {
              setSelectedPlan(nextProvider.plans[0]);
            }
            // Retry with next provider
            return checkout();
          }
        }

        throw new Error(data.error || 'Failed to create checkout');
      }

      setStatus('redirecting');

      // Return checkout info - caller can redirect
      return data.checkout;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create checkout');
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [apiBase, session, selectedProvider, selectedPlan, eligibility]);

  const reset = useCallback(() => {
    setStatus('idle');
    setSession(null);
    setEligibility(null);
    setSelectedProvider(null);
    setSelectedPlan(null);
    setError(null);
  }, []);

  const isLoading = ['creating_session', 'checking_eligibility', 'selecting_provider'].includes(status);

  return {
    status,
    session,
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
  };
}
