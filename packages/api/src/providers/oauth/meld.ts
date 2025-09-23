import axios from 'axios';
import { providers } from '../../config/providers';
import { supabase } from '../../lib/supabase';

export interface MeldTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface MeldAccount {
  id: string;
  name: string;
  type: string;
  subtype: string;
  mask: string;
  institution_id: string;
  institution_name: string;
  balance: {
    available: number;
    current: number;
    currency: string;
  };
  routing_number?: string;
  account_number?: string;
}

export interface MeldTransaction {
  id: string;
  account_id: string;
  amount: number;
  date: string;
  description: string;
  merchant_name?: string;
  category?: string[];
  pending: boolean;
  posted_date?: string;
}

export class MeldProvider {
  private config = providers.oauth.meld;

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string, userId: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: `${state}:${userId}`, // Include userId in state for callback
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<MeldTokenResponse> {
    try {
      const response = await axios.post(
        this.config.tokenUrl,
        {
          grant_type: 'authorization_code',
          code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Meld token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<MeldTokenResponse> {
    try {
      const response = await axios.post(
        this.config.tokenUrl,
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Meld token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Fetch user's bank accounts
   */
  async getAccounts(accessToken: string): Promise<MeldAccount[]> {
    try {
      const response = await axios.get(`${this.config.apiBaseUrl}/accounts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.accounts;
    } catch (error: any) {
      console.error('Meld get accounts error:', error.response?.data || error.message);
      throw new Error('Failed to fetch accounts');
    }
  }

  /**
   * Fetch account transactions
   */
  async getTransactions(
    accessToken: string,
    accountId: string,
    startDate?: string,
    endDate?: string
  ): Promise<MeldTransaction[]> {
    try {
      const params: any = { account_id: accountId };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(`${this.config.apiBaseUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params,
      });

      return response.data.transactions;
    } catch (error: any) {
      console.error('Meld get transactions error:', error.response?.data || error.message);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Store bank connection in database
   */
  async storeBankConnection(
    userId: string,
    tokenData: MeldTokenResponse,
    account: MeldAccount
  ): Promise<void> {
    const { error } = await supabase.from('bank_connections').insert({
      user_id: userId,
      provider: 'meld',
      provider_connection_id: account.id,
      provider_access_token: tokenData.access_token,
      provider_refresh_token: tokenData.refresh_token,
      institution_id: account.institution_id,
      institution_name: account.institution_name,
      account_id: account.id,
      account_name: account.name,
      account_type: account.type,
      account_mask: account.mask,
      routing_number: account.routing_number,
      balance: account.balance.current,
      currency: account.balance.currency,
      status: 'active',
      last_synced_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error storing bank connection:', error);
      throw new Error('Failed to store bank connection');
    }
  }

  /**
   * Sync transactions for a bank connection
   */
  async syncTransactions(bankConnectionId: string): Promise<void> {
    // Get bank connection details
    const { data: connection, error: connectionError } = await supabase
      .from('bank_connections')
      .select('*')
      .eq('id', bankConnectionId)
      .single();

    if (connectionError || !connection) {
      throw new Error('Bank connection not found');
    }

    // Fetch latest transactions from Meld
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const transactions = await this.getTransactions(
      connection.provider_access_token,
      connection.account_id,
      startDate,
      endDate
    );

    // Store transactions in database
    for (const transaction of transactions) {
      const { error: insertError } = await supabase.from('transactions').upsert({
        bank_connection_id: bankConnectionId,
        provider_transaction_id: transaction.id,
        amount: Math.abs(transaction.amount),
        merchant_name: transaction.merchant_name,
        description: transaction.description,
        transaction_date: transaction.date,
        posted_date: transaction.posted_date,
        pending: transaction.pending,
        category: transaction.category?.[0],
        subcategory: transaction.category?.[1],
        metadata: { meld_data: transaction },
      });

      if (insertError) {
        console.error('Error storing transaction:', insertError);
      } else {
        // Calculate round-up for this transaction
        await this.calculateRoundUp(transaction, bankConnectionId);
      }
    }

    // Update last synced timestamp
    await supabase
      .from('bank_connections')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', bankConnectionId);
  }

  /**
   * Calculate and store round-up for a transaction
   */
  private async calculateRoundUp(
    transaction: MeldTransaction,
    bankConnectionId: string
  ): Promise<void> {
    // Only process debit transactions (negative amounts in Meld)
    if (transaction.amount >= 0 || transaction.pending) {
      return;
    }

    const amount = Math.abs(transaction.amount);
    const roundedAmount = Math.ceil(amount);
    const roundUpAmount = roundedAmount - amount;

    // Skip if round-up is 0 (already a whole dollar amount)
    if (roundUpAmount === 0) {
      return;
    }

    // Get transaction ID from database
    const { data: dbTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('bank_connection_id', bankConnectionId)
      .eq('provider_transaction_id', transaction.id)
      .single();

    if (dbTransaction) {
      // Store round-up
      await supabase.from('round_ups').insert({
        transaction_id: dbTransaction.id,
        original_amount: amount,
        rounded_amount: roundedAmount,
        round_up_amount: roundUpAmount,
        multiplier: 1.0,
        status: 'pending',
      });
    }
  }

  /**
   * Disconnect a bank connection
   */
  async disconnect(bankConnectionId: string): Promise<void> {
    await supabase
      .from('bank_connections')
      .update({ status: 'disconnected' })
      .eq('id', bankConnectionId);
  }
}

export default new MeldProvider();