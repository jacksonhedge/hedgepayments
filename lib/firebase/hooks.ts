import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  DocumentData
} from 'firebase/firestore';
import { auth, db } from './client';
import { BusinessUser, getCurrentBusiness } from './auth';
import { RoundupSettings, getRoundupSettings } from './roundups';

/**
 * Hook to get current auth user and business data
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [businessData, setBusinessData] = useState<BusinessUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        
        if (firebaseUser) {
          const business = await getCurrentBusiness(firebaseUser);
          setBusinessData(business);
        } else {
          setBusinessData(null);
        }
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, businessData, loading, error };
}

/**
 * Hook to get real-time roundup settings
 */
export function useRoundupSettings(userId?: string) {
  const [settings, setSettings] = useState<RoundupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchSettings = async () => {
      try {
        const data = await getRoundupSettings(userId);
        setSettings(data);
      } catch (err) {
        console.error('Error fetching roundup settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  return { settings, loading, error };
}

/**
 * Hook to get real-time roundups
 */
export function useRoundups(userId?: string, limitCount: number = 50) {
  const [roundups, setRoundups] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRoundups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'roundups'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRoundups(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching roundups:', err);
        setError('Failed to load roundups');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, limitCount]);

  return { roundups, loading, error };
}

/**
 * Hook to get real-time transactions
 */
export function useTransactions(userId?: string, limitCount: number = 50) {
  const [transactions, setTransactions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, limitCount]);

  return { transactions, loading, error };
}

/**
 * Hook to get user statistics
 */
export function useUserStats(userId?: string) {
  const [stats, setStats] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'userStats', userId),
      (doc) => {
        if (doc.exists()) {
          setStats(doc.data());
        } else {
          setStats({
            totalRoundups: 0,
            pendingRoundups: 0,
            processedRoundups: 0,
            totalRoundupAmount: 0,
            totalProcessedAmount: 0
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user stats:', err);
        setError('Failed to load statistics');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { stats, loading, error };
}

/**
 * Hook for real-time notifications
 */
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<DocumentData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(data);
      setUnreadCount(data.length);
    });

    return unsubscribe;
  }, [userId]);

  return { notifications, unreadCount };
}