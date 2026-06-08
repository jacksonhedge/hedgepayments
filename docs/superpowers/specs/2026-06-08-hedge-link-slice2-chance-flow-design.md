# Hedge Link — Chance Flow (Slice 2) — Design

**Date:** 2026-06-08
**Status:** Approved
**Scope:** Slice 2 of Hedge Link. Port the existing Chance web component into the Link shell as a real `mountFlow` implementation, driven by a verified `session.config`. Introduces the `ctx.consume()` contract for atomic single-use session burning and proves the end-to-end pattern that CoverPay and SideBet will follow.

---

## 1. Goal

Replace the `hello` stub with a fully functional Chance flow inside the Link iframe. A merchant mints a `link_token` with `product: 'chance'` and `config: { amount, mode, ... }`, the user goes through intro → config sliders → market selection → Place, the session is burned atomically on the server, a simulated settlement runs, and the merchant's `onSuccess` fires with the result. Proves the whole shell end-to-end with real product behavior.

## 2. Context

- **Slice 0 (done):** iframe shell, postMessage bridge, `hello` flow, `FlowCtx { token, config, emit, success, exit }`.
- **Slice 1 (done):** `@hedge/api` mints `link_tokens` (`link_sessions` table, migration `005`), the iframe app exchanges the token on `INIT`. `linkStore.exchange()` uses a read-then-write pattern — intentionally NOT reused for consume (race condition).
- **`public/embed/chance.js`:** the existing Chance web component (~760 lines). 5-view flow, pure client-side engine, seeded Polymarket data + live Gamma API fallback. This is the source of truth for flow logic and UX; Slice 2 ports it into the shell without the web-component wrapper.
- **Key carry-forward:** consume MUST be atomic — `UPDATE … WHERE status <> 'consumed' RETURNING` — so a double-click or replayed request cannot produce two settled bets.

## 3. Decisions (locked)

1. **UI framework:** Preact (already in the iframe app). Not raw `innerHTML` — the 5-view flow with reactive sliders warrants proper component state.
2. **File structure:** sub-directory `flows/chance/` with `engine.ts` (pure), `Chance.tsx` (Preact), `index.ts` (mount entry). Mirrors Slice 1's `linkStore` (pure service) + `linkRouter` (HTTP) split.
3. **Consume timing:** atomic consume happens at "Place" click, before the animation. If consume fails, the user stays on the markets view with an inline error. The animation only runs on `consume 200`.
4. **`ctx.consume()` injected:** flows do not import `fetch` helpers directly. `main.tsx` injects `consume` alongside `emit`, `success`, `exit`. Consistent with Plaid's principle that the flow contract is self-contained.
5. **Settlement:** simulated client-side (seeded by market probability), same as the web component. Real routing is a later phase.
6. **Eligibility:** uses `config.country` / `config.region` if server-set, otherwise treated as US-eligible. No client-side geo-detection in the iframe (server is the authority for Link sessions).

## 4. Architecture

### 4.1 New files

```
packages/link/src/app/flows/chance/
  engine.ts         pure functions: odds calc, eligibility, market matching, Polymarket fetch, seed data
  Chance.tsx        Preact component — all 5 views
  index.ts          exports mountChance(root, ctx)
  engine.test.ts    vitest unit tests, no DOM
  Chance.test.tsx   vitest + @testing-library/preact render tests
```

### 4.2 Modified files

```
packages/link/src/app/flows/hello.ts     extend FlowCtx interface with consume
packages/link/src/app/init.ts            inject consume into ctx via deps
packages/link/src/app/linkClient.ts      add consumeSession(token, result)
packages/link/src/app/main.tsx           dispatch on session.product

packages/api/src/services/linkStore.ts   add consumeOnSuccess(token, result)
packages/api/src/routes/link.ts          add POST /sessions/:token/consume

supabase/migrations/006_link_consume_result.sql
```

### 4.3 `FlowCtx` extension

```typescript
export interface FlowCtx {
  token: string
  config: Record<string, unknown>
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
  consume: (result: unknown) => Promise<void>   // NEW — atomic single-use burn
}
```

`consume` throws `ConsumeConflictError` (409 — already consumed) or an `INVALID_LINK_TOKEN` error (410 — expired/unknown). Both are caught by the flow and surfaced as inline errors; neither calls `ctx.exit()` automatically (the session is still open for the user to retry a different market, or close cleanly).

### 4.4 `main.tsx` dispatch

```typescript
const mount = session.product === 'chance' ? mountChance : mountHello
mount(root, ctx)
```

`handleInit` in `init.ts` passes `consume` through `deps` (same injection pattern as `exchange` and `mount`).

## 5. Session config schema

```typescript
interface ChanceConfig {
  amount:    number                            // required, major units (e.g. 49.99)
  currency?: string                            // default 'USD', display only
  mode?:     'flip-to-free' | 'win-it-back'   // default 'flip-to-free'
  theme?:    'light' | 'dark'                 // default 'light'
  country?:  string                            // e.g. 'US' — server-set for eligibility
  region?:   string                            // e.g. 'WA' — US state, server-set
}
```

The flow reads these from `ctx.config`. Unknown keys are ignored.

## 6. Data flow

```
merchant server  POST /v1/link/sessions  (X-Hedge-Key)
                 { product: 'chance', config: { amount, mode, ... } }
                 ← { link_token, expires_at }

host page        Hedge.create({ token: link_token }).open()

iframe app       POST /v1/link/sessions/:token/exchange
                 ← { product: 'chance', config, env }
                 → mountChance(root, ctx)

user places      POST /v1/link/sessions/:token/consume   ← ATOMIC
                 { result: { marketId, risk, winAt, mode, venue } }
                 200 { ok: true }  →  animate → settle → ctx.emit('chance:RESULT') → show result view
                                   user clicks "Done" → ctx.success(result) → modal closes
                 409               →  inline error "already placed", stay on markets
                 410               →  inline error + ctx.exit(INVALID_LINK_TOKEN)

merchant         onSuccess({ won, mode, market, risk, winAt, finalPrice, amountBack }, meta)
```

## 7. Atomic consume

### Migration `006_link_consume_result.sql`

```sql
ALTER TABLE link_sessions
  ADD COLUMN IF NOT EXISTS consume_result JSONB;
```

### `linkStore.consumeOnSuccess(token, result)`

```typescript
export async function consumeOnSuccess(
  token: string,
  result: unknown,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('link_sessions')
    .update({ status: 'consumed', consumed_at: new Date().toISOString(), consume_result: result })
    .eq('token', token)
    .neq('status', 'consumed')           // atomic: WHERE status <> 'consumed'
    .select('id')
    .single()
  if (error || !data) return null        // 0 rows = already consumed or not found
  return { id: data.id }
}
```

Returns `null` if the token was already consumed or does not exist/is expired. The route resolves the ambiguity with one extra read on the unhappy path only:

```typescript
// in linkRouter POST /sessions/:token/consume
const consumed = await linkStore.consumeOnSuccess(token, result)
if (!consumed) {
  // distinguish: was it already consumed, or invalid/expired?
  const row = await supabase.from('link_sessions').select('status').eq('token', token).single()
  if (row.data?.status === 'consumed') return res.status(409).json({ error: 'already_consumed', error_code: 'ALREADY_CONSUMED' })
  return res.status(410).json({ error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' })
}
res.json({ ok: true })
```

### API route addition

```
POST /api/v1/link/sessions/:token/consume
Body:    { result: object }
Auth:    token is the credential (no X-Hedge-Key)
200:     { ok: true }
409:     { error: 'already_consumed', error_code: 'ALREADY_CONSUMED' }
410:     { error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' }
```

### `linkClient.consumeSession(token, result)`

```typescript
export class ConsumeConflictError extends Error {
  error_code = 'ALREADY_CONSUMED'
}

export async function consumeSession(token: string, result: unknown): Promise<void> {
  const res = await fetch(apiBase() + '/sessions/' + encodeURIComponent(token) + '/consume', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ result }),
  })
  if (res.status === 409) throw new ConsumeConflictError('already_consumed')
  if (!res.ok) {
    const err: any = new Error('INVALID_LINK_TOKEN')
    err.error_code = 'INVALID_LINK_TOKEN'
    throw err
  }
}
```

## 8. Flow views

| View | Trigger | CTA | Back |
|---|---|---|---|
| `intro` | mount | "Get started →" | — |
| `config` | intro CTA | "Find N markets →" (disabled while loading / 0 matches) | → intro |
| `markets` | config CTA | "Place" (disabled until row picked) | → config |
| `resolving` | consume 200 | — (auto-advances) | disabled |
| `result` | settlement | "Done" | disabled |

X/close on any view before `resolving` → `ctx.exit(null)` (clean exit, no error).
"Maybe next time" on intro → `ctx.exit(null)`.

**Important:** the loader auto-hides on both `SUCCESS` and `EXIT`. Therefore `ctx.success(result)` is called from the **"Done" button handler** — not at settlement time. The `chance:RESULT` event fires immediately when settlement resolves (so the merchant gets the outcome via `onEvent` right away), and the user reads the result screen. "Done" then fires `ctx.success(result)` which triggers `onSuccess` and closes the modal.

### Engine (`engine.ts`) — pure functions ported from the web component

- `resolveEligibility(country, region)` → `{ eligible, venue, reason }`
- `buildSeedCandidates(now)` → sorted `Candidate[]` (Polymarket seed fallback)
- `fetchPolymarketCandidates(now)` → `Promise<Candidate[]>` (live Gamma API)
- `matchMarkets(candidates, risk, win)` → top-12 sorted by odds-closeness then liquidity
- `calc(amount, risk, win, mode)` → `{ chancePct, odds, discountPct, payToday, matchCount }`

No `Math.random()` in engine. Simulated settlement (`Math.random() < market.price`) lives in `Chance.tsx`'s place handler, clearly labelled as demo-only.

## 9. Events

```
TRANSITION_VIEW   { view }                                        on each step change
chance:PLACED     { marketId, question, venue, risk, winAt, mode } after consume 200
chance:RESULT     { won, finalPrice, amountBack }                  after settlement
```

`ctx.success()` payload (hits merchant's `onSuccess`):
```typescript
{
  won:        boolean
  mode:       'flip-to-free' | 'win-it-back'
  market:     { marketId: string; question: string; venue: string; price: number }
  risk:       number
  winAt:      number
  finalPrice: number
  amountBack: number
}
```

## 10. Testing

### `engine.test.ts` (pure, no DOM)
- `resolveEligibility`: blocked US state (WA), allowed state (CA), international blocked (RU), international allowed (GB)
- `matchMarkets`: returns markets within `BAND (0.075)`, sorted by odds-closeness then liquidity, capped at 12
- `calc`: correct `chancePct`, `payToday` for both modes, edge case `win <= risk` rejected
- `buildSeedCandidates`: returns non-empty sorted array

### `Chance.test.tsx` (@testing-library/preact)
- Intro view renders amount from config
- Config view: slider interaction updates `chancePct` readout
- Markets view: picking a row enables Place; Place with consume-409 mock shows inline error, stays on markets
- Result view (won): shows correct `winAt`; "Done" calls `ctx.exit`
- Result view (lost): shows correct final price

### `linkClient.test.ts` additions
- `consumeSession` resolves on 200
- throws `ConsumeConflictError` on 409
- throws INVALID_LINK_TOKEN error on 410

### `link.test.ts` (API) additions
- `POST /sessions/:token/consume` → 200 on valid session
- → 409 on already-consumed session
- → 410 on expired/unknown token

### `linkStore.test.ts` additions
- `consumeOnSuccess` first call → returns `{ id }`, row status is `consumed`
- `consumeOnSuccess` second call → returns `null` (atomic idempotency)

### Migration harness
Extend `supabase/verify-migrations.sh` to apply `006` and run: `createSession → exchange → consumeOnSuccess → consumeOnSuccess` (second call returns null).

## 11. Out of scope

- Real Polymarket / Kalshi bet routing (simulation only)
- Kalshi markets (chip shows "coming soon")
- Client-side geo-detection (server sets `country`/`region` in config)
- Rate limiting on consume
- `js.hedgepayments.com` deploy (Slice 5)
- Per-merchant API keys (shared `X-Hedge-Key` only)
