/**
 * Roundups API methods
 */
import {
  Roundup,
  RoundupSettings,
  CreateRoundupSettingsRequest,
  UpdateRoundupSettingsRequest,
  PaginationParams,
  validateRequired,
  validateAmount,
} from '@hedge/shared';
import { BaseApi } from './base-api';

export class RoundupsApi extends BaseApi {
  /**
   * Get roundup settings for a user
   */
  public async getSettings(userId: string): Promise<RoundupSettings> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.get<RoundupSettings>(`/users/${userId}/roundups/settings`)
    );
  }

  /**
   * Create roundup settings for a user
   */
  public async createSettings(request: CreateRoundupSettingsRequest): Promise<RoundupSettings> {
    validateRequired(request.userId, 'userId');
    this.validateId(request.userId, 'userId');

    if (request.customAmount) {
      validateAmount(request.customAmount);
    }
    if (request.minimumPurchase) {
      validateAmount(request.minimumPurchase);
    }
    if (request.maximumRoundup) {
      validateAmount(request.maximumRoundup);
    }

    return this.handleRequest(() =>
      this.client.post<RoundupSettings>('/roundups/settings', request)
    );
  }

  /**
   * Update roundup settings
   */
  public async updateSettings(userId: string, request: UpdateRoundupSettingsRequest): Promise<RoundupSettings> {
    this.validateId(userId, 'userId');

    if (request.customAmount) {
      validateAmount(request.customAmount);
    }
    if (request.minimumPurchase) {
      validateAmount(request.minimumPurchase);
    }
    if (request.maximumRoundup) {
      validateAmount(request.maximumRoundup);
    }

    return this.handleRequest(() =>
      this.client.patch<RoundupSettings>(`/users/${userId}/roundups/settings`, request)
    );
  }

  /**
   * Enable roundups for a user
   */
  public async enable(userId: string): Promise<RoundupSettings> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.post<RoundupSettings>(`/users/${userId}/roundups/enable`)
    );
  }

  /**
   * Disable roundups for a user
   */
  public async disable(userId: string): Promise<RoundupSettings> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.post<RoundupSettings>(`/users/${userId}/roundups/disable`)
    );
  }

  /**
   * Get a specific roundup by ID
   */
  public async get(roundupId: string): Promise<Roundup> {
    this.validateId(roundupId, 'roundupId');

    return this.handleRequest(() =>
      this.client.get<Roundup>(`/roundups/${roundupId}`)
    );
  }

  /**
   * List roundups for a user
   */
  public async list(userId: string, params?: PaginationParams & {
    status?: string;
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<{
    roundups: Roundup[];
    meta: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    this.validateId(userId, 'userId');

    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.accountId) searchParams.append('accountId', params.accountId);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    const response = await this.client.get<{
      roundups: Roundup[];
      meta: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/users/${userId}/roundups${queryString}`);

    return response.data;
  }

  /**
   * Process pending roundups for a user
   */
  public async processPending(userId: string): Promise<{
    processedCount: number;
    totalAmount: number;
    transferIds: string[];
  }> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.post<{
        processedCount: number;
        totalAmount: number;
        transferIds: string[];
      }>(`/users/${userId}/roundups/process`)
    );
  }

  /**
   * Get roundup statistics for a user
   */
  public async getStats(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<{
    totalRoundups: number;
    totalAmount: number;
    averageRoundup: number;
    pendingRoundups: number;
    pendingAmount: number;
    processedRoundups: number;
    processedAmount: number;
    failedRoundups: number;
    byStatus: Record<string, number>;
    byAccount: Record<string, { count: number; amount: number }>;
  }> {
    this.validateId(userId, 'userId');

    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.accountId) searchParams.append('accountId', params.accountId);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    return this.handleRequest(() =>
      this.client.get<{
        totalRoundups: number;
        totalAmount: number;
        averageRoundup: number;
        pendingRoundups: number;
        pendingAmount: number;
        processedRoundups: number;
        processedAmount: number;
        failedRoundups: number;
        byStatus: Record<string, number>;
        byAccount: Record<string, { count: number; amount: number }>;
      }>(`/users/${userId}/roundups/stats${queryString}`)
    );
  }

  /**
   * Simulate roundups for transactions (testing/preview)
   */
  public async simulate(userId: string, transactions: Array<{
    amount: number;
    description: string;
    merchantName?: string;
  }>): Promise<{
    roundups: Array<{
      originalAmount: number;
      roundupAmount: number;
      description: string;
      merchantName?: string;
    }>;
    totalRoundupAmount: number;
  }> {
    this.validateId(userId, 'userId');
    validateRequired(transactions, 'transactions');

    return this.handleRequest(() =>
      this.client.post<{
        roundups: Array<{
          originalAmount: number;
          roundupAmount: number;
          description: string;
          merchantName?: string;
        }>;
        totalRoundupAmount: number;
      }>(`/users/${userId}/roundups/simulate`, { transactions })
    );
  }
}