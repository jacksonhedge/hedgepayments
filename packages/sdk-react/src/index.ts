/**
 * Hedge React SDK
 * @packageDocumentation
 */

// Context and Provider
export { HedgeProvider, useHedgeContext } from './context/HedgeContext';
export type { HedgeProviderProps, HedgeContextValue } from './context/HedgeContext';

// Hooks
export { useHedge } from './hooks/useHedge';
export { useUser, useCurrentUser } from './hooks/useUser';
export { useAccounts, useAccount } from './hooks/useAccounts';
export { useRoundups, useRoundupSettings, useRoundup } from './hooks/useRoundups';
export { useTransfers, useTransfer } from './hooks/useTransfers';
export { 
  useEvents, 
  useEventListener, 
  useUserEvents, 
  useAccountEvents, 
  useTransactionEvents,
  useRoundupEvents,
  useTransferEvents 
} from './hooks/useEvents';

// Components
export { ConnectionStatus } from './components/ConnectionStatus';
export type { ConnectionStatusProps } from './components/ConnectionStatus';

export { RoundupSettings } from './components/RoundupSettings';
export type { RoundupSettingsProps } from './components/RoundupSettings';

export { AccountList } from './components/AccountList';
export type { AccountListProps } from './components/AccountList';

// Re-export core SDK types
export * from '@hedge/sdk-core';