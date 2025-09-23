import axios from 'axios';
import { providers } from '../../config/providers';
import { supabase } from '../../lib/supabase';
import crypto from 'crypto';

export interface DwollaCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: 'personal' | 'business';
  status: string;
  created: string;
}

export interface DwollaFundingSource {
  id: string;
  status: string;
  type: string;
  bankAccountType: string;
  name: string;
  created: string;
  balance?: {
    value: string;
    currency: string;
  };
  removed: boolean;
  channels: string[];
}

export interface DwollaTransfer {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  created: string;
  metadata?: Record<string, any>;
}

export class DwollaProvider {
  private config = providers.ach.dwolla;
  private accessToken?: string;
  private tokenExpiry?: Date;

  /**
   * Get OAuth access token for Dwolla API
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/token`,
        {
          grant_type: 'client_credentials',
        },
        {
          auth: {
            username: this.config.key,
            password: this.config.secret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

      return this.accessToken!;
    } catch (error: any) {
      console.error('Dwolla token error:', error.response?.data || error.message);
      throw new Error('Failed to get Dwolla access token');
    }
  }

  /**
   * Create a Dwolla customer
   */
  async createCustomer(
    email: string,
    firstName: string,
    lastName: string,
    ipAddress?: string
  ): Promise<DwollaCustomer> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/customers`,
        {
          firstName,
          lastName,
          email,
          type: 'personal',
          ipAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      // Dwolla returns the customer URL in the Location header
      const customerId = response.headers.location?.split('/').pop();
      
      // Fetch the created customer details
      return await this.getCustomer(customerId!);
    } catch (error: any) {
      console.error('Dwolla create customer error:', error.response?.data || error.message);
      throw new Error('Failed to create Dwolla customer');
    }
  }

  /**
   * Get customer details
   */
  async getCustomer(customerId: string): Promise<DwollaCustomer> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.config.apiBaseUrl}/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dwolla get customer error:', error.response?.data || error.message);
      throw new Error('Failed to get Dwolla customer');
    }
  }

  /**
   * Create a funding source (bank account) using Plaid processor token
   */
  async createFundingSourceWithPlaidToken(
    customerId: string,
    plaidToken: string,
    accountName: string
  ): Promise<DwollaFundingSource> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/customers/${customerId}/funding-sources`,
        {
          plaidToken,
          name: accountName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      const fundingSourceId = response.headers.location?.split('/').pop();
      return await this.getFundingSource(fundingSourceId!);
    } catch (error: any) {
      console.error('Dwolla create funding source error:', error.response?.data || error.message);
      throw new Error('Failed to create funding source');
    }
  }

  /**
   * Create a funding source using micro-deposits (for manual bank account)
   */
  async createFundingSourceWithMicroDeposits(
    customerId: string,
    routingNumber: string,
    accountNumber: string,
    accountType: 'checking' | 'savings',
    accountName: string
  ): Promise<DwollaFundingSource> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/customers/${customerId}/funding-sources`,
        {
          routingNumber,
          accountNumber,
          bankAccountType: accountType,
          name: accountName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      const fundingSourceId = response.headers.location?.split('/').pop();
      
      // Initiate micro-deposits for verification
      await this.initiateMicroDeposits(fundingSourceId!);
      
      return await this.getFundingSource(fundingSourceId!);
    } catch (error: any) {
      console.error('Dwolla create funding source error:', error.response?.data || error.message);
      throw new Error('Failed to create funding source');
    }
  }

  /**
   * Initiate micro-deposits for bank account verification
   */
  async initiateMicroDeposits(fundingSourceId: string): Promise<void> {
    const token = await this.getAccessToken();

    try {
      await axios.post(
        `${this.config.apiBaseUrl}/funding-sources/${fundingSourceId}/micro-deposits`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );
    } catch (error: any) {
      console.error('Dwolla initiate micro-deposits error:', error.response?.data || error.message);
      throw new Error('Failed to initiate micro-deposits');
    }
  }

  /**
   * Verify micro-deposits
   */
  async verifyMicroDeposits(
    fundingSourceId: string,
    amount1: number,
    amount2: number
  ): Promise<void> {
    const token = await this.getAccessToken();

    try {
      await axios.post(
        `${this.config.apiBaseUrl}/funding-sources/${fundingSourceId}/micro-deposits`,
        {
          amount1: { value: amount1.toFixed(2), currency: 'USD' },
          amount2: { value: amount2.toFixed(2), currency: 'USD' },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );
    } catch (error: any) {
      console.error('Dwolla verify micro-deposits error:', error.response?.data || error.message);
      throw new Error('Failed to verify micro-deposits');
    }
  }

  /**
   * Get funding source details
   */
  async getFundingSource(fundingSourceId: string): Promise<DwollaFundingSource> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.config.apiBaseUrl}/funding-sources/${fundingSourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dwolla get funding source error:', error.response?.data || error.message);
      throw new Error('Failed to get funding source');
    }
  }

  /**
   * Create a transfer (ACH payment)
   */
  async createTransfer(
    sourceFundingSourceId: string,
    destinationFundingSourceId: string,
    amount: number,
    metadata?: Record<string, any>
  ): Promise<DwollaTransfer> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.config.apiBaseUrl}/transfers`,
        {
          _links: {
            source: {
              href: `${this.config.apiBaseUrl}/funding-sources/${sourceFundingSourceId}`,
            },
            destination: {
              href: `${this.config.apiBaseUrl}/funding-sources/${destinationFundingSourceId}`,
            },
          },
          amount: {
            currency: 'USD',
            value: amount.toFixed(2),
          },
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
            'Idempotency-Key': crypto.randomUUID(), // Ensure idempotency
          },
        }
      );

      const transferId = response.headers.location?.split('/').pop();
      return await this.getTransfer(transferId!);
    } catch (error: any) {
      console.error('Dwolla create transfer error:', error.response?.data || error.message);
      throw new Error('Failed to create transfer');
    }
  }

  /**
   * Get transfer details
   */
  async getTransfer(transferId: string): Promise<DwollaTransfer> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.config.apiBaseUrl}/transfers/${transferId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.dwolla.v1.hal+json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Dwolla get transfer error:', error.response?.data || error.message);
      throw new Error('Failed to get transfer');
    }
  }

  /**
   * Process round-ups for a user (collect and transfer)
   */
  async processRoundUps(userId: string, bankConnectionId: string): Promise<void> {
    // Get pending round-ups
    const { data: roundUps, error: roundUpError } = await supabase
      .from('round_ups')
      .select(`
        *,
        transaction:transactions!inner(
          bank_connection_id
        )
      `)
      .eq('transaction.bank_connection_id', bankConnectionId)
      .eq('status', 'pending');

    if (roundUpError || !roundUps || roundUps.length === 0) {
      console.log('No pending round-ups to process');
      return;
    }

    // Calculate total round-up amount
    const totalAmount = roundUps.reduce((sum, ru) => sum + parseFloat(ru.round_up_amount), 0);

    // Get user's Dwolla customer and funding source
    const { data: user } = await supabase
      .from('users')
      .select('*, bank_connections!inner(*)')
      .eq('id', userId)
      .eq('bank_connections.id', bankConnectionId)
      .single();

    if (!user || !user.bank_connections[0].metadata?.dwolla_funding_source_id) {
      throw new Error('Dwolla funding source not found for user');
    }

    // Create ACH transfer to collect round-ups
    const transfer = await this.createTransfer(
      user.bank_connections[0].metadata.dwolla_funding_source_id,
      this.config.masterAccountId!, // Your master Dwolla account
      totalAmount,
      {
        roundUpIds: roundUps.map(ru => ru.id),
        userId,
        bankConnectionId,
      }
    );

    // Store settlement record
    await supabase.from('settlements').insert({
      user_id: userId,
      bank_connection_id: bankConnectionId,
      provider: 'dwolla',
      provider_transfer_id: transfer.id,
      amount: totalAmount,
      status: 'processing',
      direction: 'debit',
      metadata: {
        dwolla_transfer: transfer,
        round_up_ids: roundUps.map(ru => ru.id),
      },
    });

    // Update round-ups status
    await supabase
      .from('round_ups')
      .update({ 
        status: 'collected',
        collected_at: new Date().toISOString(),
      })
      .in('id', roundUps.map(ru => ru.id));
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(body)
      .digest('hex');

    return hash === signature;
  }

  /**
   * Handle Dwolla webhook
   */
  async handleWebhook(event: any): Promise<void> {
    console.log('Processing Dwolla webhook:', event.topic);

    switch (event.topic) {
      case 'transfer_completed':
        await this.handleTransferCompleted(event);
        break;
      case 'transfer_failed':
        await this.handleTransferFailed(event);
        break;
      case 'customer_verification_completed':
        await this.handleCustomerVerified(event);
        break;
      default:
        console.log('Unhandled webhook topic:', event.topic);
    }
  }

  private async handleTransferCompleted(event: any): Promise<void> {
    const transferId = event.resourceId;
    
    // Update settlement status
    await supabase
      .from('settlements')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('provider_transfer_id', transferId);

    // Update round-ups status
    const { data: settlement } = await supabase
      .from('settlements')
      .select('metadata')
      .eq('provider_transfer_id', transferId)
      .single();

    if (settlement?.metadata?.round_up_ids) {
      await supabase
        .from('round_ups')
        .update({
          status: 'settled',
          settled_at: new Date().toISOString(),
        })
        .in('id', settlement.metadata.round_up_ids);
    }
  }

  private async handleTransferFailed(event: any): Promise<void> {
    const transferId = event.resourceId;
    
    // Update settlement status
    await supabase
      .from('settlements')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_reason: event._embedded?.errors?.[0]?.message || 'Transfer failed',
      })
      .eq('provider_transfer_id', transferId);

    // Revert round-ups status
    const { data: settlement } = await supabase
      .from('settlements')
      .select('metadata')
      .eq('provider_transfer_id', transferId)
      .single();

    if (settlement?.metadata?.round_up_ids) {
      await supabase
        .from('round_ups')
        .update({
          status: 'pending',
        })
        .in('id', settlement.metadata.round_up_ids);
    }
  }

  private async handleCustomerVerified(event: any): Promise<void> {
    // Update customer verification status in your database
    console.log('Customer verified:', event.resourceId);
  }
}

export default new DwollaProvider();