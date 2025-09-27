/**
 * HedgePayments SDK for JavaScript/TypeScript
 * Official SDK for integrating HedgePayments API
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { EventEmitter } from 'eventemitter3'

// Types
export interface HedgeConfig {
  apiKey: string
  secretKey?: string
  sandbox?: boolean
  timeout?: number
  webhookSecret?: string
}

export interface Wallet {
  id: string
  userId: string
  currency: string
  balance: Balance
  status: WalletStatus
  label?: string
  limits?: {
    daily?: number
    monthly?: number
    transaction?: number
  }
  createdAt: string
  updatedAt: string
}

export interface Balance {
  available: number
  pending: number
  reserved: number
  total: number
  currency: string
}

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  fee: number
  netAmount: number
  sourceWalletId?: string
  destinationWalletId?: string
  paymentMethodId?: string
  description?: string
  metadata?: Record<string, any>
  createdAt: string
  completedAt?: string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  isDefault: boolean
  details: CardDetails | BankDetails | WalletDetails
  verified: boolean
  createdAt: string
}

export interface CardDetails {
  brand: string
  last4: string
  expMonth: number
  expYear: number
}

export interface BankDetails {
  bankName: string
  last4: string
  accountType: string
}

export interface WalletDetails {
  provider: string
  email: string
}

export type WalletStatus = 'pending_verification' | 'active' | 'suspended' | 'frozen' | 'closed'
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 'payment' | 'refund' | 'fee' | 'adjustment'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'reversed' | 'refunded' | 'cancelled'
export type PaymentMethodType = 'card' | 'bank_account' | 'wallet' | 'crypto' | 'paypal' | 'venmo' | 'cashapp' | 'apple_pay' | 'google_pay'

// Main SDK Class
export class HedgePayments extends EventEmitter {
  private client: AxiosInstance
  private config: HedgeConfig

  // Sub-resources
  public wallets: WalletsAPI
  public transactions: TransactionsAPI
  public paymentMethods: PaymentMethodsAPI
  public payouts: PayoutsAPI
  public webhooks: WebhooksAPI

  constructor(config: HedgeConfig) {
    super()
    this.config = config

    // Setup axios client
    const baseURL = config.sandbox
      ? 'https://sandbox.hedgepayments.com/v1'
      : 'https://api.hedgepayments.com/v1'

    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-SDK-Version': '1.0.0',
        'X-SDK-Language': 'JavaScript'
      }
    })

    // Add request interceptor for idempotency
    this.client.interceptors.request.use((config) => {
      if (config.method === 'post' && !config.headers['Idempotency-Key']) {
        config.headers['Idempotency-Key'] = this.generateIdempotencyKey()
      }
      return config
    })

    // Initialize sub-resources
    this.wallets = new WalletsAPI(this.client)
    this.transactions = new TransactionsAPI(this.client)
    this.paymentMethods = new PaymentMethodsAPI(this.client)
    this.payouts = new PayoutsAPI(this.client)
    this.webhooks = new WebhooksAPI(this.client)
  }

  private generateIdempotencyKey(): string {
    return `hp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Webhook signature verification
  public verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      throw new Error('Webhook secret not configured')
    }
    // Implement HMAC signature verification
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex')
    return expectedSignature === signature
  }
}

// Wallets API
class WalletsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: {
    userId: string
    currency: string
    label?: string
    initialBalance?: number
  }): Promise<Wallet> {
    const { data } = await this.client.post('/wallets', params)
    return data
  }

  async get(walletId: string): Promise<Wallet> {
    const { data } = await this.client.get(`/wallets/${walletId}`)
    return data
  }

  async list(params?: {
    userId?: string
    currency?: string
    status?: WalletStatus
    limit?: number
    offset?: number
  }): Promise<{ wallets: Wallet[], total: number, hasMore: boolean }> {
    const { data } = await this.client.get('/wallets', { params })
    return data
  }

  async getBalance(walletId: string): Promise<Balance> {
    const { data } = await this.client.get(`/wallets/${walletId}/balance`)
    return data
  }

  async update(walletId: string, params: {
    label?: string
    dailyLimit?: number
    monthlyLimit?: number
  }): Promise<Wallet> {
    const { data } = await this.client.patch(`/wallets/${walletId}`, params)
    return data
  }
}

// Transactions API
class TransactionsAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: {
    amount: number
    currency: string
    method: string
    paymentMethodId?: string
    sourceWalletId?: string
    destinationWalletId?: string
    description?: string
    metadata?: Record<string, any>
  }): Promise<Transaction> {
    const { data } = await this.client.post('/transactions', params)
    return data
  }

  async get(transactionId: string): Promise<Transaction> {
    const { data } = await this.client.get(`/transactions/${transactionId}`)
    return data
  }

  async list(params?: {
    walletId?: string
    type?: TransactionType
    status?: TransactionStatus
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }): Promise<{ transactions: Transaction[], total: number, hasMore: boolean }> {
    const { data } = await this.client.get('/transactions', { params })
    return data
  }

  async refund(transactionId: string, params?: {
    amount?: number
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other'
    metadata?: Record<string, any>
  }): Promise<Transaction> {
    const { data } = await this.client.post(`/transactions/${transactionId}/refund`, params)
    return data
  }
}

// Payment Methods API
class PaymentMethodsAPI {
  constructor(private client: AxiosInstance) {}

  async add(params: {
    userId: string
    type: PaymentMethodType
    token: string
    isDefault?: boolean
  }): Promise<PaymentMethod> {
    const { data } = await this.client.post('/payment-methods', params)
    return data
  }

  async list(params?: {
    userId?: string
    type?: PaymentMethodType
  }): Promise<{ paymentMethods: PaymentMethod[] }> {
    const { data } = await this.client.get('/payment-methods', { params })
    return data
  }

  async remove(paymentMethodId: string): Promise<void> {
    await this.client.delete(`/payment-methods/${paymentMethodId}`)
  }

  async setDefault(paymentMethodId: string): Promise<PaymentMethod> {
    const { data } = await this.client.patch(`/payment-methods/${paymentMethodId}`, {
      isDefault: true
    })
    return data
  }
}

// Payouts API
class PayoutsAPI {
  constructor(private client: AxiosInstance) {}

  async request(params: {
    walletId: string
    amount: number
    payoutMethodId?: string
    instant?: boolean
  }): Promise<{ id: string, status: string, estimatedArrival: string }> {
    const { data } = await this.client.post('/payouts', params)
    return data
  }

  async get(payoutId: string): Promise<any> {
    const { data } = await this.client.get(`/payouts/${payoutId}`)
    return data
  }

  async list(params?: {
    walletId?: string
    status?: string
    limit?: number
  }): Promise<{ payouts: any[], total: number }> {
    const { data } = await this.client.get('/payouts', { params })
    return data
  }
}

// Webhooks API
class WebhooksAPI {
  constructor(private client: AxiosInstance) {}

  async create(params: {
    url: string
    events: string[]
    secret?: string
  }): Promise<{ id: string, url: string, secret: string }> {
    const { data } = await this.client.post('/webhooks', params)
    return data
  }

  async list(): Promise<{ webhooks: any[] }> {
    const { data } = await this.client.get('/webhooks')
    return data
  }

  async update(webhookId: string, params: {
    url?: string
    events?: string[]
    active?: boolean
  }): Promise<any> {
    const { data } = await this.client.patch(`/webhooks/${webhookId}`, params)
    return data
  }

  async delete(webhookId: string): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}`)
  }

  async test(webhookId: string): Promise<{ success: boolean }> {
    const { data } = await this.client.post(`/webhooks/${webhookId}/test`)
    return data
  }
}

// Helper functions for quick integration
export function createCheckout(options: {
  apiKey: string
  amount: number
  currency?: string
  methods?: PaymentMethodType[]
  onSuccess?: (payment: Transaction) => void
  onError?: (error: any) => void
}): HTMLElement {
  // Create embedded checkout widget
  const container = document.createElement('div')
  container.id = 'hedge-checkout-widget'
  container.innerHTML = `
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; max-width: 400px;">
      <h3>HedgePayments Checkout</h3>
      <p>Amount: ${options.currency || 'USD'} ${options.amount}</p>
      <div id="hedge-payment-form"></div>
    </div>
  `

  // Initialize SDK
  const hedge = new HedgePayments({ apiKey: options.apiKey })

  // Setup payment form
  // This would integrate with actual payment processing

  return container
}

// Export default
export default HedgePayments