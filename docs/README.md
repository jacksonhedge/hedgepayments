# Hedge Round-ups SDK Documentation

## 🎯 Overview

The Hedge Round-ups SDK provides a comprehensive solution for integrating spare change round-up functionality into your applications. The SDK consists of three main packages:

- **@hedge/shared** - Shared types and utilities
- **@hedge/sdk-core** - Core TypeScript SDK for all environments
- **@hedge/sdk-react** - React-specific hooks and components

## 📦 Installation

```bash
# Core SDK (required)
npm install @hedge/sdk-core

# React SDK (for React applications)
npm install @hedge/sdk-react

# Shared types (automatically installed with other packages)
npm install @hedge/shared
```

## 🚀 Quick Start

### Core SDK (Node.js/JavaScript)

```javascript
import { HedgeSDK } from '@hedge/sdk-core';

// Initialize the SDK
const sdk = new HedgeSDK({
  apiKey: 'your-api-key',
  partnerId: 'your-partner-id',
  environment: 'production', // 'development', 'staging', or 'production'
});

// Create a user
const user = await sdk.users.create({
  email: 'user@example.com',
  partnerId: 'your-partner-id',
});

// Set up roundups
await sdk.roundups.createSettings({
  userId: user.id,
  isEnabled: true,
  roundupRule: 'nearest_dollar',
  transferFrequency: 'weekly',
});
```

### React SDK

```jsx
import { 
  HedgeProvider, 
  useHedge, 
  RoundupSettings,
  AccountList 
} from '@hedge/sdk-react';

function App() {
  return (
    <HedgeProvider
      apiKey="your-api-key"
      partnerId="your-partner-id"
      environment="production"
    >
      <Dashboard />
    </HedgeProvider>
  );
}

function Dashboard() {
  const { sdk, isConnected } = useHedge();
  
  return (
    <div>
      <h1>Roundup Dashboard</h1>
      <RoundupSettings userId="user-id" />
      <AccountList userId="user-id" />
    </div>
  );
}
```

## 🏗️ Core Concepts

### Authentication

The SDK uses API keys for authentication. Each request includes:
- **X-API-Key**: Your partner API key
- **X-Partner-ID**: Your partner identifier

### Users

Users represent your customers who will use the roundup service:

```javascript
// Create user
const user = await sdk.users.create({
  email: 'user@example.com',
  partnerId: 'your-partner-id',
  metadata: { customerId: '12345' }
});

// Get user
const user = await sdk.users.get(userId);

// Update user
const updated = await sdk.users.update(userId, {
  metadata: { lastLogin: new Date().toISOString() }
});
```

### Bank Accounts

Users connect their bank accounts to enable roundups:

```javascript
// Get link token for account connection
const { linkToken } = await sdk.accounts.getLinkToken(userId);

// Connect account (after OAuth flow)
const accounts = await sdk.accounts.connect({
  userId,
  institutionId: 'bank-id',
  publicToken: 'public-token-from-oauth'
});

// Enable roundups for account
await sdk.accounts.enableRoundups(accountId);
```

### Roundup Settings

Configure how roundups work for each user:

```javascript
await sdk.roundups.createSettings({
  userId,
  isEnabled: true,
  roundupRule: 'nearest_dollar', // 'nearest_dollar', 'nearest_five', 'custom'
  customAmount: 1.00, // Only for 'custom' rule
  minimumPurchase: 1.00,
  maximumRoundup: 5.00,
  transferFrequency: 'weekly', // 'immediate', 'daily', 'weekly', 'monthly'
  excludedCategories: ['gas_stations'],
  excludedMerchants: ['Amazon']
});
```

### Transfers

Process and manage roundup transfers:

```javascript
// Process pending roundups
const result = await sdk.roundups.processPending(userId);

// Get transfer status
const transfer = await sdk.transfers.get(transferId);

// Get transfer statistics
const stats = await sdk.transfers.getStats(userId);
```

## 🎯 Real-time Events

The SDK supports real-time events via WebSocket:

```javascript
// Core SDK
sdk.connectWebSocket();

sdk.on('event:roundup.created', (event) => {
  console.log('New roundup:', event.data);
});

sdk.subscribeToEvents(['roundup.created', 'transfer.completed']);
```

```jsx
// React SDK
import { useEvents } from '@hedge/sdk-react';

function EventListener() {
  const { events } = useEvents(['roundup.created', 'transfer.completed']);
  
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.type}: {event.data.amount}</div>
      ))}
    </div>
  );
}
```

## 📊 Available Event Types

### User Events
- `user.created` - New user created
- `user.updated` - User information updated
- `user.deleted` - User deleted

### Account Events
- `account.connected` - Bank account connected
- `account.updated` - Account information updated
- `account.disconnected` - Account disconnected
- `account.error` - Account connection error

### Transaction Events
- `transaction.created` - New transaction processed
- `transaction.updated` - Transaction updated

### Roundup Events
- `roundup.created` - New roundup created
- `roundup.processed` - Roundup processed
- `roundup.failed` - Roundup processing failed

### Transfer Events
- `transfer.initiated` - Transfer started
- `transfer.processing` - Transfer in progress
- `transfer.completed` - Transfer completed
- `transfer.failed` - Transfer failed

## 🔧 Advanced Features

### Request/Response Interceptors

```javascript
sdk.addRequestInterceptor({
  onRequest: (config) => {
    console.log('Making request:', config.url);
    return config;
  }
});

sdk.addResponseInterceptor({
  onResponse: (response) => {
    console.log('Received response:', response.status);
    return response;
  }
});
```

### Error Handling

```javascript
import { HedgeError, HedgeValidationError } from '@hedge/sdk-core';

try {
  await sdk.users.create(invalidData);
} catch (error) {
  if (error instanceof HedgeValidationError) {
    console.log('Validation error:', error.details);
  } else if (error instanceof HedgeError) {
    console.log('API error:', error.code, error.message);
  }
}
```

### Retry Logic

The SDK includes automatic retry logic for network errors and rate limits:

```javascript
const sdk = new HedgeSDK({
  apiKey: 'your-api-key',
  partnerId: 'your-partner-id',
  retryAttempts: 3,
  retryDelay: 1000,
});
```

### Custom Base URLs

```javascript
const sdk = new HedgeSDK({
  apiKey: 'your-api-key',
  partnerId: 'your-partner-id',
  baseUrl: 'https://your-custom-api.com/v1',
});
```

## 🧪 Testing & Simulation

### Roundup Simulation

Test roundup logic without real transactions:

```javascript
const simulation = await sdk.roundups.simulate(userId, [
  { amount: 4.35, description: 'Coffee Shop' },
  { amount: 12.67, description: 'Lunch' },
]);

console.log('Total roundups:', simulation.totalRoundupAmount);
```

### Transfer Estimation

Estimate transfer fees and timing:

```javascript
const estimate = await sdk.transfers.estimate({
  sourceAccountId: 'account-id',
  amount: 10.00,
});

console.log('Processing time:', estimate.estimatedProcessingTime);
console.log('Fees:', estimate.fees);
```

## 🔐 Security

### Webhook Verification

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSignature}`)
  );
}
```

### Environment Configuration

Always use environment variables for sensitive data:

```bash
HEDGE_API_KEY=your-api-key
HEDGE_PARTNER_ID=your-partner-id
HEDGE_WEBHOOK_SECRET=your-webhook-secret
```

## 📖 API Reference

### SDK Configuration

```typescript
interface HedgeSDKConfig {
  apiKey: string;           // Required: Your API key
  partnerId: string;        // Required: Your partner ID
  environment?: Environment; // Optional: 'development' | 'staging' | 'production'
  baseUrl?: string;         // Optional: Custom API base URL
  timeout?: number;         // Optional: Request timeout (default: 30000ms)
  retryAttempts?: number;   // Optional: Max retry attempts (default: 3)
  retryDelay?: number;      // Optional: Retry delay (default: 1000ms)
  enableWebSocket?: boolean; // Optional: Enable WebSocket events (default: true)
}
```

### React Props

```typescript
interface HedgeProviderProps extends HedgeSDKConfig {
  children: ReactNode;
  enableAutoConnect?: boolean;
  onEvent?: (event: HedgeEvent) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}
```

## 📝 Examples

See the `/examples` directory for complete examples:

- `basic-usage/` - Core SDK usage examples
- `react-integration/` - Complete React application
- `advanced-features/` - Webhook handling, testing, and advanced patterns

## 🐛 Error Codes

Common error codes you might encounter:

- `AUTHENTICATION_ERROR` - Invalid API key
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid request data
- `NOT_FOUND_ERROR` - Resource not found
- `RATE_LIMIT_ERROR` - Too many requests
- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT_ERROR` - Request timeout

## 📞 Support

- **Documentation**: https://docs.hedgepay.com
- **API Status**: https://status.hedgepay.com
- **Support Email**: support@hedgepay.com

## 📄 License

MIT License - see LICENSE file for details.