import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'hedge_pay',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // OAuth Providers (Interchangeable)
  oauth: {
    provider: process.env.OAUTH_PROVIDER || 'meld', // 'meld' | 'plaid' | 'finicity'
    meld: {
      clientId: process.env.MELD_CLIENT_ID,
      clientSecret: process.env.MELD_CLIENT_SECRET,
      environment: process.env.MELD_ENV || 'sandbox',
      baseUrl: process.env.MELD_BASE_URL || 'https://api.meld.io',
    },
    plaid: {
      clientId: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      environment: process.env.PLAID_ENV || 'sandbox',
    },
    finicity: {
      partnerId: process.env.FINICITY_PARTNER_ID,
      appKey: process.env.FINICITY_APP_KEY,
      secret: process.env.FINICITY_SECRET,
      environment: process.env.FINICITY_ENV || 'sandbox',
    },
  },
  
  // ACH Providers (Interchangeable)
  ach: {
    provider: process.env.ACH_PROVIDER || 'dwolla', // 'dwolla' | 'stripe' | 'modern_treasury'
    dwolla: {
      key: process.env.DWOLLA_KEY,
      secret: process.env.DWOLLA_SECRET,
      environment: process.env.DWOLLA_ENV || 'sandbox',
      baseUrl: process.env.DWOLLA_BASE_URL || 'https://api-sandbox.dwolla.com',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    modernTreasury: {
      apiKey: process.env.MODERN_TREASURY_API_KEY,
      organizationId: process.env.MODERN_TREASURY_ORG_ID,
      environment: process.env.MODERN_TREASURY_ENV || 'sandbox',
    },
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
};