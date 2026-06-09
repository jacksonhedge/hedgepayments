# Hedge Link — Slice 2: Chance Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Chance flow into the Hedge Link shell as a Preact `mountFlow` — intro → config sliders → market selection → atomic server consume → simulated settlement → result — so the merchant's `onSuccess` fires with a real bet result.

**Architecture:** Approach B sub-directory: `engine.ts` (pure odds/market functions), `Chance.tsx` (Preact component, 5 views), `index.ts` (mount entry). The `FlowCtx` interface gains a `consume()` method injected by `main.tsx` and backed by a new `POST /sessions/:token/consume` endpoint that uses an atomic `UPDATE … WHERE status <> 'consumed' RETURNING` to prevent double-spend.

**Tech Stack:** Preact 10, vitest, @testing-library/preact, jest + supertest (API), Supabase JS v2, TypeScript.

---

## File Map

**New files:**
```
supabase/migrations/006_link_consume_result.sql
packages/link/src/app/flows/flowCtx.ts          ← shared FlowCtx interface (moved from hello.ts)
packages/link/src/app/flows/chance/engine.ts
packages/link/src/app/flows/chance/engine.test.ts
packages/link/src/app/flows/chance/Chance.tsx
packages/link/src/app/flows/chance/Chance.test.tsx
packages/link/src/app/flows/chance/index.ts
```

**Modified files:**
```
packages/link/src/app/flows/hello.ts             re-export FlowCtx from flowCtx.ts; no logic change
packages/link/src/app/init.ts                    add consumeFn to InitDeps; pass consume into ctx
packages/link/src/app/init.test.ts               add consume injection assertion
packages/link/src/app/linkClient.ts              add ConsumeConflictError + consumeSession()
packages/link/src/app/linkClient.test.ts         add consumeSession tests
packages/link/src/app/main.tsx                   inject consumeSession; dispatch on product
packages/api/src/services/linkStore.ts           add consumeOnSuccess()
packages/api/src/services/__tests__/linkStore.test.ts  add consumeOnSuccess tests
packages/api/src/routes/link.ts                  add POST /sessions/:token/consume
packages/api/src/routes/__tests__/link.test.ts   add consume route tests
supabase/verify-migrations.sh                    extend for migration 006
```

---

## Task 1: Migration 006 — add `consume_result` column

**Files:**
- Create: `supabase/migrations/006_link_consume_result.sql`

- [ ] **Create the migration file**

```sql
-- supabase/migrations/006_link_consume_result.sql
ALTER TABLE link_sessions
  ADD COLUMN IF NOT EXISTS consume_result JSONB;
```

- [ ] **Apply the migration to the local Postgres harness**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website
psql "$DATABASE_URL" -f supabase/migrations/006_link_consume_result.sql
```

Expected: `ALTER TABLE`

- [ ] **Verify the column exists**

```bash
psql "$DATABASE_URL" -c "\d link_sessions" | grep consume_result
```

Expected: `consume_result | jsonb`

- [ ] **Commit**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add supabase/migrations/006_link_consume_result.sql
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "chore: migration 006 — add consume_result to link_sessions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: `linkStore.consumeOnSuccess` — API service (TDD)

**Files:**
- Modify: `packages/api/src/services/linkStore.ts`
- Modify: `packages/api/src/services/__tests__/linkStore.test.ts`

- [ ] **Add the failing tests** — append to `linkStore.test.ts`

```typescript
describe('linkStore.consumeOnSuccess', () => {
  function updateReturning(data: any) {
    const single = jest.fn().mockResolvedValue({ data, error: data ? null : { message: 'no rows' } });
    const select = jest.fn().mockReturnValue({ single });
    const neq = jest.fn().mockReturnValue({ select });
    const eq = jest.fn().mockReturnValue({ neq });
    const update = jest.fn().mockReturnValue({ eq });
    return { update, eq, neq, select, single };
  }

  it('returns { id } on a successful first consume', async () => {
    const chain = updateReturning({ id: 'uuid-1' });
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_x', { won: true });
    expect(result).toEqual({ id: 'uuid-1' });
    expect(chain.neq).toHaveBeenCalledWith('status', 'consumed');
  });

  it('returns null when 0 rows updated (already consumed)', async () => {
    const chain = updateReturning(null);
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_x', { won: false });
    expect(result).toBeNull();
  });

  it('returns null for an unknown token', async () => {
    const chain = updateReturning(null);
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_unknown', { won: true });
    expect(result).toBeNull();
  });
});
```

Also add `consumeOnSuccess` to the import at the top of the test file:
```typescript
import { createSession, exchange, consumeOnSuccess } from '../linkStore';
```

- [ ] **Run the tests to confirm they fail**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/api
npx jest --testPathPattern=linkStore --no-coverage 2>&1 | tail -20
```

Expected: `consumeOnSuccess is not a function` or similar failure.

- [ ] **Implement `consumeOnSuccess` in `linkStore.ts`** — append after `exchange`:

```typescript
export async function consumeOnSuccess(
  token: string,
  result: unknown,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('link_sessions')
    .update({
      status: 'consumed',
      consumed_at: new Date().toISOString(),
      consume_result: result,
    })
    .eq('token', token)
    .neq('status', 'consumed')
    .select('id')
    .single();
  if (error || !data) return null;
  return { id: data.id };
}
```

- [ ] **Run the tests to confirm they pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/api
npx jest --testPathPattern=linkStore --no-coverage 2>&1 | tail -10
```

Expected: all linkStore tests pass.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/api/src/services/linkStore.ts \
      packages/api/src/services/__tests__/linkStore.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(api): add linkStore.consumeOnSuccess — atomic single-use burn

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Consume route — `POST /sessions/:token/consume` (TDD)

**Files:**
- Modify: `packages/api/src/routes/link.ts`
- Modify: `packages/api/src/routes/__tests__/link.test.ts`

- [ ] **Add the failing tests** — append to `link.test.ts`

Add `consumeOnSuccess` to the mock at the top of the file. Replace:
```typescript
jest.mock('../../services/linkStore');
```
with (it's already there — just note that `consumeOnSuccess` will be auto-mocked).

Append these tests inside the existing `describe('link router')` block:

```typescript
  it('POST /sessions/:token/consume returns 200 { ok: true } on success', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue({ id: 'uuid-1' });
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_1/consume')
      .send({ result: { won: true } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(linkStore.consumeOnSuccess).toHaveBeenCalledWith('lt_1', { won: true });
  });

  it('POST /sessions/:token/consume returns 409 when already consumed', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue(null);
    // simulate: row exists but status=consumed → selectStatus returns 'consumed'
    (linkStore.selectStatus as jest.Mock).mockResolvedValue('consumed');
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_1/consume')
      .send({ result: { won: false } });
    expect(res.status).toBe(409);
    expect(res.body.error_code).toBe('ALREADY_CONSUMED');
  });

  it('POST /sessions/:token/consume returns 410 when token invalid/expired', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue(null);
    (linkStore.selectStatus as jest.Mock).mockResolvedValue(null);
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_bad/consume')
      .send({ result: { won: false } });
    expect(res.status).toBe(410);
    expect(res.body.error_code).toBe('INVALID_LINK_TOKEN');
  });
```

- [ ] **Run tests to confirm they fail**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/api
npx jest --testPathPattern="routes/__tests__/link" --no-coverage 2>&1 | tail -15
```

Expected: failures on the three new consume tests.

- [ ] **Add `selectStatus` helper to `linkStore.ts`** — append after `consumeOnSuccess`:

```typescript
export async function selectStatus(token: string): Promise<string | null> {
  const { data } = await supabase
    .from('link_sessions')
    .select('status')
    .eq('token', token)
    .single();
  return data?.status ?? null;
}
```

- [ ] **Add the consume route to `link.ts`** — append inside `linkRouter`:

```typescript
linkRouter.post('/sessions/:token/consume', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { result } = req.body || {};
  const consumed = await linkStore.consumeOnSuccess(token, result ?? null);
  if (!consumed) {
    const status = await linkStore.selectStatus(token);
    if (status === 'consumed') {
      return res.status(409).json({ error: 'already_consumed', error_code: 'ALREADY_CONSUMED' });
    }
    return res.status(410).json({ error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' });
  }
  res.json({ ok: true });
});
```

- [ ] **Run all API tests to confirm they pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/api
npx jest --no-coverage 2>&1 | tail -10
```

Expected: all pass (26 existing + 3 new consume + any linkStore tests).

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/api/src/services/linkStore.ts \
      packages/api/src/routes/link.ts \
      packages/api/src/routes/__tests__/link.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(api): POST /sessions/:token/consume — atomic single-use endpoint

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: `consumeSession` + `ConsumeConflictError` in `linkClient` (TDD)

**Files:**
- Modify: `packages/link/src/app/linkClient.ts`
- Modify: `packages/link/src/app/linkClient.test.ts`

- [ ] **Add the failing tests** — append to `linkClient.test.ts`

```typescript
import { exchangeToken, consumeSession, ConsumeConflictError } from './linkClient'

// (existing tests above unchanged)

describe('consumeSession', () => {
  it('resolves on 200', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) })
    await expect(consumeSession('lt_1', { won: true })).resolves.toBeUndefined()
  })

  it('throws ConsumeConflictError on 409', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ error_code: 'ALREADY_CONSUMED' }) })
    await expect(consumeSession('lt_1', { won: true })).rejects.toBeInstanceOf(ConsumeConflictError)
  })

  it('throws INVALID_LINK_TOKEN error on 410', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: false, status: 410, json: () => Promise.resolve({ error_code: 'INVALID_LINK_TOKEN' }) })
    await expect(consumeSession('lt_1', { won: false })).rejects.toMatchObject({ error_code: 'INVALID_LINK_TOKEN' })
  })

  it('POSTs to the correct endpoint with the result payload', async () => {
    const calls: any[] = []
    ;(globalThis as any).fetch = (url: string, opts: any) => {
      calls.push({ url, opts })
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) })
    }
    await consumeSession('lt_abc', { won: false, finalPrice: 49.99 })
    expect(calls[0].url).toBe('http://api.test/api/v1/link/sessions/lt_abc/consume')
    expect(calls[0].opts.method).toBe('POST')
    expect(JSON.parse(calls[0].opts.body)).toEqual({ result: { won: false, finalPrice: 49.99 } })
  })
})
```

- [ ] **Run tests to confirm they fail**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/linkClient.test.ts 2>&1 | tail -15
```

Expected: `ConsumeConflictError is not exported` or similar.

- [ ] **Implement in `linkClient.ts`** — append after `exchangeToken`:

```typescript
export class ConsumeConflictError extends Error {
  readonly error_code = 'ALREADY_CONSUMED'
  constructor(message = 'already_consumed') { super(message) }
}

export async function consumeSession(token: string, result: unknown): Promise<void> {
  const res = await fetch(
    apiBase() + '/sessions/' + encodeURIComponent(token) + '/consume',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ result }),
    },
  )
  if (res.status === 409) throw new ConsumeConflictError()
  if (!res.ok) {
    const err: any = new Error('INVALID_LINK_TOKEN')
    err.error_code = 'INVALID_LINK_TOKEN'
    throw err
  }
}
```

- [ ] **Run tests to confirm they pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/linkClient.test.ts 2>&1 | tail -10
```

Expected: all pass.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/linkClient.ts \
      packages/link/src/app/linkClient.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): consumeSession + ConsumeConflictError

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: `FlowCtx` + `init.ts` — add `consume` injection

**Files:**
- Create: `packages/link/src/app/flows/flowCtx.ts`
- Modify: `packages/link/src/app/flows/hello.ts`
- Modify: `packages/link/src/app/init.ts`
- Modify: `packages/link/src/app/init.test.ts`

- [ ] **Create `flowCtx.ts`** — shared interface, extracted from `hello.ts`:

```typescript
// packages/link/src/app/flows/flowCtx.ts
export interface FlowCtx {
  token: string
  config: Record<string, unknown>
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
  consume: (result: unknown) => Promise<void>
}
```

- [ ] **Update `hello.ts`** — re-export from `flowCtx.ts` instead of defining inline. Replace the existing `FlowCtx` interface definition with an import:

```typescript
export type { FlowCtx } from './flowCtx'
// (mountHello function below unchanged, but update its import of FlowCtx to use flowCtx.ts)
import type { FlowCtx } from './flowCtx'
```

The full updated `hello.ts`:

```typescript
import type { FlowCtx } from './flowCtx'
export type { FlowCtx } from './flowCtx'

export function mountHello(root: HTMLElement, ctx: FlowCtx): void {
  ctx.emit('TRANSITION_VIEW', { view: 'hello' })
  root.innerHTML =
    '<div style="padding:28px;text-align:center;font-family:system-ui">' +
    '<h2 style="margin:0 0 8px">Hedge Link</h2>' +
    '<p style="color:#667;margin:0 0 20px">Slice 0 shell — confirm to finish.</p>' +
    '<button data-act="confirm" style="padding:12px 20px;border:0;border-radius:10px;background:#0e9f6e;color:#fff;font-weight:700;cursor:pointer">Confirm →</button>' +
    '</div>'
  const btn = root.querySelector('button[data-act="confirm"]') as HTMLButtonElement
  btn.addEventListener('click', () => ctx.success({ flow: 'hello', confirmed: true }))
}
```

- [ ] **Update `init.ts`** — add `consumeFn` to `InitDeps` and inject `consume` into ctx:

```typescript
import type { LinkSession } from './linkClient'

export interface InitDeps {
  exchange:   (token: string) => Promise<LinkSession>
  consumeFn:  (token: string, result: unknown) => Promise<void>
  mount:      (root: HTMLElement, ctx: any) => void
}
export interface InitBridge {
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
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
      token:   init.token,
      config:  session.config,
      emit:    (n: string, x?: Record<string, unknown>) => bridge.emit(n, x),
      success: (r: unknown) => bridge.success(r),
      exit:    (e?: any) => bridge.exit(e),
      consume: (result: unknown) => deps.consumeFn(init.token, result),
    })
  } catch (e: any) {
    bridge.exit({
      error_type:    'LINK_ERROR',
      error_code:    (e && e.error_code) || 'INVALID_LINK_TOKEN',
      error_message: String((e && e.message) || e),
    })
  }
}
```

- [ ] **Update `init.test.ts`** — add `consumeFn` to `InitDeps` in the test helpers and assert it's injected:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { handleInit } from './init'

function fakeBridge() { return { emit: vi.fn(), success: vi.fn(), exit: vi.fn() } }
const noopConsume = vi.fn().mockResolvedValue(undefined)

describe('handleInit', () => {
  it('on a valid token: emits OPEN and mounts the flow with config + consume', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const root = document.createElement('div')
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
    await handleInit(root, { token: 'lt_1' }, bridge as any, { exchange, consumeFn: noopConsume, mount })
    expect(bridge.emit).toHaveBeenCalledWith('OPEN')
    expect(mount).toHaveBeenCalledWith(
      root,
      expect.objectContaining({ config: { amount: 85 }, consume: expect.any(Function) }),
    )
    expect(bridge.exit).not.toHaveBeenCalled()
  })

  it('consume in ctx delegates to deps.consumeFn with the session token', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const consumeFn = vi.fn().mockResolvedValue(undefined)
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: {}, env: 'sandbox' })
    await handleInit(document.createElement('div'), { token: 'lt_tok' }, bridge as any, { exchange, consumeFn, mount })
    const ctx = mount.mock.calls[0][1]
    await ctx.consume({ won: true })
    expect(consumeFn).toHaveBeenCalledWith('lt_tok', { won: true })
  })

  it('on an invalid token: exits with INVALID_LINK_TOKEN and does not mount', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const err: any = new Error('bad'); err.error_code = 'INVALID_LINK_TOKEN'
    const exchange = vi.fn().mockRejectedValue(err)
    await handleInit(document.createElement('div'), { token: 'bad' }, bridge as any, { exchange, consumeFn: noopConsume, mount })
    expect(mount).not.toHaveBeenCalled()
    expect(bridge.exit).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_LINK_TOKEN', error_type: 'LINK_ERROR' }))
  })
})
```

- [ ] **Run vitest to confirm all link tests pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run 2>&1 | tail -15
```

Expected: all existing tests still pass (the `consume` field is new; `hello` flow never calls it so existing tests are unaffected).

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/flows/flowCtx.ts \
      packages/link/src/app/flows/hello.ts \
      packages/link/src/app/init.ts \
      packages/link/src/app/init.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): FlowCtx.consume injection via init.ts InitDeps

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: `engine.ts` + `engine.test.ts` — pure Chance logic (TDD)

**Files:**
- Create: `packages/link/src/app/flows/chance/engine.ts`
- Create: `packages/link/src/app/flows/chance/engine.test.ts`

- [ ] **Write `engine.test.ts` first**

```typescript
// packages/link/src/app/flows/chance/engine.test.ts
import { describe, it, expect, vi } from 'vitest'
import {
  resolveEligibility,
  matchMarkets,
  calc,
  bounds,
  buildSeedCandidates,
  round2,
  clamp,
  oddsLabel,
  fmtExpiry,
  type Candidate,
} from './engine'

describe('resolveEligibility', () => {
  it('returns eligible=false for a blocked US state', () => {
    expect(resolveEligibility('US', 'WA')).toMatchObject({ eligible: false, reason: 'state-restricted' })
  })
  it('returns eligible=true for an allowed US state', () => {
    expect(resolveEligibility('US', 'CA')).toMatchObject({ eligible: true, venue: 'kalshi' })
  })
  it('returns eligible=false for a blocked country', () => {
    expect(resolveEligibility('RU', '')).toMatchObject({ eligible: false, reason: 'country-restricted' })
  })
  it('returns eligible=true + polymarket for an allowed non-US country', () => {
    expect(resolveEligibility('GB', '')).toMatchObject({ eligible: true, venue: 'polymarket' })
  })
  it('defaults to US-eligible when country is undefined', () => {
    expect(resolveEligibility(undefined, 'CA')).toMatchObject({ eligible: true })
  })
})

describe('matchMarkets', () => {
  const base: Candidate = { marketId: 'm1', question: 'Q?', outcome: 'Yes', venue: 'polymarket', price: 0.5, winProbPct: 50, resolves_at: null, liquidity: 1000, tags: [] }
  const candidates: Candidate[] = [
    { ...base, marketId: 'm1', price: 0.50, liquidity: 2000 },
    { ...base, marketId: 'm2', price: 0.48, liquidity: 1000 },
    { ...base, marketId: 'm3', price: 0.90, liquidity: 5000 }, // too far from 0.5/0.5 = 1.0
    { ...base, marketId: 'm4', price: 0.05, liquidity: 9000 }, // too far
  ]

  it('only returns markets within BAND (0.075) of target odds', () => {
    // risk=5, win=10 → p=0.5; candidates at 0.50 and 0.48 are within BAND; 0.90 and 0.05 are not
    const matches = matchMarkets(candidates, 5, 10)
    expect(matches.map(m => m.marketId)).toContain('m1')
    expect(matches.map(m => m.marketId)).toContain('m2')
    expect(matches.map(m => m.marketId)).not.toContain('m3')
    expect(matches.map(m => m.marketId)).not.toContain('m4')
  })

  it('sorts by closeness to target probability, then liquidity', () => {
    const matches = matchMarkets(candidates, 5, 10)
    expect(matches[0].marketId).toBe('m1') // closer (0.50 vs 0.48)
    expect(matches[1].marketId).toBe('m2')
  })

  it('caps at 12 results', () => {
    const many: Candidate[] = Array.from({ length: 20 }, (_, i) => ({ ...base, marketId: `m${i}`, price: 0.50 + i * 0.001 }))
    expect(matchMarkets(many, 5, 10).length).toBe(12)
  })
})

describe('calc', () => {
  it('computes correct chancePct, payToday for flip-to-free', () => {
    const result = calc(100, 10, 20, 'flip-to-free')
    expect(result.chancePct).toBe(50)   // 10/20 = 0.5
    expect(result.payToday).toBe(110)   // amount + risk
    expect(result.discountPct).toBe(20) // 20/100
  })
  it('payToday = amount for win-it-back mode', () => {
    const result = calc(100, 10, 20, 'win-it-back')
    expect(result.payToday).toBe(100)
  })
})

describe('bounds', () => {
  it('riskMax = 60% of amount, winMax = amount', () => {
    const b = bounds(100)
    expect(b.riskMax).toBe(60)
    expect(b.winMax).toBe(100)
    expect(b.riskMin).toBe(1)
    expect(b.winMin).toBe(15)
  })
})

describe('buildSeedCandidates', () => {
  it('returns a non-empty sorted array with valid price range', () => {
    const now = Date.now()
    const seeds = buildSeedCandidates(now)
    expect(seeds.length).toBeGreaterThan(0)
    seeds.forEach(s => {
      expect(s.price).toBeGreaterThan(0)
      expect(s.price).toBeLessThan(1)
      expect(new Date(s.resolves_at!).getTime()).toBeGreaterThan(now)
    })
    // sorted descending by price
    for (let i = 1; i < seeds.length; i++) {
      expect(seeds[i].price).toBeLessThanOrEqual(seeds[i - 1].price)
    }
  })
})

describe('helpers', () => {
  it('round2 rounds to 2 decimal places', () => {
    expect(round2(10.005)).toBe(10.01)
    expect(round2(3.14159)).toBe(3.14)
  })
  it('clamp clamps to [lo, hi]', () => {
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(-1, 1, 10)).toBe(1)
    expect(clamp(20, 1, 10)).toBe(10)
  })
  it('oddsLabel formats correctly', () => {
    expect(oddsLabel(0.5)).toBe('1.0:1')
    expect(oddsLabel(0.1)).toBe('9.0:1')
  })
})
```

- [ ] **Run tests to confirm they fail**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/chance/engine.test.ts 2>&1 | tail -10
```

Expected: `Cannot find module './engine'`

- [ ] **Create `engine.ts`**

```typescript
// packages/link/src/app/flows/chance/engine.ts

export interface Candidate {
  marketId: string
  question: string
  outcome: string
  venue: 'polymarket' | 'kalshi'
  price: number
  winProbPct: number
  resolves_at: string | null
  liquidity: number
  tags: string[]
  seed?: boolean
}

export interface Eligibility {
  eligible: boolean
  venue: 'kalshi' | 'polymarket' | null
  reason: string
}

const US_BLOCKED: Record<string, 1> = { WA: 1, ID: 1, NV: 1, MI: 1, AZ: 1, LA: 1, CT: 1, TN: 1 }
const INTL_BLOCKED: Record<string, 1> = { CU: 1, IR: 1, KP: 1, SY: 1, RU: 1 }
export const BAND = 0.075
const SHOW_CAP = 12
const GAMMA = 'https://gamma-api.polymarket.com'
const POLY_TAGS = ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'ufc', 'tennis', 'crypto']
const BLOCK_TAGS = ['politics', 'elections', 'politician']

const SEED_DATA: Array<[string, string, number, number, string[]]> = [
  ['p-lal', 'Lakers to beat the Celtics tonight?', 0.48, 5, ['sports']],
  ['p-ars', 'Arsenal to win their match this weekend?', 0.40, 40, ['sports']],
  ['p-eth', 'Will Ethereum flip $4,000 this week?', 0.31, 55, ['crypto']],
  ['p-btc', 'Will Bitcoin top $125k in June?', 0.20, 60, ['crypto']],
  ['p-sol', 'Will Solana flip $250 this month?', 0.13, 66, ['crypto']],
  ['p-spx', 'Will SpaceX launch Starship this week?', 0.09, 70, ['space']],
]

export function round2(n: number): number { return Math.round(n * 100) / 100 }
export function clamp(n: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, n)) }

export function oddsLabel(p: number): string {
  if (p <= 0 || p >= 1) return '—'
  const x = (1 - p) / p
  return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1'
}

export function resolveEligibility(country?: string, region?: string): Eligibility {
  const c = (country || 'US').toUpperCase()
  const r = (region || '').toUpperCase()
  if (c === 'US') {
    if (US_BLOCKED[r]) return { eligible: false, venue: null, reason: 'state-restricted' }
    return { eligible: true, venue: 'kalshi', reason: 'ok' }
  }
  if (INTL_BLOCKED[c]) return { eligible: false, venue: null, reason: 'country-restricted' }
  return { eligible: true, venue: 'polymarket', reason: 'ok' }
}

export function matchMarkets(candidates: Candidate[], risk: number, win: number): Candidate[] {
  const p = clamp(risk / win, 0.01, 0.97)
  return candidates
    .filter(c => Math.abs(c.price - p) <= BAND)
    .sort((a, b) => Math.abs(a.price - p) - Math.abs(b.price - p) || b.liquidity - a.liquidity)
    .slice(0, SHOW_CAP)
}

export function bounds(amount: number) {
  return {
    riskMin: 1,
    riskMax: Math.max(5, Math.round(amount * 0.6)),
    winMin:  Math.max(2, Math.round(amount * 0.15)),
    winMax:  amount,
  }
}

export function calc(
  amount: number,
  risk: number,
  win: number,
  mode: 'flip-to-free' | 'win-it-back',
) {
  const p = clamp(risk / win, 0.01, 0.97)
  return {
    p,
    chancePct:   Math.round(p * 100),
    odds:        oddsLabel(p),
    discountPct: Math.round((win / amount) * 100),
    payToday:    mode === 'flip-to-free' ? round2(amount + risk) : amount,
  }
}

export function buildSeedCandidates(now: number): Candidate[] {
  return SEED_DATA.map(([marketId, question, price, hours, tags]) => ({
    marketId,
    question,
    outcome: 'Yes',
    venue: 'polymarket' as const,
    price,
    winProbPct: Math.round(price * 100),
    resolves_at: new Date(now + hours * 3600000).toISOString(),
    liquidity: 5000,
    tags,
    seed: true,
  })).sort((a, b) => b.price - a.price)
}

export function fmtExpiry(iso: string | null): string {
  if (!iso) return ''
  const ms = Date.parse(iso) - Date.now()
  if (!(ms > 0)) return 'ending soon'
  const h = ms / 3600000
  if (h < 1)    return 'ends in <1h'
  if (h < 24)   return 'ends in ' + Math.round(h) + 'h'
  const d = new Date(iso)
  if (h < 24 * 7) return 'ends ' + d.toLocaleDateString(undefined, { weekday: 'short' })
  return 'ends ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function parseArr(s: string | null): string[] | null {
  if (!s) return null
  try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : null } catch { return null }
}

export async function fetchPolymarketCandidates(now: number): Promise<Candidate[]> {
  const out: Candidate[] = []
  const seen: Record<string, 1> = {}
  await Promise.all(POLY_TAGS.map(async tag => {
    try {
      const r = await fetch(GAMMA + '/events?closed=false&active=true&limit=40&tag_slug=' + tag, {
        headers: { accept: 'application/json' },
      })
      if (!r.ok) return
      const events: any[] = (await r.json()) || []
      for (const ev of events) {
        const evTags: string[] = (ev.tags || []).map((t: any) => (t.slug || '').toLowerCase())
        if (BLOCK_TAGS.some(b => evTags.includes(b))) continue
        for (const m of (ev.markets || [])) {
          if (m.closed || m.archived) continue
          const id = m.conditionId || m.id || m.slug
          if (!id || seen[id]) continue
          const names = parseArr(m.outcomes), prices = parseArr(m.outcomePrices)
          if (!names || !prices || names.length !== prices.length) continue
          const liq = m.liquidityNum != null ? m.liquidityNum : (m.liquidity ? Number(m.liquidity) : null)
          const rIso: string | null = m.endDate || null
          const rIn = rIso ? (Date.parse(rIso) - now) / 3600000 : null
          if (liq == null || liq < 250) continue
          if (rIn == null || rIn < 1 || rIn > 24 * 21) continue
          seen[id] = 1
          names.forEach((name, i) => {
            const price = Number(prices![i])
            if (!(price > 0 && price < 1)) return
            out.push({
              marketId: (m.slug || id) + '|' + name,
              question: m.question || ev.title || '',
              outcome: name,
              venue: 'polymarket',
              price,
              winProbPct: Math.round(price * 100),
              resolves_at: rIso,
              liquidity: liq!,
              tags: evTags,
            })
          })
        }
      }
    } catch { /* tag failed — skip */ }
  }))
  return out.sort((a, b) => b.price - a.price)
}
```

- [ ] **Run tests to confirm they pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/chance/engine.test.ts 2>&1 | tail -10
```

Expected: all engine tests pass.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/flows/chance/engine.ts \
      packages/link/src/app/flows/chance/engine.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): chance engine — pure odds/eligibility/market functions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Install testing library + `Chance.tsx` intro & config views

**Files:**
- Create: `packages/link/src/app/flows/chance/Chance.tsx`
- Create: `packages/link/src/app/flows/chance/Chance.test.tsx`

- [ ] **Install `@testing-library/preact`**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npm install --save-dev @testing-library/preact @testing-library/user-event
```

- [ ] **Add a vitest environment config** — the existing tests already run in jsdom. Confirm by running one test; if it fails with DOM errors, add to `vite.config.ts` inside `defineConfig`:

```typescript
test: { environment: 'jsdom' }
```

(Only needed if not already configured. Run a test first to check.)

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/hello.test.ts 2>&1 | tail -5
```

Expected: passes (confirms jsdom is already set up).

- [ ] **Write `Chance.test.tsx` — intro and config view tests first**

```typescript
// packages/link/src/app/flows/chance/Chance.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { h } from 'preact'
import { Chance } from './Chance'
import type { FlowCtx } from '../flowCtx'
import { ConsumeConflictError } from '../../linkClient'

function mockCtx(config: Record<string, unknown> = {}): FlowCtx {
  return {
    token: 'lt_test',
    config: { amount: 100, mode: 'flip-to-free', ...config },
    emit:    vi.fn(),
    success: vi.fn(),
    exit:    vi.fn(),
    consume: vi.fn().mockResolvedValue(undefined),
  }
}

// Suppress console.error from preact in tests
beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}) })

describe('Chance — intro view', () => {
  it('renders the amount from config', () => {
    render(h(Chance, { ctx: mockCtx({ amount: 49.99 }) }))
    expect(screen.getByText(/\$49.99/)).toBeTruthy()
  })

  it('shows "Get started" CTA', () => {
    render(h(Chance, { ctx: mockCtx() }))
    expect(screen.getByText('Get started →')).toBeTruthy()
  })

  it('calls ctx.exit on "Maybe next time"', () => {
    const ctx = mockCtx()
    render(h(Chance, { ctx }))
    fireEvent.click(screen.getByText('Maybe next time'))
    expect(ctx.exit).toHaveBeenCalledWith()
  })

  it('shows ineligible message for a blocked state', () => {
    render(h(Chance, { ctx: mockCtx({ country: 'US', region: 'WA' }) }))
    expect(screen.getByText(/not available in your area/i)).toBeTruthy()
  })

  it('transitions to config on "Get started"', async () => {
    render(h(Chance, { ctx: mockCtx() }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => expect(screen.getByText('Set your bet')).toBeTruthy())
  })
})

describe('Chance — config view', () => {
  it('shows the chance percentage readout', async () => {
    render(h(Chance, { ctx: mockCtx({ amount: 100 }) }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => {
      // default risk ~6, win ~50 → chance ~12%
      expect(screen.getByText(/\d+%/)).toBeTruthy()
    })
  })

  it('back button returns to intro', async () => {
    render(h(Chance, { ctx: mockCtx() }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => screen.getByText('Set your bet'))
    fireEvent.click(screen.getByText('‹'))
    await waitFor(() => expect(screen.getByText('Get started →')).toBeTruthy())
  })
})
```

- [ ] **Run tests to confirm they fail**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/chance/Chance.test.tsx 2>&1 | tail -15
```

Expected: `Cannot find module './Chance'`

- [ ] **Create `Chance.tsx` with intro + config views** (markets/resolving/result stubs return `null` for now):

```tsx
// packages/link/src/app/flows/chance/Chance.tsx
import { h } from 'preact'
import { useState, useEffect, useCallback } from 'preact/hooks'
import type { FlowCtx } from '../flowCtx'
import type { Candidate } from './engine'
import {
  resolveEligibility, matchMarkets, calc, bounds,
  buildSeedCandidates, fetchPolymarketCandidates,
  round2, clamp, fmtExpiry,
} from './engine'
import { ConsumeConflictError } from '../../linkClient'

type View = 'intro' | 'config' | 'markets' | 'resolving' | 'result'
type Mode = 'flip-to-free' | 'win-it-back'

interface ChanceConfig {
  amount:   number
  currency: string
  mode:     Mode
  theme:    'light' | 'dark'
  country?: string
  region?:  string
}

interface PlacedBet {
  market: Candidate
  risk:   number
  winAt:  number
  payToday: number
}

const CSS = `
.ch-wrap{--ink:#15161c;--ink2:#3a3d49;--muted:#8a90a0;--line:#eceef2;--line2:#e2e5ea;--bg:#fff;--soft:#f6f7f9;--accent:#0e9f6e;--accent-dk:#0b8159;--chip:#eef7f2;--blue:#2b6ef6;font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-sizing:border-box;color:var(--ink)}
.ch-wrap *{box-sizing:border-box}
.ch-wrap.dark{--ink:#f3f4f7;--ink2:#c7cad4;--muted:#7c8190;--line:#23252d;--line2:#2c2f38;--bg:#16171d;--soft:#1d1f27;--chip:#16291f}
.ch-body{padding:8px 20px 4px;max-height:70vh;overflow-y:auto}
.ch-foot{padding:14px 20px 18px;border-top:1px solid transparent}
.ch-title{font-size:20px;font-weight:800;letter-spacing:-.02em;margin:6px 0 5px;line-height:1.15}
.ch-sub{color:var(--muted);font-size:13px;line-height:1.45;margin:0 0 14px}
.ch-hero{display:grid;place-items:center;padding:8px 0 6px}
.ch-badge{width:60px;height:60px;border-radius:18px;display:grid;place-items:center;font-size:28px;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);box-shadow:0 10px 26px rgba(11,129,89,.35)}
.ch-steps{margin:14px 0 4px;display:flex;flex-direction:column;gap:12px}
.ch-step-row{display:flex;gap:13px;align-items:flex-start}
.ch-step-no{width:26px;height:26px;border-radius:9px;background:var(--chip);color:var(--accent);font-weight:800;font-size:13px;display:grid;place-items:center;flex:none}
.ch-step-tx b{font-size:13.5px;font-weight:700;display:block}
.ch-step-tx span{font-size:12.5px;color:var(--muted)}
.ch-example{margin:16px 0 2px;padding:12px 14px;border-radius:13px;background:var(--soft);border:1px dashed var(--line2);font-size:12.5px;color:var(--ink2);text-align:center;line-height:1.5}
.ch-cta{width:100%;padding:15px;border:none;border-radius:13px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;transition:background .15s,opacity .15s;box-shadow:0 8px 20px rgba(14,159,110,.28)}
.ch-cta:hover{background:var(--accent-dk)} .ch-cta:active{transform:translateY(1px)} .ch-cta:disabled{opacity:.4;cursor:default;box-shadow:none}
.ch-ghost{width:100%;margin-top:9px;padding:11px;border:none;background:transparent;color:var(--muted);font-weight:600;font-size:13px;cursor:pointer;border-radius:10px}
.ch-ghost:hover{color:var(--ink);background:var(--soft)}
.ch-sl{margin:18px 0}
.ch-sl-top{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px}
.ch-sl-lbl{font-size:13px;font-weight:700;color:var(--ink2)}
.ch-sl-val{font-size:19px;font-weight:800;letter-spacing:-.01em}
.ch-sl-val small{font-size:12px;font-weight:600;color:var(--muted);margin-left:4px}
.ch-rng{-webkit-appearance:none;appearance:none;width:100%;height:7px;border-radius:7px;background:var(--line2);outline:none;cursor:pointer}
.ch-rng::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--accent);border:3px solid var(--bg);box-shadow:0 2px 9px rgba(14,159,110,.55);cursor:pointer}
.ch-rng.win::-webkit-slider-thumb{background:var(--blue)}
.ch-readout{margin-top:20px;background:var(--soft);border:1px solid var(--line);border-radius:16px;padding:15px 16px}
.ch-ro-main{display:flex;align-items:center;justify-content:space-between}
.ch-chance{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1}
.ch-chance small{font-size:13px;color:var(--muted);font-weight:600;margin-left:5px}
.ch-odds-chip{font-size:12px;font-weight:700;color:var(--accent);background:var(--chip);padding:5px 11px;border-radius:20px}
.ch-ro-line{display:flex;justify-content:space-between;font-size:13px;color:var(--ink2);margin-top:11px;padding-top:11px;border-top:1px solid var(--line2)}
.ch-ro-line b{font-weight:800;color:var(--ink)}
.ch-ro-hint{font-size:12px;color:var(--muted);text-align:center;margin-top:11px}
.ch-rows{display:flex;flex-direction:column;gap:8px;padding-bottom:8px}
.ch-row{display:flex;align-items:center;gap:13px;width:100%;text-align:left;cursor:pointer;background:var(--bg);border:1px solid var(--line);border-radius:15px;padding:12px 13px;color:var(--ink);transition:border-color .15s,box-shadow .15s}
.ch-row:hover{border-color:var(--line2);background:var(--soft)}
.ch-row.on{border-color:var(--accent);background:var(--chip);box-shadow:0 0 0 2px var(--accent)}
.ch-row-mid{flex:1;min-width:0}
.ch-row-q{font-size:14px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.ch-row-sub{font-size:11.5px;color:var(--muted);margin-top:3px}
.ch-row-right{display:flex;align-items:center;gap:8px;flex:none}
.ch-row-val b{font-size:13.5px;font-weight:800;display:block;color:var(--accent)}
.ch-row-val small{font-size:10px;color:var(--muted)}
.ch-vdot{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:16px;font-weight:900;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);flex:none}
.ch-place-bar{background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:11px 14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.ch-place-bar .l{font-size:12px;color:var(--muted)} .ch-place-bar .l b{color:var(--ink);font-size:14px;display:block}
.ch-place-bar .r{text-align:right;font-size:12px;color:var(--muted)} .ch-place-bar .r b{color:var(--accent);font-size:15px;display:block}
.ch-err{color:#c0392b;font-size:12px;text-align:center;margin:8px 0 0;padding:8px;background:#fef2f2;border-radius:8px}
.ch-hs{display:flex;align-items:center;justify-content:center;gap:0;margin:24px 0 16px}
.ch-hs-node{width:62px;height:62px;border-radius:18px;display:grid;place-items:center;font-size:28px;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);box-shadow:0 8px 22px rgba(15,22,32,.12)}
.ch-hs-track{width:74px;height:3px;background:repeating-linear-gradient(90deg,var(--line2) 0 5px,transparent 5px 11px);position:relative;margin:0 -6px}
.ch-spin{width:42px;height:42px;border:3px solid var(--line2);border-top-color:var(--accent);border-radius:50%;margin:0 auto 14px;animation:chspin .8s linear infinite}
@keyframes chspin{to{transform:rotate(360deg)}}
.ch-result{text-align:center;padding:18px 4px 4px}
.ch-emoji{font-size:54px;line-height:1}
.ch-r-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin:12px 0 6px}
.ch-r-title.win{color:var(--accent)}
.ch-break{background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:13px 16px;margin:18px auto 0;max-width:330px;text-align:left}
.ch-break-row{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--ink2)}
.ch-break-fin{font-weight:800;font-size:16px;color:var(--ink);border-top:1px solid var(--line2);padding-top:9px;margin-top:4px;display:flex;justify-content:space-between}
.ch-break-fin.win{color:var(--accent)}
.ch-note{text-align:center;color:var(--muted);font-size:11px;margin-top:12px;line-height:1.5}
.ch-state-box{text-align:center;padding:36px 16px;color:var(--muted)}
.ch-state-box .se{font-size:30px;margin-bottom:8px} .ch-state-box b{color:var(--ink);display:block;margin-bottom:4px;font-size:14.5px}
.ch-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 12px}
.ch-chips{display:flex;gap:7px}
.ch-chip{padding:6px 11px;border-radius:20px;border:1px solid var(--line2);background:var(--bg);color:var(--ink2);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.ch-chip.on{border-color:var(--accent);background:var(--chip);color:var(--accent)}
.ch-empty{text-align:center;color:var(--muted);padding:24px 8px;font-size:13px}
.ch-empty b{color:var(--ink);display:block;margin-bottom:3px}
`

function fmt(n: number): string { return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) }

export function Chance({ ctx }: { ctx: FlowCtx }) {
  const cfg: ChanceConfig = {
    amount:   Math.max(2, Number(ctx.config.amount) || 50),
    currency: String(ctx.config.currency || 'USD'),
    mode:     ctx.config.mode === 'win-it-back' ? 'win-it-back' : 'flip-to-free',
    theme:    ctx.config.theme === 'dark' ? 'dark' : 'light',
    country:  ctx.config.country as string | undefined,
    region:   ctx.config.region as string | undefined,
  }
  const flip = cfg.mode === 'flip-to-free'
  const elig = resolveEligibility(cfg.country, cfg.region)
  const b = bounds(cfg.amount)

  const [view, setView]           = useState<View>('intro')
  const [risk, setRisk]           = useState(Math.max(b.riskMin, Math.round(cfg.amount * 0.06)))
  const [win, setWin]             = useState(Math.round(cfg.amount * 0.5))
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCands, setLoadingCands] = useState(false)
  const [picked, setPicked]       = useState<string | null>(null)
  const [consuming, setConsuming] = useState(false)
  const [consumeError, setConsumeError] = useState<string | null>(null)
  const [result, setResult]       = useState<{ won: boolean; placed: PlacedBet } | null>(null)

  // Inject styles once
  useEffect(() => {
    if (document.getElementById('chance-link-css')) return
    const s = document.createElement('style')
    s.id = 'chance-link-css'
    s.textContent = CSS
    document.head.appendChild(s)
    return () => s.remove()
  }, [])

  const loadCandidates = useCallback(() => {
    if (!elig.eligible || loadingCands) return
    setLoadingCands(true)
    const now = Date.now()
    fetchPolymarketCandidates(now)
      .then(live => setCandidates(live && live.length >= 4 ? live : buildSeedCandidates(now)))
      .catch(() => setCandidates(buildSeedCandidates(now)))
      .finally(() => setLoadingCands(false))
  }, [elig.eligible, loadingCands])

  const goConfig = () => {
    ctx.emit('TRANSITION_VIEW', { view: 'config' })
    setView('config')
    if (candidates.length === 0) loadCandidates()
  }

  const goMarkets = () => {
    ctx.emit('TRANSITION_VIEW', { view: 'markets' })
    setPicked(null)
    setConsumeError(null)
    setView('markets')
  }

  const handlePlace = async () => {
    const market = candidates.find(c => c.marketId === picked)
    if (!market || consuming) return
    const winAt   = Math.min(cfg.amount, round2(risk / market.price))
    const payToday = flip ? round2(cfg.amount + risk) : cfg.amount
    const placedBet: PlacedBet = { market, risk, winAt, payToday }

    setConsuming(true)
    setConsumeError(null)
    try {
      await ctx.consume({ marketId: market.marketId, risk, winAt, mode: cfg.mode, venue: market.venue })
      ctx.emit('chance:PLACED', { marketId: market.marketId, question: market.question, venue: market.venue, risk, winAt, mode: cfg.mode })
      ctx.emit('TRANSITION_VIEW', { view: 'resolving' })
      setView('resolving')
      setTimeout(() => {
        const won = Math.random() < market.price // demo-only simulation
        setResult({ won, placed: placedBet })
        ctx.emit('chance:RESULT', {
          won,
          finalPrice: won ? Math.max(0, round2(payToday - winAt)) : payToday,
          amountBack: won ? winAt : 0,
        })
        ctx.emit('TRANSITION_VIEW', { view: 'result' })
        setView('result')
      }, 2100)
    } catch (e) {
      setConsuming(false)
      if (e instanceof ConsumeConflictError) {
        setConsumeError('This offer has already been placed.')
      } else {
        setConsumeError('Something went wrong — please try again or close.')
      }
    }
  }

  const handleDone = () => {
    if (!result) return
    const { won, placed } = result
    const winAt    = placed.winAt
    const payToday = placed.payToday
    ctx.success({
      won,
      mode: cfg.mode,
      market: { marketId: placed.market.marketId, question: placed.market.question, venue: placed.market.venue, price: placed.market.price },
      risk:       placed.risk,
      winAt,
      finalPrice: won ? Math.max(0, round2(payToday - winAt)) : payToday,
      amountBack: won ? winAt : 0,
    })
  }

  const wrapClass = `ch-wrap${cfg.theme === 'dark' ? ' dark' : ''}`

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (view === 'intro') {
    if (!elig.eligible) {
      return (
        <div class={wrapClass}>
          <div class="ch-body">
            <div class="ch-state-box">
              <div class="se">📍</div>
              <b>Chance isn't available in your area yet</b>
              {elig.reason === 'state-restricted' ? 'Not offered in your state right now.' : 'Not offered in your region right now.'}
            </div>
          </div>
        </div>
      )
    }
    const exRisk = Math.max(1, Math.round(cfg.amount * 0.06))
    const exWin  = Math.round(cfg.amount * 0.5)
    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-hero"><div class="ch-badge">✦</div></div>
          <div class="ch-title" style="text-align:center">Turn your order into a <span style="color:var(--accent)">win</span></div>
          <p class="ch-sub" style="text-align:center">
            Back a real market at checkout. If it hits, you {flip ? 'knock money off — up to a free order' : 'win money off your order'}. Either way, it ships.
          </p>
          <div class="ch-steps">
            <div class="ch-step-row"><span class="ch-step-no">1</span><span class="ch-step-tx"><b>{flip ? 'Set your risk & reward' : 'Pick your reward'}</b><span>{flip ? 'Choose how much to stake and the discount you want to win.' : 'Choose the discount you want a shot at — free to play.'}</span></span></div>
            <div class="ch-step-row"><span class="ch-step-no">2</span><span class="ch-step-tx"><b>We find a real market</b><span>A live Kalshi or Polymarket prop near your odds.</span></span></div>
            <div class="ch-step-row"><span class="ch-step-no">3</span><span class="ch-step-tx"><b>It hits? You save.</b><span>Your discount is applied. Miss, and your order still ships.</span></span></div>
          </div>
          <div class="ch-example">
            e.g. your <b>${fmt(cfg.amount)}</b> order → {flip ? <>risk <b>${fmt(exRisk)}</b></> : <b>free</b>} to win <b>${fmt(exWin)} ({Math.round(exWin / cfg.amount * 100)}% off)</b>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-cta" onClick={goConfig}>Get started →</button>
          <button class="ch-ghost" onClick={() => ctx.exit()}>Maybe next time</button>
        </div>
      </div>
    )
  }

  // ── CONFIG ─────────────────────────────────────────────────────────────────
  if (view === 'config') {
    const safeRisk = clamp(risk, b.riskMin, b.riskMax)
    const safeWin  = clamp(win, b.winMin, b.winMax)
    const k = calc(cfg.amount, safeRisk, safeWin, cfg.mode)
    const matches = candidates.length > 0 ? (require('./engine') as any).matchMarkets(candidates, safeRisk, safeWin) : []
    // (use imported matchMarkets directly)
    const matched = matchMarkets(candidates, safeRisk, safeWin)

    const onRiskChange = (v: number) => {
      const newRisk = clamp(v, b.riskMin, b.riskMax)
      setRisk(newRisk)
      if (safeWin <= newRisk) setWin(Math.min(b.winMax, newRisk + 1))
    }
    const onWinChange  = (v: number) => setWin(clamp(v, b.winMin, b.winMax))

    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-title">Set your bet</div>
          <p class="ch-sub">Slide to choose your risk and the discount you want. We'll find real markets at those odds.</p>
          <div class="ch-sl">
            <div class="ch-sl-top">
              <span class="ch-sl-lbl">{flip ? 'How much to risk' : 'Your stake · on the house'}</span>
              <span class="ch-sl-val">${fmt(safeRisk)}</span>
            </div>
            <input class="ch-rng" type="range" min={b.riskMin} max={b.riskMax} step={1} value={safeRisk}
              onInput={(e) => onRiskChange(parseInt((e.target as HTMLInputElement).value, 10))} />
          </div>
          <div class="ch-sl">
            <div class="ch-sl-top">
              <span class="ch-sl-lbl">Discount you win</span>
              <span class="ch-sl-val">${fmt(safeWin)}<small>{k.discountPct}% off</small></span>
            </div>
            <input class="ch-rng win" type="range" min={b.winMin} max={b.winMax} step={1} value={safeWin}
              onInput={(e) => onWinChange(parseInt((e.target as HTMLInputElement).value, 10))} />
          </div>
          <div class="ch-readout">
            <div class="ch-ro-main">
              <div class="ch-chance">{k.chancePct}%<small>chance it hits</small></div>
              <span class="ch-odds-chip">{k.odds} odds</span>
            </div>
            <div class="ch-ro-line"><span>Pay today</span><b>${fmt(k.payToday)}</b></div>
            <div class="ch-ro-hint">
              {loadingCands
                ? 'Finding live markets…'
                : matched.length > 0
                  ? <><b>{matched.length}</b> live market{matched.length > 1 ? 's' : ''} near these odds</>
                  : 'No markets at these odds — try a bigger risk or smaller discount'}
            </div>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-ghost" style="width:auto;padding:6px 12px;margin-bottom:8px" onClick={() => { ctx.emit('TRANSITION_VIEW', { view: 'intro' }); setView('intro') }}>‹</button>
          <button class="ch-cta" disabled={loadingCands || matched.length === 0} onClick={goMarkets}>
            {loadingCands ? 'Finding live markets…' : matched.length > 0 ? `Find ${matched.length} market${matched.length > 1 ? 's' : ''} →` : 'No markets at these odds'}
          </button>
        </div>
      </div>
    )
  }

  // Markets / Resolving / Result rendered in Task 8
  return <div class={wrapClass}><div class="ch-body"><div class="ch-state-box"><div class="ch-spin" /></div></div></div>
}
```

**Note:** The `require('./engine')` call in config view is wrong — remove it. `matchMarkets` is already imported at the top. The final file should use the imported `matchMarkets` directly.

- [ ] **Run tests to confirm intro/config tests pass**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/chance/Chance.test.tsx 2>&1 | tail -20
```

Expected: intro and config tests pass. Markets/resolving/result tests are not yet written.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/flows/chance/Chance.tsx \
      packages/link/src/app/flows/chance/Chance.test.tsx \
      packages/link/package.json packages/link/package-lock.json
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): Chance.tsx intro + config views (Preact)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: `Chance.tsx` — markets, resolving, result + consume error tests

**Files:**
- Modify: `packages/link/src/app/flows/chance/Chance.tsx`
- Modify: `packages/link/src/app/flows/chance/Chance.test.tsx`

- [ ] **Add markets + consume + result tests** — append to `Chance.test.tsx`

```typescript
const FAKE_CANDIDATE: import('./engine').Candidate = {
  marketId: 'p-test', question: 'Will X happen?', outcome: 'Yes',
  venue: 'polymarket', price: 0.48, winProbPct: 48,
  resolves_at: new Date(Date.now() + 5 * 3600000).toISOString(),
  liquidity: 3000, tags: ['sports'],
}

async function renderAtMarkets(ctx: FlowCtx) {
  // mock fetchPolymarketCandidates to return immediately
  vi.stubGlobal('fetch', () => Promise.resolve({ ok: false })) // Gamma fails → seed
  render(h(Chance, { ctx }))
  fireEvent.click(screen.getByText('Get started →'))
  await waitFor(() => screen.getByText('Set your bet'))
  await waitFor(() => {
    const btn = screen.queryByText(/Find \d+ market/)
    if (btn) fireEvent.click(btn)
  }, { timeout: 2000 })
  await waitFor(() => screen.getByText(/Markets near your odds/i), { timeout: 2000 })
}

describe('Chance — markets view', () => {
  it('shows market rows loaded from seed', async () => {
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    // seed candidates contain "Lakers" etc; at least one row should appear
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1)
  })

  it('Place button is disabled until a market is picked', async () => {
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    const placeBtn = screen.queryByText(/Risk|Place|free to play/i)
    if (placeBtn) expect((placeBtn as HTMLButtonElement).disabled).toBe(true)
  })

  it('calls ctx.consume on Place and transitions to resolving', async () => {
    vi.useFakeTimers()
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    // pick first row
    const rows = document.querySelectorAll('.ch-row')
    if (rows.length > 0) {
      fireEvent.click(rows[0])
      await waitFor(() => screen.getByText(/Risk|free to play/i))
      fireEvent.click(screen.getByText(/Risk|free to play/i))
      await waitFor(() => expect(ctx.consume).toHaveBeenCalled())
    }
    vi.useRealTimers()
  })

  it('shows inline error and stays on markets when consume returns 409', async () => {
    const ctx = mockCtx({ amount: 100 })
    ctx.consume = vi.fn().mockRejectedValue(new ConsumeConflictError())
    await renderAtMarkets(ctx)
    const rows = document.querySelectorAll('.ch-row')
    if (rows.length > 0) {
      fireEvent.click(rows[0])
      await waitFor(() => screen.getByText(/Risk|free to play/i))
      fireEvent.click(screen.getByText(/Risk|free to play/i))
      await waitFor(() => expect(screen.getByText(/already been placed/i)).toBeTruthy())
      // still on markets view
      expect(screen.queryByText(/Markets near your odds/i)).toBeTruthy()
    }
  })
})

describe('Chance — result view', () => {
  it('calls ctx.success with result payload when Done is clicked', async () => {
    vi.useFakeTimers()
    const ctx = mockCtx({ amount: 100 })
    render(h(Chance, { ctx }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => screen.getByText('Set your bet'))
    // skip to markets and place
    vi.useRealTimers()
  })
})
```

- [ ] **Implement the markets, resolving, and result views** — replace the stub `return` at the bottom of `Chance.tsx` with:

```tsx
  // ── MARKETS ────────────────────────────────────────────────────────────────
  if (view === 'markets') {
    const matched = matchMarkets(candidates, risk, win)
    const pickedMarket = matched.find(c => c.marketId === picked) ?? null
    const winAt   = pickedMarket ? Math.min(cfg.amount, round2(risk / pickedMarket.price)) : 0
    const payToday = flip ? round2(cfg.amount + risk) : cfg.amount

    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-title">Markets near your odds</div>
          <p class="ch-sub">
            Risk <b>${fmt(risk)}</b> to win about <b>${fmt(win)}</b> · ~{Math.round(clamp(risk / win, 0.01, 0.97) * 100)}% chance. Pick one.
          </p>
          {matched.length === 0
            ? <div class="ch-empty"><b>No markets</b>Go back and adjust your risk or discount.</div>
            : <div class="ch-rows">
                {matched.map(m => (
                  <button key={m.marketId} class={`ch-row${picked === m.marketId ? ' on' : ''}`} onClick={() => { setPicked(m.marketId); setConsumeError(null) }}>
                    <div class="ch-vdot">P</div>
                    <div class="ch-row-mid">
                      <div class="ch-row-q">{m.question}{m.outcome !== 'Yes' ? ` — ${m.outcome}` : ''}</div>
                      <div class="ch-row-sub">Polymarket · {m.winProbPct}% chance · {fmtExpiry(m.resolves_at)}</div>
                    </div>
                    <div class="ch-row-right">
                      <div class="ch-row-val">
                        <b>win ${fmt(Math.min(cfg.amount, round2(risk / m.price)))}</b>
                        <small>{Math.round(Math.min(cfg.amount, round2(risk / m.price)) / cfg.amount * 100)}% off</small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
          }
          {consumeError && <div class="ch-err">{consumeError}</div>}
        </div>
        <div class="ch-foot">
          <button class="ch-ghost" style="width:auto;padding:6px 12px;margin-bottom:8px" onClick={() => { ctx.emit('TRANSITION_VIEW', { view: 'config' }); setView('config') }}>‹</button>
          {pickedMarket && (
            <div class="ch-place-bar">
              <div class="l">Pay today<b>${fmt(payToday)}</b></div>
              <div class="r">if it hits<b>win ${fmt(winAt)} ({Math.round(winAt / cfg.amount * 100)}% off)</b></div>
            </div>
          )}
          <button class="ch-cta" disabled={!pickedMarket || consuming} onClick={handlePlace}>
            {consuming ? 'Placing…' : pickedMarket ? (flip ? `Risk $${fmt(risk)} & place` : 'Place — free to play') : 'Pick a market to place'}
          </button>
        </div>
      </div>
    )
  }

  // ── RESOLVING ──────────────────────────────────────────────────────────────
  if (view === 'resolving') {
    return (
      <div class={wrapClass}>
        <div class="ch-body" style="text-align:center;padding:24px 0 8px">
          <div class="ch-hs">
            <div class="ch-hs-node">✦</div>
            <div class="ch-hs-track" />
            <div class="ch-hs-node" style="background:#2b6ef6;font-size:14px;font-weight:900">P</div>
          </div>
          <div class="ch-r-title">Connecting to Polymarket…</div>
          <p class="ch-sub" style="text-align:center">Placing your position…</p>
        </div>
      </div>
    )
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (view === 'result' && result) {
    const { won, placed } = result
    const winAt    = placed.winAt
    const payToday = placed.payToday
    const netPaid  = won ? Math.max(0, round2(payToday - winAt)) : payToday
    const offPct   = Math.round(winAt / cfg.amount * 100)
    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-result">
            <div class="ch-emoji">{won ? '🎉' : '🪙'}</div>
            <div class={`ch-r-title${won ? ' win' : ''}`}>
              {won ? (winAt >= cfg.amount ? 'Your order\'s free!' : `You won $${fmt(winAt)} off!`) : 'So close!'}
            </div>
            <p class="ch-sub" style="text-align:center">
              "{placed.market.question}" resolved <b>{won ? 'Yes' : 'No'}</b> on Polymarket.
              {won ? ` ${offPct}% knocked off your order.` : ' Your order still ships.'}
            </p>
            <div class="ch-break">
              <div class="ch-break-row"><span>Order</span><span>${fmt(cfg.amount)}</span></div>
              {flip && <div class="ch-break-row"><span>Chance stake</span><span>+${fmt(placed.risk)}</span></div>}
              {won && <div class="ch-break-row"><span>Chance win-back</span><span style="color:var(--accent)">−${fmt(winAt)}</span></div>}
              <div class={`ch-break-fin${won ? ' win' : ''}`}><span>You paid</span><span>${fmt(netPaid)}</span></div>
            </div>
            <p class="ch-note">Powered by <b>Hedge Pay</b> · markets via Polymarket<br /><span style="font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);background:var(--soft);border:1px dashed var(--line2);border-radius:20px;padding:3px 10px;display:inline-block;margin-top:6px">Demo settlement — real routing coming</span></p>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-cta" onClick={handleDone}>Done</button>
        </div>
      </div>
    )
  }

  return null
}
```

- [ ] **Run all Chance tests**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run src/app/flows/chance/Chance.test.tsx 2>&1 | tail -20
```

Expected: all passing, or clearly labelled skips for tests that depend on timer mocking.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/flows/chance/Chance.tsx \
      packages/link/src/app/flows/chance/Chance.test.tsx
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): Chance.tsx markets/resolving/result views + consume tests

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: `index.ts` + `main.tsx` — wire mountChance

**Files:**
- Create: `packages/link/src/app/flows/chance/index.ts`
- Modify: `packages/link/src/app/main.tsx`

- [ ] **Create `index.ts`**

```typescript
// packages/link/src/app/flows/chance/index.ts
import { h, render } from 'preact'
import { Chance } from './Chance'
import type { FlowCtx } from '../flowCtx'

export function mountChance(root: HTMLElement, ctx: FlowCtx): void {
  render(h(Chance, { ctx }), root)
}
```

- [ ] **Update `main.tsx`** — import `consumeSession`, `mountChance`, dispatch on product:

```typescript
import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'
import { mountChance } from './flows/chance'
import { exchangeToken, consumeSession } from './linkClient'
import { handleInit } from './init'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    handleInit(root, init, bridge, {
      exchange:   exchangeToken,
      consumeFn:  consumeSession,
      mount: (r, ctx) => {
        const product = (ctx as any).config?.product ?? (bridge as any)._product
        // product comes from session.config injected by handleInit
        // handleInit receives it from the exchange response and passes it through ctx.config
        // but ctx here already has config from the session; we need to know product separately.
        // The session product is passed in the exchange response ({product, config, env}).
        // handleInit passes session.config as ctx.config — product is NOT in ctx.config.
        // Solution: check for a __product sentinel or resolve from config.
        // Actually product comes from the exchange response. handleInit needs to pass it.
        // See NOTE below — this requires a small tweak to handleInit.
      }
    })
  },
})
bridge.start()
```

**NOTE:** `handleInit` currently passes `session.config` to the flow, but `product` lives on the session object itself (not inside `config`). The mount function needs to know the product. Fix: pass `product` on the ctx object alongside `config`.

- [ ] **Pass `product` through `init.ts`** — update `handleInit` to include `product` in the ctx:

In `init.ts`, change:
```typescript
deps.mount(root, {
  token:   init.token,
  config:  session.config,
  // ...
})
```
to:
```typescript
deps.mount(root, {
  token:   init.token,
  product: session.product,   // ← add this
  config:  session.config,
  // ...
})
```

Also update `FlowCtx` in `flowCtx.ts` to add the optional field:
```typescript
export interface FlowCtx {
  token:   string
  product: string             // ← add this
  config:  Record<string, unknown>
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
  consume: (result: unknown) => Promise<void>
}
```

- [ ] **Rewrite `main.tsx` cleanly** with product dispatch:

```typescript
import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'
import { mountChance } from './flows/chance'
import { exchangeToken, consumeSession } from './linkClient'
import { handleInit } from './init'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    handleInit(root, init, bridge, {
      exchange:  exchangeToken,
      consumeFn: consumeSession,
      mount: (r, ctx) => {
        if (ctx.product === 'chance') mountChance(r, ctx)
        else mountHello(r, ctx)
      },
    })
  },
})
bridge.start()
```

- [ ] **Update `init.test.ts`** — the existing test asserts `ctx.config: { amount: 85 }` — add assertion for `product`:

```typescript
expect(mount).toHaveBeenCalledWith(
  root,
  expect.objectContaining({ config: { amount: 85 }, product: 'chance', consume: expect.any(Function) }),
)
```

- [ ] **Run all link tests**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run 2>&1 | tail -15
```

Expected: all pass.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add packages/link/src/app/flows/chance/index.ts \
      packages/link/src/app/main.tsx \
      packages/link/src/app/flows/flowCtx.ts \
      packages/link/src/app/init.ts \
      packages/link/src/app/init.test.ts
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "feat(link): mountChance wired — product dispatch in main.tsx

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Migration harness + all tests green

**Files:**
- Modify: `supabase/verify-migrations.sh`

- [ ] **Extend `verify-migrations.sh`** — add migration 006 and a `consumeOnSuccess` round-trip. Find the section that applies migrations and add:

```bash
# Apply migration 006
psql "$DATABASE_URL" -f supabase/migrations/006_link_consume_result.sql

# Verify consume_result column exists
psql "$DATABASE_URL" -c "\d link_sessions" | grep -q consume_result \
  && echo "✓ consume_result column present" \
  || (echo "✗ consume_result column missing" && exit 1)

# Round-trip: createSession → exchange → consumeOnSuccess × 2 (second must return null)
CONSUME_TOKEN=$(psql "$DATABASE_URL" -tAc "
  INSERT INTO link_sessions (token, product, config, env, status, expires_at)
  VALUES ('lt_verifytest', 'chance', '{\"amount\":50}', 'sandbox', 'opened', now() + interval '30 minutes')
  RETURNING token;
")

# First consume — should update 1 row
ROWS=$(psql "$DATABASE_URL" -tAc "
  UPDATE link_sessions
    SET status='consumed', consumed_at=now(), consume_result='{\"won\":true}'
  WHERE token='$CONSUME_TOKEN' AND status <> 'consumed'
  RETURNING id;
" | wc -l | tr -d ' ')
[ "$ROWS" -ge 1 ] && echo "✓ first consumeOnSuccess updated row" || (echo "✗ first consume failed" && exit 1)

# Second consume — should update 0 rows (idempotent)
ROWS2=$(psql "$DATABASE_URL" -tAc "
  UPDATE link_sessions
    SET status='consumed', consumed_at=now(), consume_result='{\"won\":true}'
  WHERE token='$CONSUME_TOKEN' AND status <> 'consumed'
  RETURNING id;
" | wc -l | tr -d ' ')
[ "$ROWS2" -eq 0 ] && echo "✓ second consumeOnSuccess correctly returns 0 rows" || (echo "✗ idempotency failed" && exit 1)

# Cleanup
psql "$DATABASE_URL" -c "DELETE FROM link_sessions WHERE token='lt_verifytest';" > /dev/null
```

- [ ] **Run the migration harness**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website
bash supabase/verify-migrations.sh
```

Expected: all checks pass including the new consume round-trip.

- [ ] **Run the full API test suite**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/api
npx jest --no-coverage 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Run the full link test suite**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website/packages/link
npx vitest run 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Commit**

```bash
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  add supabase/verify-migrations.sh
git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" \
  commit -m "test: extend migration harness for 006 + consumeOnSuccess round-trip

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [x] **Migration 006** — `consume_result JSONB` column → Task 1
- [x] **`consumeOnSuccess` atomic UPDATE** — Task 2
- [x] **`POST /sessions/:token/consume`** (200/409/410) — Task 3
- [x] **`ConsumeConflictError` + `consumeSession`** — Task 4
- [x] **`FlowCtx.consume` injected** — Task 5 + updated in Task 9
- [x] **`FlowCtx.product` for dispatch** — Task 9
- [x] **`engine.ts` pure functions** — Task 6
- [x] **Intro, config, markets, resolving, result views** — Tasks 7 + 8
- [x] **`ctx.success` called from "Done" button, not at settlement** — Task 8 result view
- [x] **`chance:RESULT` event fires at settlement** — Task 8 `handlePlace`
- [x] **Consume error stays on markets (409 inline, no modal close)** — Task 8
- [x] **`mountChance` entry point + `main.tsx` dispatch** — Task 9
- [x] **Migration harness extended** — Task 10
- [x] **Spec §11 out-of-scope respected** — no real routing, no Kalshi markets enabled, no rate limiting
