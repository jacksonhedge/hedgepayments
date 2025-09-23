import { config } from 'dotenv';
config();

export interface ProviderConfig {
  oauth: {
    meld: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      authUrl: string;
      tokenUrl: string;
      apiBaseUrl: string;
      scopes: string[];
      sandbox: boolean;
    };
    plaid?: {
      clientId: string;
      secret: string;
      environment: 'sandbox' | 'development' | 'production';
      products: string[];
      countryCodes: string[];
    };
  };
  ach: {
    dwolla: {
      key: string;
      secret: string;
      environment: 'sandbox' | 'production';
      apiBaseUrl: string;
      webhookSecret: string;
      masterAccountId?: string;
    };
    stripe?: {
      secretKey: string;
      webhookSecret: string;
    };
  };
}

const isDevelopment = process.env.NODE_ENV !== 'production';

export const providers: ProviderConfig = {
  oauth: {
    meld: {
      clientId: process.env.MELD_CLIENT_ID || '',
      clientSecret: process.env.MELD_CLIENT_SECRET || '',
      redirectUri: process.env.MELD_REDIRECT_URI || 'http://localhost:3001/auth/callback/meld',
      authUrl: isDevelopment 
        ? 'https://sandbox.meldfinance.tech/oauth/authorize'
        : 'https://api.meldfinance.tech/oauth/authorize',
      tokenUrl: isDevelopment
        ? 'https://sandbox.meldfinance.tech/oauth/token'
        : 'https://api.meldfinance.tech/oauth/token',
      apiBaseUrl: isDevelopment
        ? 'https://sandbox.meldfinance.tech/v1'
        : 'https://api.meldfinance.tech/v1',
      scopes: ['accounts:read', 'transactions:read', 'identity:read'],
      sandbox: isDevelopment
    }
  },
  ach: {
    dwolla: {
      key: process.env.DWOLLA_KEY || '',
      secret: process.env.DWOLLA_SECRET || '',
      environment: isDevelopment ? 'sandbox' : 'production',
      apiBaseUrl: isDevelopment
        ? 'https://api-sandbox.dwolla.com'
        : 'https://api.dwolla.com',
      webhookSecret: process.env.DWOLLA_WEBHOOK_SECRET || '',
      masterAccountId: process.env.DWOLLA_MASTER_ACCOUNT_ID
    }
  }
};

// Validate required configuration
export function validateProviderConfig(): void {
  const errors: string[] = [];

  // Validate Meld config
  if (!providers.oauth.meld.clientId) {
    errors.push('MELD_CLIENT_ID is required');
  }
  if (!providers.oauth.meld.clientSecret) {
    errors.push('MELD_CLIENT_SECRET is required');
  }

  // Validate Dwolla config
  if (!providers.ach.dwolla.key) {
    errors.push('DWOLLA_KEY is required');
  }
  if (!providers.ach.dwolla.secret) {
    errors.push('DWOLLA_SECRET is required');
  }

  if (errors.length > 0) {
    console.warn('⚠️  Provider configuration warnings:');
    errors.forEach(error => console.warn(`   - ${error}`));
  }
}

export default providers;