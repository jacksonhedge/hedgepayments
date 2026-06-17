# Chance — checkout host surfaces (Stripe-peer payment method) — Design

> **Status:** Design (pending written-spec review)
> **Date:** 2026-06-17
> **Product:** Chance, a Hedge Pay product. Chance is a **payment method** and a **route to/through real prediction markets only** — Hedge is the router, never the house.
> **Builds on:**
> - `docs/superpowers/specs/2026-06-16-chance-dropin-coinbase-redesign-design.md` — the redesigned drop-in (the shared Chance flow this work hosts).
> - `docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md` — the offer-ranker + parlays + round-ups engine the drop-in surfaces.

## Summary

Present **Chance as a first-class payment method** — a peer to the Stripe lineup (Card, Apple Pay, Klarna, Affirm, Link) — and demonstrate it across **matching host surfaces**. The end-state vision: when a merchant's checkout renders its payment options, Chance appears right there in the list. This spec reworks the existing `/store` demo into a Stripe-Payment-Element-style checkout where Chance sits in the method list, and brings the Chrome extension to visual + feature parity, so both render the **same** Chance flow.

The crux is **one shared artifact** (Approach A): the redesigned `packages/link` drop-in (built `public/embed/chance.js`) is the single Chance flow. The web checkout embeds it; the extension vendors it through its existing `verify-widget` hash gate. The two surfaces therefore match **by construction**, not by eyeballing. A future native Swift iOS checkout is a forward-looking seam — designed for, not built here.

### Distribution / positioning

The end goal is that Hedge **white-labels CoinFlow as the underlying gateway** and **bundles Chance as a built-in payment method in the gateway it sells** — so every merchant who takes the white-labeled Hedge gateway gets Chance as a native checkout option, no per-merchant integration. This demo is the proof of that pitch: the "Stripe-peer method" framing throughout is really "peer method inside the Hedge/CoinFlow gateway lineup." Nothing in the demo work changes based on the underlying gateway (Chance-in-the-method-list is identical); this note just fixes *why* the demo exists. Chance remains a payment method and a route to/through real prediction markets only — Hedge is the router, never the house.

## Background / current state

- **Site `/store`** (`app/store/{page.tsx,store.module.css,layout.tsx}`): a simulated Shopify storefront → checkout with a payment-method list (Debit/Credit/Venmo/Klarna/Chance) → the Chance flow → result. Today the checkout is custom-styled (not Stripe-Payment-Element-shaped) and the Chance flow is the old arcade slider drop-in.
- **Shared drop-in** (`packages/link/src/app/flows/chance/`): Preact flow `Chance.tsx`, the `requestOffers` client (`offersClient.ts`), the local engine. Built to `public/embed/chance.js` and exposed as the `<chance-checkout>` web component (Shadow DOM, themeable). The `2026-06-16` redesign rewrites this flow to the Coinbase look + round-up/combos UI; **this spec consumes that, does not redo it.**
- **Engine** (merged): `@hedge/api` `POST /api/v1/offers/rank` (round-up pool + synthetic combos + AI ranking + deterministic fallback). Demo-tier — no settlement (Payment Slice 3).
- **Extension** (`~/Projects/HedgePayments/chance-extension/`, separate git repo, not published): MV3. `content.js` detects checkouts + reads order total → floating bubble → vendored `vendor/chance.js` opens the headless `<chance-checkout>`. `popup.{html,css,js}` is an arcade "wallet" with fixed-SEED demo data. `sync-widget.mjs` + a `verify-widget` hash gate keep `vendor/chance.js` identical to the site's `public/embed/chance.js`. Detection already **fails closed** (requires a labelled order total + a pay/platform signal).
- **No iOS surface exists** — repo is `website` + `chance-extension` only; no Swift/Xcode target.

## Goals

- Rework `/store` so the payment step **reads as a Stripe Payment Element** — familiar accordion/radio method rows — with **Chance as one of the rows**, alongside realistic stand-ins for Card, Apple Pay, Klarna, Affirm, Link.
- The **Chance row + the flow it opens** use the Coinbase-style Chance palette (navy/dark surfaces, UI-blue accent — exact tokens per the `2026-06-16` redesign spec / `docs/coinbase-wallet-extension-reference.md`, not redefined here). The surrounding checkout chrome stays **neutral** (merchant-owned look).
- Selecting Chance **expands the shared drop-in inline** in the method panel — the way Klarna/Affirm expand under Stripe — making "Chance is a peer method" literal.
- Bring the **extension to parity**: restyle popup + bubble to the Coinbase palette and vendor the redesigned drop-in, so its injected flow is the same artifact with combos/parlays.
- **Matching is structural** — both surfaces render the identical built `chance.js`; the `verify-widget` hash gate enforces it at build time.
- **Portable contract** so a future native Swift iOS checkout can present Chance as a method and consume the same offer/result contract.

## Non-goals (this spec)

- Re-speccing the drop-in flow itself (owned by `2026-06-16`).
- A brand-new demo route — this is a **rework of `/store`**, not a new page.
- Native Swift / SwiftUI code, or an iOS app. iOS is a design seam only.
- New extension **detection** work, a wallet, or store submission (detection already fails closed; out of scope).
- Real Stripe SDK / live payment processing. The non-Chance method rows are **visual stand-ins** for the demo.
- Bet settlement / real money (Payment Slice 3; gated).

## Decisions locked in brainstorming

- **A — one shared artifact.** The redesigned drop-in is the single source of truth; web + extension both render it. (Rejected: shared-tokens-separate-flows — drifts; embedding the literal extension UI in the site — muddies the Stripe-peer pitch.)
- **Site host = rework `/store`** into a Stripe-Payment-Element-style checkout (not a new route).
- **Chance row in the Chance/Coinbase palette; checkout chrome neutral.** A real merchant owns the checkout's overall look; Chance carries its own identity inside its row + flow.
- **Chance selection expands the drop-in inline** in the Payment Element panel (peer-method presentation).
- **Extension = parity only** — redesign + combos/parlays via the vendored drop-in. Detection unchanged.
- **iOS = future seam, not built.** A native Swift checkout will eventually be a host surface; design the contract to accept it, build no Swift now.

## Architecture

Three host surfaces, one core. Each host is a **thin presenter** that opens the shared flow with an order amount and reacts to its result.

```
                ┌─────────────────────────────┐
                │  Shared core (built once)    │
                │  packages/link → chance.js   │
                │  <chance-checkout> web comp  │
                │  redesigned flow, round-up   │
                │  default, combos/parlays via │
                │  /offers/rank                │
                └──────────────┬──────────────┘
        embeds it      vendors it (hash-gated)   future: WKWebView / native
            │                  │                         │
 ┌──────────▼────────┐ ┌───────▼─────────┐     ┌─────────▼──────────┐
 │ Web host          │ │ Extension host  │     │ iOS host (future,  │
 │ /store checkout = │ │ bubble + popup, │     │ NOT built): Swift  │
 │ Stripe Payment    │ │ Coinbase look,  │     │ checkout presents  │
 │ Element look,     │ │ injects the     │     │ Chance as a method;│
 │ Chance = a row    │ │ shared flow     │     │ embeds same flow   │
 └───────────────────┘ └─────────────────┘     └────────────────────┘
```

### 1. Shared core (dependency — not built here)
The redesigned `packages/link` drop-in. Inputs via `config` (`amount, currency, mode, theme, country, region`, plus `api-base` for offers). Outputs via DOM events `chance:applied` / `chance:result`. Built to `public/embed/chance.js`.

### 2. Web host — Stripe-Payment-Element-style checkout (`/store` rework)
- **Method list** styled as a Stripe Payment Element: stacked accordion/radio rows, hairline dividers, a selected row expanding a panel beneath it. Rows: **Card** (expands a card-number/expiry/CVC form), **Apple Pay**, **Klarna**, **Affirm**, **Link**, **Chance**. Non-Chance rows are inert visual stand-ins (selecting them shows a simple "demo only" panel or a disabled pay button).
- **Chance row:** Chance mark + label ("Round up to win — up to a free order") in the Coinbase palette. Selecting it renders the `<chance-checkout>` drop-in **inline** in the expanded panel, themed dark or light to suit the checkout. The order amount (keyboard $85 default, configurable) is passed to `config.amount`.
- **Result wiring:** the checkout listens for `chance:result` and updates the order summary ("You paid **$Y**" / "**FREE**"). `chance:applied` can reflect the staked round-up in the summary.
- **Chrome neutral:** the storefront/checkout shell keeps its current neutral merchant styling; only the Chance row + its panel carry the Chance palette.
- **Demo chip:** the drop-in's persistent "Demo · no real money yet" chip is retained; the checkout adds no claim of live processing.

### 3. Extension host — improved bubble + popup
- Restyle `popup.{html,css,js}` and the injected bubble to the Coinbase palette; retire the arcade die / Press Start 2P identity so it matches the web host. The popup's fixed-SEED demo data stays **deterministic**, just re-skinned.
- Re-run `npm run sync-widget` so `vendor/chance.js` is the redesigned build; the injected `<chance-checkout>` is now the same flow with combos/parlays. No changes to `content.js` detection.
- `verify-widget` hash gate must pass (vendored copy == site's `public/embed/chance.js`).

### 4. Future iOS seam (designed, not built)
A native Swift checkout will present Chance as a payment method and obtain offers from the **same contract**:
- **Offer contract:** `POST /api/v1/offers/rank` (round-up amount in → ranked offers out) is transport-portable; a Swift client calls it identically.
- **Result contract:** the `chance:applied` / `chance:result` payload shapes are the portable event contract; a WKWebView host bridges them to Swift, a native host emits equivalents.
- **Cheapest path to matching:** a future iOS checkout embeds the **same `chance.js`** in a WKWebView (responsive/webview-safe drop-in → matches by construction). Native SwiftUI reimplementation is an option later, kept honest against the same offer/result contract + Coinbase tokens.
- **This spec's only iOS obligation:** keep the drop-in mobile-viewport correct (already a redesign concern) and keep the offer/result contract free of web-only assumptions. No Swift, no app.

### Matching guarantee
Web and extension render the **identical built `chance.js`**. `verify-widget`'s hash gate fails the extension build if its vendored copy drifts from the site's. Matching is enforced at build time, not by review.

## Data flow (happy path, demo-tier)

**Web:**
1. Shopper picks a product → checkout; order amount known.
2. Shopper selects the **Chance** method row → panel expands → `<chance-checkout config.amount=...>` mounts.
3. Drop-in calls `requestOffers` (round-up mode) → `/offers/rank` → ranked offers (free-order combo headline when reachable + `@hedge/api` up; else round-up singles).
4. Shopper picks an offer → **simulated** resolve → drop-in emits `chance:result`.
5. Checkout updates the order summary ("You paid $Y / FREE").

**Extension:** `content.js` detects a checkout + reads the labelled order total → opens the vendored drop-in with that amount → identical steps 3–5; `background.js` badges/stores the play.

## Demo-safety & the static-export caveat

- Site is a static export (`output: 'export'`) — the drop-in runs client-side. **Combos + AI ranking light up only when `@hedge/api` is reachable**; otherwise both surfaces degrade to **round-up singles** (redesign Decision B). Same behavior in both → they still match.
- Persistent "Demo · no real money yet" chip on both; **honest framing** (an offer is "free" only when its combined price actually reaches the free-order target); response carries no settlement/live fields.

## Testing

- **Web `/store`:** the Payment Element renders all method rows; selecting Chance mounts the drop-in; a `chance:result` updates the order summary; non-Chance rows are inert. Playwright on `/store` (the existing browser-agent QA-prompt pattern, `docs/prompts/`).
- **Extension:** `verify-widget` hash gate green (vendored == site build); load-unpacked manual check (the isolated-world `customElements.upgrade()` path can't be exercised via Playwright here) of the restyled bubble/popup + the injected redesigned flow.
- **Matching:** the hash-gate equality *is* the automated matching test. A short note in the `/store` QA prompt to eyeball that the inline Chance panel matches the extension bubble's flow.

## Build order

1. (Dependency) Redesigned drop-in from `2026-06-16` is built/available as `public/embed/chance.js`.
2. **Web host:** rework `/store` checkout into the Stripe-Payment-Element look with Chance as an inline-expanding method row; wire `chance:result` to the summary.
3. **Extension host:** `sync-widget` the new build; restyle popup + bubble to the Coinbase palette.
4. Run `verify-widget`; Playwright `/store`; load-unpacked extension check.

## File touch list (indicative)

- `app/store/page.tsx`, `app/store/store.module.css` — Payment Element rework + Chance row + result wiring.
- (consume only) `public/embed/chance.js` / `packages/link/...` — the redesigned drop-in.
- `chance-extension/popup.{html,css,js}`, the bubble styles in `content.js`/its injected CSS, `vendor/chance.js` (via `sync-widget`).

## Dependencies & docs index

- Redesigned drop-in — `docs/superpowers/specs/2026-06-16-chance-dropin-coinbase-redesign-design.md`
- Offer engine (ranker + parlays + round-ups) — `docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md`
- Brand architecture (Chance = payment method / router, not house) — `docs/superpowers/specs/2026-06-03-hedge-brand-architecture-design.md`
- Visual reference (Coinbase tokens) — `docs/coinbase-wallet-extension-reference.md`
- Roadmap (source of truth) — `ROADMAP.md`
