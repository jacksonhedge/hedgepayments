/**
 * Bank account related types
 */
import { TimestampedEntity } from './common';

export type AccountType = 'checking' | 'savings' | 'credit';
export type AccountStatus = 'active' | 'inactive' | 'pending' | 'error';

export interface BankAccount extends TimestampedEntity {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  accountSubtype?: string;
  mask: string;
  status: AccountStatus;
  balance?: {
    available: number;
    current: number;
    currency: string;
  };
  isRoundupsEnabled: boolean;
  metadata?: Record<string, any>;
}

export interface ConnectAccountRequest {
  userId: string;
  institutionId: string;
  publicToken: string;
}

export interface LinkToken {
  linkToken: string;
  expiration: string;
}

export interface UpdateAccountRequest {
  accountName?: string;
  isRoundupsEnabled?: boolean;
  metadata?: Record<string, any>;
}