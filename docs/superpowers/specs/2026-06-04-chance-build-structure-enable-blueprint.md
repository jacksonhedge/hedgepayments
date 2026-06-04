# Chance — Build, Structure & Enable Blueprint

_Hedge Pay product · v1 · 2026-06-04 · grounding verified against `chance-extension/` + `website/public/embed/chance.js`_

## 1. Thesis

Chance is a checkout-time offer that routes a shopper's small stake to a **real, licensed prediction market** for a shot at a discount up to a free order — with Hedge Pay as the **router, never the house**. Today it is fully client-side and honest about it (live Polymarket data via the CORS-open Gamma API, but **simulated settlement** via `Math.random() < price`, a **client-side spoofable geo gate**, and **zero KYC**), which is correct for a demo and unshippable for real money. The path to real money is not "bolt more logic into the static widget" — it is to **introduce exactly one new thing the architecture is missing: a single small backend service behind the widget's already-existing `api-base` seam**, then move sourcing, eligibility, settlement, and telemetry behind it, gated by a **written counsel opinion** and a **licensed-partner-holds-funds** custody design. The two front-end surfaces (merchant **embed** = the transacting product; browser **extension** = a demand funnel that cannot settle on third-party checkouts) stay thin renderers that consume the same normalized offer shape they already render, with **one widget source of truth** and an automated hash-gated sync so the bundled copy can never silently drift.

## 2. Target architecture

The system is one widget (rendered two ways), one backend service, and the Hedge spine beneath it. The widget already exposes the seam: `chance.js` reads the `api-base` attribute (line ~382) and, when set, fetches offers/eligibility from it instead of computing in-browser. Everything below hangs off standing that service up.

```
            ┌──────────────────────────── ONE WIDGET SOURCE ───────────────────────────┐
            │  website/src/embed/chance.src.js  →  build → public/embed/chance.<ver>.js │
            │                              (engine math + UI, no remote-code dep)        │
            └───────────────┬───────────────────────────────────┬───────────────────────┘
                  build copies + hash-gates                 served by CDN (immutable hashed path)
                            │                                     │
        ┌───────────────────▼─────────────┐        ┌──────────────▼────────────────────────┐
        │ EXTENSION  (MV3, bundled copy)   │        │ MERCHANT EMBED (website / store)        │
        │ content.js (isolated world):     │        │ <chance-checkout api-base=… amount=… >  │
        │  • detect checkout (adapters)    │        │  • listens chance:applied / chance:result│
        │  • render widget in OWN closed   │        │  • APPLIES the discount to the order     │
        │    Shadow DOM (extension origin, │        │    (draft-order / discount-code / refund)│
        │    CSP-exempt) — NO page-bridge  │        │  • this is the TRANSACTING surface       │
        │  • api-base = offers.hedge…      │        └──────────────┬──────────────────────────┘
        │  • connect-src declares offers+  │                       │
        │    gamma host in manifest CSP    │                       │
        └───────────────────┬──────────────┘                      │
                            │   HTTPS (api-base)                   │  HTTPS (api-base)
                            └──────────────┬───────────────────────┘
                                           ▼
        ┌──────────────────────── HEDGE OFFERS SERVICE (separate deploy) ────────────────────┐
        │  offers.hedgepayments.com — Vercel Functions OR Hono worker (NOT in static site)     │
        │  POST /offers      → Kalshi(authed proxy)+Polymarket, normalize→1 schema, cache 5-15s │
        │  POST /eligibility → server IP-geo ∩ counsel allow-list ∩ age/KYC  (FAIL CLOSED)      │
        │  POST /place       → idempotency-key; reserve→confirm two-phase                       │
        │  POST /events      → telemetry collector (event+platform+sha256(host)+versions only)  │
        └───────────────────────────────────────┬────────────────────────────────────────────┘
                                                 ▼
        ┌──────────────────────────────── HEDGE PAY SPINE ──────────────────────────────────┐
        │  Accounts/KYC · LEDGER (system of record) · Wallet ("Bankroll") · Payouts          │
        │  CoverPay = internal white-label Stripe layer                                       │
        │  CUSTODY RULE: licensed market (Kalshi DCM) + Stripe Treasury/Connect HOLD funds.   │
        │  Hedge ledger RECORDS movement only — never sits in the flow of funds as principal. │
        └─────────────────────────────────────────────────────────────────────────────────────┘
```

**How vendor-drift is eliminated (do this before any other code touches `chance.js`).** Today `vendor/chance.js` is byte-identical to the embed (both sha256 `c73b851c…`, verified) but the README literally instructs a manual `cp`, which guarantees eventual divergence on exactly the security-relevant code (geo, api-base, settlement). Fix:

1. `git init` the extension folder (it is not a repo today).
2. Designate **`website/public/embed/chance.js` as the single source**. Add `npm run sync-widget` that copies it into `vendor/`, writes `vendor/chance.version.json` (`{version, sha256, builtAt}`), and stamps the version into a constant the widget exposes for telemetry.
3. Add a **pre-package / CI gate** that recomputes both hashes and **fails the build if they diverge**. The extension can no longer be packaged with a stale widget.
4. **Never load the widget from `hedgepayments.com` at runtime in the extension** — that is remote code and an MV3 rejection. (This resolves the architecture-dim "load embed by CDN reference" recommendation: it is correct **only for the website embed**; in the extension it would also re-point `ASSET_BASE` — `new URL(THIS_SCRIPT.src).origin`, line ~38 — to the website origin and break extension-origin logo/asset loading. Bundle in the extension, reference-by-CDN on the website.)

## 3. The simulated → real-money path

Each stage names what it unlocks and what gate must clear to advance. **Settlement stays simulated-with-label everywhere except the single gated real slice** until execution + reconciliation are proven.

| Stage | What runs | What unlocks the next stage |
|---|---|---|
| **S0 — Simulated (today)** | Client-side: live Polymarket data, `Math.random()<price` settlement, client geo gate, no KYC. Honest "Demo settlement — real routing coming" label. | The backend service exists and the widget reads from it. |
| **S1 — Service-backed, still simulated** | `api-base` points at Offers service. **Kalshi proxy live** (flips "· soon" → real rows). Polymarket moved server-side (cache/normalize/rate-limit). **Geo + eligibility server-authoritative** (client `country`/`region` treated as demo-override only, **disabled in prod**). Settlement still simulated but now seeded by *server-sourced* real markets. | Written counsel opinion (framing, per-state allow-list, Hedge-not-MTL). Custody design signed off. KYC + responsible-gaming data model built. |
| **S2 — First real stake (sandbox)** | **One venue (Kalshi), one mode (win-it-back capped at order price** → bounded max loss, no shopper-stake custody to license around). Real two-phase order in **Kalshi sandbox**. Server gate fails closed on geo/age/KYC. Licensed partner holds funds. | Sandbox end-to-end proven: reserve→placed→filled→resolved→credited, with reconciliation clean. |
| **S3 — First real stake (production, narrow)** | Same slice in production funds, **one friendly merchant (FraternityBase — founder owns both sides)**, low order-value ceiling. Reconciliation job nightly. | Stable production reconciliation + clean audit; counsel sign-off to widen jurisdictions/merchants. |
| **S4 — Widen** | More merchants/states; **then** flip-to-free (custodies shopper premium → heavier compliance, deliberately last). Polymarket real-money execution is a **separate later track** (on-chain USDC, US-restricted, likely rides the Bankroll embedded-wallet rails — parked behind the open embedded-wallet vendor decision). | Each widening is its own counsel + reconciliation gate. |

**The custody contradiction, resolved (authoritative):** the live-data dimension's phrasing "Hedge holds funds, routes the position, credits via the ledger" is **superseded** by the compliance rule. Hedge holds funds **never, even momentarily** — that likely triggers ~45-state money-transmitter licensing + FinCEN MSB. The authoritative money flow is: **shopper stake → licensed market deposit rails (Kalshi DCM holds member funds); winnings paid back via Stripe Treasury/Connect (CoverPay); the Hedge ledger only RESERVES and RECORDS.** Two-phase reserve→confirm; per-cart idempotency key. Any design with funds resting in a Hedge-controlled account is non-viable until licensed.

## 4. How users get enabled end-to-end

**Merchant (the product that transacts).** Lead here — only the embed has a host page listening for `chance:applied` / `chance:result`, so **only the embed can actually apply a discount and earn a fee**.

1. Merchant drops in `<chance-checkout>` + the CDN script (two lines), sets `api-base` and `mode`.
2. At checkout the widget renders intent-first (intro → risk/win sliders → live markets near those odds → handshake → result).
3. On a win, the embed must **actually reduce what the merchant captures** — this is the currently-unspecified piece that the conversion-lift case study and all real money depend on. Pick one explicit mechanism per platform: **Shopify draft-order / discount-code application** (cleanest, pre-capture) for win-it-back; **post-capture partial refund** as the fallback. The "credit the order through the ledger" hand-wave must become a concrete per-platform integration before "dogfood for a lift number" produces trustworthy data.
4. **Dogfood now (simulated, labeled):** run the embed in win-it-back mode on the `/store` demo and one FraternityBase checkout, instrument the funnel, and produce **one credible conversion/AOV-lift number**. That owned data is the entire merchant pitch and cannot come from the extension.

**Shopper.** Two entry points:
- **Embed (on a Chance-enabled store):** sees the offer inline, configures, plays. For real money (S2+), the widget shows a **"verify to play"** gate (age + KYC) and required disclosures **before** any stake.
- **Extension (demand funnel):** install once → it detects a checkout, reads the total, renders the widget **inside the content script's own closed Shadow DOM (extension origin)** and offers a play. On third-party checkouts there is **no host listening**, so it **cannot settle** — its job is to drive a "request Chance at your store" waitlist (outbound sales fuel) and let the shopper experience the loop. Per-site enable/pause lives in `chrome.storage.sync`, checked in `content.js` detect.

## 5. Compliance gating checklist — ALL must be server-side true and FAIL CLOSED before any real stake

A stake is placed only if every line is true; default **DENY** on any unknown.

1. **Counsel opinion in writing** covering (a) routing framing keeps Hedge out of money-transmitter status, (b) per-state allow-list for CFTC event contracts as of mid-2026, (c) Hedge-as-principal vs shopper-as-principal on Kalshi reads as routing, not a book.
2. **Jurisdiction allow-listed** from **server-derived** location (IP + KYC'd address), intersected with a **counsel-maintained allow-list** (not the stale `US_BLOCKED` JS object at `chance.js` lines 69–78; that becomes UX pre-filter only and the `country`/`region` demo-override is disabled in prod).
3. **Age verified** to threshold (18 federal CFTC floor; **treat 21 conservatively** given the gambling-adjacency and college-aged audience).
4. **KYC/identity verified + OFAC-cleared** (ride Kalshi's DCM KYC/AML program where possible; vendor choice stays parked, integration point is not optional).
5. **Funds custodied by the licensed market / Stripe Treasury-Connect — never Hedge.**
6. **Required disclosures shown + accepted this session:** real-financial-position + can-lose-entire-stake risk; the regulated market's name + Hedge-is-router-not-counterparty; ToS + privacy policy.
7. **Responsible-gaming controls available and enforced server-side, keyed to KYC identity:** deposit/loss limits, cooling-off, self-exclusion (data model + enforcement that survives across merchants — this is a **launch blocker for the student audience, not a disclosure line or fast-follow**).
8. **A confirmed real market order exists before stake capture** (two-phase reserve→confirm; per-cart idempotency key; no synthetic outcomes).
9. **Data-layer fails closed too:** during a venue/data outage, the seed/fallback snapshot may be shown **only in simulated/demo mode** — never stake real money against a seed market. Real placement requires a live, confirmed venue market.

## 6. Staged roadmap

Integrates every dimension and the critique's must-do-first items. The two true critical-path blockers — **the counsel opinion** and **the one backend service** — are pulled to the front because every "next/later" item silently assumes them.

| Stage | Goal | Key work | Gate to advance |
|---|---|---|---|
| **NOW-0 (kick off in parallel, blocks everything real)** | Unblock the legal + infra critical path | (a) Engage payments/gaming counsel for the written opinion (framing / per-state allow-list / not-MTL / principal model). (b) **Decide the one host** (own Vercel Functions project vs the existing Railway box next to Sneakers Postgres) and **stand up the thin Offers service**: `POST /offers`, `/eligibility`, `/events` behind `api-base`. | Counsel engaged; service skeleton deployed and reachable at `api-base`. |
| **NOW-1 (extension hygiene, must precede any `chance.js` edits)** | Make the two widget copies un-driftable and CSP-immune | `git init` extension; add `npm run sync-widget` + `chance.version.json` + **CI hash-gate**. **Content-script Shadow-DOM refactor: delete `page-bridge.js`, render widget in the extension's own closed Shadow DOM**, re-wire `chance:result` as a direct in-content callback. Manifest: declare `content_security_policy` `connect-src` for the offers host + `gamma-api.polymarket.com`. | Hash-gate green; widget renders + settles (simulated) on a strict-CSP test checkout with no page-world inject. |
| **NOW-2 (trust before any non-unpacked listing)** | Detection fails closed | Rewrite detection as a **platform-adapter registry** (Shopify / Stripe Checkout host / WooCommerce / BigCommerce-Magento) returning `{isCheckout,confidence,amount,source}`. Generic fallback requires **BOTH a labeled total AND a pay-button**. **Drop the "largest currency string on page" as a staking source** and stop the unconditional `querySelectorAll('*')` on every mutation; scope/throttle the observer. | No false bubble + no bettable amount on a curated non-checkout fixture set. |
| **NEXT-A (service-backed, still simulated = S1)** | Client becomes a renderer; Kalshi goes live | **Kalshi server-side authed proxy** (signed requests, normalize to shared schema, cache 5–15s by venue+prob-band) → flips "· soon" to real rows. Move Polymarket fetch server-side (cache/normalize/rate-limit; seed only as service-side fallback). **Server-authoritative `/eligibility`** (IP-geo ∩ allow-list ∩ age/KYC hook); disable client geo override in prod. Wire **both embed and extension** to pass `api-base` (same normalized offer shape → zero UI rework). | Counsel opinion in hand; custody design signed off; KYC + responsible-gaming data model built; reconciliation harness exists. |
| **NEXT-B (instrument + prove value)** | One funnel, one lift number | Build **merchant-side discount application** (Shopify draft-order/discount-code; refund fallback). Emit one shared funnel schema (impression→open→configure→markets→place→result + merchant lift-vs-control) to `POST /events`. **Telemetry rule: event-name + platform + `sha256(host)` + versions only — never amount/URL/cart.** Dogfood embed on `/store` + FraternityBase. | A credible conversion/AOV-lift number from a correctly-applying discount. |
| **NEXT-C (Web Store readiness — prepare, do NOT submit)** | Listing-ready, decoupled from submission | manifest: drop `tabs` → `activeTab`+`scripting`; **decide `<all_urls>` vs explicit Shopify/Stripe/Woo match list for v1**. Publish privacy policy at `hedgepayments.com/chance/extension-privacy`. Draft single-purpose listing + `<all_urls>` justification. Add a **remote kill-switch / feature-flag fetched from the service** so a money-adjacent client you can't hotfix can be disabled without a store re-review. | Compliance settled (S3) — **"prepare listing" and "submit listing" are separate gates**; do not submit before real-money framing is legal. |
| **LATER-1 (first real money = S2→S3)** | One real stake, narrow | Kalshi **sandbox** end-to-end: win-it-back capped at order price, two-phase `place` with idempotency key, licensed-partner custody, full geo+age+KYC+responsible-gaming gate. Then **production** with FraternityBase + low ceiling. Nightly **reconciliation** diff (venue fills ↔ ledger ↔ merchant order), success+error logging on every Kalshi/Stripe call, circuit-breaker → labeled-simulated on outage. | Reconciliation clean in sandbox, then in production; counsel sign-off to widen. |
| **LATER-2 (widen = S4)** | Scale carefully | More states/merchants (each its own gate); **then** flip-to-free (shopper-premium custody — heaviest lift, last). Playwright smoke suite vs Shopify/Stripe/Woo fixtures. Polymarket real-money execution as a **separate track** on Bankroll/USDC rails. | Per-widening counsel + reconciliation; embedded-wallet vendor decided (Polymarket track). |

## 7. Top open decisions for the founder

1. **Service host:** own Vercel Functions/Edge project (keeps Vercel tooling + Runtime Cache) vs the existing Railway box next to Sneakers Postgres (one ops surface). **Pick before building NOW-0.**
2. **Custody partner mechanics:** Stripe **Connect** vs **Treasury** for the money-movement leg, confirmed with counsel that the integration keeps Hedge as agent/recorder, not transmitter.
3. **Principal model:** Hedge places the Kalshi position from its own account (router/principal, simpler KYC) vs routing the shopper directly onto Kalshi — counsel must confirm the chosen model still reads as routing, not a book.
4. **Age threshold:** 18 (CFTC floor) vs 21 (conservative, given student audience).
5. **Extension v1 host scope:** `<all_urls>` (bigger demand signal, slow/risky financial-category review) vs explicit Shopify/Stripe/Woo match list (fast review, expand later). This is the broad-for-signal vs narrow-for-review tension — **resolve as one decision**, recommend narrow for v1.
6. **Revenue line:** merchant SaaS now (no gambling exposure) → thin **routing fee/spread on the premium, never the outcome** post-counsel → wallet float + merchant-funded win-it-back budgets later. Hard rule: rake the routing fee, never the bet outcome, or Hedge becomes the house.
7. **Sweepstakes parallel path:** build a genuine free-entry, Hedge-funded "win-it-back-with-zero-stake" offer for restricted jurisdictions at launch, or simply show "not available here"? Never blend a real-stake bet with "no purchase necessary" — two clean offers, jurisdiction-selected server-side.

## 8. Concrete next 5 build steps (priority order)

1. **Stand up the thin Offers service behind `api-base`** (pick Vercel-Functions vs Railway first): `POST /offers` (Kalshi authed proxy + Polymarket, normalized to the exact shape `chance.js` already renders — `{marketId,question,outcome,venue,price,winProbPct,resolves_at,liquidity,tags}`), `POST /eligibility` (server IP-geo, fail-closed), `POST /events`. This is the shared prerequisite no dimension currently owns — building it unblocks Kalshi, server-geo, settlement, and funnel analytics at once.
2. **`git init` the extension + add `npm run sync-widget` with a `sha256` `chance.version.json` and a CI hash-gate**, so the bundled widget can never diverge from the source embed before the api-base/geo/settlement edits land in both.
3. **Content-script Shadow-DOM refactor:** delete `page-bridge.js`, render the bundled widget in the extension's own **closed Shadow DOM (extension origin)**, re-wire `chance:result` as a direct callback, and add the manifest `content_security_policy` `connect-src` for the offers host + `gamma-api.polymarket.com`. This makes the widget CSP-immune on exactly the serious checkouts (Shopify Plus, banks) where the current page-world inject silently dies — **do this before wiring `api-base` into the extension** so the server fetch is governed by the extension's own `connect-src`.
4. **Harden detection to fail closed:** platform-adapter registry + a generic fallback that requires both a labeled total and a pay-button, and **remove the largest-currency-on-page value as a staking source**. A false bubble that also sets a bettable amount is the most user-visible trust failure and a merchant-ToS exposure — must precede any non-unpacked distribution.
5. **Engage counsel and write the fail-closed real-money gating checklist as code** (Section 5) as a single server-side precondition every stake passes, defaulting DENY. No settlement, eligibility, or rake code ships until the written opinion lands; until then keep the **"Demo settlement — real routing coming"** label unmissable on configure, place-bar, and result in both the embed and the extension copy.