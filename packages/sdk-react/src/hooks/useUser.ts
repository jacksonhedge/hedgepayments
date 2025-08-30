/**
 * User management hooks
 */
import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserRequest, UpdateUserRequest } from '@hedge/shared';
import { useHedgeContext } from '../context/HedgeContext';

export function useUser(userId?: string) {
  const { sdk } = useHedgeContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async (id?: string) => {
    if (!sdk || !id) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await sdk.users.get(id);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const fetchCurrentUser = useCallback(async () => {
    if (!sdk) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await sdk.users.getCurrent();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const createUser = useCallback(async (request: CreateUserRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const userData = await sdk.users.create(request);
      setUser(userData);
      return userData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const updateUser = useCallback(async (id: string, request: UpdateUserRequest) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      const userData = await sdk.users.update(id, request);
      setUser(userData);
      return userData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const deleteUser = useCallback(async (id: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    setLoading(true);
    setError(null);

    try {
      await sdk.users.delete(id);
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const getStats = useCallback(async (id: string) => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      return await sdk.users.getStats(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [sdk]);

  // Auto-fetch user on mount if userId provided
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  return {
    user,
    loading,
    error,
    fetchUser,
    fetchCurrentUser,
    createUser,
    updateUser,
    deleteUser,
    getStats,
    refresh: () => userId ? fetchUser(userId) : fetchCurrentUser(),
  };
}

export function useCurrentUser() {
  const { sdk } = useHedgeContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!sdk) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await sdk.users.getCurrent();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refresh: fetchUser,
  };
}