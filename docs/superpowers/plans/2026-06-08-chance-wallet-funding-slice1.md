# Chance Wallet — Funding (Cash-in) Slice 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load real money (Stripe **test mode**) into a wallet on Hedge's shared ledger, confirmed by webhook, and show the balance in the Chance extension — one config-flip from live.

**Architecture:** The Express service `@hedge/api` exposes Chance funding endpoints. `POST /funding/sessions` creates a Stripe Checkout Session (test) + a `chance_funding_sessions` row; the popup opens the hosted URL; Stripe's webhook calls an **idempotent** Postgres function `credit_wallet` that writes a `deposit` transaction (unique on `external_id`) and bumps `wallets.balance_available`. The popup reads the real balance from `GET /wallet/:id`.

**Tech Stack:** TypeScript, Express, Stripe Node SDK, Supabase (`@supabase/supabase-js` service-role), Postgres (plpgsql), Jest + supertest. Extension is vanilla JS (MV3), tested with the existing jsdom harness.

**Spec:** `docs/superpowers/specs/2026-06-05-chance-wallet-funding-design.md`

**Deviation from spec (intentional):** the spec said record the funding under `coverpay_sessions`. That table requires a `business_id` (B2B) and a B2B status enum — wrong shape for consumer wallet funding. This plan uses a dedicated **`chance_funding_sessions`** table instead. CoverPay-compatibility is preserved conceptually (we can wrap it later); the consumer-funding record is its own table.

**Money units:** API accepts `amount` in **dollars** (e.g. `25`). Internally everything is **cents** (BIGINT). `GET /wallet` returns both `balanceCents` and `balance` (dollars).

---

## File Structure

**Backend (`packages/api/`):**
- Create `src/middleware/errorHandler.ts` — minimal error middleware (index.ts already imports it; missing today).
- Create `src/utils/logger.ts` — minimal winston logger (index.ts already imports it; missing today).
- Modify `src/config/index.ts` — add `stripe` + `chance` config.
- Create `src/lib/stripe.ts` — Stripe client singleton.
- Create `src/services/walletStore.ts` — Supabase data access (wallets, funding sessions, `credit_wallet` RPC).
- Create `src/services/fundingService.ts` — orchestration (create session, handle webhook event).
- Create `src/routes/chance.ts` — JSON router: create wallet, get wallet, create funding session.
- Create `src/routes/chanceWebhook.ts` — raw-body Stripe webhook handler.
- Modify `src/index.ts` — mount webhook (raw) **before** `express.json()`, mount router after.
- Tests: `src/services/__tests__/walletStore.test.ts`, `src/services/__tests__/fundingService.test.ts`, `src/routes/__tests__/chance.test.ts`.

**Database (`supabase/migrations/`):**
- Create `004_chance_funding.sql` — `chance_funding_sessions` table, `credit_wallet()` function, seeded anon user.

**Extension (`chance-extension/`):**
- Create `config.js` — `window.CHANCE_API_BASE`.
- Modify `popup.html` — load `config.js` before `popup.js`.
- Modify `popup.js` — real `startFunding('card')`, wallet bootstrap, balance from API.
- Modify `manifest.json` — `host_permissions` for the API origin.
- Test: `test/funding.mjs` — jsdom test of the popup funding call with mocked `fetch`/`chrome`.

---

## Task 0: Make `@hedge/api` build + add deps/config

**Files:**
- Create: `packages/api/src/utils/logger.ts`
- Create: `packages/api/src/middleware/errorHandler.ts`
- Modify: `packages/api/src/config/index.ts`
- Modify: `packages/api/package.json` (deps)

- [ ] **Step 1: Add dependencies**

Run:
```bash
cd packages/api && npm install stripe@^16 && npm install -D supertest@^6 @types/supertest@^6
```
Expected: `stripe` in dependencies, `supertest` + types in devDependencies.

- [ ] **Step 2: Create the logger**

`packages/api/src/utils/logger.ts`:
```ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

export default logger;
```

- [ ] **Step 3: Create the error handler**

`packages/api/src/middleware/errorHandler.ts`:
```ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode || 500;
  logger.error('Unhandled error', { message: err.message, status });
  res.status(status).json({ error: err.publicMessage || 'Internal error' });
}
```

- [ ] **Step 4: Add Stripe + Chance config**

In `packages/api/src/config/index.ts`, add these keys inside the `config` object (after the `ach` block):
```ts
  // Stripe (Chance wallet funding)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Chance wallet
  chance: {
    anonUserId: process.env.CHANCE_ANON_USER_ID || '00000000-0000-0000-0000-0000000000a1',
    successUrl: process.env.CHANCE_SUCCESS_URL || 'https://hedgepayments.com/chance/funded',
    cancelUrl: process.env.CHANCE_CANCEL_URL || 'https://hedgepayments.com/chance/cancelled',
    extensionOrigin: process.env.CHANCE_EXTENSION_ORIGIN || '*',
  },
```

- [ ] **Step 5: Build to verify it compiles**

Run: `cd packages/api && npm run build`
Expected: `tsc` exits 0 (no missing-module errors for logger/errorHandler).

- [ ] **Step 6: Commit**
```bash
git add packages/api/src/utils/logger.ts packages/api/src/middleware/errorHandler.ts packages/api/src/config/index.ts packages/api/package.json packages/api/package-lock.json
git commit -m "chore(api): make @hedge/api build + add stripe/chance config"
```

---

## Task 1: Database — funding table, `credit_wallet`, anon user

**Files:**
- Create: `supabase/migrations/004_chance_funding.sql`

- [ ] **Step 1: Write the migration**

`supabase/migrations/004_chance_funding.sql`:
```sql
-- Chance wallet funding (cash-in) — slice 1

-- Seeded anonymous user + auth row so device wallets have a valid owner.
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000000a1', 'anon@chance.local', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, kyc_status, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000000a1', 'anon@chance.local', 'not_started', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Funding sessions (consumer wallet top-ups; decoupled from B2B coverpay_sessions)
CREATE TABLE IF NOT EXISTS chance_funding_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount BIGINT NOT NULL,            -- cents
  currency currency_type NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_funding_sessions_wallet ON chance_funding_sessions(wallet_id);

-- Atomic, idempotent credit: writes a deposit txn (unique external_id) + bumps balance.
CREATE OR REPLACE FUNCTION credit_wallet(
  p_wallet_id UUID,
  p_amount BIGINT,
  p_currency TEXT,
  p_external_id TEXT
) RETURNS TABLE(balance_available BIGINT, credited BOOLEAN) AS $$
DECLARE
  v_balance BIGINT;
BEGIN
  -- Idempotency: if this external_id already credited, return current balance.
  IF EXISTS (SELECT 1 FROM transactions WHERE external_id = p_external_id) THEN
    SELECT w.balance_available INTO v_balance FROM wallets w WHERE w.id = p_wallet_id;
    RETURN QUERY SELECT v_balance, FALSE;
    RETURN;
  END IF;

  INSERT INTO transactions
    (destination_wallet_id, type, status, currency, amount, external_id, description, completed_at)
  VALUES
    (p_wallet_id, 'deposit', 'completed', p_currency::currency_type, p_amount, p_external_id,
     'Chance wallet funding (Stripe)', NOW());

  UPDATE wallets
    SET balance_available = balance_available + p_amount, updated_at = NOW()
    WHERE id = p_wallet_id
    RETURNING balance_available INTO v_balance;

  RETURN QUERY SELECT v_balance, TRUE;
END;
$$ LANGUAGE plpgsql;
```

- [ ] **Step 2: Apply the migration to the test Supabase project**

Run (Supabase SQL editor or psql against the test DB):
```bash
psql "$SUPABASE_DB_URL" -f supabase/migrations/004_chance_funding.sql
```
Expected: `CREATE TABLE`, `CREATE FUNCTION`, no errors. (If migration 001 is not yet applied, apply 001 first.)

- [ ] **Step 3: Verify idempotency by hand (integration check)**

Run in psql:
```sql
-- make a test wallet
INSERT INTO wallets (id, user_id, currency, status)
VALUES ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000a1', 'USD', 'active')
ON CONFLICT (id) DO NOTHING;

SELECT * FROM credit_wallet('00000000-0000-0000-0000-0000000000b1', 2500, 'USD', 'evt_test_1'); -- credited=t, balance=2500
SELECT * FROM credit_wallet('00000000-0000-0000-0000-0000000000b1', 2500, 'USD', 'evt_test_1'); -- credited=f, balance=2500 (no double credit)
```
Expected: first call `credited=true, balance_available=2500`; second `credited=false, balance_available=2500`.

- [ ] **Step 4: Commit**
```bash
git add supabase/migrations/004_chance_funding.sql
git commit -m "feat(db): chance funding sessions + idempotent credit_wallet + anon user"
```

---

## Task 2: `walletStore` — Supabase data access

**Files:**
- Create: `packages/api/src/services/walletStore.ts`
- Test: `packages/api/src/services/__tests__/walletStore.test.ts`

- [ ] **Step 1: Write the failing test**

`packages/api/src/services/__tests__/walletStore.test.ts`:
```ts
jest.mock('../../lib/supabase', () => ({ supabase: { from: jest.fn(), rpc: jest.fn() } }));
import { supabase } from '../../lib/supabase';
import { creditWallet, getWallet } from '../walletStore';

const mocked = supabase as unknown as { from: jest.Mock; rpc: jest.Mock };

describe('walletStore.creditWallet', () => {
  it('calls credit_wallet RPC and maps the result', async () => {
    mocked.rpc.mockResolvedValue({ data: [{ balance_available: 2500, credited: true }], error: null });
    const res = await creditWallet({ walletId: 'w1', amountCents: 2500, currency: 'USD', externalId: 'evt_1' });
    expect(mocked.rpc).toHaveBeenCalledWith('credit_wallet', {
      p_wallet_id: 'w1', p_amount: 2500, p_currency: 'USD', p_external_id: 'evt_1',
    });
    expect(res).toEqual({ balanceCents: 2500, credited: true });
  });
});

describe('walletStore.getWallet', () => {
  it('returns null when not found', async () => {
    const single = jest.fn().mockResolvedValue({ data: null, error: null });
    mocked.from.mockReturnValue({ select: () => ({ eq: () => ({ single }) }) });
    expect(await getWallet('missing')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/api && npx jest walletStore -t creditWallet`
Expected: FAIL ("Cannot find module '../walletStore'").

- [ ] **Step 3: Implement `walletStore`**

`packages/api/src/services/walletStore.ts`:
```ts
import { supabase } from '../lib/supabase';
import { config } from '../config';

export interface Wallet { id: string; currency: string; balanceCents: number; }

export async function createWallet(currency = 'USD'): Promise<Wallet> {
  const { data, error } = await supabase
    .from('wallets')
    .insert({ user_id: config.chance.anonUserId, currency, status: 'active' })
    .select('id, currency, balance_available')
    .single();
  if (error || !data) throw new Error(`createWallet failed: ${error?.message}`);
  return { id: data.id, currency: data.currency, balanceCents: data.balance_available };
}

export async function getWallet(walletId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('id, currency, balance_available')
    .eq('id', walletId)
    .single();
  if (error || !data) return null;
  return { id: data.id, currency: data.currency, balanceCents: data.balance_available };
}

export async function createFundingSession(input: {
  walletId: string; amountCents: number; currency: string; stripeSessionId: string;
}): Promise<void> {
  const { error } = await supabase.from('chance_funding_sessions').insert({
    wallet_id: input.walletId, amount: input.amountCents, currency: input.currency,
    stripe_session_id: input.stripeSessionId, status: 'pending',
  });
  if (error) throw new Error(`createFundingSession failed: ${error.message}`);
}

export async function completeFundingSession(stripeSessionId: string): Promise<void> {
  await supabase.from('chance_funding_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('stripe_session_id', stripeSessionId);
}

export async function creditWallet(input: {
  walletId: string; amountCents: number; currency: string; externalId: string;
}): Promise<{ balanceCents: number; credited: boolean }> {
  const { data, error } = await supabase.rpc('credit_wallet', {
    p_wallet_id: input.walletId, p_amount: input.amountCents,
    p_currency: input.currency, p_external_id: input.externalId,
  });
  if (error) throw new Error(`credit_wallet failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return { balanceCents: row.balance_available, credited: row.credited };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd packages/api && npx jest walletStore`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**
```bash
git add packages/api/src/services/walletStore.ts packages/api/src/services/__tests__/walletStore.test.ts
git commit -m "feat(api): walletStore supabase data access + tests"
```

---

## Task 3: `stripe` lib + `fundingService`

**Files:**
- Create: `packages/api/src/lib/stripe.ts`
- Create: `packages/api/src/services/fundingService.ts`
- Test: `packages/api/src/services/__tests__/fundingService.test.ts`

- [ ] **Step 1: Create the Stripe client**

`packages/api/src/lib/stripe.ts`:
```ts
import Stripe from 'stripe';
import { config } from '../config';

export const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2024-06-20' });
export default stripe;
```

- [ ] **Step 2: Write the failing test**

`packages/api/src/services/__tests__/fundingService.test.ts`:
```ts
jest.mock('../../lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: jest.fn() } }, webhooks: { constructEvent: jest.fn() } },
}));
jest.mock('../walletStore');
import { stripe } from '../../lib/stripe';
import * as walletStore from '../walletStore';
import { startFunding, handleWebhookEvent } from '../fundingService';

const s = stripe as any;

describe('fundingService.startFunding', () => {
  it('creates a $25 Checkout session (2500 cents) and records it', async () => {
    s.checkout.sessions.create.mockResolvedValue({ id: 'cs_1', url: 'https://stripe/cs_1' });
    (walletStore.createFundingSession as jest.Mock).mockResolvedValue(undefined);
    const res = await startFunding({ walletId: 'w1', amount: 25, currency: 'USD' });
    expect(s.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'payment', client_reference_id: 'w1',
    }));
    const arg = s.checkout.sessions.create.mock.calls[0][0];
    expect(arg.line_items[0].price_data.unit_amount).toBe(2500);
    expect(res).toEqual({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
    expect(walletStore.createFundingSession).toHaveBeenCalledWith(
      expect.objectContaining({ walletId: 'w1', amountCents: 2500, stripeSessionId: 'cs_1' }));
  });
});

describe('fundingService.handleWebhookEvent', () => {
  it('credits the wallet on checkout.session.completed', async () => {
    (walletStore.creditWallet as jest.Mock).mockResolvedValue({ balanceCents: 2500, credited: true });
    (walletStore.completeFundingSession as jest.Mock).mockResolvedValue(undefined);
    await handleWebhookEvent({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_1', amount_total: 2500, currency: 'usd', metadata: { walletId: 'w1' } } },
    } as any);
    expect(walletStore.creditWallet).toHaveBeenCalledWith({
      walletId: 'w1', amountCents: 2500, currency: 'USD', externalId: 'cs_1',
    });
  });

  it('ignores unrelated event types', async () => {
    await handleWebhookEvent({ type: 'payment_intent.created', data: { object: {} } } as any);
    expect(walletStore.creditWallet).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd packages/api && npx jest fundingService`
Expected: FAIL ("Cannot find module '../fundingService'").

- [ ] **Step 4: Implement `fundingService`**

`packages/api/src/services/fundingService.ts`:
```ts
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { config } from '../config';
import * as walletStore from './walletStore';
import { logger } from '../utils/logger';

export async function startFunding(input: { walletId: string; amount: number; currency?: string; }) {
  const currency = (input.currency || 'USD').toUpperCase();
  const amountCents = Math.round(input.amount * 100);
  if (!(amountCents > 0)) throw new Error('amount must be positive');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: input.walletId,
    metadata: { walletId: input.walletId },
    success_url: config.chance.successUrl,
    cancel_url: config.chance.cancelUrl,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: amountCents,
        product_data: { name: 'Chance wallet funding' },
      },
    }],
  });

  await walletStore.createFundingSession({
    walletId: input.walletId, amountCents, currency, stripeSessionId: session.id,
  });
  return { checkoutUrl: session.url as string, sessionId: session.id };
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  if (event.type !== 'checkout.session.completed') return;
  const session = event.data.object as Stripe.Checkout.Session;
  const walletId = (session.metadata?.walletId) || (session.client_reference_id as string);
  if (!walletId) { logger.error('webhook missing walletId', { id: session.id }); return; }

  const amountCents = session.amount_total ?? 0;
  const currency = (session.currency || 'usd').toUpperCase();
  const result = await walletStore.creditWallet({
    walletId, amountCents, currency, externalId: session.id,
  });
  await walletStore.completeFundingSession(session.id);
  logger.info('chance funding credited', { walletId, amountCents, credited: result.credited });
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `cd packages/api && npx jest fundingService`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**
```bash
git add packages/api/src/lib/stripe.ts packages/api/src/services/fundingService.ts packages/api/src/services/__tests__/fundingService.test.ts
git commit -m "feat(api): fundingService (stripe checkout + webhook credit) + tests"
```

---

## Task 4: Chance JSON router (wallet + funding session)

**Files:**
- Create: `packages/api/src/routes/chance.ts`
- Test: `packages/api/src/routes/__tests__/chance.test.ts`

- [ ] **Step 1: Write the failing test**

`packages/api/src/routes/__tests__/chance.test.ts`:
```ts
jest.mock('../../services/walletStore');
jest.mock('../../services/fundingService');
import express from 'express';
import request from 'supertest';
import * as walletStore from '../../services/walletStore';
import * as fundingService from '../../services/fundingService';
import { chanceRouter } from '../chance';

function app() { const a = express(); a.use(express.json()); a.use('/api/v1/chance', chanceRouter); return a; }

describe('chance router', () => {
  it('POST /wallet creates a wallet', async () => {
    (walletStore.createWallet as jest.Mock).mockResolvedValue({ id: 'w1', currency: 'USD', balanceCents: 0 });
    const res = await request(app()).post('/api/v1/chance/wallet').send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ walletId: 'w1', currency: 'USD' });
  });

  it('GET /wallet/:id returns dollars + cents', async () => {
    (walletStore.getWallet as jest.Mock).mockResolvedValue({ id: 'w1', currency: 'USD', balanceCents: 4569 });
    const res = await request(app()).get('/api/v1/chance/wallet/w1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ walletId: 'w1', currency: 'USD', balanceCents: 4569, balance: 45.69 });
  });

  it('GET /wallet/:id 404s when missing', async () => {
    (walletStore.getWallet as jest.Mock).mockResolvedValue(null);
    expect((await request(app()).get('/api/v1/chance/wallet/none')).status).toBe(404);
  });

  it('POST /funding/sessions rejects non-positive amount', async () => {
    const res = await request(app()).post('/api/v1/chance/funding/sessions').send({ walletId: 'w1', amount: 0 });
    expect(res.status).toBe(400);
  });

  it('POST /funding/sessions returns the checkout url', async () => {
    (fundingService.startFunding as jest.Mock).mockResolvedValue({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
    const res = await request(app()).post('/api/v1/chance/funding/sessions').send({ walletId: 'w1', amount: 25 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/api && npx jest routes/chance`
Expected: FAIL ("Cannot find module '../chance'").

- [ ] **Step 3: Implement the router**

`packages/api/src/routes/chance.ts`:
```ts
import { Router, Request, Response } from 'express';
import * as walletStore from '../services/walletStore';
import * as fundingService from '../services/fundingService';
import { logger } from '../utils/logger';

export const chanceRouter = Router();

chanceRouter.post('/wallet', async (_req: Request, res: Response) => {
  try {
    const wallet = await walletStore.createWallet('USD');
    res.json({ walletId: wallet.id, currency: wallet.currency });
  } catch (e: any) { logger.error('create wallet failed', { e: e.message }); res.status(500).json({ error: 'could not create wallet' }); }
});

chanceRouter.get('/wallet/:id', async (req: Request, res: Response) => {
  const wallet = await walletStore.getWallet(req.params.id);
  if (!wallet) return res.status(404).json({ error: 'wallet not found' });
  res.json({ walletId: wallet.id, currency: wallet.currency, balanceCents: wallet.balanceCents, balance: wallet.balanceCents / 100 });
});

chanceRouter.post('/funding/sessions', async (req: Request, res: Response) => {
  const { walletId, amount, currency } = req.body || {};
  if (!walletId) return res.status(400).json({ error: 'walletId required' });
  if (!(Number(amount) > 0)) return res.status(400).json({ error: 'amount must be positive' });
  try {
    const out = await fundingService.startFunding({ walletId, amount: Number(amount), currency });
    res.json(out);
  } catch (e: any) { logger.error('funding session failed', { e: e.message }); res.status(500).json({ error: 'could not start checkout' }); }
});
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd packages/api && npx jest routes/chance`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**
```bash
git add packages/api/src/routes/chance.ts packages/api/src/routes/__tests__/chance.test.ts
git commit -m "feat(api): chance router (wallet + funding session) + tests"
```

---

## Task 5: Stripe webhook handler (raw body)

**Files:**
- Create: `packages/api/src/routes/chanceWebhook.ts`
- Test: extend `packages/api/src/routes/__tests__/chance.test.ts`

- [ ] **Step 1: Write the failing test (append to chance.test.ts)**

Append to `packages/api/src/routes/__tests__/chance.test.ts`:
```ts
jest.mock('../../lib/stripe', () => ({ stripe: { webhooks: { constructEvent: jest.fn() } } }));
import { stripe } from '../../lib/stripe';
import { chanceWebhook } from '../chanceWebhook';

function webhookApp() {
  const a = express();
  a.post('/webhook', express.raw({ type: 'application/json' }), chanceWebhook);
  return a;
}

describe('chance webhook', () => {
  it('400s on bad signature', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => { throw new Error('bad sig'); });
    const res = await request(webhookApp()).post('/webhook').set('stripe-signature', 'x').send(Buffer.from('{}'));
    expect(res.status).toBe(400);
  });

  it('200s and dispatches on valid event', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({ type: 'checkout.session.completed', data: { object: { id: 'cs_1', amount_total: 2500, currency: 'usd', metadata: { walletId: 'w1' } } } });
    (fundingService.handleWebhookEvent as jest.Mock).mockResolvedValue(undefined);
    const res = await request(webhookApp()).post('/webhook').set('stripe-signature', 'x').send(Buffer.from('{}'));
    expect(res.status).toBe(200);
    expect(fundingService.handleWebhookEvent).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd packages/api && npx jest routes/chance -t webhook`
Expected: FAIL ("Cannot find module '../chanceWebhook'").

- [ ] **Step 3: Implement the webhook handler**

`packages/api/src/routes/chanceWebhook.ts`:
```ts
import { Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { config } from '../config';
import * as fundingService from '../services/fundingService';
import { logger } from '../utils/logger';

// Mount with express.raw({ type: 'application/json' }) so req.body is the raw Buffer.
export async function chanceWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (e: any) {
    logger.error('webhook signature failed', { e: e.message });
    return res.status(400).json({ error: 'invalid signature' });
  }
  try {
    await fundingService.handleWebhookEvent(event);
  } catch (e: any) {
    logger.error('webhook handler error', { e: e.message });
    return res.status(500).json({ error: 'handler error' });
  }
  res.json({ received: true });
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd packages/api && npx jest routes/chance`
Expected: PASS (7 tests total).

- [ ] **Step 5: Commit**
```bash
git add packages/api/src/routes/chanceWebhook.ts packages/api/src/routes/__tests__/chance.test.ts
git commit -m "feat(api): stripe webhook handler (raw body, signature verify) + tests"
```

---

## Task 6: Mount routes in `index.ts`

**Files:**
- Modify: `packages/api/src/index.ts`

- [ ] **Step 1: Mount the webhook (raw) before json, and the router after**

In `packages/api/src/index.ts`, add the import near the top:
```ts
import { chanceRouter } from './routes/chance';
import { chanceWebhook } from './routes/chanceWebhook';
```
Replace the line `app.use(express.json({ limit: '10mb' }));` with:
```ts
// Stripe webhook needs the RAW body — mount BEFORE express.json().
app.post('/api/v1/chance/funding/webhook', express.raw({ type: 'application/json' }), chanceWebhook);

app.use(express.json({ limit: '10mb' }));
```
Then, replace the `// Routes will be added here` comment block with:
```ts
app.use('/api/v1/chance', chanceRouter);
```

- [ ] **Step 2: Build to verify it compiles**

Run: `cd packages/api && npm run build`
Expected: `tsc` exits 0.

- [ ] **Step 3: Smoke-run the server**

Run: `cd packages/api && STRIPE_SECRET_KEY=sk_test_x STRIPE_WEBHOOK_SECRET=whsec_x npm run dev`
Expected: logs "Hedge API Server running on port 3000"; `curl localhost:3000/health` → `{"status":"ok",...}`. Stop the server.

- [ ] **Step 4: Commit**
```bash
git add packages/api/src/index.ts
git commit -m "feat(api): mount chance routes + raw-body stripe webhook"
```

---

## Task 7: Extension — real card funding + live balance

**Files:**
- Create: `chance-extension/config.js`
- Modify: `chance-extension/popup.html`
- Modify: `chance-extension/popup.js`
- Modify: `chance-extension/manifest.json`

- [ ] **Step 1: Add the API base config**

`chance-extension/config.js`:
```js
// Set to your deployed @hedge/api origin. For local dev with the extension, use a tunnel
// (e.g. `stripe listen` + a public URL) or http://localhost:3000.
window.CHANCE_API_BASE = 'http://localhost:3000/api/v1/chance'
```

- [ ] **Step 2: Load config before popup.js**

In `chance-extension/popup.html`, change `<script src="popup.js"></script>` to:
```html
  <script src="config.js"></script>
  <script src="popup.js"></script>
```

- [ ] **Step 3: Add host permission**

In `chance-extension/manifest.json`, add the API origin to `host_permissions` (alongside `<all_urls>`):
```json
  "host_permissions": ["<all_urls>", "http://localhost:3000/*"]
```
(When deployed, add the production API origin too.)

- [ ] **Step 4: Wire wallet bootstrap + real card funding in popup.js**

In `chance-extension/popup.js`, add near the balance helpers (after `addBalance`):
```js
var API = (typeof window !== 'undefined' && window.CHANCE_API_BASE) || ''
// ensure a device wallet id (created once, persisted)
function ensureWallet(cb) {
  try {
    chrome.storage.local.get(['walletId'], function (v) {
      if (v && v.walletId) return cb(v.walletId)
      fetch(API + '/wallet', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
        .then(function (r) { return r.json() }).then(function (d) {
          if (d && d.walletId) { try { chrome.storage.local.set({ walletId: d.walletId }) } catch (e) {} ; cb(d.walletId) }
          else cb(null)
        }).catch(function () { cb(null) })
    })
  } catch (e) { cb(null) }
}
// refresh balance from the ledger
function refreshBalance() {
  chrome.storage.local.get(['walletId'], function (v) {
    var id = v && v.walletId; if (!id || !API) return
    fetch(API + '/wallet/' + id).then(function (r) { return r.json() }).then(function (d) {
      if (d && typeof d.balance === 'number') { BAL = d.balance; renderBal(); try { chrome.storage.local.set({ balance: BAL }) } catch (e) {} }
    }).catch(function () {})
  })
}
```

Replace the card branch of `startFunding`. Find:
```js
function startFunding(amount, rail) { S.fundAmt = amount; S.fundRail = rail || 'card'; go('funding'); setTimeout(function () { addBalance(amount); go('funded') }, 1600) }
```
Replace with:
```js
function startFunding(amount, rail) {
  S.fundAmt = amount; S.fundRail = rail || 'card'
  if (S.fundRail !== 'card' || !API) { // CoinFlow path stays simulated for now
    go('funding'); setTimeout(function () { addBalance(amount); go('funded') }, 1600); return
  }
  go('funding')
  ensureWallet(function (walletId) {
    if (!walletId) { go('fund'); return }
    fetch(API + '/funding/sessions', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ walletId: walletId, amount: amount, currency: 'USD' }),
    }).then(function (r) { return r.json() }).then(function (d) {
      if (d && d.checkoutUrl) { try { chrome.tabs.create({ url: d.checkoutUrl }) } catch (e) {} ; go('fund') }
      else go('fund')
    }).catch(function () { go('fund') })
  })
}
```

In `loadBalance`, after it sets `BAL` from storage, also call `refreshBalance()`. Find:
```js
function loadBalance() { try { chrome.storage.local.get(['balance'], function (v) { BAL = (v && v.balance) || 0; renderBal() }) } catch (e) { renderBal() } }
```
Replace with:
```js
function loadBalance() { try { chrome.storage.local.get(['balance'], function (v) { BAL = (v && v.balance) || 0; renderBal(); refreshBalance() }) } catch (e) { renderBal() } }
```

- [ ] **Step 5: Sync the vendored widget + syntax check**

Run: `cd chance-extension && npm run verify-widget && node --check popup.js`
Expected: verify-widget OK, `popup.js` parses.

- [ ] **Step 6: Commit**
```bash
git add chance-extension/config.js chance-extension/popup.html chance-extension/popup.js chance-extension/manifest.json
git commit -m "feat(ext): real card funding via @hedge/api + live ledger balance"
```

---

## Task 8: Extension funding test (jsdom)

**Files:**
- Create: `chance-extension/test/funding.mjs`
- Modify: `chance-extension/package.json` (add `test:funding` script)

- [ ] **Step 1: Write the test**

`chance-extension/test/funding.mjs`:
```js
/* Verifies the popup's card-funding path calls @hedge/api and opens Checkout. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const dir = path.dirname(fileURLToPath(import.meta.url))
const html = fs.readFileSync(path.join(dir, '..', 'popup.html'), 'utf8')
const popupJs = fs.readFileSync(path.join(dir, '..', 'popup.js'), 'utf8')

const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true })
const w = dom.window
const store = { walletId: 'w1' }
let createdTabUrl = null
const calls = []
w.CHANCE_API_BASE = 'http://api.test/api/v1/chance'
w.chrome = {
  storage: { local: { get: (k, cb) => cb(store), set: (o) => Object.assign(store, o) } },
  tabs: { create: ({ url }) => { createdTabUrl = url } },
  runtime: {},
}
w.fetch = (url, opts) => {
  calls.push({ url, opts })
  if (url.endsWith('/funding/sessions')) return Promise.resolve({ json: () => Promise.resolve({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' }) })
  if (url.match(/\/wallet\/w1$/)) return Promise.resolve({ json: () => Promise.resolve({ balance: 12.5 }) })
  return Promise.resolve({ json: () => Promise.resolve({}) })
}
w.eval(popupJs)

// drive: open fund → card
await new Promise((r) => w.setTimeout(r, 30))
w.document.getElementById('bal').click()
w.document.querySelector('.card').click()
await new Promise((r) => w.setTimeout(r, 60))

let pass = true
const sessionCall = calls.find((c) => c.url.endsWith('/funding/sessions'))
if (!sessionCall) { console.log('❌ did not POST /funding/sessions'); pass = false }
else {
  const body = JSON.parse(sessionCall.opts.body)
  if (body.walletId !== 'w1' || !(body.amount > 0)) { console.log('❌ bad session body', body); pass = false }
}
if (createdTabUrl !== 'https://stripe/cs_1') { console.log('❌ did not open Checkout tab, got', createdTabUrl); pass = false }
console.log(pass ? '✅ funding: POST session + opened Checkout tab' : '')
process.exit(pass ? 0 : 1)
```

- [ ] **Step 2: Add the script + run**

In `chance-extension/package.json` scripts add: `"test:funding": "node test/funding.mjs"`.
Run: `cd chance-extension && node test/funding.mjs`
Expected: `✅ funding: POST session + opened Checkout tab`.

- [ ] **Step 3: Commit**
```bash
git add chance-extension/test/funding.mjs chance-extension/package.json
git commit -m "test(ext): jsdom test for card-funding API call + Checkout open"
```

---

## Task 9: Runbook + end-to-end verification

**Files:**
- Create: `packages/api/CHANCE_FUNDING.md`

- [ ] **Step 1: Write the runbook**

`packages/api/CHANCE_FUNDING.md`:
```md
# Chance wallet funding — run & test (Stripe test mode)

## Env (`packages/api/.env`)
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — test Supabase project (migration 001 + 004 applied)
- `STRIPE_SECRET_KEY` = `sk_test_...`
- `STRIPE_WEBHOOK_SECRET` = from `stripe listen` (below)
- `CHANCE_ANON_USER_ID` = `00000000-0000-0000-0000-0000000000a1`

## Run
1. `cd packages/api && npm run dev` (port 3000)
2. `stripe listen --forward-to localhost:3000/api/v1/chance/funding/webhook`
   - copy the `whsec_...` into `STRIPE_WEBHOOK_SECRET`, restart the server
3. Extension: set `chance-extension/config.js` `CHANCE_API_BASE` to `http://localhost:3000/api/v1/chance`, reload the unpacked extension

## E2E
1. Popup → balance → "Add $25 · pay with card" → Stripe Checkout opens
2. Pay with test card `4242 4242 4242 4242`, any future expiry/CVC
3. `stripe listen` shows `checkout.session.completed` forwarded → 200
4. Reopen the popup → balance shows **$25.00** (from `GET /wallet/:id`)
5. Re-trigger the same event (`stripe events resend <id>`) → balance still $25.00 (idempotent)
```

- [ ] **Step 2: Full backend test run**

Run: `cd packages/api && npm test`
Expected: all suites green (walletStore, fundingService, chance routes + webhook).

- [ ] **Step 3: Manual E2E once (per runbook)** — confirm balance reflects a test-card payment and a resent event does not double-credit.

- [ ] **Step 4: Commit**
```bash
git add packages/api/CHANCE_FUNDING.md
git commit -m "docs(api): chance funding runbook (stripe test mode E2E)"
```

---

## Self-Review notes (addressed)

- **Spec coverage:** wallet model (shared ledger via `wallets`/`transactions`) ✓ (Tasks 1–2); Approach A hosted Checkout ✓ (Task 3); idempotent `credit_wallet` ✓ (Task 1); device-wallet identity ✓ (`POST /wallet`, Task 4/7); extension live balance ✓ (Task 7); test-mode + Stripe CLI ✓ (Task 9). Round-up wager already shipped in the demo (out of scope for this backend slice; it draws stake from the funded balance in the later bet-execution slice).
- **Deviation:** `chance_funding_sessions` replaces `coverpay_sessions` (B2B `business_id` requirement) — documented at top.
- **Type consistency:** `creditWallet`/`getWallet`/`startFunding`/`handleWebhookEvent` signatures match across Tasks 2–6; money is dollars at the API edge, cents internally throughout.
- **Out of scope (unchanged):** auth UI, cash-out, bet settlement, KYC, real money, Connect/Treasury.
