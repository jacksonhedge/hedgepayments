/**
 * Roundups management hooks
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  Roundup, 
  RoundupSettings, 
  CreateRoundupSettingsRequest, 
  UpdateRoundupSettingsRequest,
  PaginationParams 
} from '@hedge/shared';
import { useHedgeContext } from '../context/HedgeContext';

export function useRoundups(userId: string) {
  const { sdk } = useHedgeContext();
  const [roundups, setRoundups] = useState<Roundup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  } | null>(null);

  const fetchRoundups = useCallback(async (params?: PaginationParams & {
    status?: string;
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }) => {
    if (!sdk || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await sdk.roundups.list(userId, params);
      setRoundups(response.roundups);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const processPending = useCallback(async () => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    setLoading(true);
    setError(null);

    try {
      const result = await sdk.roundups.processPending(userId);
      // Refresh the roundups list after processing
      await fetchRoundups();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk, userId, fetchRoundups]);

  const getStats = useCallback(async (params?: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }) => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    try {
      return await sdk.roundups.getStats(userId, params);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, userId]);

  const simulate = useCallback(async (transactions: Array<{
    amount: number;
    description: string;
    merchantName?: string;
  }>) => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    try {
      return await sdk.roundups.simulate(userId, transactions);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, userId]);

  // Auto-fetch roundups on mount
  useEffect(() => {
    if (userId) {
      fetchRoundups();
    }
  }, [userId, fetchRoundups]);

  return {
    roundups,
    loading,
    error,
    meta,
    fetchRoundups,
    processPending,
    getStats,
    simulate,
    refresh: () => fetchRoundups(),
  };
}

export function useRoundupSettings(userId: string) {
  const { sdk } = useHedgeContext();
  const [settings, setSettings] = useState<RoundupSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!sdk || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const settingsData = await sdk.roundups.getSettings(userId);
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const createSettings = useCallback(async (request: CreateRoundupSettingsRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const newSettings = await sdk.roundups.createSettings(request);
      setSettings(newSettings);
      return newSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const updateSettings = useCallback(async (request: UpdateRoundupSettingsRequest) => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    setLoading(true);
    setError(null);

    try {
      const updatedSettings = await sdk.roundups.updateSettings(userId, request);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const enable = useCallback(async () => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    setLoading(true);
    setError(null);

    try {
      const updatedSettings = await sdk.roundups.enable(userId);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const disable = useCallback(async () => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    setLoading(true);
    setError(null);

    try {
      const updatedSettings = await sdk.roundups.disable(userId);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  // Auto-fetch settings on mount
  useEffect(() => {
    if (userId) {
      fetchSettings();
    }
  }, [userId, fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    createSettings,
    updateSettings,
    enable,
    disable,
    refresh: fetchSettings,
  };
}

export function useRoundup(roundupId: string) {
  const { sdk } = useHedgeContext();
  const [roundup, setRoundup] = useState<Roundup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoundup = useCallback(async () => {
    if (!sdk || !roundupId) return;

    setLoading(true);
    setError(null);

    try {
      const roundupData = await sdk.roundups.get(roundupId);
      setRoundup(roundupData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, roundupId]);

  useEffect(() => {
    if (roundupId) {
      fetchRoundup();
    }
  }, [roundupId, fetchRoundup]);

  return {
    roundup,
    loading,
    error,
    fetchRoundup,
    refresh: fetchRoundup,
  };
}