/**
 * Transfer related types
 */
import { TimestampedEntity } from './common';

export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TransferType = 'roundup' | 'manual' | 'refund';

export interface Transfer extends TimestampedEntity {
  id: string;
  userId: string;
  sourceAccountId: string;
  destinationAccountId?: string;
  amount: number;
  currency: string;
  type: TransferType;
  status: TransferStatus;
  description: string;
  processingTime?: string;
  completedAt?: string;
  failureReason?: string;
  externalTransferId?: string;
  roundupIds?: string[];
  metadata?: Record<string, any>;
}

export interface CreateTransferRequest {
  userId: string;
  sourceAccountId: string;
  destinationAccountId?: string;
  amount: number;
  currency?: string;
  type: TransferType;
  description: string;
  roundupIds?: string[];
  metadata?: Record<string, any>;
}

export interface TransferSummary {
  totalAmount: number;
  currency: string;
  transferCount: number;
  successfulTransfers: number;
  failedTransfers: number;
  pendingTransfers: number;
}