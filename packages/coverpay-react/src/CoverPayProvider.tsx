import React, { createContext, useContext, useMemo, ReactNode } from 'react';

export interface CoverPayConfig {
  publishableKey: string;
  apiBase?: string;
  testMode?: boolean;
}

interface CoverPayContextValue {
  publishableKey: string;
  apiBase: string;
  testMode: boolean;
}

const CoverPayContext = createContext<CoverPayContextValue | null>(null);

export interface CoverPayProviderProps {
  publishableKey: string;
  apiBase?: string;
  testMode?: boolean;
  children: ReactNode;
}

export function CoverPayProvider({
  publishableKey,
  apiBase = 'https://api.hedgepayments.com',
  testMode = true,
  children,
}: CoverPayProviderProps) {
  const value = useMemo(
    () => ({
      publishableKey,
      apiBase,
      testMode,
    }),
    [publishableKey, apiBase, testMode]
  );

  return (
    <CoverPayContext.Provider value={value}>
      {children}
    </CoverPayContext.Provider>
  );
}

export function useCoverPayConfig(): CoverPayContextValue {
  const context = useContext(CoverPayContext);
  if (!context) {
    throw new Error('useCoverPayConfig must be used within a CoverPayProvider');
  }
  return context;
}

export { CoverPayContext };
