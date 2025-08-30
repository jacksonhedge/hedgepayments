/**
 * Users API methods
 */
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationParams,
  ApiResponse,
  validateEmail,
  validateRequired,
} from '@hedge/shared';
import { BaseApi } from './base-api';

export class UsersApi extends BaseApi {
  /**
   * Create a new user
   */
  public async create(request: CreateUserRequest): Promise<User> {
    validateRequired(request.email, 'email');
    validateEmail(request.email);
    validateRequired(request.partnerId, 'partnerId');

    return this.handleRequest(() =>
      this.client.post<User>('/users', request)
    );
  }

  /**
   * Get user by ID
   */
  public async get(userId: string): Promise<User> {
    this.validateId(userId, 'userId');
    
    return this.handleRequest(() =>
      this.client.get<User>(`/users/${userId}`)
    );
  }

  /**
   * Get current user (from API key context)
   */
  public async getCurrent(): Promise<User> {
    return this.handleRequest(() =>
      this.client.get<User>('/users/me')
    );
  }

  /**
   * Update user
   */
  public async update(userId: string, request: UpdateUserRequest): Promise<User> {
    this.validateId(userId, 'userId');

    if (request.email) {
      validateEmail(request.email);
    }

    return this.handleRequest(() =>
      this.client.patch<User>(`/users/${userId}`, request)
    );
  }

  /**
   * Delete user
   */
  public async delete(userId: string): Promise<void> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.delete<void>(`/users/${userId}`)
    );
  }

  /**
   * List users with pagination (partner admin only)
   */
  public async list(params?: PaginationParams): Promise<{
    users: User[];
    meta: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    const query = this.buildPaginationQuery(params);
    
    const response = await this.client.get<{
      users: User[];
      meta: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
      };
    }>(`/users${query}`);

    return response.data;
  }

  /**
   * Search users by email (partner admin only)
   */
  public async search(email: string): Promise<User[]> {
    validateRequired(email, 'email');
    validateEmail(email);

    return this.handleRequest(() =>
      this.client.get<User[]>(`/users/search?email=${encodeURIComponent(email)}`)
    );
  }

  /**
   * Get user statistics
   */
  public async getStats(userId: string): Promise<{
    totalRoundups: number;
    totalRoundupAmount: number;
    totalTransfers: number;
    totalTransferAmount: number;
    accountsConnected: number;
    activeRoundupSettings: number;
  }> {
    this.validateId(userId, 'userId');

    return this.handleRequest(() =>
      this.client.get<{
        totalRoundups: number;
        totalRoundupAmount: number;
        totalTransfers: number;
        totalTransferAmount: number;
        accountsConnected: number;
        activeRoundupSettings: number;
      }>(`/users/${userId}/stats`)
    );
  }
}