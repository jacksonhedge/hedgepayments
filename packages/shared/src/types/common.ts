/**
 * Common types used across all Hedge SDKs
 */

export type Environment = 'development' | 'staging' | 'production';

export interface HedgeConfig {
  apiKey: string;
  partnerId: string;
  environment: Environment;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  requestId?: string;
}