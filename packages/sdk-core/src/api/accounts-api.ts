/**
 * Accounts API methods
 */
import {
  BankAccount,
  ConnectAccountRequest,
  UpdateAccountRequest,
  LinkToken,
  PaginationParams,
  validateRequired,
} from '@hedge/shared';
import { BaseApi } from './base-api';

export class AccountsApi extends BaseApi {
  /**
   * Get link token for account connection flow
   */
  public async getLinkToken(userId: string): Promise<LinkToken> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.post<LinkToken>('/accounts/link-token', { userId })
    );
  }

  /**
   * Connect a new bank account
   */
  public async connect(request: ConnectAccountRequest): Promise<BankAccount[]> {
    validateRequired(request.userId, 'userId');
    validateRequired(request.institutionId, 'institutionId');
    validateRequired(request.publicToken, 'publicToken');

    return this.handleRequest(() =>
      this.client.post<BankAccount[]>('/accounts/connect', request)
    );
  }

  /**
   * Get account by ID
   */
  public async get(accountId: string): Promise<BankAccount> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.get<BankAccount>(`/accounts/${accountId}`)
    );
  }

  /**
   * List accounts for a user
   */
  public async list(userId: string, params?: PaginationParams): Promise<{
    accounts: BankAccount[];
    meta: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    this.validateId(userId, 'userId');
    const query = this.buildPaginationQuery(params);

    const response = await this.client.get<{
      accounts: BankAccount[];
      meta: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/users/${userId}/accounts${query}`);

    return response.data;
  }

  /**
   * Update account settings
   */
  public async update(accountId: string, request: UpdateAccountRequest): Promise<BankAccount> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.patch<BankAccount>(`/accounts/${accountId}`, request)
    );
  }

  /**
   * Disconnect/delete account
   */
  public async disconnect(accountId: string): Promise<void> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.delete<void>(`/accounts/${accountId}`)
    );
  }

  /**
   * Refresh account balance and information
   */
  public async refresh(accountId: string): Promise<BankAccount> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.post<BankAccount>(`/accounts/${accountId}/refresh`)
    );
  }

  /**
   * Enable roundups for an account
   */
  public async enableRoundups(accountId: string): Promise<BankAccount> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.post<BankAccount>(`/accounts/${accountId}/roundups/enable`)
    );
  }

  /**
   * Disable roundups for an account
   */
  public async disableRoundups(accountId: string): Promise<BankAccount> {
    this.validateId(accountId, 'accountId');

    return this.handleRequest(() =>
      this.client.post<BankAccount>(`/accounts/${accountId}/roundups/disable`)
    );
  }

  /**
   * Get account transactions
   */
  public async getTransactions(accountId: string, params?: PaginationParams & {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<{
    transactions: any[];
    meta: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    this.validateId(accountId, 'accountId');
    
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.category) searchParams.append('category', params.category);

    const query = searchParams.toString();
    const queryString = query ? `?${query}` : '';

    const response = await this.client.get<{
      transactions: any[];
      meta: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/accounts/${accountId}/transactions${queryString}`);

    return response.data;
  }
}