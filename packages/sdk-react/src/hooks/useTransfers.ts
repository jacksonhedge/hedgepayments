/**
 * Transfers management hooks
 */
import { useState, useEffect, useCallback } from 'react';
import { Transfer, CreateTransferRequest, TransferSummary, PaginationParams } from '@hedge/shared';
import { useHedgeContext } from '../context/HedgeContext';

export function useTransfers(userId: string) {
  const { sdk } = useHedgeContext();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  } | null>(null);

  const fetchTransfers = useCallback(async (params?: PaginationParams & {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }) => {
    if (!sdk || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await sdk.transfers.list(userId, params);
      setTransfers(response.transfers);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, userId]);

  const createTransfer = useCallback(async (request: CreateTransferRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const newTransfer = await sdk.transfers.create(request);
      // Add the new transfer to the beginning of the list
      setTransfers(prev => [newTransfer, ...prev]);
      return newTransfer;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const cancelTransfer = useCallback(async (transferId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const cancelledTransfer = await sdk.transfers.cancel(transferId);
      // Update the transfer in the list
      setTransfers(prev => 
        prev.map(transfer => transfer.id === transferId ? cancelledTransfer : transfer)
      );
      return cancelledTransfer;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const retryTransfer = useCallback(async (transferId: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const retriedTransfer = await sdk.transfers.retry(transferId);
      // Update the transfer in the list
      setTransfers(prev => 
        prev.map(transfer => transfer.id === transferId ? retriedTransfer : transfer)
      );
      return retriedTransfer;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const getSummary = useCallback(async (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<TransferSummary> => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    try {
      return await sdk.transfers.getSummary(userId, params);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, userId]);

  const getStats = useCallback(async (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => {
    if (!sdk || !userId) throw new Error('SDK not initialized or userId not provided');

    try {
      return await sdk.transfers.getStats(userId, params);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk, userId]);

  const estimate = useCallback(async (request: {
    sourceAccountId: string;
    destinationAccountId?: string;
    amount: number;
    currency?: string;
  }) => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      return await sdk.transfers.estimate(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk]);

  // Auto-fetch transfers on mount
  useEffect(() => {
    if (userId) {
      fetchTransfers();
    }
  }, [userId, fetchTransfers]);

  return {
    transfers,
    loading,
    error,
    meta,
    fetchTransfers,
    createTransfer,
    cancelTransfer,
    retryTransfer,
    getSummary,
    getStats,
    estimate,
    refresh: () => fetchTransfers(),
  };
}

export function useTransfer(transferId: string) {
  const { sdk } = useHedgeContext();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{
    status: string;
    timestamp: string;
    message?: string;
  }>>([]);

  const fetchTransfer = useCallback(async () => {
    if (!sdk || !transferId) return;

    setLoading(true);
    setError(null);

    try {
      const transferData = await sdk.transfers.get(transferId);
      setTransfer(transferData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, transferId]);

  const getStatus = useCallback(async () => {
    if (!sdk || !transferId) return;

    setLoading(true);
    setError(null);

    try {
      const statusData = await sdk.transfers.getStatus(transferId);
      setTransfer(statusData.transfer);
      setStatusHistory(statusData.statusHistory);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk, transferId]);

  useEffect(() => {
    if (transferId) {
      fetchTransfer();
    }
  }, [transferId, fetchTransfer]);

  return {
    transfer,
    statusHistory,
    loading,
    error,
    fetchTransfer,
    getStatus,
    refresh: fetchTransfer,
  };
}