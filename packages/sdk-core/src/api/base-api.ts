/**
 * Base API class with common functionality
 */
import {
  ApiResponse,
  PaginationParams,
  validateRequired,
  validateUUID,
} from '@hedge/shared';
import { HttpClient } from '../client/http-client';

export abstract class BaseApi {
  protected client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  protected buildPaginationQuery(params?: PaginationParams): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  protected validateId(id: string, fieldName: string = 'id'): void {
    validateRequired(id, fieldName);
    validateUUID(id, fieldName);
  }

  protected async handleRequest<T>(
    request: () => Promise<ApiResponse<T>>
  ): Promise<T> {
    const response = await request();
    if (!response.success) {
      throw new Error(response.message || 'Request failed');
    }
    return response.data;
  }
}