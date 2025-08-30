/**
 * User-related types
 */
import { TimestampedEntity } from './common';

export interface User extends TimestampedEntity {
  id: string;
  email: string;
  partnerId: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  roundupsEnabled: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    marketingOptIn: boolean;
  };
}

export interface CreateUserRequest {
  email: string;
  partnerId: string;
  metadata?: Record<string, any>;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateUserRequest {
  email?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
  preferences?: Partial<UserPreferences>;
}