/**
 * Account management hooks
 */
import { useState, useEffect, useCallback } from 'react';
import { BankAccount, ConnectAccountRequest, UpdateAccountRequest, LinkToken } from '@hedge/shared';
import { useHedgeContext } from '../context/HedgeContext';

export function useAccounts(userId: string) {
  const { sdk } = useHedgeContext();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  } | null>(null);

  const fetchAccounts = useCallback(async (page = 1, limit = 20) => {
    if (!sdk || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await sdk.accounts.list(userId, { page, limit });
      setAccounts(response.accounts);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const getLinkToken = useCallback(async (): Promise<LinkToken> => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    try {
      return await sdk.accounts.getLinkToken(userId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, userId]);

  const connectAccount = useCallback(async (request: ConnectAccountRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const newAccounts = await sdk.accounts.connect(request);
      // Refresh the accounts list
      await fetchAccounts();
      return newAccounts;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk, fetchAccounts]);

  const updateAccount = useCallback(async (accountId: string, request: UpdateAccountRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const updatedAccount = await sdk.accounts.update(accountId, request);
      // Update the account in the list
      setAccounts(prev => 
        prev.map(account => account.id === accountId ? updatedAccount : account)
      );
      return updatedAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const disconnectAccount = useCallback(async (accountId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      await sdk.accounts.disconnect(accountId);
      // Remove the account from the list
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const refreshAccount = useCallback(async (accountId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      const refreshedAccount = await sdk.accounts.refresh(accountId);
      // Update the account in the list
      setAccounts(prev => 
        prev.map(account => account.id === accountId ? refreshedAccount : account)
      );
      return refreshedAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk]);

  const enableRoundups = useCallback(async (accountId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      const updatedAccount = await sdk.accounts.enableRoundups(accountId);
      setAccounts(prev => 
        prev.map(account => account.id === accountId ? updatedAccount : account)
      );
      return updatedAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk]);

  const disableRoundups = useCallback(async (accountId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      const updatedAccount = await sdk.accounts.disableRoundups(accountId);
      setAccounts(prev => 
        prev.map(account => account.id === accountId ? updatedAccount : account)
      );
      return updatedAccount;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk]);

  // Auto-fetch accounts on mount
  useEffect(() => {
    if (userId) {
      fetchAccounts();
    }
  }, [userId, fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    meta,
    fetchAccounts,
    getLinkToken,
    connectAccount,
    updateAccount,
    disconnectAccount,
    refreshAccount,
    enableRoundups,
    disableRoundups,
    refresh: () => fetchAccounts(),
  };
}

export function useAccount(accountId: string) {
  const { sdk } = useHedgeContext();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!sdk || !accountId) return;

    setLoading(true);
    setError(null);

    try {
      const accountData = await sdk.accounts.get(accountId);
      setAccount(accountData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, accountId]);

  const getTransactions = useCallback(async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
  }) => {
    if (!sdk || !accountId) throw new Error('SDK not initialized or accountId not provided');

    try {
      return await sdk.accounts.getTransactions(accountId, params);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, accountId]);

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId, fetchAccount]);

  return {
    account,
    loading,
    error,
    fetchAccount,
    getTransactions,
    refresh: fetchAccount,
  };
}