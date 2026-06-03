# Hedge — Brand & Payment Architecture

**Date:** 2026-06-03
**Status:** Approved design (decision record)
**Scope:** Strategy + architecture. Defines how **Hedge** (parent) relates to its products and what the shared payment spine is. No implementation in this document — it is the backbone future specs and plans build from.

---

## 1. One-paragraph summary

**Hedge** is a parent brand whose promise is **fun, easy payments — money that doesn't feel like work.** Its flagship, **Hedge Payments (HedgePay)**, is a B2B payments product to start, sitting on a **thin shared spine** (accounts, ledger, wallet, payouts) that Hedge owns. Behind the spine, **CoverPay** — a separate entity the founder controls — provides the white-labeled Stripe integration that actually moves money today; it is invisible to customers and swappable for Hedge's own processor later. Three sibling products ride the same spine: **SideBet** (a round-up plugin sold to sportsbooks), **PayFlip** (a checkout "flip to get it free" plugin that routes stakes to real external prediction markets), and **FraternityBase** (a frat-commerce app). The model is *platform + apps*, PayPal-style: a flagship payment product with structural payment infrastructure behind it and adjacent products on the same rails.

---

## 2. Brand model (decided)

**Platform + apps on a thin shared spine.** Chosen over (a) a full shared platform/monorepo and (b) a brand-only federation.

- Hedge centralizes **only what touches money or identity**. Everything else lives in each product.
- This delivers the platform feel while letting each product ship on its own timeline, with low coupling and low blast radius.
- It is the natural **stage one** toward becoming a processor: owning the ledger from day one is what makes that move possible later. (Full monorepo is the eventual graduation, not the starting point.)

**Mental model (PayPal):**

| PayPal world | Hedge world |
|---|---|
| PayPal (flagship customer-facing product) | **Hedge Payments (HedgePay)** |
| Braintree / Payflow / Hyperwallet (rails behind the scenes) | **CoverPay + the Hedge ledger/wallet spine** |
| Venmo (adjacent product on the same rails) | **SideBet, PayFlip, FraternityBase** |

---

## 3. Entity & layer map

| Layer | Name | What it is | Who it faces |
|---|---|---|---|
| Parent brand | **Hedge** | Umbrella + trust mark ("a Hedge company" / "Powered by Hedge"). Not a product you sell. Promise: *fun, easy payments for users.* | Everyone (brand) |
| Flagship product | **Hedge Payments (HedgePay)** | The payments product. **B2B to start** (merchant payments, embedded payments, payouts, developer API). Public face of the spine. | Businesses & developers |
| Structural rails *(behind the scenes)* | **CoverPay** | Founder-controlled separate entity; the white-label **Stripe integration** the spine calls. Internal infra, not marketed. | Internal only |
| Product on rails | **SideBet** | Round-up plugin sold B2B to sportsbooks (FanDuel, DraftKings…). | Sportsbooks |
| Product on rails | **PayFlip** | Checkout "flip to get it free" plugin sold to general e-commerce merchants. Routes stakes to **real external prediction markets**. | E-commerce merchants |
| Product on rails | **FraternityBase** | Frat-commerce: per-chapter mockups → chapter sales. | Fraternities / brands |

> **Naming housekeeping:** run a trademark/domain check on **PayFlip** (and confirm **HedgePay** as the short form) before committing spend — both are natural names others may hold.

---

## 4. The Hedge core — the thin shared spine

One service, the **Hedge API**, is the only thing all products share. It owns exactly four concerns and nothing else:

1. **Accounts & KYC** — a Hedge identity for businesses and end-users; onboarding/verification routed through CoverPay → Stripe.
2. **Ledger** — double-entry record of every cent through any Hedge product. **System of record.** The asset Hedge owns from day one; the reason the processor endgame is reachable.
3. **Wallet / stored value** — balances, holds, reserves (consumer "Bankroll"-style wallet lives here).
4. **Payouts & movement** — pay-in, pay-out, transfers, settlement — *executed* via CoverPay/Stripe, *recorded* in the Hedge ledger.

**Boundary test:** *if it touches money or identity, it's in the spine; otherwise it's in the app.*

**Explicitly NOT in the spine:**
- Product UI and product-specific data (merchant dashboard, FraternityBase catalog/CRM, SideBet round-up rules, PayFlip checkout widget).
- **PayFlip's odds/markets engine.** Because PayFlip routes to *real external* prediction markets (it is a router/aggregator, not a house book), the odds-sourcing/pricing engine is **PayFlip-owned** and reuses the existing `sneakers-trading` prediction-market infrastructure. The spine moves money; *odds are PayFlip's concern.*

**Below the spine:** only **CoverPay**. Swap it for Hedge's own processor later and nothing above it changes.

---

## 5. Product catalog

| Product | One-liner | Buyer | Consumes from spine | App-owned (not spine) |
|---|---|---|---|---|
| **HedgePay** *(flagship)* | B2B payments: checkout, embedded payments, payouts, dev API | Businesses & developers | *is* the public face of the spine | Merchant dashboard, API docs |
| **SideBet** | Round-up plugin for sportsbooks | Sportsbooks | accounts, ledger, wallet, payouts | Round-up rules, sportsbook integrations |
| **PayFlip** | Checkout "flip to get it free" | E-commerce merchants | accounts, ledger, wallet, payouts | **Odds/markets router** (prediction-market sourcing & pricing), checkout widget |
| **FraternityBase** | Frat-commerce: mockups → chapter sales | Fraternities / brands | accounts, ledger (orders), payouts | Catalog, mockup generator, CRM |
| **CoverPay** *(internal)* | Stripe-integration / white-label wrapper | — not marketed — | *is* the layer the spine calls | Stripe plumbing |

**Two structural reads:**
1. **PayFlip and SideBet are siblings** — both B2B embedded plugins, both consume the spine, each carrying its own domain-specific brain (odds routing vs round-up logic). They are the template for "product on rails."
2. **CoverPay is the only thing below the spine.** Everything else sits on it.

### 5a. PayFlip mechanic (reference)

At checkout for a $5 item, the buyer is offered a chance to get it free by staking a small amount on a prediction-market position whose payout, if it hits, covers the purchase — priced as a risk ladder:

| Stake | Implied odds | Payout if win | Buyer outcome if win |
|---|---|---|---|
| $0.50 | ~10x | $5 | item effectively free |
| $1.00 | ~5x | $5 | item effectively free |
| $4.00 | ~1.25x | $5 | item effectively free |

Cheaper stake = longer odds. Hedge/PayFlip is the **router** to a real external market (Kalshi/Polymarket/etc.), **not** the counterparty. Constraint: real odds/liquidity must exist near those price points — PayFlip's engine selects/composes positions to approximate the ladder.

---

## 6. Money & data flow

Every product follows the same shape:

> **App handles product logic → calls Hedge API for money → Hedge records it in the ledger → CoverPay/Stripe actually moves it.**

| Product | Pay-in | What the spine does | Pay-out |
|---|---|---|---|
| **HedgePay** (merchant) | Customer pays merchant via Hedge checkout/API | Ledger credits merchant balance; Hedge fee recorded | Settle to merchant bank |
| **FraternityBase** | Chapter buys merch | Funds held in Hedge wallet as the order; FB margin recorded | On fulfillment, pay brand/Printful |
| **SideBet** | Sportsbook user's round-up captured at deposit/bet | Spare change swept into wallet/position | Settle back to user/sportsbook |
| **PayFlip** | Buyer pays item price + optional stake | Item settles normally; stake handed to PayFlip odds engine → external prediction market; on win, payout credited so the purchase is free | Refund-as-winnings via ledger |

**Invariant:** the Hedge ledger is the system of record; CoverPay/Stripe is the executor.

---

## 7. Domains & surface map

Decision: **parent domain + sub-paths/subdomains.** B2B-first.

- **hedgepayments.com** — doubles as the **Hedge parent hub** *and* the **HedgePay** (B2B flagship) site for now.
- **dashboard.hedgepayments.com** / **developers.hedgepayments.com** — merchant dashboard + API docs (the rails surface).
- **sidebet.hedgepayments.com** / **payflip.hedgepayments.com** — the two embedded plugins' marketing pages (can later redirect dedicated `.com`s here).
- **fraternitybase.com** — keeps its own domain; wears an "a Hedge company" badge.
- A cleaner **consumer domain** is acquired *later*, when the consumer wallet ships and the promise goes fully "for users."

---

## 8. Repo posture

- **Stay separate now** (Approach A). Repos today: `~/Projects/HedgePayments/website` (Hedge hub + flagship), `~/FraternityBase`, `~/sneakers-trading` (PayFlip odds engine source).
- The integration seam is a defined **Hedge API contract** (the four spine endpoints) plus a shared **`@hedge/sdk`** client package later.
- **PayFlip reuses `sneakers-trading`** prediction-market infra as its odds engine — do not rebuild it.
- **No monorepo yet.** Consolidation toward a monorepo/shared-platform is the Approach-B graduation, justified by scale, not undertaken now.

---

## 9. Phased roadmap

1. **Spine MVP** — Hedge API over CoverPay/Stripe: accounts, ledger, wallet, payouts.
2. **HedgePay B2B** — merchant onboarding + checkout + payouts (the revenue wedge).
3. **Dogfood: FraternityBase** onto the spine — real money, founder owns both sides, lowest risk. First proof the rails work end-to-end.
4. **SideBet** — sportsbook pilot on the spine.
5. **PayFlip** — wire odds engine (`sneakers-trading`) + spine; **resolve compliance framing first** (see §10).
6. **Consumer wallet** — realizes "fun & easy payments for users"; begin the **own-processor** path (replace CoverPay).

---

## 10. Risk & compliance flags

- **Holding funds:** the wallet holds stored value, which raises money-transmission/custody questions **even while white-label**. Mitigate early by leaning on Stripe Connect/Treasury custody (funds held by the licensed partner, not Hedge directly).
- **PayFlip:** most compliance-sensitive product. A real-money "bet to get it free" at general-merchant checkout reads as gambling (CFTC for prediction markets; state-by-state). The legal escape hatch is a **sweepstakes/promotional** structure ("no purchase necessary"). The routing-to-real-prediction-markets model keeps Hedge as a router (not the house), which helps — but the consumer-facing framing must be settled with counsel **before launch**.
- **SideBet:** gambling-adjacency depends on the exact round-up mechanic; review per-product and per-sportsbook-jurisdiction.
- **CoverPay dependency:** founder-controlled, but a single point beneath the spine. The spine's clean boundary (only CoverPay sits below it) is what makes that risk swappable rather than structural.

---

## 11. Open items / decisions parked

- Trademark + domain availability for **PayFlip**; confirm **HedgePay** short form.
- Exact **Hedge API contract** (the four spine endpoints) — defined in the implementation spec, not here.
- PayFlip legal structure (prediction-market routing vs sweepstakes) — counsel before launch.
- When/whether to acquire the consumer domain and launch the wallet (phase 6 trigger).
- Monorepo graduation criteria (what scale justifies Approach B).
