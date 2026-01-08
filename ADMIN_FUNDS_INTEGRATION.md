# Admin Operational Funds Integration

Research document for displaying Stripe and Brex balances in the HedgePayments admin dashboard.

---

## Current State

Your admin dashboard at `/app/admin/` has:
- Dashboard layout with sidebar navigation
- Super-admin monitoring at `/app/admin/super-admin/`
- Mock data showing zeros for metrics
- Supabase integration ready

**Missing:**
- No Stripe balance fetching
- No Brex integration configured
- No operational funds display

---

## 1. Stripe Balance Integration

### API Endpoint
```
GET https://api.stripe.com/v1/balance
```

### Authentication
Uses your secret key via HTTP Basic Auth:
```bash
curl https://api.stripe.com/v1/balance \
  -u "sk_live_YOUR_SECRET_KEY:"
```

### Response Structure
```json
{
  "object": "balance",
  "available": [
    {
      "amount": 66667000,  // $666,670.00 in cents
      "currency": "usd",
      "source_types": {
        "card": 66667000
      }
    }
  ],
  "pending": [
    {
      "amount": 6141400,  // $61,414.00 pending
      "currency": "usd",
      "source_types": {
        "card": 6141400
      }
    }
  ],
  "connect_reserved": [
    {
      "amount": 0,
      "currency": "usd"
    }
  ],
  "livemode": true
}
```

### Key Fields
| Field | Description |
|-------|-------------|
| `available` | Funds ready for payout/transfer |
| `pending` | Funds still processing (typically 2-7 days) |
| `connect_reserved` | Funds reserved for Connect payouts |

### Implementation: API Route

Create `/app/api/admin/stripe-balance/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(request: Request) {
  // Add auth check here
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const balance = await stripe.balance.retrieve();

    // Format for display
    const formatted = {
      available: balance.available[0]?.amount / 100 || 0,
      pending: balance.pending[0]?.amount / 100 || 0,
      reserved: balance.connect_reserved?.[0]?.amount / 100 || 0,
      currency: balance.available[0]?.currency || 'usd',
      total: (balance.available[0]?.amount + balance.pending[0]?.amount) / 100 || 0,
      livemode: balance.livemode,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Stripe balance error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
```

### Environment Variables Needed
Already in `.env.example`:
```
STRIPE_SECRET_KEY=sk_live_...
```

Add for production:
```
ADMIN_API_KEY=your_secure_admin_key
```

---

## 2. Brex Integration

### Available APIs
- **Transactions API** - View transactions, accounts, statements
- **Accounting API** - View/manage accounting data
- **Payments API** - Manage vendors, send ACH/wires

### Authentication
Brex uses OAuth 2.0 or API tokens:
```bash
curl https://platform.brexapis.com/v2/accounts \
  -H "Authorization: Bearer YOUR_BREX_TOKEN"
```

### Brex Account Types
Your Brex business account has 3 sub-accounts:
1. **Checking** - Operational funds for daily use
2. **Treasury** - Yield-generating money market funds (up to 4.17% APY)
3. **Vault** - FDIC-insured deposits (up to $6M coverage)

### Implementation: API Route

Create `/app/api/admin/brex-balance/route.ts`:

```typescript
import { NextResponse } from 'next/server';

const BREX_API_BASE = 'https://platform.brexapis.com/v2';

export async function GET(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get accounts
    const accountsRes = await fetch(`${BREX_API_BASE}/accounts`, {
      headers: {
        'Authorization': `Bearer ${process.env.BREX_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountsRes.ok) {
      throw new Error(`Brex API error: ${accountsRes.status}`);
    }

    const accounts = await accountsRes.json();

    // Parse account balances
    const balances = {
      checking: 0,
      treasury: 0,
      vault: 0,
      total: 0,
      accounts: accounts.items || [],
      lastUpdated: new Date().toISOString(),
    };

    // Sum up balances by account type
    for (const account of accounts.items || []) {
      const amount = account.current_balance?.amount / 100 || 0;
      if (account.name?.toLowerCase().includes('checking')) {
        balances.checking = amount;
      } else if (account.name?.toLowerCase().includes('treasury')) {
        balances.treasury = amount;
      } else if (account.name?.toLowerCase().includes('vault')) {
        balances.vault = amount;
      }
      balances.total += amount;
    }

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Brex balance error:', error);
    return NextResponse.json({ error: 'Failed to fetch Brex balance' }, { status: 500 });
  }
}
```

### Environment Variables to Add
```bash
# Brex API Configuration
BREX_API_TOKEN=brex_live_...
BREX_CLIENT_ID=your_client_id
BREX_CLIENT_SECRET=your_client_secret
```

### Getting Brex API Access
1. Go to Brex Dashboard > Settings > Developer
2. Create an API token with "Accounts: Read" scope
3. For production, use OAuth for better security

---

## 3. Combined Funds Dashboard Component

Create `/app/admin/components/OperationalFunds.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';

interface FundsData {
  stripe: {
    available: number;
    pending: number;
    total: number;
  } | null;
  brex: {
    checking: number;
    treasury: number;
    vault: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export default function OperationalFunds() {
  const [funds, setFunds] = useState<FundsData>({
    stripe: null,
    brex: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchBalances() {
      try {
        const [stripeRes, brexRes] = await Promise.all([
          fetch('/api/admin/stripe-balance', {
            headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_KEY}` },
          }),
          fetch('/api/admin/brex-balance', {
            headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_KEY}` },
          }),
        ]);

        const stripe = stripeRes.ok ? await stripeRes.json() : null;
        const brex = brexRes.ok ? await brexRes.json() : null;

        setFunds({ stripe, brex, loading: false, error: null });
      } catch (err) {
        setFunds(prev => ({ ...prev, loading: false, error: 'Failed to load balances' }));
      }
    }

    fetchBalances();
    // Refresh every 5 minutes
    const interval = setInterval(fetchBalances, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const totalOperational = (funds.stripe?.available || 0) + (funds.brex?.checking || 0);
  const totalSavings = (funds.brex?.treasury || 0) + (funds.brex?.vault || 0);
  const grandTotal = (funds.stripe?.total || 0) + (funds.brex?.total || 0);

  if (funds.loading) {
    return <div style={{ fontFamily: 'Georgia, serif', color: '#6B5D4F' }}>Loading balances...</div>;
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Grand Total */}
      <div style={{
        background: '#2C2416',
        color: '#FAF8F5',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Company Funds</div>
        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{formatCurrency(grandTotal)}</div>
      </div>

      {/* Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Operational Funds */}
        <div style={{
          border: '1px solid #D4C5B0',
          borderRadius: '8px',
          padding: '20px',
          background: '#FAF8F5',
        }}>
          <h3 style={{ color: '#2C2416', margin: '0 0 16px 0' }}>Operational Funds</h3>
          <div style={{ fontSize: '28px', color: '#2C2416', marginBottom: '16px' }}>
            {formatCurrency(totalOperational)}
          </div>

          <div style={{ borderTop: '1px solid #D4C5B0', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6B5D4F' }}>Stripe Available</span>
              <span style={{ color: '#2C2416' }}>{formatCurrency(funds.stripe?.available || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6B5D4F' }}>Stripe Pending</span>
              <span style={{ color: '#8B7E6E' }}>{formatCurrency(funds.stripe?.pending || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B5D4F' }}>Brex Checking</span>
              <span style={{ color: '#2C2416' }}>{formatCurrency(funds.brex?.checking || 0)}</span>
            </div>
          </div>
        </div>

        {/* Savings/Investments */}
        <div style={{
          border: '1px solid #D4C5B0',
          borderRadius: '8px',
          padding: '20px',
          background: '#FAF8F5',
        }}>
          <h3 style={{ color: '#2C2416', margin: '0 0 16px 0' }}>Savings & Investments</h3>
          <div style={{ fontSize: '28px', color: '#2C2416', marginBottom: '16px' }}>
            {formatCurrency(totalSavings)}
          </div>

          <div style={{ borderTop: '1px solid #D4C5B0', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6B5D4F' }}>Brex Treasury</span>
              <span style={{ color: '#2C2416' }}>{formatCurrency(funds.brex?.treasury || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span style={{ color: '#8B7E6E' }}>Money Market (4.17% APY)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B5D4F' }}>Brex Vault</span>
              <span style={{ color: '#2C2416' }}>{formatCurrency(funds.brex?.vault || 0)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#8B7E6E' }}>
              FDIC Insured (up to $6M)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Implementation Checklist

### Phase 1: Stripe (Quick Win)
- [ ] Add `STRIPE_SECRET_KEY` to production env
- [ ] Create `/app/api/admin/stripe-balance/route.ts`
- [ ] Add balance display to admin dashboard
- [ ] Test with Stripe test mode first

### Phase 2: Brex
- [ ] Get Brex API access token from developer settings
- [ ] Add `BREX_API_TOKEN` to env
- [ ] Create `/app/api/admin/brex-balance/route.ts`
- [ ] Test API connectivity
- [ ] Add Brex balances to dashboard

### Phase 3: Polish
- [ ] Add error states and loading UI
- [ ] Implement auto-refresh (every 5 min)
- [ ] Add manual refresh button
- [ ] Add historical balance tracking (optional)
- [ ] Set up balance change alerts (optional)

---

## 5. Security Considerations

1. **Never expose secret keys client-side**
   - All API calls go through your Next.js API routes
   - Keys stay in server environment only

2. **Protect admin routes**
   - Add authentication middleware
   - Use secure admin tokens
   - Consider IP whitelisting

3. **Rate limiting**
   - Stripe: 100 requests/second
   - Brex: Check their limits, cache results

4. **Audit logging**
   - Log all balance queries
   - Track who accessed what

---

## 6. Quick Start Commands

```bash
# Install Stripe SDK
npm install stripe

# Add to .env.local
STRIPE_SECRET_KEY=sk_live_...
BREX_API_TOKEN=brex_live_...
ADMIN_API_KEY=your_secure_key

# Test Stripe connection
curl http://localhost:3000/api/admin/stripe-balance \
  -H "Authorization: Bearer your_admin_key"
```

---

## Resources

- [Stripe Balance API](https://docs.stripe.com/api/balance/balance_retrieve)
- [Stripe Balance Object](https://docs.stripe.com/api/balance/balance_object)
- [Brex Developer Portal](https://developer.brex.com/)
- [Brex Transactions API](https://developer.brex.com/openapi/transactions_api/)
- [Brex Account Management](https://www.brex.com/support/manage-business-account-balance)

---

*Generated: December 26, 2025*
