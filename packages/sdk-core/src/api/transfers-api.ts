/**
 * Transfers API methods
 */
import {
  Transfer,
  CreateTransferRequest,
  TransferSummary,
  PaginationParams,
  validateRequired,
  validateAmount,
  validateCurrency,
} from '@hedge/shared';
import { BaseApi } from './base-api';

export class TransfersApi extends BaseApi {
  /**
   * Create a new transfer
   */
  public async create(request: CreateTransferRequest): Promise<Transfer> {
    validateRequired(request.userId, 'userId');
    validateRequired(request.sourceAccountId, 'sourceAccountId');
    validateRequired(request.type, 'type');
    validateAmount(request.amount);

    if (request.currency) {
      validateCurrency(request.currency);
    }

    return this.handleRequest(() =>
      this.client.post<Transfer>('/transfers', request)
    );
  }

  /**
   * Get transfer by ID
   */
  public async get(transferId: string): Promise<Transfer> {
    this.validateId(transferId, 'transferId');

    return this.handleRequest(() =>
      this.client.get<Transfer>(`/transfers/${transferId}`)
    );
  }

  /**
   * List transfers for a user
   */
  public async list(userId: string, params?: PaginationParams & {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<{
    transfers: Transfer[];
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
    if (params?.type) searchParams.append('type', params.type);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.accountId) searchParams.append('accountId', params.accountId);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    const response = await this.client.get<{
      transfers: Transfer[];
      meta: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/users/${userId}/transfers${queryString}`);

    return response.data;
  }

  /**
   * Cancel a pending transfer
   */
  public async cancel(transferId: string): Promise<Transfer> {
    this.validateId(transferId, 'transferId');

    return this.handleRequest(() =>
      this.client.post<Transfer>(`/transfers/${transferId}/cancel`)
    );
  }

  /**
   * Retry a failed transfer
   */
  public async retry(transferId: string): Promise<Transfer> {
    this.validateId(transferId, 'transferId');

    return this.handleRequest(() =>
      this.client.post<Transfer>(`/transfers/${transferId}/retry`)
    );
  }

  /**
   * Get transfer status and details
   */
  public async getStatus(transferId: string): Promise<{
    transfer: Transfer;
    statusHistory: Array<{
      status: string;
      timestamp: string;
      message?: string;
    }>;
  }> {
    this.validateId(transferId, 'transferId');

    return this.handleRequest(() =>
      this.client.get<{
        transfer: Transfer;
        statusHistory: Array<{
          status: string;
          timestamp: string;
          message?: string;
        }>;
      }>(`/transfers/${transferId}/status`)
    );
  }

  /**
   * Get transfer summary for a user
   */
  public async getSummary(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<TransferSummary> {
    this.validateId(userId, 'userId');

    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.type) searchParams.append('type', params.type);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    return this.handleRequest(() =>
      this.client.get<TransferSummary>(`/users/${userId}/transfers/summary${queryString}`)
    );
  }

  /**
   * Get transfer statistics
   */
  public async getStats(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<{
    totalTransfers: number;
    totalAmount: number;
    averageAmount: number;
    successRate: number;
    byStatus: Record<string, number>;
    byType: Record<string, { count: number; amount: number }>;
    timeline: Array<{
      period: string;
      count: number;
      amount: number;
    }>;
  }> {
    this.validateId(userId, 'userId');

    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.groupBy) searchParams.append('groupBy', params.groupBy);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    return this.handleRequest(() =>
      this.client.get<{
        totalTransfers: number;
        totalAmount: number;
        averageAmount: number;
        successRate: number;
        byStatus: Record<string, number>;
        byType: Record<string, { count: number; amount: number }>;
        timeline: Array<{
          period: string;
          count: number;
          amount: number;
        }>;
      }>(`/users/${userId}/transfers/stats${queryString}`)
    );
  }

  /**
   * Estimate transfer time and fees
   */
  public async estimate(request: {
    sourceAccountId: string;
    destinationAccountId?: string;
    amount: number;
    currency?: string;
  }): Promise<{
    estimatedProcessingTime: string;
    fees: {
      processingFee: number;
      transferFee: number;
      totalFee: number;
    };
    estimatedArrival: string;
  }> {
    validateRequired(request.sourceAccountId, 'sourceAccountId');
    validateAmount(request.amount);

    if (request.currency) {
      validateCurrency(request.currency);
    }

    return this.handleRequest(() =>
      this.client.post<{
        estimatedProcessingTime: string;
        fees: {
          processingFee: number;
          transferFee: number;
          totalFee: number;
        };
        estimatedArrival: string;
      }>('/transfers/estimate', request)
    );
  }
}