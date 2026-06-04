# Chance Drop-in — Embeddable Checkout Widget

**Date:** 2026-06-04
**Status:** Approved design
**Scope:** Turn the `/store` Chance flow into a real, embeddable B2B drop-in any merchant can add to any checkout. Builds a working, self-contained proof in the HedgePayments website. Implements the Chance product (formerly speced as "PayFlip" in the brand-architecture record).

---

## 1. One-paragraph summary

Chance becomes a single embeddable **web component** — `<chance-checkout>` — that a merchant drops into any checkout with two lines of HTML. Behind it sits **one market-sourcing engine** (ported, network-free, from `sneakers-trading`) that selects real prediction-market positions near a target probability. The same selected offer renders in **two settlement modes** the merchant chooses by config: **flip-to-free** (shopper pays item price + a small premium that buys a real YES position; a win covers the whole purchase → pay $0) and **win-it-back** (shopper pays full price, stake is fronted on the house, a win credits a slice back). The proof is fully self-contained in the HedgePayments website (vendored engine + seeded market snapshot + a `/api/chance/offers` route) so it deploys to Vercel with no new infrastructure.

---

## 2. Design decisions (settled)

| Decision | Choice | Why |
|---|---|---|
| Mechanic | **Both, merchant-configurable** (`mode` flag) | One sourcing engine, two settlement framings — covers the `/store` win-back demo *and* the spec's flip-to-free. |
| Form factor | **Script + web component** (`<chance-checkout>`) | Framework-agnostic, "drop 2 lines into any checkout," isolates our logic. |
| Isolation | **Shadow DOM** (no iframe) | iframe-grade CSS isolation without iframe overhead; the bet never touches card data, so no PCI reason to need one. |
| Proof host | **Self-contained in the website** | Vendored pure engine + seeded snapshot + API route → deploys to Vercel today, no cross-origin/live-data flakiness. |
| Settlement (proof) | **Simulated**, seeded by the offer's true probability, labeled as such | Matches the architecture spec: Chance is sourcing/routing now, execution later. |
| Demo surface | **New generic checkout page**, not the Lumen `/store` | Proves portability ("any checkout"); avoids regressing the polished demo. |

---

## 3. Architecture

```
Merchant checkout (any site)
  │  <script src=".../embed/chance.js"> + <chance-checkout amount mode theme>
  ▼
<chance-checkout>  (Shadow DOM, vanilla TS, public/embed/chance.js)
  │  POST { amount, currency, mode, country?, region? }
  ▼
/api/chance/offers  (Next route in the website)
  │  resolveEligibility → loadSeedSnapshots(venue) → findChanceOffers
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

1. **`lib/chance/engine.ts`** — vendored verbatim from `sneakers-trading/apps/platform/src/lib/chance/engine.ts`. Pure: `MarketSnapshot[]` → `ChanceOffer[]`. No network. Source of `premiumToProb`, `probToPremium`, `oddsLabel`, `findChanceOffers`, `defaultTiers`.
2. **`lib/chance/snapshots.ts`** — seeded, deterministic `MarketSnapshot[]` (a Kalshi set + a Polymarket set) covering a spread of probabilities so every default tier finds a match. Replaces the live `source.ts`. Exposes `loadSeedSnapshots(venue)`.
3. **`lib/chance/eligibility.ts`** — vendored, trimmed geo gate (`resolveEligibility`, `venueBrand`): US→Kalshi, intl→Polymarket, blocked → not offered. Demo defaults to US/Kalshi when geo is absent.
4. **`lib/chance/types.ts`** — the `MarketSnapshot` shape the engine needs (extracted minimal subset, so we don't drag in `markets-data`).
5. **`app/api/chance/offers/route.ts`** — `POST` handler. Validates `amount`, resolves eligibility, loads seed snapshots, runs the engine, returns mode-aware payload. Graceful states for ineligible / no-markets / bad-amount.
6. **`embed/chance.ts`** → built to **`public/embed/chance.js`** — the `<chance-checkout>` custom element. Vanilla TS, Shadow DOM, attribute config, fetch → render picker + result, emit events. Picker + result UI ported from `/store`.
7. **`scripts/build-embed.mjs`** — esbuild bundle step (IIFE, minified) producing `public/embed/chance.js`; wired into an npm script and the build so Vercel emits it.
8. **`app/chance/page.tsx`** — the proof: a generic third-party checkout that drops in the two lines, plus a live `mode`/`theme` switcher and the copy-paste snippet + event-listener integration story.

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

- **Unit:** engine math (`premiumToProb`/`probToPremium`/`oddsLabel`) and `findChanceOffers` (match, no-match → `available:false`, `mustMakeWhole`).
- **API route:** eligible → offers; ineligible geo → blocked; both modes return correct framing.
- **Smoke (Playwright):** load `/chance`, open the modal, assert an offer renders and `chance:applied` fires.

---

## 8. Out of scope (YAGNI for this proof)

- Real bet execution / settlement on Kalshi/Polymarket (spec: later phase).
- Live market fetch (seeded snapshot is deliberate for a deterministic proof).
- Auth / merchant API keys / billing (the `api-base` attribute is the future seam).
- Publishing `@hedge/chance-react` (a thin wrapper over this script embed is a later add).
- Modifying the Lumen `/store` (optional dogfood stretch, tracked separately).
