/**
 * Event handling hooks
 */
import { useState, useEffect, useCallback } from 'react';
import { HedgeEvent } from '@hedge/shared';
import { useHedgeContext } from '../context/HedgeContext';

export function useEvents(eventTypes?: string[]) {
  const { sdk, lastEvent } = useHedgeContext();
  const [events, setEvents] = useState<HedgeEvent[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeToEvents = useCallback((types: string[]) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      sdk.subscribeToEvents(types);
      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe to events:', err);
    }
  }, [sdk]);

  const unsubscribeFromEvents = useCallback((types: string[]) => {
    if (!sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      sdk.unsubscribeFromEvents(types);
      setIsSubscribed(false);
    } catch (err) {
      console.error('Failed to unsubscribe from events:', err);
    }
  }, [sdk]);

  // Add new events to the events array
  useEffect(() => {
    if (lastEvent) {
      // Filter events if eventTypes is specified
      if (!eventTypes || eventTypes.includes(lastEvent.type)) {
        setEvents(prev => [lastEvent, ...prev.slice(0, 99)]); // Keep last 100 events
      }
    }
  }, [lastEvent, eventTypes]);

  // Auto-subscribe to specified event types
  useEffect(() => {
    if (eventTypes && eventTypes.length > 0 && sdk && !isSubscribed) {
      subscribeToEvents(eventTypes);
    }

    return () => {
      if (eventTypes && eventTypes.length > 0 && sdk && isSubscribed) {
        unsubscribeFromEvents(eventTypes);
      }
    };
  }, [eventTypes, sdk, isSubscribed, subscribeToEvents, unsubscribeFromEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    lastEvent,
    isSubscribed,
    subscribeToEvents,
    unsubscribeFromEvents,
    clearEvents,
  };
}

export function useEventListener<T extends HedgeEvent>(
  eventType: string,
  callback: (event: T) => void,
  dependencies?: React.DependencyList
) {
  const { sdk } = useHedgeContext();

  useEffect(() => {
    if (!sdk) return;

    const handler = (event: T) => {
      if (event.type === eventType) {
        callback(event);
      }
    };

    sdk.on('event', handler);

    return () => {
      sdk.off('event', handler);
    };
  }, [sdk, eventType, callback, ...(dependencies || [])]);
}

// Specific event hooks
export function useUserEvents(callback: (event: HedgeEvent) => void) {
  useEventListener('user.created', callback);
  useEventListener('user.updated', callback);
  useEventListener('user.deleted', callback);
}

export function useAccountEvents(callback: (event: HedgeEvent) => void) {
  useEventListener('account.connected', callback);
  useEventListener('account.updated', callback);
  useEventListener('account.disconnected', callback);
  useEventListener('account.error', callback);
}

export function useTransactionEvents(callback: (event: HedgeEvent) => void) {
  useEventListener('transaction.created', callback);
  useEventListener('transaction.updated', callback);
}

export function useRoundupEvents(callback: (event: HedgeEvent) => void) {
  useEventListener('roundup.created', callback);
  useEventListener('roundup.processed', callback);
  useEventListener('roundup.failed', callback);
}

export function useTransferEvents(callback: (event: HedgeEvent) => void) {
  useEventListener('transfer.initiated', callback);
  useEventListener('transfer.processing', callback);
  useEventListener('transfer.completed', callback);
  useEventListener('transfer.failed', callback);
}