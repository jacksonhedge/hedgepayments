/**
 * HedgePayments Provider Registry
 * Central registry for all payment provider integrations
 */

export interface PaymentProvider {
  id: string
  name: string
  type: ProviderType
  logo?: string
  supported: boolean
  requiresOAuth: boolean
  sandboxAvailable: boolean
  documentation?: string
  setupComplexity: 1 | 2 | 3 | 4 | 5
  apiKeys: ApiKeyConfig[]
  webhooks?: WebhookConfig
  features: string[]
  regions: string[]
  currencies: string[]
}

export type ProviderType =
  | 'card_processor'
  | 'digital_wallet'
  | 'bank_connection'
  | 'ach_processor'
  | 'crypto'
  | 'bnpl'
  | 'investment'
  | 'international'
  | 'proprietary'

export interface ApiKeyConfig {
  key: string
  label: string
  required: boolean
  encrypted: boolean
  envVar: string
  placeholder?: string
  description?: string
}

export interface WebhookConfig {
  endpoint: string
  events: string[]
  signingSecret: string
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  // ============================================
  // CARD PROCESSORS
  // ============================================
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'card_processor',
    logo: '/logos/stripe.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://stripe.com/docs',
    setupComplexity: 2,
    apiKeys: [
      { key: 'public_key', label: 'Publishable Key', required: true, encrypted: false, envVar: 'STRIPE_PUBLIC_KEY' },
      { key: 'secret_key', label: 'Secret Key', required: true, encrypted: true, envVar: 'STRIPE_SECRET_KEY' },
      { key: 'webhook_secret', label: 'Webhook Secret', required: false, encrypted: true, envVar: 'STRIPE_WEBHOOK_SECRET' }
    ],
    features: ['cards', 'wallets', 'subscriptions', 'payouts', 'connect'],
    regions: ['US', 'EU', 'APAC', 'LATAM'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR']
  },
  {
    id: 'visa_direct',
    name: 'Visa Direct',
    type: 'card_processor',
    logo: '/logos/visa.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://developer.visa.com/capabilities/visa-direct',
    setupComplexity: 5,
    apiKeys: [
      { key: 'user_id', label: 'User ID', required: true, encrypted: false, envVar: 'VISA_DIRECT_USER_ID' },
      { key: 'password', label: 'Password', required: true, encrypted: true, envVar: 'VISA_DIRECT_PASSWORD' },
      { key: 'certificate_path', label: 'Certificate Path', required: true, encrypted: false, envVar: 'VISA_DIRECT_CERTIFICATE_PATH' },
      { key: 'key_path', label: 'Private Key Path', required: true, encrypted: false, envVar: 'VISA_DIRECT_KEY_PATH' }
    ],
    features: ['p2p', 'payouts', 'push_payments'],
    regions: ['US', 'EU', 'APAC'],
    currencies: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'mastercard_send',
    name: 'Mastercard Send',
    type: 'card_processor',
    logo: '/logos/mastercard.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://developer.mastercard.com',
    setupComplexity: 5,
    apiKeys: [
      { key: 'consumer_key', label: 'Consumer Key', required: true, encrypted: false, envVar: 'MASTERCARD_CONSUMER_KEY' },
      { key: 'private_key', label: 'Private Key', required: true, encrypted: true, envVar: 'MASTERCARD_PRIVATE_KEY' },
      { key: 'key_alias', label: 'Key Alias', required: true, encrypted: false, envVar: 'MASTERCARD_KEY_ALIAS' },
      { key: 'key_password', label: 'Key Password', required: true, encrypted: true, envVar: 'MASTERCARD_KEY_PASSWORD' }
    ],
    features: ['p2p', 'payouts', 'disbursements'],
    regions: ['US', 'EU', 'APAC'],
    currencies: ['USD', 'EUR', 'GBP']
  },
  {
    id: 'checkout',
    name: 'Checkout.com',
    type: 'card_processor',
    logo: '/logos/checkout.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://docs.checkout.com',
    setupComplexity: 3,
    apiKeys: [
      { key: 'public_key', label: 'Public Key', required: true, encrypted: false, envVar: 'CHECKOUT_PUBLIC_KEY' },
      { key: 'secret_key', label: 'Secret Key', required: true, encrypted: true, envVar: 'CHECKOUT_SECRET_KEY' },
      { key: 'webhook_secret', label: 'Webhook Secret', required: false, encrypted: true, envVar: 'CHECKOUT_WEBHOOK_SECRET' }
    ],
    features: ['cards', 'apm', 'payouts', 'fx'],
    regions: ['US', 'EU', 'APAC', 'MEA'],
    currencies: ['USD', 'EUR', 'GBP', 'AED', 'SGD']
  },

  // ============================================
  // DIGITAL WALLETS & P2P
  // ============================================
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'digital_wallet',
    logo: '/logos/paypal.svg',
    supported: true,
    requiresOAuth: true,
    sandboxAvailable: true,
    documentation: 'https://developer.paypal.com',
    setupComplexity: 3,
    apiKeys: [
      { key: 'client_id', label: 'Client ID', required: true, encrypted: false, envVar: 'PAYPAL_CLIENT_ID' },
      { key: 'client_secret', label: 'Client Secret', required: true, encrypted: true, envVar: 'PAYPAL_CLIENT_SECRET' },
      { key: 'webhook_id', label: 'Webhook ID', required: false, encrypted: false, envVar: 'PAYPAL_WEBHOOK_ID' }
    ],
    features: ['checkout', 'subscriptions', 'payouts', 'invoicing'],
    regions: ['GLOBAL'],
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
  },
  {
    id: 'venmo',
    name: 'Venmo',
    type: 'digital_wallet',
    logo: '/logos/venmo.svg',
    supported: true,
    requiresOAuth: true,
    sandboxAvailable: true,
    documentation: 'https://developer.paypal.com/docs/business/payments/venmo',
    setupComplexity: 3,
    apiKeys: [
      { key: 'client_id', label: 'Client ID', required: true, encrypted: false, envVar: 'VENMO_CLIENT_ID' },
      { key: 'client_secret', label: 'Client Secret', required: true, encrypted: true, envVar: 'VENMO_CLIENT_SECRET' }
    ],
    features: ['p2p', 'checkout', 'qr_codes'],
    regions: ['US'],
    currencies: ['USD']
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    type: 'digital_wallet',
    logo: '/logos/cashapp.svg',
    supported: true,
    requiresOAuth: true,
    sandboxAvailable: true,
    documentation: 'https://developers.squareup.com/docs/cash-app-pay',
    setupComplexity: 4,
    apiKeys: [
      { key: 'application_id', label: 'Application ID', required: true, encrypted: false, envVar: 'CASHAPP_APPLICATION_ID' },
      { key: 'access_token', label: 'Access Token', required: true, encrypted: true, envVar: 'CASHAPP_ACCESS_TOKEN' },
      { key: 'location_id', label: 'Location ID', required: true, encrypted: false, envVar: 'CASHAPP_LOCATION_ID' }
    ],
    features: ['p2p', 'checkout', 'bitcoin'],
    regions: ['US', 'UK'],
    currencies: ['USD', 'GBP', 'BTC']
  },
  {
    id: 'skrill',
    name: 'Skrill',
    type: 'digital_wallet',
    logo: '/logos/skrill.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://developers.skrill.com',
    setupComplexity: 3,
    apiKeys: [
      { key: 'merchant_id', label: 'Merchant ID', required: true, encrypted: false, envVar: 'SKRILL_MERCHANT_ID' },
      { key: 'api_password', label: 'API Password', required: true, encrypted: true, envVar: 'SKRILL_API_PASSWORD' },
      { key: 'secret_word', label: 'Secret Word', required: true, encrypted: true, envVar: 'SKRILL_SECRET_WORD' }
    ],
    features: ['checkout', 'payouts', 'fx', 'crypto'],
    regions: ['EU', 'APAC'],
    currencies: ['EUR', 'USD', 'GBP', 'PLN', 'CZK']
  },

  // ============================================
  // BANKING & ACH
  // ============================================
  {
    id: 'meld',
    name: 'Meld',
    type: 'bank_connection',
    logo: '/logos/meld.svg',
    supported: true,
    requiresOAuth: true,
    sandboxAvailable: true,
    documentation: 'https://docs.meld.io',
    setupComplexity: 2,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: true, encrypted: true, envVar: 'MELD_API_KEY' },
      { key: 'client_id', label: 'Client ID', required: true, encrypted: false, envVar: 'MELD_CLIENT_ID' },
      { key: 'client_secret', label: 'Client Secret', required: true, encrypted: true, envVar: 'MELD_CLIENT_SECRET' }
    ],
    features: ['account_linking', 'balance', 'transactions', 'identity'],
    regions: ['US'],
    currencies: ['USD']
  },
  {
    id: 'plaid',
    name: 'Plaid',
    type: 'bank_connection',
    logo: '/logos/plaid.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://plaid.com/docs',
    setupComplexity: 2,
    apiKeys: [
      { key: 'client_id', label: 'Client ID', required: true, encrypted: false, envVar: 'PLAID_CLIENT_ID' },
      { key: 'secret', label: 'Secret', required: true, encrypted: true, envVar: 'PLAID_SECRET' }
    ],
    features: ['auth', 'transactions', 'accounts', 'identity', 'investments'],
    regions: ['US', 'CA', 'UK', 'EU'],
    currencies: ['USD', 'CAD', 'GBP', 'EUR']
  },
  {
    id: 'dwolla',
    name: 'Dwolla',
    type: 'ach_processor',
    logo: '/logos/dwolla.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://docs.dwolla.com',
    setupComplexity: 3,
    apiKeys: [
      { key: 'key', label: 'API Key', required: true, encrypted: false, envVar: 'DWOLLA_KEY' },
      { key: 'secret', label: 'API Secret', required: true, encrypted: true, envVar: 'DWOLLA_SECRET' },
      { key: 'master_account_id', label: 'Master Account ID', required: true, encrypted: false, envVar: 'DWOLLA_MASTER_ACCOUNT_ID' }
    ],
    features: ['ach', 'mass_payments', 'instant_verification', 'webhooks'],
    regions: ['US'],
    currencies: ['USD']
  },

  // ============================================
  // CRYPTOCURRENCY
  // ============================================
  {
    id: 'coinbase',
    name: 'Coinbase Commerce',
    type: 'crypto',
    logo: '/logos/coinbase.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://commerce.coinbase.com/docs',
    setupComplexity: 2,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: true, encrypted: true, envVar: 'COINBASE_COMMERCE_API_KEY' },
      { key: 'webhook_secret', label: 'Webhook Secret', required: false, encrypted: true, envVar: 'COINBASE_COMMERCE_WEBHOOK_SECRET' }
    ],
    features: ['crypto_checkout', 'hosted_checkout', 'webhooks'],
    regions: ['GLOBAL'],
    currencies: ['BTC', 'ETH', 'USDC', 'USDT', 'DAI', 'BCH', 'LTC', 'DOGE']
  },

  // ============================================
  // INVESTMENT & TRADING
  // ============================================
  {
    id: 'kalshi',
    name: 'Kalshi',
    type: 'investment',
    logo: '/logos/kalshi.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://trading-api.readme.io/reference',
    setupComplexity: 3,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: true, encrypted: true, envVar: 'KALSHI_API_KEY' },
      { key: 'private_key', label: 'Private Key', required: true, encrypted: true, envVar: 'KALSHI_PRIVATE_KEY' }
    ],
    features: ['prediction_markets', 'trading', 'portfolio', 'market_data'],
    regions: ['US'],
    currencies: ['USD']
  },

  // ============================================
  // PROPRIETARY PRODUCTS
  // ============================================
  {
    id: 'bankroll',
    name: 'Bankroll',
    type: 'proprietary',
    logo: '/logos/bankroll.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'Internal',
    setupComplexity: 1,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: true, encrypted: true, envVar: 'BANKROLL_API_KEY' },
      { key: 'secret_key', label: 'Secret Key', required: true, encrypted: true, envVar: 'BANKROLL_SECRET_KEY' },
      { key: 'merchant_id', label: 'Merchant ID', required: true, encrypted: false, envVar: 'BANKROLL_MERCHANT_ID' }
    ],
    features: ['wallet', 'deposits', 'withdrawals', 'roundups'],
    regions: ['US'],
    currencies: ['USD']
  },
  {
    id: 'sidebet',
    name: 'SideBet',
    type: 'proprietary',
    logo: '/logos/sidebet.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'Internal',
    setupComplexity: 1,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: true, encrypted: true, envVar: 'SIDEBET_API_KEY' },
      { key: 'secret_key', label: 'Secret Key', required: true, encrypted: true, envVar: 'SIDEBET_SECRET_KEY' },
      { key: 'operator_id', label: 'Operator ID', required: true, encrypted: false, envVar: 'SIDEBET_OPERATOR_ID' }
    ],
    features: ['betting', 'odds', 'payouts', 'risk_management'],
    regions: ['US'],
    currencies: ['USD']
  },

  // ============================================
  // BUY NOW PAY LATER
  // ============================================
  {
    id: 'klarna',
    name: 'Klarna',
    type: 'bnpl',
    logo: '/logos/klarna.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://docs.klarna.com',
    setupComplexity: 3,
    apiKeys: [
      { key: 'username', label: 'Username', required: true, encrypted: false, envVar: 'KLARNA_USERNAME' },
      { key: 'password', label: 'Password', required: true, encrypted: true, envVar: 'KLARNA_PASSWORD' }
    ],
    features: ['pay_later', 'pay_now', 'slice_it', 'financing'],
    regions: ['US', 'EU', 'UK', 'AU'],
    currencies: ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK', 'AUD']
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    type: 'bnpl',
    logo: '/logos/afterpay.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://developers.afterpay.com',
    setupComplexity: 2,
    apiKeys: [
      { key: 'merchant_id', label: 'Merchant ID', required: true, encrypted: false, envVar: 'AFTERPAY_MERCHANT_ID' },
      { key: 'secret_key', label: 'Secret Key', required: true, encrypted: true, envVar: 'AFTERPAY_SECRET_KEY' }
    ],
    features: ['pay_in_4', 'monthly_payments'],
    regions: ['US', 'CA', 'AU', 'NZ', 'UK'],
    currencies: ['USD', 'CAD', 'AUD', 'NZD', 'GBP']
  },
  {
    id: 'affirm',
    name: 'Affirm',
    type: 'bnpl',
    logo: '/logos/affirm.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://docs.affirm.com',
    setupComplexity: 2,
    apiKeys: [
      { key: 'public_key', label: 'Public Key', required: true, encrypted: false, envVar: 'AFFIRM_PUBLIC_KEY' },
      { key: 'private_key', label: 'Private Key', required: true, encrypted: true, envVar: 'AFFIRM_PRIVATE_KEY' }
    ],
    features: ['pay_over_time', 'split_pay', '0_apr'],
    regions: ['US', 'CA'],
    currencies: ['USD', 'CAD']
  },
  {
    id: 'sezzle',
    name: 'Sezzle',
    type: 'bnpl',
    logo: '/logos/sezzle.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: true,
    documentation: 'https://docs.sezzle.com',
    setupComplexity: 2,
    apiKeys: [
      { key: 'public_key', label: 'Public Key', required: true, encrypted: false, envVar: 'SEZZLE_PUBLIC_KEY' },
      { key: 'private_key', label: 'Private Key', required: true, encrypted: true, envVar: 'SEZZLE_PRIVATE_KEY' }
    ],
    features: ['pay_in_4', 'interest_free'],
    regions: ['US', 'CA'],
    currencies: ['USD', 'CAD']
  },

  // ============================================
  // COMPLIANCE & IDENTITY
  // ============================================
  {
    id: 'npi',
    name: 'NPI Registry',
    type: 'proprietary',
    logo: '/logos/npi.svg',
    supported: true,
    requiresOAuth: false,
    sandboxAvailable: false,
    documentation: 'https://npiregistry.cms.hhs.gov',
    setupComplexity: 1,
    apiKeys: [
      { key: 'api_key', label: 'API Key', required: false, encrypted: false, envVar: 'NPI_REGISTRY_API_KEY' }
    ],
    features: ['provider_lookup', 'verification', 'taxonomy'],
    regions: ['US'],
    currencies: []
  }
]

// Helper functions
export function getProviderById(id: string): PaymentProvider | undefined {
  return PAYMENT_PROVIDERS.find(p => p.id === id)
}

export function getProvidersByType(type: ProviderType): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(p => p.type === type)
}

export function getSupportedProviders(): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(p => p.supported)
}

export function getProvidersByRegion(region: string): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(p =>
    p.regions.includes(region) || p.regions.includes('GLOBAL')
  )
}

export function getProvidersByCurrency(currency: string): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(p => p.currencies.includes(currency))
}

// Environment variable validation
export function validateProviderConfig(providerId: string): {
  valid: boolean
  missing: string[]
} {
  const provider = getProviderById(providerId)
  if (!provider) {
    return { valid: false, missing: ['Provider not found'] }
  }

  const missing: string[] = []
  for (const apiKey of provider.apiKeys) {
    if (apiKey.required && !process.env[apiKey.envVar]) {
      missing.push(apiKey.envVar)
    }
  }

  return {
    valid: missing.length === 0,
    missing
  }
}

export function getConfiguredProviders(): PaymentProvider[] {
  return PAYMENT_PROVIDERS.filter(provider => {
    const { valid } = validateProviderConfig(provider.id)
    return valid
  })
}