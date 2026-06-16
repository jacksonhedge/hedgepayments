# Chance drop-in — Coinbase-style round-up redesign — Design

> **Status:** Design (pending written-spec review)
> **Date:** 2026-06-16
> **Product:** Chance, a Hedge Pay product. The embeddable checkout drop-in (`packages/link`, Preact).
> **Builds on:** the AI offer-ranker + parlays + round-ups engine (`docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md`) — this redesign is the UI that surfaces it.
> **Visual reference:** `docs/coinbase-wallet-extension-reference.md` (pixel-sampled Coinbase Wallet tokens).

## Summary

Redesign the Chance checkout drop-in to (a) look like the **Coinbase Wallet extension** (clean fintech, both light and dark themes) and (b) restructure the flow around **round-ups as the default mechanic**, surfacing **free-order combos** and **AI-ranked offers** built in the prior engine slice. Today's drop-in is an arcade-styled, green, slider-driven flow (pick risk/win, single markets only). The redesign replaces it with a four-screen flow where the order's round-up is framed like a wallet balance, and the shopper picks a ranked **offer** (a free-order combo as the headline, plus single-market alternatives) instead of dragging sliders.

This is primarily a `packages/link` change. The server engine and the `requestOffers` client helper already exist and are tested; this redesign wires them into a new UI and adds the round-up framing.

## Background / current state

- The live drop-in is `packages/link/src/app/flows/chance/Chance.tsx` (~430 lines, Preact, inline CSS). Identity: green accent (`#0e9f6e`), a `✦` badge, **light/dark via CSS variables** keyed off a `theme` config value. Flow: `intro → config (risk/win sliders) → markets (pick one single) → resolving → result`. Modes: `flip-to-free` | `win-it-back`. It renders `matchMarkets(candidates, risk, win)` inline.
- The drop-in receives a `FlowCtx` (`packages/link/src/app/flows/flowCtx.ts`): `{ token, product, config: Record<string, unknown>, emit, success, exit, consume }`. `config` today carries `amount, currency, mode, theme, country, region`. **It does not carry `merchantId` or product context.**
- The engine slice (merged) provides: `@hedge/api` `POST /api/v1/offers/rank` (round-up pool + synthetic combos + AI ranking + deterministic fallback), and `packages/link/src/app/flows/chance/offersClient.ts` `requestOffers(...)` (posts in round-up mode, local-fallback to singles). Round-up math + honest framing live in `@hedge/api`'s `calc.ts` (`roundUpStake`, `pFree`, `frameOffer`).
- Bet settlement is Payment Slice 3 (not built) — this redesign stays **demo-tier** (simulated placement/result, "Demo settlement" badge).

## Goals

- Coinbase-Wallet-grade look, **both light and dark**, driven by the existing `theme` config.
- Round-up is the default mechanic; the **free-order combo is the headline** offer; honest framing never overstates an unreachable "free."
- Surface AI-ranked offers via `requestOffers`; graceful degrade when the server is unreachable.
- Keep demo-safety: nothing reads as live settlement.

## Non-goals (v1)

- An optional "stake more than the round-up" control (YAGNI — default round-up only).
- Porting the synthetic combo builder to the client (combos come from the server; the static demo degrades to round-up singles — **Decision B**).
- Native Polymarket combos; a ranking cache; the public-endpoint auth/budget hardening (tracked separately; only relevant once a live provider is enabled).

## Decisions locked in brainstorming

- **A — Both themes.** Light and dark, config-driven (not dark-only). Coinbase is dark-only but its brand/marketing is clean white + the same blue, so the light variant is well-grounded.
- **B — Accept the degraded demo.** Parlays + AI ranking come from `@hedge/api`. The local fallback shows round-up **singles only**. Until `@hedge/api` is reachable, the static `hedgepayments.com/chance` demo shows round-up singles (no combo headline); combos light up when the API is wired. No client-side combo duplication.
- **Headline treatment A (restrained).** The hero offer uses a lightly distinguished surface (a tinted block + a UI-blue left edge + star), kept flat enough to stay Coinbase-grade.

## Theming

Keep the existing CSS-variable + theme-class pattern (`.ch-wrap.dark` etc.), but replace the green arcade tokens with Coinbase tokens for **both** themes. Source values: `docs/coinbase-wallet-extension-reference.md`.

| Variable | Dark | Light |
|---|---|---|
| `--bg` | `#0a0b0d` | `#ffffff` |
| `--surface` (headline block) | `#14161a` | `#eff3fe` |
| `--row-icon-bg` | `#191b20` | `#f2f3f5` |
| `--line` (divider) | `#1a1a1c` | `#ececef` |
| `--ink` (primary text) | `#ffffff` | `#0a0b0d` |
| `--ink2` (secondary) | `#8a919e` | `#5b616e` |
| `--muted` | `#848586` | `#8a919e` |
| `--accent` (UI blue) | `#3773f5` | `#3773f5` |
| `--accent-dk` | `#2c59bb` | `#2c59bb` |

Theme is chosen by `config.theme` (`'light' | 'dark'`); default `'light'`. Type: Coinbase-Sans-like stack — `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Balance/hero number ~30px/700; titles ~16/600; row primary ~14/500; row secondary ~11/400. Full-width pill CTA (radius 999, ~46px, `--accent` fill). 8px base spacing, 16px screen padding. Flat surfaces, hairline dividers.

## Flow & screens (four screens)

Replaces the five-screen slider flow. The `config`/slider step is removed.

1. **Intro** — round-up hook. Hero: "Round up your **$47.30** to **$48** — your **70¢** could make this order free." Coinbase-dark/light, primary pill `Round up & play`, ghost `Maybe next time`. Ineligible region → the dark/light "not available in your area" state (reuse `resolveEligibility`).
2. **Offers** — the heart. Order round-up framed like a balance up top (`Your order $47.30 · round up → $48.00 · 70¢ in play to win it free`). Underline tabs **All / Combos / Singles** (client-side filter on offer `kind`). Flat ranked rows. **Headline** = the best free-reaching offer if one exists (`display.achievesFree === true`), else the top-ranked offer — rendered with Treatment A. Remaining offers render flat in ranked order. Each row: icon · question (or combo legs summary) · right-aligned value (`win → FREE` in accent when `achievesFree`, else `win → $X off`) + odds. Footer: `Demo · markets via Polymarket & Kalshi`.
3. **Resolving** — existing "connecting to Polymarket" beat, restyled.
4. **Result** — round-up breakdown: `Order $47.30 · + round-up 70¢ · − win-back $X · You paid $Y` (or **FREE**). Keep the "Demo settlement — real routing coming" badge. A parlay's simulated win uses the combined price.

## Architecture & components

`Chance.tsx` is **substantially rewritten** (new tokens, 4 view branches, offers wiring). To keep it focused, extract:

```
packages/link/src/app/flows/chance/
  Chance.tsx            # view orchestrator (intro/offers/resolving/result) + new CSS tokens
  offerView.tsx         # OfferRow + headline rendering (Treatment A) + round-up hero; pure presentational
  roundup.ts            # roundUpStake() + frameOffer() ported from @hedge/api calc (pure)
  offersClient.ts       # (exists) requestOffers — extend localOffers to attach display via roundup.ts
  engine.ts             # (exists) fetchPolymarketCandidates, resolveEligibility, matchMarkets, etc.
```

- **`roundup.ts`** — port the small pure `roundUpStake(amount)` and `frameOffer(amount, stake, price)` (honest framing → `{ chancePct, odds, framedDiscountPct, achievesFree, payToday, winPayout }`) from `@hedge/api/src/lib/offers/calc.ts`. This lets the client compute `display` for the local fallback so the UI renders identically whether offers come from the server or local. (Closes the gap the engine slice's final review flagged: `localOffers` previously omitted `display`.)
- **`offersClient.ts`** — extend `localOffers` to attach `display` via `roundup.ts` (and a `headline` selection helper can live here or in `offerView`).
- **`offerView.tsx`** — given an `Offer` (`{ id, kind, legs, price, display }`), render a flat row or the Treatment-A headline; render the round-up hero from `amount`. Pure/presentational → unit-testable.
- **`Chance.tsx`** — owns view state (`intro|offers|resolving|result`), `offers` state, `selectedOfferId`, loading. On intro→offers: `stake = roundUpStake(amount)`, fetch candidates (existing), `requestOffers(merchantId, { amount, productTitle, category, mode:'round_up' }, candidates, { fetch, apiBase })` → `setOffers`. Place → `ctx.consume(...)` → simulate result (demo) → result screen.

### Config contract addition

`FlowCtx.config` gains: `merchantId` (string — for `/offers/rank`), optional `productTitle`, `category`, and `apiBase` (where `@hedge/api` is reachable; default to the production API base). The embed loader (`packages/link/src/loader.ts`) passes them through. **Graceful degrade:** missing `merchantId` (or unreachable API) → `requestOffers` falls back to local round-up singles; the UI still works, just without combos/ranking.

### Headline selection (client-side, on top of server order)

`headline = offers.find(o => o.display.achievesFree) ?? offers[0]`. Guarantees "make it free" is the hero whenever a combo reaches `pFree` (the product's core pitch); otherwise the top-ranked offer leads, framed honestly as `$X off`. The rest render in ranked order, headline removed from the list.

## Data flow (happy path)

1. Drop-in opens at checkout in round-up mode; `config` has `amount`, `merchantId`, optional `productTitle`/`category`, `theme`.
2. Intro → offers: `stake = roundUpStake(amount)`; fetch candidates (`fetchPolymarketCandidates`, seed fallback as today).
3. `requestOffers(...)` POSTs to `/offers/rank`; server returns ranked `Offer[]` (singles + combos, each with `display`). On failure → local round-up singles (with client-computed `display`).
4. Offers screen renders headline + ranked rows + tab filter.
5. Place selected offer → `ctx.consume(...)` → simulated resolve → result breakdown. Demo only; no settlement.

## Error handling & edge cases

| Case | Behavior |
|---|---|
| Ineligible region/country | Reuse `resolveEligibility` → "not available in your area" state (themed). |
| `/offers/rank` unreachable / no `merchantId` | Local round-up singles (client `display`); no combos/ranking. |
| No candidates / empty offers | Offers screen shows an empty state ("no markets right now"); CTA disabled. |
| No free-reaching offer | Headline = top-ranked offer, framed `$X off` (never "free"). |
| Parlay selected | Simulated win uses combined price; demo result only. |

## Demo-safety

Placement and result stay **simulated** (as today). The "Demo settlement — real routing coming" badge stays on the result screen. No balance debit, no live settlement (Payment Slice 3). The redesign changes presentation, not money movement.

## Testing (Vitest, `packages/link`)

- **`roundup.ts`** — port the engine's `calc.test.ts` cases: `roundUpStake` (cents, whole-dollar → $1), `frameOffer` (free only at `pFree`, partial otherwise, overshoot capped, payToday).
- **`offerView`** — headline vs flat row; `win → FREE` only when `achievesFree`, else `$X off`; round-up hero copy from `amount`/`stake`; tab filter by `kind`.
- **`offersClient`** — (exists) extend: local fallback offers now carry `display`.
- **`Chance.test.tsx`** — **rewritten** for the 4-view flow: intro round-up copy; offers list renders headline + singles; result breakdown math; ineligible state.

## Build sequencing (single spec, internally modular)

1. `roundup.ts` (ported pure math) + tests.
2. Extend `offersClient.localOffers` to attach `display` + test.
3. New Coinbase token CSS (both themes) in `Chance.tsx`.
4. `offerView.tsx` (OfferRow + headline + round-up hero) + tests.
5. `Chance.tsx` rewrite: 4 views, offers wiring, headline selection, demo result.
6. Config contract: thread `merchantId`/`productTitle`/`category`/`apiBase` through `loader.ts` + `flowCtx`.
7. Rewrite `Chance.test.tsx`; build (`vite build`) green.
8. Update ROADMAP.

## Future work (out of scope here)

- Combos in the static demo without a server (port ComboSource client-side) — deferred per Decision B.
- Deploy `@hedge/api` so the demo runs on the real engine (combos + live AI ranking).
- Optional "stake more" control; native Polymarket combos; ranking cache.
- Public-endpoint auth + per-merchant LLM budget (only once a live provider is enabled).
