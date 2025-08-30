/**
 * HTTP Client for Hedge API
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EventEmitter } from 'eventemitter3';
import {
  HedgeConfig,
  ApiResponse,
  ErrorResponse,
  HedgeError,
  createHedgeError,
  HEDGE_CONSTANTS,
  Environment,
} from '@hedge/shared';

export interface RequestInterceptor {
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  onRequestError?: (error: any) => Promise<any>;
}

export interface ResponseInterceptor {
  onResponse?: (response: AxiosResponse) => AxiosResponse;
  onResponseError?: (error: any) => Promise<any>;
}

export class HttpClient extends EventEmitter {
  private axiosInstance: AxiosInstance;
  private config: HedgeConfig;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(config: HedgeConfig) {
    super();
    this.config = config;
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    const baseURL = this.config.baseUrl || HEDGE_CONSTANTS.BASE_URLS[this.config.environment];

    return axios.create({
      baseURL,
      timeout: this.config.timeout || HEDGE_CONSTANTS.DEFAULT_TIMEOUT,
      headers: {
        [HEDGE_CONSTANTS.HEADERS.CONTENT_TYPE]: 'application/json',
        [HEDGE_CONSTANTS.HEADERS.X_API_KEY]: this.config.apiKey,
        [HEDGE_CONSTANTS.HEADERS.X_PARTNER_ID]: this.config.partnerId,
        [HEDGE_CONSTANTS.HEADERS.USER_AGENT]: `HedgeSDK/1.0.0`,
        [HEDGE_CONSTANTS.HEADERS.X_CLIENT_VERSION]: '1.0.0',
      },
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add request ID for tracking
        const requestId = this.generateRequestId();
        config.headers = config.headers || {};
        config.headers[HEDGE_CONSTANTS.HEADERS.X_REQUEST_ID] = requestId;

        this.emit('request:start', { requestId, config });
        return config;
      },
      (error) => {
        this.emit('request:error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const requestId = response.config.headers?.[HEDGE_CONSTANTS.HEADERS.X_REQUEST_ID];
        this.emit('request:success', { requestId, response });
        return response;
      },
      async (error) => {
        const requestId = error.config?.headers?.[HEDGE_CONSTANTS.HEADERS.X_REQUEST_ID];
        this.emit('request:error', { requestId, error });

        // Handle retry logic
        if (this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private shouldRetry(error: any): boolean {
    const retryAttempts = this.config.retryAttempts || HEDGE_CONSTANTS.DEFAULT_RETRY_ATTEMPTS;
    const currentAttempts = error.config.__retryCount || 0;

    if (currentAttempts >= retryAttempts) {
      return false;
    }

    // Retry on network errors, timeouts, and 5xx status codes
    return (
      !error.response ||
      error.code === 'ECONNABORTED' ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.response.status === HEDGE_CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS
    );
  }

  private async retryRequest(config: any): Promise<any> {
    config.__retryCount = (config.__retryCount || 0) + 1;
    
    const delay = this.calculateRetryDelay(config.__retryCount);
    await this.sleep(delay);

    this.emit('request:retry', { 
      attempt: config.__retryCount, 
      delay,
      requestId: config.headers[HEDGE_CONSTANTS.HEADERS.X_REQUEST_ID]
    });

    return this.axiosInstance(config);
  }

  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.config.retryDelay || HEDGE_CONSTANTS.DEFAULT_RETRY_DELAY;
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), HEDGE_CONSTANTS.MAX_RETRY_DELAY);
    // Add jitter to prevent thundering herd
    return exponentialDelay + Math.random() * 1000;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private transformError(error: any): HedgeError {
    if (error.code === 'ECONNABORTED') {
      return createHedgeError('Request timeout', 'TIMEOUT_ERROR');
    }

    if (!error.response) {
      return createHedgeError('Network error', 'NETWORK_ERROR');
    }

    const { status, data } = error.response;
    const errorData: ErrorResponse = data;

    if (errorData && errorData.error) {
      return createHedgeError(
        errorData.error.message,
        errorData.error.code,
        status,
        errorData.error.details,
        errorData.requestId
      );
    }

    return createHedgeError(
      `HTTP ${status} Error`,
      'API_ERROR',
      status
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.axiosInstance.interceptors.request.use(
      interceptor.onRequest,
      interceptor.onRequestError
    );
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.axiosInstance.interceptors.response.use(
      interceptor.onResponse,
      interceptor.onResponseError
    );
  }

  public removeRequestInterceptor(id: number): void {
    this.axiosInstance.interceptors.request.eject(id);
  }

  public removeResponseInterceptor(id: number): void {
    this.axiosInstance.interceptors.response.eject(id);
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>(config);
    return response.data;
  }

  public updateConfig(newConfig: Partial<HedgeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.apiKey) {
      this.axiosInstance.defaults.headers[HEDGE_CONSTANTS.HEADERS.X_API_KEY] = newConfig.apiKey;
    }
    
    if (newConfig.partnerId) {
      this.axiosInstance.defaults.headers[HEDGE_CONSTANTS.HEADERS.X_PARTNER_ID] = newConfig.partnerId;
    }

    if (newConfig.baseUrl || newConfig.environment) {
      const baseURL = newConfig.baseUrl || HEDGE_CONSTANTS.BASE_URLS[newConfig.environment || this.config.environment];
      this.axiosInstance.defaults.baseURL = baseURL;
    }

    if (newConfig.timeout) {
      this.axiosInstance.defaults.timeout = newConfig.timeout;
    }
  }
}