# Chance — AI offer-ranker + parlays — Design

> **Status:** Design (approved direction, pending written-spec review)
> **Date:** 2026-06-15
> **Product:** Chance, a Hedge Pay product. Shoppers risk a little to win a discount by backing a real prediction market. Hedge Pay is the **router, not the house**.
> **Slots into:** ROADMAP.md as a new engine capability (not a payment slice). Demo-tier only — no live settlement.

## Summary

Three things built on one shared pipeline:

1. **Round-ups are the default mechanic.** The drop-in opens in round-up mode: the purchase rounds up to the next whole dollar, and the **change** is the stake wagered toward a **free order**. A win pays the full purchase amount back, so the order is free; the shopper only ever risks the rounded-up cents.
2. **Parlays are how the round-up reaches "free."** A round-up stake is small (cents), so flipping a whole order free needs **long odds** that single markets rarely offer. Combos manufacture those odds: 2–3 real legs (all must resolve YES) whose combined price is targeted at the free-order price. Built behind a `ComboSource` abstraction — a **synthetic** implementation ships now (combine the single-leg candidates we already fetch); a **native** Polymarket-combo (CAOC) adapter is a drop-in for when that API ships publicly.
3. **AI offer-ranker.** An LLM curates/reorders which real markets (and combos) become Chance offers, optimizing for **relevance to the purchase** and **appeal/conversion**. Server-side, invisible to the shopper. Each merchant configures the provider (Claude / ChatGPT / off) via a stored setting; the platform holds the API keys.

The deterministic `matchMarkets` engine that exists today remains authoritative and becomes the **always-on fallback**: if the LLM call errors or exceeds its latency budget, the shopper sees the deterministic order. The LLM never blocks a sale. **Honest framing is load-bearing:** when the free-order target is too long to reach with real liquid legs, the offer is framed as the actual discount it *can* hit — never overstated as "free."

## Background / current state

- The Chance engine today lives **client-side** in the embeddable drop-in: `packages/link/src/app/flows/chance/engine.ts` (Preact, static export). It fetches Polymarket candidates from the public Gamma API and runs `matchMarkets()` — a pure price-band + liquidity sort — entirely in the shopper's browser. There is no server in that path and no place for API keys.
- `@hedge/api` (`packages/api`, Express + TypeScript) already owns wallet/funding endpoints (`routes/chance.ts`), services (`src/services`), shared libs (`src/lib`), and provider integrations (`src/providers`). Tests live in `__tests__` dirs.
- The merchant record is `business_accounts` (migration `002`). Migrations are sequential; next is `007`.
- Bet **execution + settlement** is Payment **Slice 3** (per ROADMAP.md) and is **not built**. Everything here is demo-tier: offers are **displayed and selectable**, never settled. No flow may read as live money.

### Why native Polymarket combos are abstracted, not depended on (verified 2026-06-15)

Polymarket Combos are a real, CFTC-self-certified product (Combinatorial Athletic Outcome Contracts — bundle multiple sports legs, all must hit or the contract resolves to zero). But the public developer surface is read-only Gamma market metadata + the CLOB; **neither exposes a documented combo/CAOC endpoint yet**. So a true native combo path (discover combo legs → place a combo position → settle one token) is not buildable against documented APIs today. We therefore ship synthetic now behind `ComboSource` and keep a native adapter as a drop-in. Offer model and shopper UX are identical either way; only the (future, Slice-3) settlement backend differs.

## Goals

- **Round-ups are the default mechanic**: stake = round-up change to the next whole dollar, win target = full purchase (free order).
- Build **combos targeted at the free-order price** so a small round-up stake can realistically flip a whole order free; honest framing when the target is unreachable.
- Let an LLM curate/rank Chance offers server-side, configurable per merchant across providers (Claude, ChatGPT, off).
- Offer multi-leg parlay Chance offers, synthetic now and native-ready.
- Never regress the existing demo: deterministic order is the guaranteed fallback; nothing reads as live settlement; no offer overstates the discount it can actually deliver.

## Non-goals

- Bet execution / settlement of parlays (that is Payment Slice 3).
- A merchant-facing dashboard toggle UI (config is stored + settable now; the dashboard control is a deferred follow-up).
- A ranking cache (deferred follow-up; see Future work).
- Merchants supplying their own LLM API keys (platform holds keys; merchants only pick a provider).

## Round-up mechanic (the default)

Round-up is the default configuration of the existing flip-to-free math, with the stake fixed to the round-up change and the win sized to the whole order:

- **Stake** = round-up change to the next whole dollar: `stake = ceil(amount) - amount`, and when `amount` is already whole, `stake = 1.00` (always something to wager).
- **Win target** = the full purchase `amount`. A win pays `stake / p` ; sizing it to make the order free means the target combined price is:

  ```
  pFree = stake / amount     // win pays stake/pFree = amount  → order free
  ```

  Example: a $47.30 order → stake $0.70 → `pFree ≈ 0.0148` (~67:1). Single markets rarely sit that long, which is exactly why combos exist here.
- **Display** reuses the existing `calc(amount, risk=stake, win=amount, mode='flip-to-free')` → `payToday = amount + stake`, `chancePct`, `odds`, `discountPct`. No new display math.
- **Feasibility & honest framing:** `pFree` can be longer than any combo of real, liquid legs (≤3 legs) can reach. When the free-order target is unreachable, the engine returns the **closest-reachable** combo and frames the offer as the actual discount it achieves (`win → $X off`), **never** as "free." This honesty rule is asserted in tests.
- Round-up is the **default**; flip-to-free / win-it-back remain selectable mechanics, but the drop-in opens in round-up.
- **Demo-tier:** "win → free order" is display + selection only. No settlement, no refund, no balance debit (that is Payment Slice 3).

## Architecture

```
Shopper browser (drop-in, packages/link)
  fetch Gamma candidates ──► matchMarkets() (local, deterministic)  ──┐ eligible singles
                                                                       │
  POST /offers/rank { merchantId, context, mode, risk, win, candidates }
        │
        ▼
@hedge/api  (packages/api)
  POST /offers/rank
    1. load merchant Chance settings (ai_provider, ai_model, parlays_enabled)
    2. resolve eligibility (reuse engine rules)
    3. if parlays_enabled → ComboSource.build(candidates, band) → parlay offers
    4. assemble Offer[] pool = singles + parlays
    5. RankProvider(provider).rank({ context, offers, max }) → RankedOffer[]
         └─ on error / timeout (~1.5s) → deterministic order
    6. return ordered Offer[] (top-N)
        │
        ▼
Shopper browser renders returned offers IN ORDER
  (if the call failed at the network layer, render local matchMarkets order)
```

### Latency posture

The call is in the checkout flow. Server-side rank budget ≈ **1.5s**; on exceed, return deterministic order. Client also has its own network timeout; on failure it renders the local order it already computed. Default model is a **fast tier** (Claude Haiku 4.5) — not a max-reasoning model — because this is latency-sensitive, high-volume classification/ranking, which is a single LLM call (not an agent).

## Components

Each component has one job, a typed interface, and is unit-testable in isolation.

### 1. `Offer` model (shared types)

`packages/api/src/lib/offers/types.ts`

```ts
export interface Offer {
  id: string;                 // stable within a single /offers/rank response
  kind: 'single' | 'parlay';
  legs: Candidate[];          // 1 leg for single, 2–3 for parlay
  price: number;              // single: leg price; parlay: product of leg prices
  // calc-derived display fields (chancePct, odds, discountPct, payToday) computed by calc()
}
```

`Candidate` is the existing shape from `engine.ts` (marketId, question, outcome, venue, price, liquidity, tags, resolves_at). The existing `calc(amount, risk, win, mode)` maps **any** price → `{ chancePct, odds, discountPct, payToday }`, so a parlay feeds its combined `price` through `calc` unchanged — no new pricing math in the display layer.

### 2. `ComboSource` — parlay assembly (pure, deterministic)

`packages/api/src/lib/offers/comboSource.ts` + interface; `nativeComboSource.ts` stub.

```ts
export interface ComboSource {
  build(candidates: Candidate[], opts: ComboOpts): Offer[];  // parlay offers only
}
```

Synthetic implementation:
- **Targets the free-order price.** `build(candidates, { targetPrice: pFree, ... })` assembles 2–3-leg combinations whose combined price `Π(leg.price)` is closest to `pFree` (the round-up free-order target). Combos approaching `pFree` from feasible legs are the headline offers.
- Combined `price = Π(leg.price)` (independence assumption → lower combined price → longer odds → bigger discount, up to the free order at `pFree`).
- **Correlation guard:** never combine legs that share the same event/market or overlapping tags (independence is false for correlated legs and would misprice the parlay). Excluded combinations are dropped, not silently mispriced.
- **Closest-reachable, honestly framed:** if no ≤3-leg combo of liquid legs reaches `pFree`, return the combo that gets *closest* (longest reachable odds) and tag it with the real discount it achieves — never "free." If a combo overshoots (combined price below `pFree`, i.e. a win would over-cover), cap the framed payout at a free order (no "more than free").
- Caps: max legs = 3, max parlay offers returned = small N (e.g. 4), liquidity-filtered legs only.
- Win condition recorded as **all legs YES** (matches Polymarket CAOC semantics), surfaced in the offer for display.

`nativeComboSource.ts` is a stub implementing the same `ComboSource` interface, to be filled when Polymarket's combo API is available. The orchestrator selects the source; everything downstream is identical.

### 3. `RankProvider` — LLM ranking (provider-abstracted)

`packages/api/src/lib/offers/rankProvider.ts` (interface + factory),
`packages/api/src/lib/offers/providers/anthropic.ts`,
`packages/api/src/lib/offers/providers/openai.ts`.

```ts
export interface RankInput { context: PurchaseContext; offers: Offer[]; max: number; }
export interface RankedOffer { offerId: string; rank: number; reason?: string; }
export interface RankProvider { rank(input: RankInput): Promise<RankedOffer[]>; }
```

- **`anthropic.ts`** — uses `@anthropic-ai/sdk`. Single structured-output call via `messages.parse` with `output_config: { format: { type: 'json_schema', schema } }` returning `RankedOffer[]`. Default model `claude-haiku-4-5` (configurable via `ai_model`). Adaptive thinking is unnecessary for this lightweight ranking call; keep it a plain fast call.
- **`openai.ts`** — uses the OpenAI SDK with structured outputs returning the same `RankedOffer[]` shape.
- **`off` / noop** — returns the deterministic order (no LLM call).
- **Factory** `getRankProvider(provider, model)` selects by merchant config.
- **Failover is hand-rolled** (we chose direct per-provider SDKs, not a gateway): any provider error or timeout → orchestrator falls back to deterministic order.

**Security invariants (load-bearing):**
- The LLM only **reorders/selects from server-provided offer IDs**. Any `offerId` it returns that isn't in the input pool is **dropped**. It cannot fabricate a market or a price.
- Offers not mentioned by the LLM are appended after the ranked ones in deterministic order (never silently lost), trimmed to `max`.
- API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are `@hedge/api` environment variables. They are never sent to the client and never stored per-merchant.

`PurchaseContext` = `{ amount, productTitle?, category?, mode }` (mode default `'round_up'`) derived from what the drop-in already reads off the page; the server derives `stake` and `pFree` from `amount`. No PII beyond product context is sent to the LLM.

### 4. Endpoint orchestration

`packages/api/src/routes/offers.ts` → `POST /offers/rank`.

1. Validate body (`merchantId`, `context` incl. `amount`, `mode` — default `'round_up'`, `candidates`).
2. Derive round-up `stake = ceil(amount) - amount || 1.00` and `pFree = stake / amount` (when mode is round-up).
3. Load merchant Chance settings; default `{ ai_provider: 'off', parlays_enabled: false }`.
4. Resolve eligibility (reuse the engine's `resolveEligibility` rules; ineligible → return a clear ineligible response, no offers).
5. If `parlays_enabled` → `ComboSource.build(candidates, { targetPrice: pFree, ... })`; assemble `Offer[]` pool (singles + parlays) and compute `calc` display fields. Tag each offer with the real discount it achieves (free only when its price ≤ `pFree`).
6. `getRankProvider(provider, model).rank({ context, offers, max })`; wrap in a ~1.5s timeout; on throw/timeout → deterministic order.
7. Return ordered `Offer[]` (top-N) + a flag indicating whether ranking was applied (for observability; not shown to shopper).

### 5. Merchant config (Supabase migration `007`)

Add Chance engine settings keyed to `business_accounts`:

- `ai_provider` — enum `'anthropic' | 'openai' | 'off'`, default `'off'`.
- `ai_model` — text, nullable (provider default when null).
- `parlays_enabled` — boolean, default `false`.

Implemented as columns on `business_accounts` **or** a `business_chance_settings` table keyed by `business_account_id` (decide in the plan; a dedicated settings table is cleaner if more Chance knobs are coming). A small `merchantSettings` service reads them. No dashboard UI in this scope — settable via the record, with safe defaults so existing merchants behave exactly as today (deterministic, no parlays).

## Data flow (happy path, AI on, parlays on)

1. Shopper opens the drop-in at checkout in **round-up mode**; embed has `merchantId`, cart `amount`, product title/category, country/region.
2. Embed fetches Gamma candidates and runs local `matchMarkets()` → eligible singles (deterministic fallback set).
3. Embed `POST /offers/rank` with context (`amount`, `mode: 'round_up'`) + candidates.
4. Server derives `stake`/`pFree` → builds combos targeted at `pFree` → assembles pool → LLM ranks for relevance+appeal → returns top-N ordered offers, each tagged with its real achievable discount (free only when reached).
5. Embed renders offers in returned order, leading with the free-order (or closest) combo. Selection/placement is demo-only (unchanged); **no settlement**.

## Error handling & fallbacks

| Failure | Behavior |
| --- | --- |
| LLM error / timeout (>~1.5s) | Server returns deterministic order (singles + any parlays), `ranked=false`. |
| `/offers/rank` network failure | Client renders the local `matchMarkets` order it already computed. |
| Provider `off` | No LLM call; deterministic order. |
| LLM returns unknown offer IDs | Unknown IDs dropped; remaining offers appended in deterministic order; trimmed to `max`. |
| Ineligible region/country | Clear ineligible response, no offers (reuse existing eligibility copy). |
| `parlays_enabled=false` | Singles only — framed as the partial discount they reach (a single rarely hits the round-up free target). |
| Free-order target `pFree` unreachable by any ≤3-leg combo | Closest-reachable combo returned, framed as the real discount it achieves — never "free." |
| Order amount is a whole dollar | `stake = 1.00` (always a wager). |

## Testing strategy (mirrors existing `engine.test.ts`; no live LLM calls)

- **Round-up math (pure):** `stake = ceil(amount) - amount`; whole-dollar edge → `stake = 1.00`; `pFree = stake / amount`; `calc` reuse produces a free order at `pFree`.
- **ComboSource (pure):** targets `pFree` (closest-reachable combo selected); correlation exclusion (same event/overlapping tags never combined); leg-count cap (≤3); max-parlays cap; **honesty assertions** — an offer is tagged "free" only when its combined price ≤ `pFree`; an unreachable target yields the closest combo framed as a partial discount, never "free"; an overshoot is capped at free (no "more than free").
- **RankProvider:** `off` returns deterministic order; provider error → deterministic fallback; **unknown offer IDs dropped**; returned `rank` order respected; `max` cap respected; unmentioned offers appended deterministically. Use a fake provider + mocked SDK responses.
- **Endpoint:** eligibility gating; `parlays_enabled` toggle; provider switch by merchant config; timeout → deterministic fallback; demo-safety assertion (response carries no settlement/live fields).
- **Merchant settings service:** defaults (`off`, no parlays) when a merchant has no row.

## Security & privacy

- API keys are server-only env vars; never client-exposed, never per-merchant.
- LLM input is product context + real offers only — no shopper PII.
- LLM output is constrained to selecting among server-provided offer IDs; fabricated IDs are dropped (no market injection).
- Demo-safety: responses are display/selection only; no settlement, balances-debited, or live-money fields.
- Truth-in-offer: no offer is framed as "free" unless its combined price actually reaches `pFree`; closest-reachable combos are framed as the partial discount they deliver.

## Module / file boundaries

```
packages/api/src/
  lib/offers/
    types.ts                 # Offer, PurchaseContext, RankedOffer
    comboSource.ts           # ComboSource interface + synthetic impl
    nativeComboSource.ts     # native Polymarket-combo stub (same interface)
    rankProvider.ts          # RankProvider interface + getRankProvider factory + 'off'
    providers/anthropic.ts   # @anthropic-ai/sdk impl (default claude-haiku-4-5)
    providers/openai.ts      # OpenAI SDK impl
    __tests__/               # comboSource, rankProvider, offers route tests
  services/merchantSettings.ts  # read business Chance settings
  routes/offers.ts           # POST /offers/rank
supabase/migrations/007_chance_engine_settings.sql
packages/link/src/app/flows/chance/   # client: call /offers/rank, render returned order, fall back locally
```

## Build sequencing (single spec, internally modular)

The plan can sequence within this one spec:
1. `Offer`/`PurchaseContext` types + round-up math (`stake`, `pFree`) + `calc` reuse.
2. Merchant settings migration `007` + `merchantSettings` service (default `off`).
3. `RankProvider` interface + `off` + factory; `/offers/rank` endpoint with deterministic path end-to-end (round-up singles).
4. Anthropic + OpenAI provider impls + timeout/fallback.
5. `ComboSource` synthetic parlays **targeted at `pFree`** + honest-framing tags + `parlays_enabled` wiring + `nativeComboSource` stub.
6. Drop-in: default to round-up mode, call `/offers/rank`, render returned order (free-or-closest combo first), local fallback.
7. Update ROADMAP.md.

## Future work (explicitly out of scope here)

- Native Polymarket combo adapter (`nativeComboSource.ts`) when their combo/CAOC API ships.
- Short-TTL ranking cache keyed by `(merchantId, category, mode, risk-bucket, candidate-set-hash)`.
- Merchant dashboard toggle UI for provider + parlays.
- Parlay settlement (Payment Slice 3): synthetic = hold against all legs; native = single combo token.
