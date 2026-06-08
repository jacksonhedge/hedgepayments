# Hedge Link — Token Handshake (Slice 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Slice 0's stubbed token with a real handshake — `@hedge/api` mints a short-lived, single-use, scoped `link_token`; the iframe app exchanges it on `INIT` for the session config, or exits with `INVALID_LINK_TOKEN`.

**Architecture:** A `link_sessions` Supabase table (migration `005`). `@hedge/api` gets `linkStore` (Supabase data access) + `linkRouter` (`POST /v1/link/sessions` behind `X-Hedge-Key`, `POST /v1/link/sessions/:token/exchange`). `packages/link`'s app gains `linkClient.exchangeToken` + a testable `handleInit` that the iframe `main.tsx` calls — exchange success → mount flow; failure → `bridge.exit(INVALID_LINK_TOKEN)`.

**Tech Stack:** TypeScript, Express, Supabase (`@supabase/supabase-js`), Jest (api), Vitest (link), Postgres (migration + local verify harness).

**Spec:** `docs/superpowers/specs/2026-06-08-hedge-link-token-handshake-design.md`

**Deploy note:** all buildable + unit-testable locally (Supabase mocked in unit tests; the migration round-trip uses the existing local-Postgres harness). Applying `005` to a real Supabase + the `js.hedgepayments.com` deploy are later gates.

---

## File Structure
```
supabase/migrations/005_link_sessions.sql        link_sessions table
supabase/verify-migrations.sh                     extend: apply 005 + round-trip
packages/api/src/config/index.ts                  add config.hedge.linkKey
packages/api/src/services/linkStore.ts            createSession + exchange (Supabase)
packages/api/src/services/__tests__/linkStore.test.ts
packages/api/src/routes/link.ts                   mint + exchange router
packages/api/src/routes/__tests__/link.test.ts
packages/api/src/index.ts                          mount /api/v1/link
packages/link/src/app/linkClient.ts               exchangeToken(token)
packages/link/src/app/linkClient.test.ts
packages/link/src/app/init.ts                      handleInit(root, init, bridge, deps)
packages/link/src/app/init.test.ts
packages/link/src/app/main.tsx                     wire handleInit
```

---

## Task 1: DB migration — `link_sessions`

**Files:**
- Create: `supabase/migrations/005_link_sessions.sql`

- [ ] **Step 1: Write the migration**
```sql
-- Hedge Link sessions: short-lived, single-use, scoped tokens for the drop-in handshake.
CREATE TABLE IF NOT EXISTS link_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  product TEXT NOT NULL,
  env TEXT NOT NULL DEFAULT 'sandbox',
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'opened', 'consumed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  opened_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_link_sessions_token ON link_sessions(token);
```

- [ ] **Step 2: Quick validity check** (no real DB needed)
Run: `grep -c "link_sessions" supabase/migrations/005_link_sessions.sql`
Expected: ≥ 3. (Live apply is verified by the harness in Task 6.)

- [ ] **Step 3: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add supabase/migrations/005_link_sessions.sql && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(db): link_sessions table for Hedge Link token handshake

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `@hedge/api` config + `linkStore`

**Files:**
- Modify: `packages/api/src/config/index.ts`
- Create: `packages/api/src/services/linkStore.ts`
- Test: `packages/api/src/services/__tests__/linkStore.test.ts`

- [ ] **Step 1: Add config** — in `packages/api/src/config/index.ts`, add a `hedge` block as a sibling key inside the exported `config` object (next to the existing `stripe`/`chance` blocks):
```ts
  // Hedge Link
  hedge: {
    linkKey: process.env.HEDGE_LINK_KEY || '',
  },
```

- [ ] **Step 2: Write the failing test** — `packages/api/src/services/__tests__/linkStore.test.ts`
```ts
jest.mock('../../lib/supabase', () => ({ supabase: { from: jest.fn() } }));
import { supabase } from '../../lib/supabase';
import { createSession, exchange } from '../linkStore';

const mocked = supabase as unknown as { from: jest.Mock };

describe('linkStore.createSession', () => {
  it('inserts a pending session and returns a token + expiry', async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    mocked.from.mockReturnValue({ insert });
    const res = await createSession({ product: 'chance', config: { amount: 85 } });
    expect(res.token).toMatch(/^lt_/);
    expect(new Date(res.expiresAt).getTime()).toBeGreaterThan(Date.now());
    const row = insert.mock.calls[0][0][0];
    expect(row.product).toBe('chance');
    expect(row.status).toBe('pending');
    expect(row.token).toBe(res.token);
  });
});

describe('linkStore.exchange', () => {
  function selectReturning(data: any) {
    return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data, error: data ? null : { message: 'no rows' } }) }) }) };
  }
  it('returns config for a valid pending session and marks it opened', async () => {
    const update = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) });
    const future = new Date(Date.now() + 60000).toISOString();
    mocked.from
      .mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: { amount: 85 }, env: 'sandbox', status: 'pending', expires_at: future }))
      .mockReturnValueOnce({ update });
    const res = await exchange('lt_x');
    expect(res).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ status: 'opened' }));
  });
  it('returns null for an expired session', async () => {
    const past = new Date(Date.now() - 60000).toISOString();
    mocked.from.mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: {}, env: 'sandbox', status: 'pending', expires_at: past }));
    expect(await exchange('lt_x')).toBeNull();
  });
  it('returns null for a consumed session', async () => {
    const future = new Date(Date.now() + 60000).toISOString();
    mocked.from.mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: {}, env: 'sandbox', status: 'consumed', expires_at: future }));
    expect(await exchange('lt_x')).toBeNull();
  });
  it('returns null for an unknown token', async () => {
    mocked.from.mockReturnValueOnce(selectReturning(null));
    expect(await exchange('nope')).toBeNull();
  });
});
```

- [ ] **Step 3: Run, verify FAIL**
Run: `cd packages/api && npx jest linkStore`
Expected: FAIL ("Cannot find module '../linkStore'").

- [ ] **Step 4: Implement** — `packages/api/src/services/linkStore.ts`
```ts
import { supabase } from '../lib/supabase';

const TTL_MS = 30 * 60 * 1000;

function genToken(): string {
  let s = '';
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 36).toString(36);
  return 'lt_' + s;
}

export interface NewSession { product: string; config?: Record<string, unknown>; env?: string }

export async function createSession(input: NewSession): Promise<{ token: string; expiresAt: string }> {
  const token = genToken();
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
  const { error } = await supabase.from('link_sessions').insert([
    { token, product: input.product, config: input.config || {}, env: input.env || 'sandbox', status: 'pending', expires_at: expiresAt },
  ]);
  if (error) throw new Error(`createSession failed: ${error.message}`);
  return { token, expiresAt };
}

export async function exchange(token: string): Promise<{ product: string; config: any; env: string } | null> {
  const { data, error } = await supabase
    .from('link_sessions')
    .select('id, product, config, env, status, expires_at')
    .eq('token', token)
    .single();
  if (error || !data) return null;
  if (data.status === 'consumed') return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;
  if (data.status === 'pending') {
    await supabase.from('link_sessions').update({ status: 'opened', opened_at: new Date().toISOString() }).eq('token', token);
  }
  return { product: data.product, config: data.config, env: data.env };
}
```

- [ ] **Step 5: Run, verify PASS**
Run: `cd packages/api && npx jest linkStore` → expect 5 passing. Then `npm run build` → tsc exit 0.

- [ ] **Step 6: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/api/src/config/index.ts packages/api/src/services/linkStore.ts packages/api/src/services/__tests__/linkStore.test.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(api): linkStore (createSession + exchange) + config.hedge.linkKey + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `@hedge/api` link router + mount

**Files:**
- Create: `packages/api/src/routes/link.ts`
- Test: `packages/api/src/routes/__tests__/link.test.ts`
- Modify: `packages/api/src/index.ts`

- [ ] **Step 1: Write the failing test** — `packages/api/src/routes/__tests__/link.test.ts`
```ts
jest.mock('../../lib/supabase', () => ({ supabase: {} }));
jest.mock('../../services/linkStore');
jest.mock('../../config', () => ({ config: { hedge: { linkKey: 'test-key' } } }));
import express from 'express';
import request from 'supertest';
import * as linkStore from '../../services/linkStore';
import { linkRouter } from '../link';

function app() { const a = express(); a.use(express.json()); a.use('/api/v1/link', linkRouter); return a; }

describe('link router', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /sessions rejects a wrong X-Hedge-Key', async () => {
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'nope').send({ product: 'chance' });
    expect(res.status).toBe(401);
  });
  it('POST /sessions rejects a missing product', async () => {
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'test-key').send({});
    expect(res.status).toBe(400);
  });
  it('POST /sessions mints a token', async () => {
    (linkStore.createSession as jest.Mock).mockResolvedValue({ token: 'lt_1', expiresAt: '2030-01-01T00:00:00Z' });
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'test-key').send({ product: 'chance', config: { amount: 85 } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ link_token: 'lt_1', expires_at: '2030-01-01T00:00:00Z' });
  });
  it('POST /sessions/:token/exchange returns config on success', async () => {
    (linkStore.exchange as jest.Mock).mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
    const res = await request(app()).post('/api/v1/link/sessions/lt_1/exchange').send();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
  });
  it('POST /sessions/:token/exchange 410s on an invalid token', async () => {
    (linkStore.exchange as jest.Mock).mockResolvedValue(null);
    const res = await request(app()).post('/api/v1/link/sessions/bad/exchange').send();
    expect(res.status).toBe(410);
    expect(res.body.error_code).toBe('INVALID_LINK_TOKEN');
  });
});
```

- [ ] **Step 2: Run, verify FAIL**
Run: `cd packages/api && npx jest routes/link` → FAIL ("Cannot find module '../link'").

- [ ] **Step 3: Implement** — `packages/api/src/routes/link.ts`
```ts
import { Router, Request, Response } from 'express';
import * as linkStore from '../services/linkStore';
import { config } from '../config';
import { logger } from '../utils/logger';

export const linkRouter = Router();

linkRouter.post('/sessions', async (req: Request, res: Response) => {
  if (!config.hedge.linkKey || req.header('x-hedge-key') !== config.hedge.linkKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { product, config: cfg, env } = req.body || {};
  if (!product) return res.status(400).json({ error: 'product required' });
  try {
    const s = await linkStore.createSession({ product, config: cfg, env });
    res.json({ link_token: s.token, expires_at: s.expiresAt });
  } catch (e: any) { logger.error('link session create failed', { e: e.message }); res.status(500).json({ error: 'could not create session' }); }
});

linkRouter.post('/sessions/:token/exchange', async (req: Request, res: Response) => {
  const result = await linkStore.exchange(req.params.token);
  if (!result) return res.status(410).json({ error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' });
  res.json(result);
});
```

- [ ] **Step 4: Mount it** — in `packages/api/src/index.ts`, add near the other route imports `import { linkRouter } from './routes/link';` and, next to `app.use('/api/v1/chance', chanceRouter);`, add:
```ts
app.use('/api/v1/link', linkRouter);
```

- [ ] **Step 5: Run, verify PASS + build**
Run: `cd packages/api && npx jest routes/link` → 5 passing. Then `npm run build` → tsc exit 0.

- [ ] **Step 6: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/api/src/routes/link.ts packages/api/src/routes/__tests__/link.test.ts packages/api/src/index.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(api): link router (mint + exchange) mounted at /api/v1/link + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `packages/link` — `exchangeToken` client

**Files:**
- Create: `packages/link/src/app/linkClient.ts`
- Test: `packages/link/src/app/linkClient.test.ts`

- [ ] **Step 1: Write the failing test** — `packages/link/src/app/linkClient.test.ts`
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exchangeToken } from './linkClient'

beforeEach(() => { (window as any).__HEDGE_LINK_API_BASE = 'http://api.test/api/v1/link' })

describe('exchangeToken', () => {
  it('POSTs to the exchange endpoint and returns the session on 200', async () => {
    const calls: any[] = []
    ;(globalThis as any).fetch = (url: string, opts: any) => { calls.push({ url, opts }); return Promise.resolve({ ok: true, json: () => Promise.resolve({ product: 'chance', config: { amount: 85 }, env: 'sandbox' }) }) }
    const s = await exchangeToken('lt_1')
    expect(calls[0].url).toBe('http://api.test/api/v1/link/sessions/lt_1/exchange')
    expect(calls[0].opts.method).toBe('POST')
    expect(s).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
  })
  it('throws INVALID_LINK_TOKEN on a non-200', async () => {
    ;(globalThis as any).fetch = () => Promise.resolve({ ok: false, status: 410, json: () => Promise.resolve({ error_code: 'INVALID_LINK_TOKEN' }) })
    await expect(exchangeToken('bad')).rejects.toMatchObject({ error_code: 'INVALID_LINK_TOKEN' })
  })
})
```

- [ ] **Step 2: Run, verify FAIL**
Run: `cd packages/link && npx vitest run linkClient` → FAIL (module not found).

- [ ] **Step 3: Implement** — `packages/link/src/app/linkClient.ts`
```ts
export interface LinkSession { product: string; config: Record<string, unknown>; env: string }

function apiBase(): string {
  return (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_API_BASE) || 'https://api.hedgepayments.com/api/v1/link'
}

export async function exchangeToken(token: string): Promise<LinkSession> {
  const res = await fetch(apiBase() + '/sessions/' + encodeURIComponent(token) + '/exchange', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
  if (!res.ok) {
    const err: any = new Error('INVALID_LINK_TOKEN')
    err.error_code = 'INVALID_LINK_TOKEN'
    throw err
  }
  return res.json()
}
```

- [ ] **Step 4: Run, verify PASS**
Run: `cd packages/link && npx vitest run linkClient` → 2 passing.

- [ ] **Step 5: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/app/linkClient.ts packages/link/src/app/linkClient.test.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): exchangeToken client (POST exchange, INVALID_LINK_TOKEN on non-200) + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: `packages/link` — `handleInit` + wire `main.tsx`

**Files:**
- Create: `packages/link/src/app/init.ts`
- Test: `packages/link/src/app/init.test.ts`
- Modify: `packages/link/src/app/main.tsx`

- [ ] **Step 1: Write the failing test** — `packages/link/src/app/init.test.ts`
```ts
import { describe, it, expect, vi } from 'vitest'
import { handleInit } from './init'

function fakeBridge() { return { emit: vi.fn(), success: vi.fn(), exit: vi.fn() } }

describe('handleInit', () => {
  it('on a valid token: emits OPEN and mounts the flow with the session config', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const root = document.createElement('div')
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
    await handleInit(root, { token: 'lt_1' }, bridge as any, { exchange, mount })
    expect(bridge.emit).toHaveBeenCalledWith('OPEN')
    expect(mount).toHaveBeenCalledWith(root, expect.objectContaining({ config: { amount: 85 } }))
    expect(bridge.exit).not.toHaveBeenCalled()
  })
  it('on an invalid token: exits with INVALID_LINK_TOKEN and does not mount', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const err: any = new Error('bad'); err.error_code = 'INVALID_LINK_TOKEN'
    const exchange = vi.fn().mockRejectedValue(err)
    await handleInit(document.createElement('div'), { token: 'bad' }, bridge as any, { exchange, mount })
    expect(mount).not.toHaveBeenCalled()
    expect(bridge.exit).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_LINK_TOKEN', error_type: 'LINK_ERROR' }))
  })
})
```

- [ ] **Step 2: Run, verify FAIL**
Run: `cd packages/link && npx vitest run init` → FAIL (module not found).

- [ ] **Step 3: Implement** — `packages/link/src/app/init.ts`
```ts
import type { LinkSession } from './linkClient'

export interface InitDeps {
  exchange: (token: string) => Promise<LinkSession>
  mount: (root: HTMLElement, ctx: any) => void
}
export interface InitBridge {
  emit: (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit: (error?: any) => void
}

export async function handleInit(
  root: HTMLElement,
  init: { token: string },
  bridge: InitBridge,
  deps: InitDeps,
): Promise<void> {
  try {
    const session = await deps.exchange(init.token)
    bridge.emit('OPEN')
    deps.mount(root, {
      token: init.token,
      config: session.config,
      emit: (n: string, x?: Record<string, unknown>) => bridge.emit(n, x),
      success: (r: unknown) => bridge.success(r),
      exit: (e?: any) => bridge.exit(e),
    })
  } catch (e: any) {
    bridge.exit({
      error_type: 'LINK_ERROR',
      error_code: (e && e.error_code) || 'INVALID_LINK_TOKEN',
      error_message: String((e && e.message) || e),
    })
  }
}
```

- [ ] **Step 4: Wire `main.tsx`** — replace `packages/link/src/app/main.tsx` with:
```tsx
import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'
import { exchangeToken } from './linkClient'
import { handleInit } from './init'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    handleInit(root, init, bridge, { exchange: exchangeToken, mount: mountHello })
  },
})
bridge.start()
```

- [ ] **Step 5: Run the FULL link suite + build**
Run: `cd packages/link && npx vitest run` → all pass (protocol, loader, appBridge, hello, linkClient, init). Then `npm run build` → emits `dist/loader/link.js` + `dist/app/index.html` (confirm: `test -f dist/loader/link.js && test -f dist/app/index.html && echo OK`).

- [ ] **Step 6: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/app/init.ts packages/link/src/app/init.test.ts packages/link/src/app/main.tsx && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): exchange token on INIT (handleInit) -> mount flow or EXIT(INVALID_LINK_TOKEN)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Extend the migration harness for `005`

**Files:**
- Modify: `supabase/verify-migrations.sh`

- [ ] **Step 1: Add the 005 apply + round-trip** — in `supabase/verify-migrations.sh`, after the line that applies `004` (`…/migrations/004_chance_funding.sql … || fail "004 did not apply"`), add:
```bash
"${PSQL[@]}" -f "$HERE/migrations/005_link_sessions.sql" >/dev/null || fail "005 did not apply"
echo "✅ migration 005 applies"

# link_sessions round-trip: insert a pending session and read it back
"${PSQL[@]}" -c "INSERT INTO link_sessions (token, product, env, expires_at) VALUES ('lt_verify', 'chance', 'sandbox', NOW() + INTERVAL '30 minutes');" >/dev/null || fail "link_sessions insert failed"
ls_status=$("${PSQL[@]}" -c "SELECT status FROM link_sessions WHERE token='lt_verify';")
[ "$ls_status" = "pending" ] || fail "link_sessions status should be 'pending' (got '$ls_status')"
echo "✅ link_sessions round-trip: pending"
```

- [ ] **Step 2: Run the harness** (skips cleanly if Postgres isn't installed)
Run: `cd ~/Projects/HedgePayments/website && bash supabase/verify-migrations.sh; echo "exit=$?"`
Expected (if Postgres 17 is installed): the existing checks PLUS `✅ migration 005 applies` and `✅ link_sessions round-trip: pending`, exit 0. (If Postgres isn't installed it prints the skip line and exits 0 — that's fine.)

- [ ] **Step 3: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add supabase/verify-migrations.sh && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "test(db): verify-migrations applies 005 + link_sessions round-trip

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review notes (addressed)

- **Spec coverage:** `link_sessions` table ✓ (Task 1); `linkStore.createSession`/`exchange` with single-use/idempotent/expiry semantics ✓ (Task 2); `POST /sessions` behind `X-Hedge-Key` + `POST /sessions/:token/exchange` → 410 INVALID_LINK_TOKEN ✓ (Task 3); `config.hedge.linkKey` ✓ (Task 2); app `exchangeToken` ✓ (Task 4); exchange-on-INIT → mount or `EXIT(INVALID_LINK_TOKEN)` (closes the Slice-0 gap) ✓ (Task 5); harness 005 round-trip ✓ (Task 6).
- **Type consistency:** `createSession`/`exchange`/`NewSession`/`LinkSession`/`exchangeToken`/`handleInit`/`InitDeps`/`InitBridge` names match across Tasks 2–5; the exchange response shape `{product, config, env}` is identical in api + app.
- **Placeholder scan:** none — every step has real code/commands.
- **Out of scope (unchanged):** per-merchant API keys, product config schemas, consume-on-success, the deploy.
