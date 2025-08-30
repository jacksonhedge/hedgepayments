/**
 * Round-up related types
 */
import { TimestampedEntity } from './common';

export type RoundupStatus = 'pending' | 'processed' | 'failed' | 'cancelled';
export type TransactionType = 'purchase' | 'payment' | 'transfer' | 'fee';

export interface Transaction extends TimestampedEntity {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  merchantName?: string;
  transactionType: TransactionType;
  date: string;
  roundupAmount?: number;
  isRoundupEligible: boolean;
  metadata?: Record<string, any>;
}

export interface Roundup extends TimestampedEntity {
  id: string;
  userId: string;
  accountId: string;
  transactionId: string;
  originalAmount: number;
  roundupAmount: number;
  currency: string;
  status: RoundupStatus;
  processedAt?: string;
  transferId?: string;
  metadata?: Record<string, any>;
}

export interface RoundupSettings extends TimestampedEntity {
  id: string;
  userId: string;
  isEnabled: boolean;
  roundupRule: 'nearest_dollar' | 'nearest_five' | 'custom';
  customAmount?: number;
  minimumPurchase?: number;
  maximumRoundup?: number;
  excludedCategories?: string[];
  excludedMerchants?: string[];
  transferFrequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  destinationAccountId?: string;
}

export interface CreateRoundupSettingsRequest {
  userId: string;
  isEnabled?: boolean;
  roundupRule?: RoundupSettings['roundupRule'];
  customAmount?: number;
  minimumPurchase?: number;
  maximumRoundup?: number;
  excludedCategories?: string[];
  excludedMerchants?: string[];
  transferFrequency?: RoundupSettings['transferFrequency'];
  destinationAccountId?: string;
}

export interface UpdateRoundupSettingsRequest {
  isEnabled?: boolean;
  roundupRule?: RoundupSettings['roundupRule'];
  customAmount?: number;
  minimumPurchase?: number;
  maximumRoundup?: number;
  excludedCategories?: string[];
  excludedMerchants?: string[];
  transferFrequency?: RoundupSettings['transferFrequency'];
  destinationAccountId?: string;
}