# Chance Drop-in — Embeddable Checkout Widget

**Date:** 2026-06-04
**Status:** Approved design
**Scope:** Turn the `/store` Chance flow into a real, embeddable B2B drop-in any merchant can add to any checkout. Builds a working, self-contained proof in the HedgePayments website. Implements the Chance product (formerly speced as "PayFlip" in the brand-architecture record).

---

## 1. One-paragraph summary

Chance becomes a single embeddable **web component** — `<chance-checkout>` — that a merchant drops into any checkout with two lines of HTML. Behind it sits **one market-sourcing engine** (ported, network-free, from `sneakers-trading`) that selects real prediction-market positions near a target probability. The same selected offer renders in **two settlement modes** the merchant chooses by config: **flip-to-free** (shopper pays item price + a small premium that buys a real YES position; a win covers the whole purchase → pay $0) and **win-it-back** (shopper pays full price, stake is fronted on the house, a win credits a slice back). The proof is fully self-contained in the HedgePayments website: the engine + a seeded market snapshot are **bundled into the embed and run client-side**, so it works on the site's **static export** (`output: 'export'` → no server routes) and deploys to Vercel with no new infrastructure. The `api-base` attribute is the seam to a real hosted Hedge offers API later.

> **Constraint note (2026-06-04):** the website ships as a Next.js **static export** (`next.config.js` → `output: 'export'`), which is why the `/store` demo is entirely client-side. Server-side API routes do not run on the deploy, so the proof computes offers in the browser. This is also a *better* drop-in story: the sourcing demo needs no merchant backend.

---

## 2. Design decisions (settled)

| Decision | Choice | Why |
|---|---|---|
| Mechanic | **Both, merchant-configurable** (`mode` flag) | One sourcing engine, two settlement framings — covers the `/store` win-back demo *and* the spec's flip-to-free. |
| Form factor | **Script + web component** (`<chance-checkout>`) | Framework-agnostic, "drop 2 lines into any checkout," isolates our logic. |
| Isolation | **Shadow DOM** (no iframe) | iframe-grade CSS isolation without iframe overhead; the bet never touches card data, so no PCI reason to need one. |
| Proof host | **Self-contained, client-side in the embed** | Static export has no server routes; the pure engine + seeded snapshot bundle into the embed JS and run in the browser. Deploys to Vercel today, no cross-origin/live-data flakiness. `api-base` = future hosted-API seam. |
| Settlement (proof) | **Simulated**, seeded by the offer's true probability, labeled as such | Matches the architecture spec: Chance is sourcing/routing now, execution later. |
| Demo surface | **New generic checkout page**, not the Lumen `/store` | Proves portability ("any checkout"); avoids regressing the polished demo. |

---

## 3. Architecture

```
Merchant checkout (any site)
  │  <script src=".../embed/chance.js"> + <chance-checkout amount mode theme>
  ▼
<chance-checkout>  (Shadow DOM, vanilla JS, public/embed/chance.js)
  │  getOffers({ amount, mode, country?, region? })
  │    ├─ default: compute in-browser  ── resolveEligibility → seedSnapshots(venue) → findChanceOffers
  │    └─ if [api-base] set: POST to hosted Hedge offers API  (future)
  ▼
{ eligible, venue, brand, mode, offers[] }
  │  render picker + result (ported /store UI) in Shadow DOM
  ▼
DOM events back to host:  chance:applied  ·  chance:result
```

**One engine, two modes.** The engine selects an offer (a real market outcome near a target probability). The mode only reframes math + copy:

| | flip-to-free | win-it-back |
|---|---|---|
| Shopper pays | `price + premium` | `price` (stake fronted on the house) |
| A win means | pay **$0** (payout covers purchase) | get **$X back** (gross payout, capped at item price) |
| Funds the stake | the shopper (premium) | merchant / Hedge (marketing cost) |
| Same engine offer? | yes | yes |

---

## 4. Components (each one job)

Everything the sourcing demo needs lives **inside the embed** (hand-authored vanilla JS, served as a static asset — same pattern as the existing `public/embed/coverpay-widget.js` and `hedge-widget.js`). No new dependency, no build step, no `package-lock` churn.

1. **`public/embed/chance.js`** — the `<chance-checkout>` custom element, an IIFE with four internal sections, each one job:
   - **engine** — ported from `sneakers-trading/apps/platform/src/lib/chance/engine.ts`: `premiumToProb`, `probToPremium`, `oddsLabel`, `findChanceOffers`. Pure: `snapshots[]` → `offers[]`.
   - **eligibility** — ported geo gate: US→Kalshi, intl→Polymarket, blocked → not offered; defaults to US/Kalshi when geo is absent.
   - **seed snapshots** — deterministic Kalshi + Polymarket market sets spanning a spread of probabilities so every default tier finds a match (replaces the live `source.ts`).
   - **element** — Shadow DOM, attribute config, `getOffers()` (local compute, or POST to `api-base` if set), renders trigger → modal with picker + result (UI ported from `/store`), emits events.
2. **`app/chance/page.tsx`** — the proof: a generic third-party checkout that loads the script and drops in `<chance-checkout>`, with a live `mode`/`theme` switcher, the copy-paste snippet, and an event log showing `chance:applied` / `chance:result`.
3. **`lib/chance/engine.mjs`** *(dev-only, not shipped)* — the engine math as a plain-JS module plus inline assertions, run with `node` to verify the ported math (no test-runner dependency). Mirrors the logic embedded in `chance.js`.

---

## 5. The embed interface (merchant-facing contract)

**Install:**
```html
<script src="https://hedgepayments.com/embed/chance.js" async></script>
<chance-checkout amount="85" currency="USD" mode="flip-to-free" theme="light"></chance-checkout>
```

**Attributes:**

| Attr | Required | Default | Notes |
|---|---|---|---|
| `amount` | yes | — | Order/item price in major units. |
| `currency` | no | `USD` | Display only in the proof. |
| `mode` | no | `flip-to-free` | `flip-to-free` \| `win-it-back`. |
| `theme` | no | `light` | `light` \| `dark`. |
| `api-base` | no | same-origin | Where to POST offers (website now, Hedge API later). |
| `country` / `region` | no | from server geo | Demo override for the eligibility gate. |

**Events (the integration seam):**

| Event | Detail | When |
|---|---|---|
| `chance:applied` | `{ mode, premium, total, offer }` | Shopper added Chance — host adjusts the cart total. |
| `chance:result` | `{ won, mode, amountBack, finalPrice, offer }` | Bet resolved (simulated in proof) — host settles. |

---

## 6. Error handling

- **API:** invalid/missing `amount` → default to a safe value; ineligible geo → `{ eligible:false, reason }`; engine throws → `{ eligible:true, offers:[], error }` (never 500 the widget).
- **Component:** network error → hide trigger or show "Chance unavailable"; `eligible:false` → friendly "not available in your area"; zero offers → "no markets right now."
- **Settlement:** simulated, seeded by the offer's true probability, and visibly labeled "demo settlement."

---

## 7. Testing

No test runner is configured and the deploy is `package-lock`-sensitive, so verification avoids adding infra:

- **Engine math (`node`):** `lib/chance/engine.mjs` carries inline assertions for `premiumToProb`/`probToPremium`/`oddsLabel` and `findChanceOffers` (match, no-match → `available:false`, `mustMakeWhole`, both-mode framing). Run with `node lib/chance/engine.mjs`.
- **Smoke (Playwright MCP):** load `/chance` on the dev server, open the modal, assert an offer renders, place a bet, and confirm `chance:applied` / `chance:result` fire with correct totals in both modes.
- **Build check:** `next build` succeeds (static export emits `/chance` and copies `public/embed/chance.js`).

---

## 7a. Addendum — Plaid-style flow (2026-06-04)

The picker was redesigned into a **Plaid Link-style multi-step flow** (refined-minimal fintech aesthetic) inside the same web component:

1. **Pick** — a searchable, venue-filtered vertical list. Each row is a **venue avatar + market prompt + odds + the mode value + chevron** (Plaid's "select your institution" list, mapped to venues + prompts). Real venue logos: Polymarket's PNG (`<img>` from `ASSET_BASE/logos/polymarket.png`, derived from the embed script's own origin) and a brand-teal "K" tile for Kalshi. The demo merges **both venues' markets** so both logos appear; production restricts to the single geo-legal venue.
2. **Confirm** — selected-market hero + a clean math card (mode-aware) + one CTA (Plaid's "connect" step).
3. **Resolving** — the signature **handshake**: a Hedge ✦ node connected to the venue avatar by a dotted track with traveling dots + a pulse ring ("Connecting to {venue}…").
4. **Result** — Plaid-clean win/lose with breakdown.

Search filters prompts live; venue chips (All / Kalshi / Polymarket) appear when >1 venue is present. Light + dark themes. `chance:applied` fires on confirm→place; `chance:result` after the (simulated) resolve. HTML built from offer data is escaped (`esc()`); the `api-base` path should still sanitize remote `question` strings server-side.

## 8. Out of scope (YAGNI for this proof)

- Real bet execution / settlement on Kalshi/Polymarket (spec: later phase).
- Live market fetch (seeded snapshot is deliberate for a deterministic proof).
- Auth / merchant API keys / billing (the `api-base` attribute is the future seam).
- Publishing `@hedge/chance-react` (a thin wrapper over this script embed is a later add).
- Modifying the Lumen `/store` (optional dogfood stretch, tracked separately).
