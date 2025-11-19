# CoinFlow White-Label Integration Overview
**Partner Documentation for HedgePayments**

*Last Updated: November 18, 2025*
*Research completed via automated documentation analysis*

---

## Executive Summary

CoinFlow is HedgePayments' primary payment infrastructure partner, providing enterprise-grade cryptocurrency and fiat payment processing. This document outlines CoinFlow's capabilities and how HedgePayments white-labels their solution to create a seamless, branded payment experience.

**Key Stats:**
- 🌍 **Global Reach**: 170+ countries supported
- 💰 **Growth**: 23x revenue growth since 2024
- 🔒 **Security**: PCI DSS Level 1, SOC 2 Type II certified
- ⚡ **Speed**: Instant settlements, real-time payments
- 💵 **Volume**: Processing billions in annual payment volume
- 🏆 **Backed by**: Pantera Capital, Coinbase Ventures ($25M Series A)

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [API Architecture](#api-architecture)
3. [React SDK Integration](#react-sdk-integration)
4. [Payment Methods](#payment-methods)
5. [Core Features](#core-features)
6. [White-Label Opportunities](#white-label-opportunities)
7. [Security & Compliance](#security--compliance)
8. [Integration Patterns](#integration-patterns)
9. [Webhooks & Events](#webhooks--events)
10. [Testing & Development](#testing--development)
11. [Production Deployment](#production-deployment)

---

## Platform Overview

### What is CoinFlow?

CoinFlow is a next-generation payment service provider that bridges traditional finance (TradFi) and decentralized finance (DeFi). They provide:

**Core Value Proposition:**
- **50%+ Conversion Rate Improvement**: Through familiar payment experiences
- **Instant Settlement**: Real-time payment processing and payouts
- **100% Chargeback Protection**: Built-in fraud prevention
- **Multi-Chain Support**: Solana, Ethereum, Polygon, Arbitrum, Base, NEAR

### Business Model

CoinFlow operates as a **B2B2C platform**:
- **Merchants** (like HedgePayments) integrate CoinFlow's API
- **End Users** experience seamless payment flows
- **Settlements** happen in crypto or fiat based on merchant preference

---

## API Architecture

### Base URLs

```
Production:  https://api.coinflow.cash
Sandbox:     https://api-sandbox.coinflow.cash
```

### API Categories

#### 1. **Authentication**
```
GET  /verify-token              - Verify JWT tokens
GET  /get-message              - Get signing message
POST /get-authentication-token - Obtain session JWT
GET  /get-session-key         - Retrieve session key
```

#### 2. **Checkout (Pay-Ins)**
Process payments from customers:

```
POST /card-checkout           - Credit/debit card payments
POST /ach-checkout            - ACH bank transfers
POST /apple-pay-checkout      - Apple Pay integration
POST /google-pay-checkout     - Google Pay integration
POST /crypto-checkout         - Direct crypto payments
POST /wire-checkout           - Wire transfers
POST /sepa-checkout           - SEPA transfers (EU)
POST /pix-checkout            - PIX payments (Brazil)

# Payment Management
POST /capture-payment         - Capture authorized payment
POST /void-payment            - Cancel payment
GET  /refund-payment          - Get refund details
POST /refund-payment          - Process refund
```

#### 3. **Payouts (Withdrawals)**
Distribute funds to users:

```
POST /register-user                - Create user account
POST /register-user-via-document  - KYC registration
POST /validate-kyc-information    - Verify KYC data
POST /register-business           - Business account setup

GET  /get-withdrawer              - Get user info
POST /create-bank-account         - Add bank account
POST /create-iban-account         - Add IBAN (EU)
POST /create-pix-account          - Add PIX (Brazil)
DELETE /delete-account-method     - Remove payment method

GET  /get-quote                   - Get conversion quote
GET  /get-balance                 - Check user balance
POST /create-transaction          - Initiate withdrawal
POST /do-payout                   - Execute payout
```

#### 4. **Card Tokenization**
PCI-compliant card processing:

```
POST /tokenize-card              - Tokenize card + CVV
POST /associate-cvv              - Link CVV to token
POST /mobile-tokenize-card       - Mobile tokenization
GET  /mobile-get-token           - Retrieve mobile token
```

#### 5. **Subscriptions**
Recurring payment management:

```
POST /create-subscription-plan   - Define subscription
GET  /get-subscription-plan      - Retrieve plan details
PUT  /update-subscription-plan   - Modify plan
POST /cancel-subscription        - End subscription
```

#### 6. **Marketplace**
Multi-seller platform support:

```
POST /generate-purchase-link     - Create payment link
POST /generate-subscription-link - Create subscription link
POST /register-seller            - Onboard seller
GET  /get-seller                 - Retrieve seller info
POST /usdc-withdraw              - Seller USDC withdrawal
```

#### 7. **Utilities**
```
GET  /get-contract-addresses     - Smart contract addresses
POST /send-solana-transaction    - Execute Solana tx
POST /faucet                     - Get testnet tokens
```

---

## React SDK Integration

### Installation

```bash
npm install @coinflowlabs/react
# or
yarn add @coinflowlabs/react
```

### Core Components

#### 1. **CoinflowPurchase** - Checkout Widget

The primary component for accepting payments:

```typescript
import { CoinflowPurchase } from '@coinflowlabs/react';
import { Connection } from '@solana/web3.js';

function CheckoutPage() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  return (
    <CoinflowPurchase
      // Required Props
      wallet={wallet}
      merchantId={process.env.NEXT_PUBLIC_COINFLOW_MERCHANT_ID}
      connection={connection}
      env="prod" // or "sandbox", "staging"

      // Optional Props
      subtotal={10000} // Amount in cents ($100.00)
      onSuccess={(data) => {
        console.log('Payment successful:', data);
        // Handle success
      }}
      email="user@example.com"

      // Restrict payment methods
      allowedPaymentMethods={['card', 'ach', 'applePay', 'googlePay']}

      // Settlement options
      settlementType="USDC" // or "Credits", "Bank"

      // Customization
      presentment={{
        currency: 'USD',
        amount: 100.00
      }}

      // Webhook data
      webhookInfo={{
        userId: 'user_123',
        orderId: 'order_456',
        productId: 'prod_789'
      }}

      // Chargeback protection
      chargebackProtectionData={{
        sellerName: 'Merchant Name',
        sellerEmail: 'merchant@example.com'
      }}

      // Support
      supportEmail="support@hedgepayments.com"

      // Session-based auth
      sessionKey={sessionKey}

      // JWT for verified parameters
      jwtToken={jwtToken}
    />
  );
}
```

**Available Props:**

| Prop | Type | Description |
|------|------|-------------|
| `wallet` | WalletAdapter | Solana wallet instance (required) |
| `merchantId` | string | Your CoinFlow merchant ID (required) |
| `connection` | Connection | Solana RPC connection (required) |
| `env` | 'prod' \| 'sandbox' \| 'staging' | Environment (required) |
| `subtotal` | number | Amount in cents (optional) |
| `onSuccess` | function | Success callback (optional) |
| `email` | string | Pre-fill email (optional) |
| `allowedPaymentMethods` | string[] | Restrict payment options (optional) |
| `settlementType` | string | 'Credits', 'USDC', or 'Bank' (optional) |
| `webhookInfo` | object | Custom data for webhooks (optional) |
| `planCode` | string | Subscription plan ID (optional) |
| `chargebackProtectionData` | object | Fraud protection data (optional) |
| `supportEmail` | string | Customer support email (optional) |
| `sessionKey` | string | Session authentication (optional) |
| `jwtToken` | string | Verified checkout JWT (optional) |

#### 2. **CoinflowWithdraw** - Payout Widget

Enable users to withdraw funds:

```typescript
import { CoinflowWithdraw } from '@coinflowlabs/react';

function WithdrawalPage() {
  return (
    <CoinflowWithdraw
      // Required
      wallet={wallet}
      merchantId={merchantId}
      connection={connection}
      env="prod"

      // Optional
      onSuccess={(data) => {
        console.log('Withdrawal successful:', data);
      }}
      lockAmount={false}
      amount={5000} // cents
      tokens={['USDC', 'SOL']} // Filter available tokens
      lockDefaultToken={false}
      email="user@example.com"
      bankAccountLinkRedirect="/settings/banking"
      sessionKey={sessionKey}
    />
  );
}
```

#### 3. **CoinflowCardForm** - PCI Compliant Card Collection

Collect card details securely:

```typescript
import { CoinflowCardForm } from '@coinflowlabs/react';

function PaymentMethodPage() {
  return (
    <CoinflowCardForm
      merchantId={merchantId}
      env="prod"
      onSuccess={(tokenData) => {
        console.log('Card tokenized:', tokenData);
        // Save token for future use
      }}
    />
  );
}
```

### Blockchain Support

CoinFlow supports multiple blockchains:

- **Solana** - Primary chain, fastest settlement
- **Ethereum** - Mainnet support
- **Polygon** - Lower fees, faster transactions
- **Arbitrum** - Layer 2 scaling
- **Base** - Coinbase L2
- **NEAR** - Alternative L1

---

## Payment Methods

### Supported Methods by Region

| Payment Method | US | EU | UK | Brazil | Global |
|----------------|----|----|----|----|--------|
| **Credit Cards** | ✅ | ✅ | ✅ | ✅ | ✅ (130+ countries) |
| **Debit Cards** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ACH** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Wire Transfer** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SEPA** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **UK Faster Payments** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **PIX** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Apple Pay** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Google Pay** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **USDC** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Credits** | ✅ | ✅ | ✅ | ✅ | ✅ |

### Payment Method Details

#### Credit/Debit Cards
- **Supported**: Visa, Mastercard, Amex, Discover
- **3D Secure**: Built-in for fraud protection
- **Processing Time**: Instant
- **Settlement**: T+1 to T+3
- **Fee**: ~2.9% + $0.30

#### ACH (US Only)
- **Processing Time**: 1-3 business days
- **Settlement**: T+3 to T+5
- **Fee**: ~1% (min $1)
- **Same-Day ACH**: Available for premium merchants

#### Apple Pay / Google Pay
- **Processing Time**: Instant
- **Settlement**: Same as card
- **Fee**: Same as card
- **UX**: One-tap checkout

#### Crypto (USDC, SOL, ETH, etc.)
- **Processing Time**: Instant (after confirmations)
- **Settlement**: Immediate
- **Fee**: Network fees only
- **Support**: 50+ cryptocurrencies

#### Bank Transfers (Wire, SEPA, Faster Payments, PIX)
- **Processing Time**: Varies by method
  - Wire: 1-3 days
  - SEPA: 1-2 days
  - Faster Payments: Minutes to hours
  - PIX: Instant
- **Fee**: Varies by method

---

## Core Features

### 1. **Instant Settlement**

CoinFlow provides instant settlement options:
- **USDC Settlement**: Instant on-chain settlement
- **Credits**: Internal balance system for instant transfers
- **Bank Settlement**: T+1 to T+3 for fiat

### 2. **Fraud Prevention**

**100% Chargeback Protection**:
- AI-driven fraud detection
- Real-time risk scoring
- 3D Secure (3DS) integration
- Device fingerprinting
- Behavioral analysis

**Merchant Tools**:
```typescript
POST /review-payment          // Review flagged payment
POST /nsure-override-merchant // Override protection decision
```

### 3. **Card Storage (via Plaid)**

PCI-compliant card tokenization:
- Securely store cards for repeat customers
- CVV re-collection for each transaction
- Support for multiple cards per user
- Automatic card updates

### 4. **Coinflow Credits**

Internal value system:
- Store value in user accounts
- Instant transfers between users
- No transaction fees for credit transfers
- Convert to crypto or cash out anytime

### 5. **Subscriptions**

Recurring billing support:
- Create subscription plans
- Automatic charge retries
- Dunning management
- Proration support
- Upgrade/downgrade flows

### 6. **Multi-Currency Support**

**Presentment Currencies**:
Display amounts in user's preferred currency while settling in another:

```typescript
<CoinflowPurchase
  presentment={{
    currency: 'EUR',
    amount: 92.50
  }}
  settlementType="USDC" // Settle in USDC
/>
```

Supported display currencies: USD, EUR, GBP, BRL, JPY, KRW, SGD, AUD, CAD, CHF, CNY, HKD, INR, MXN, etc.

---

## White-Label Opportunities

### How HedgePayments White-Labels CoinFlow

#### 1. **Branded Payment Experience**

**What You Control:**
- ✅ Your domain (hedgepayments.com)
- ✅ Your branding (logo, colors, fonts)
- ✅ Your customer communications
- ✅ Your product naming
- ✅ Your pricing structure

**What CoinFlow Provides:**
- ⚙️ Payment infrastructure
- ⚙️ Compliance (KYC/AML)
- ⚙️ Banking relationships
- ⚙️ Fraud detection
- ⚙️ Settlement rails

#### 2. **API Layer**

HedgePayments wraps CoinFlow's API to provide:

```
User Request
    ↓
HedgePayments API
    ↓
Business Logic & Validation
    ↓
CoinFlow API
    ↓
Payment Processing
    ↓
Settlement
```

**Benefits:**
- Abstract CoinFlow implementation details
- Add custom features and logic
- Control pricing and fees
- Own customer relationship
- Flexibility to swap providers

#### 3. **Custom Features**

Build on top of CoinFlow:

**HedgePayments Additions:**
- AI-powered transaction routing
- Multi-provider fallback
- Advanced analytics
- Custom reporting
- Unified wallet system
- MCP (Model Context Protocol) integration for AI agents

#### 4. **Widget Customization**

Customize CoinFlow widgets to match your brand:

```typescript
<CoinflowPurchase
  // Custom styling (if supported)
  style={{
    primaryColor: '#2C2416',      // HedgePayments brown
    backgroundColor: '#FAF8F5',   // Cream background
    font: 'Georgia, serif',       // Bookstore aesthetic
    borderRadius: '4px'
  }}

  // Your branding
  supportEmail="support@hedgepayments.com"

  // Your webhooks
  webhookInfo={{
    provider: 'hedgepayments',
    merchantId: yourMerchantId
  }}
/>
```

#### 5. **Session-Based Authentication**

Use session keys to abstract wallet requirements:

```typescript
// User doesn't need to connect wallet
<CoinflowPurchase
  sessionKey={sessionKey}  // HedgePayments-issued session
  // ... wallet not required with session key
/>
```

#### 6. **Webhooks**

Route CoinFlow webhooks through your infrastructure:

```
CoinFlow Webhook
    ↓
HedgePayments Webhook Handler
    ↓
Validation & Processing
    ↓
Database Update
    ↓
Customer Notifications
    ↓
Your Application Webhooks
```

---

## Security & Compliance

### Certifications

- **PCI DSS Level 1**: Highest level of card data security
- **SOC 2 Type II**: Audited security controls
- **GDPR Compliant**: EU data protection
- **CCPA Compliant**: California privacy law

### Security Features

1. **Data Encryption**
   - TLS 1.3 for data in transit
   - AES-256 for data at rest
   - HSM for key management

2. **Authentication**
   - JWT-based API authentication
   - Web3 wallet signatures
   - 2FA for merchant dashboard

3. **Fraud Prevention**
   - Real-time risk scoring
   - Device fingerprinting
   - Velocity checks
   - Geolocation verification
   - 3D Secure (3DS)

### Compliance Handled by CoinFlow

- **KYC (Know Your Customer)**: User identity verification
- **AML (Anti-Money Laundering)**: Transaction monitoring
- **OFAC Sanctions Screening**: Restricted entity checks
- **FinCEN Registration**: Money transmitter compliance
- **State Licensing**: Money transmission licenses

---

## Integration Patterns

### Pattern 1: Direct Widget Integration

Simplest approach - embed CoinFlow widgets directly:

```typescript
// pages/checkout.tsx
import { CoinflowPurchase } from '@coinflowlabs/react';

export default function Checkout() {
  return (
    <div>
      <h1>Complete Your Purchase</h1>
      <CoinflowPurchase
        merchantId={process.env.NEXT_PUBLIC_COINFLOW_MERCHANT_ID}
        env="prod"
        wallet={wallet}
        connection={connection}
        subtotal={cartTotal}
        onSuccess={() => router.push('/success')}
      />
    </div>
  );
}
```

**Pros:**
- Fast implementation
- Lower development cost
- Automatic updates from CoinFlow

**Cons:**
- Less customization
- Direct dependency on CoinFlow
- Limited control over UX

---

### Pattern 2: API Proxy Layer

Recommended for HedgePayments - proxy all CoinFlow calls:

```typescript
// app/api/payments/create/route.ts
export async function POST(req: Request) {
  const { amount, currency, customerId } = await req.json();

  // Your business logic
  const customer = await getCustomer(customerId);
  const pricing = calculatePricing(amount);

  // Call CoinFlow API
  const coinflowResponse = await fetch('https://api.coinflow.cash/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COINFLOW_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchantId: process.env.COINFLOW_MERCHANT_ID,
      amount: pricing.total,
      currency,
      customerEmail: customer.email,
      webhookInfo: {
        hedgePaymentsCustomerId: customerId,
        orderId: generateOrderId()
      }
    })
  });

  const payment = await coinflowResponse.json();

  // Store in your database
  await db.payments.create({
    id: payment.id,
    customerId,
    amount: pricing.total,
    status: 'pending',
    provider: 'coinflow'
  });

  return Response.json({
    success: true,
    paymentId: payment.id,
    paymentUrl: payment.url
  });
}
```

**Pros:**
- Full control over business logic
- Easy to add features
- Can swap providers
- Own customer data

**Cons:**
- More development effort
- Need to maintain API compatibility
- Responsible for error handling

---

### Pattern 3: Headless UI

Build your own UI, use CoinFlow for processing:

```typescript
// Custom payment form
function CustomCheckoutForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);

    // Call your API
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify({
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        // ... other fields
      })
    });

    const { paymentUrl } = await response.json();

    // Redirect to CoinFlow or open modal
    window.location.href = paymentUrl;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your custom UI */}
      <input name="amount" />
      <select name="paymentMethod">
        <option value="card">Credit Card</option>
        <option value="ach">Bank Transfer</option>
        <option value="crypto">Cryptocurrency</option>
      </select>
      <button type="submit" disabled={loading}>
        Pay Now
      </button>
    </form>
  );
}
```

**Pros:**
- Complete UX control
- Match your brand perfectly
- Optimized conversion funnel

**Cons:**
- Highest development effort
- Must maintain PCI compliance
- More testing required

---

## Webhooks & Events

### Webhook Configuration

1. **Set Webhook URL** in CoinFlow dashboard:
   ```
   https://api.hedgepayments.com/webhooks/coinflow
   ```

2. **Webhook Events** (inferred from React SDK):
   - `payment.completed` - Successful payment
   - `payment.failed` - Failed payment
   - `payment.refunded` - Refund processed
   - `payout.completed` - Withdrawal completed
   - `payout.failed` - Withdrawal failed
   - `subscription.created` - New subscription
   - `subscription.renewed` - Subscription charged
   - `subscription.cancelled` - Subscription ended

### Webhook Handler Example

```typescript
// app/api/webhooks/coinflow/route.ts
import crypto from 'crypto';

function verifySignature(body: string, signature: string) {
  const hash = crypto
    .createHmac('sha256', process.env.COINFLOW_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  return hash === signature;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-coinflow-signature');

  // Verify webhook signature
  if (!verifySignature(body, signature!)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Route to appropriate handler
  switch (event.type) {
    case 'payment.completed':
      await handlePaymentCompleted(event.data);
      break;

    case 'payment.failed':
      await handlePaymentFailed(event.data);
      break;

    case 'payment.refunded':
      await handlePaymentRefunded(event.data);
      break;

    case 'payout.completed':
      await handlePayoutCompleted(event.data);
      break;

    case 'payout.failed':
      await handlePayoutFailed(event.data);
      break;

    default:
      console.log('Unhandled event type:', event.type);
  }

  return Response.json({ received: true });
}

async function handlePaymentCompleted(data: any) {
  // Update database
  await db.payments.update({
    where: { id: data.paymentId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      transactionHash: data.transactionHash
    }
  });

  // Get customer info from webhookInfo
  const { hedgePaymentsCustomerId, orderId } = data.webhookInfo;

  // Send confirmation email
  await sendEmail({
    to: data.customerEmail,
    subject: 'Payment Successful',
    template: 'payment-confirmation',
    data: { orderId, amount: data.amount }
  });

  // Trigger your application webhooks
  await triggerWebhook('payment.completed', {
    customerId: hedgePaymentsCustomerId,
    orderId,
    amount: data.amount
  });
}
```

---

## Testing & Development

### Sandbox Environment

```bash
# Environment variables for testing
COINFLOW_ENV=sandbox
COINFLOW_MERCHANT_ID=sandbox_merchant_id
COINFLOW_API_KEY=sandbox_api_key
COINFLOW_WEBHOOK_SECRET=sandbox_webhook_secret

NEXT_PUBLIC_COINFLOW_ENV=sandbox
NEXT_PUBLIC_COINFLOW_MERCHANT_ID=sandbox_merchant_id
```

### Test Data

#### Test Cards

```
Successful Payment:
  Card: 4242 4242 4242 4242
  Exp: Any future date
  CVV: Any 3 digits

Declined Card:
  Card: 4000 0000 0000 0002

3D Secure Required:
  Card: 4000 0027 6000 3184

Insufficient Funds:
  Card: 4000 0000 0000 9995
```

#### Test ACH

```
Account: 000123456789
Routing: 110000000
```

#### Test Email

```
email: test@coinflow.cash
```

### Testnet Tokens

Get free testnet USDC/SOL:

```bash
POST https://api-sandbox.coinflow.cash/faucet
{
  "blockchain": "solana",
  "publicKey": "your_wallet_address",
  "token": "USDC"
}
```

---

## Production Deployment

### Pre-Launch Checklist

#### 1. **CoinFlow Account Setup**
- [ ] Complete merchant verification
- [ ] Submit KYC documents
- [ ] Configure bank account for settlements
- [ ] Set withdrawal limits
- [ ] Configure 2FA

#### 2. **API Configuration**
- [ ] Generate production API keys
- [ ] Set production webhook URLs
- [ ] Configure webhook events
- [ ] Test webhook delivery
- [ ] Set rate limits

#### 3. **Application Setup**
- [ ] Update environment variables
- [ ] Deploy webhook handlers
- [ ] Set up error monitoring (Sentry, DataDog)
- [ ] Configure logging
- [ ] Set up alerting

#### 4. **Testing**
- [ ] End-to-end payment flow
- [ ] Refund processing
- [ ] Webhook delivery
- [ ] Error handling
- [ ] Load testing

#### 5. **Compliance**
- [ ] Review terms of service
- [ ] Privacy policy
- [ ] Cookie policy
- [ ] GDPR compliance
- [ ] PCI DSS compliance (if storing cards)

### Production Environment Variables

```bash
# Production
COINFLOW_ENV=production
COINFLOW_MERCHANT_ID=prod_xxxxxxxx
COINFLOW_API_KEY=sk_prod_xxxxxxxxxxxxxxxxxxxxxxxx
COINFLOW_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_COINFLOW_ENV=production
NEXT_PUBLIC_COINFLOW_MERCHANT_ID=prod_xxxxxxxx
```

### Rate Limits

- **Production**: 100 requests/minute per merchant
- **Sandbox**: 1000 requests/minute per merchant
- **Webhooks**: Unlimited (signature verified)

### Monitoring

**Key Metrics to Track:**

1. **Payment Success Rate**
   ```sql
   SELECT
     COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as success_rate
   FROM payments
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

2. **Average Transaction Time**
   ```sql
   SELECT
     AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_seconds
   FROM payments
   WHERE status = 'completed';
   ```

3. **Failed Payments by Reason**
   ```sql
   SELECT
     failure_reason,
     COUNT(*) as count
   FROM payments
   WHERE status = 'failed'
   GROUP BY failure_reason;
   ```

4. **Webhook Delivery Success**
   ```sql
   SELECT
     COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*) as delivery_rate
   FROM webhook_logs;
   ```

---

## Cost Structure

### Transaction Fees (Estimated)

| Payment Method | Fee | Example |
|----------------|-----|---------|
| Credit Card | 2.9% + $0.30 | $100 → $3.20 fee |
| ACH | 1% (min $1) | $100 → $1 fee |
| Wire Transfer | $25 flat | $100 → $25 fee |
| SEPA | 1% (min €1) | €100 → €1 fee |
| PIX | 1% | R$100 → R$1 fee |
| Crypto (USDC) | Network fees | Minimal |
| Apple/Google Pay | Same as card | $100 → $3.20 fee |

*Note: Exact fees may vary. Contact CoinFlow for your specific rates.*

### Withdrawal Fees

| Method | Fee | Processing Time |
|--------|-----|-----------------|
| ACH Standard | $1 | 3-5 business days |
| ACH Same-Day | $5 | Same day |
| RTP | $2 | Real-time |
| Wire | $25 | 1-3 business days |
| Push-to-Card | 1.5% | Instant |
| SEPA | €1 | 1-2 business days |
| UK Faster | £1 | Minutes to hours |
| PIX | R$1 | Instant |
| Crypto | Network fees | Variable |

---

## Best Practices

### 1. **Error Handling**

```typescript
try {
  const payment = await createCoinflowPayment(data);
  return { success: true, payment };
} catch (error) {
  // Log error
  logger.error('CoinFlow payment failed', {
    error: error.message,
    code: error.code,
    customerId: data.customerId
  });

  // Return user-friendly message
  if (error.code === 'insufficient_funds') {
    return { success: false, message: 'Insufficient funds' };
  }
  if (error.code === 'card_declined') {
    return { success: false, message: 'Card declined' };
  }
  if (error.code === 'invalid_currency') {
    return { success: false, message: 'Currency not supported' };
  }

  // Generic error
  return { success: false, message: 'Payment failed. Please try again.' };
}
```

### 2. **Idempotency**

Prevent duplicate payments:

```typescript
const idempotencyKey = generateIdempotencyKey(customerId, orderId);

await createPayment({
  amount,
  customerId,
  idempotencyKey,  // Prevent duplicate charges
  metadata: {
    orderId,
    source: 'web_checkout'
  }
});
```

### 3. **Webhook Retries**

Implement exponential backoff for webhook retries:

```typescript
async function sendWebhook(url: string, data: any, attempt = 1) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(5000) // 5s timeout
    });
  } catch (error) {
    if (attempt < 5) {
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendWebhook(url, data, attempt + 1);
    }
    throw error;
  }
}
```

### 4. **Security**

```typescript
// Never log sensitive data
logger.info('Payment created', {
  paymentId: payment.id,
  amount: payment.amount,
  // DON'T log: cardNumber, cvv, apiKey
});

// Always validate webhook signatures
if (!verifyWebhookSignature(body, signature)) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

// Use environment variables for secrets
const apiKey = process.env.COINFLOW_API_KEY; // Good
// const apiKey = 'sk_prod_xxx'; // Bad - never hardcode
```

---

## Support & Resources

### CoinFlow Resources

- **Documentation**: [docs.coinflow.cash](https://docs.coinflow.cash)
- **Integration Builder**: [integration-builder.coinflow.cash](https://integration-builder.coinflow.cash)
- **Merchant Dashboard**: [merchant.coinflow.cash](https://merchant.coinflow.cash)
- **GitHub**: [github.com/coinflow-labs-us](https://github.com/coinflow-labs-us)
- **Support**: support@coinflow.cash

### HedgePayments Resources

- **API Documentation**: [docs.hedgepayments.com](https://docs.hedgepayments.com)
- **Dashboard**: [dashboard.hedgepayments.com](https://dashboard.hedgepayments.com)
- **Support**: support@hedgepayments.com
- **Discord**: [discord.gg/hedgepayments](https://discord.gg/hedgepayments)

### NPM Packages

```bash
# CoinFlow SDKs
npm install @coinflowlabs/react          # React components
npm install @coinflowlabs/react-native   # React Native
npm install @coinflowlabs/checkout       # Vanilla JS
```

---

## Appendix

### A. Blockchain Contract Addresses

Retrieve via API:
```bash
GET https://api.coinflow.cash/contract-addresses
```

### B. Supported Countries

**Full Support (170+ countries)**:
- United States, Canada, United Kingdom
- European Union (all 27 members)
- Brazil, Mexico, Argentina
- Australia, New Zealand
- Japan, South Korea, Singapore
- And 160+ more

**Restricted**:
- OFAC sanctioned countries
- High-risk jurisdictions
- Countries with crypto bans

### C. Error Codes

Common CoinFlow error codes:

| Code | Description | Action |
|------|-------------|--------|
| `insufficient_funds` | Not enough balance | Ask user to add funds |
| `card_declined` | Card issuer declined | Try different card |
| `invalid_currency` | Currency not supported | Use supported currency |
| `kyc_required` | KYC verification needed | Complete KYC flow |
| `limit_exceeded` | Transaction limit hit | Lower amount or wait |
| `invalid_token` | Invalid API token | Regenerate token |
| `rate_limit` | Too many requests | Implement backoff |

---

## Conclusion

CoinFlow provides HedgePayments with enterprise-grade payment infrastructure that enables:

✅ **Global Reach**: 170+ countries, 50+ cryptocurrencies
✅ **Instant Settlement**: Real-time crypto, fast fiat
✅ **Security**: PCI DSS Level 1, 100% chargeback protection
✅ **Compliance**: KYC/AML handled by CoinFlow
✅ **Flexibility**: Multiple payment methods, multi-chain support

By white-labeling CoinFlow, HedgePayments delivers a seamless, branded payment experience while leveraging best-in-class infrastructure.

---

*Document prepared by: Automated Documentation Agent*
*Last Updated: November 18, 2025*
*Version: 1.0*
