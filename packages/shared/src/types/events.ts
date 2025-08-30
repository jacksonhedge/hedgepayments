/**
 * Event types for real-time notifications
 */

export interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  userId: string;
  partnerId: string;
}

export interface UserEvent extends BaseEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    userId: string;
    email: string;
    changes?: Record<string, any>;
  };
}

export interface AccountEvent extends BaseEvent {
  type: 'account.connected' | 'account.updated' | 'account.disconnected' | 'account.error';
  data: {
    accountId: string;
    institutionName: string;
    status: string;
    error?: string;
  };
}

export interface TransactionEvent extends BaseEvent {
  type: 'transaction.created' | 'transaction.updated';
  data: {
    transactionId: string;
    accountId: string;
    amount: number;
    roundupAmount?: number;
    isRoundupEligible: boolean;
  };
}

export interface RoundupEvent extends BaseEvent {
  type: 'roundup.created' | 'roundup.processed' | 'roundup.failed';
  data: {
    roundupId: string;
    transactionId: string;
    amount: number;
    status: string;
    error?: string;
  };
}

export interface TransferEvent extends BaseEvent {
  type: 'transfer.initiated' | 'transfer.processing' | 'transfer.completed' | 'transfer.failed';
  data: {
    transferId: string;
    amount: number;
    status: string;
    error?: string;
  };
}

export type HedgeEvent = UserEvent | AccountEvent | TransactionEvent | RoundupEvent | TransferEvent;

export interface WebhookPayload {
  event: HedgeEvent;
  signature: string;
  timestamp: string;
}