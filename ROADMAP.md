# Chance — Product Roadmap

> **Chance, a Hedge Pay product.** Shoppers risk a little to win a discount (up to a free order) by backing a real prediction market. Hedge Pay is the **router, not the house**.
>
> **This file is the source of truth.** Mirrored to Notion. The per-slice engine is the superpowers loop (**brainstorm → spec → plan → execute**); this file sequences the slices and tracks the gates above them.
>
> **Last updated:** 2026-06-08

Status legend: ✅ shipped · 🔨 in progress · ⏭️ queued · 🔒 blocked on a gate

---

## NOW

### ✅ Payments — Slice 1: Funding (cash-in) — BUILT (Stripe test mode), pending live wiring
The full **confirmed-payment** pipeline is implemented, tested (12/12 backend + extension funding test), reviewed, and merged to `main`: `@hedge/api` endpoints (`POST /wallet`, `POST /funding/sessions`, raw-body Stripe **webhook**, `GET /wallet/:id`), idempotent `credit_wallet` (migration `004`), and the extension's real "pay with card" path. CoinFlow stays simulated.
- **Spec:** `docs/superpowers/specs/2026-06-05-chance-wallet-funding-design.md` · **Plan:** `docs/superpowers/plans/2026-06-08-chance-wallet-funding-slice1.md` · **Runbook:** `packages/api/CHANCE_FUNDING.md`
- 🔒 **Live E2E pending (needs you):** Stripe test keys (`sk_test_…` + `whsec_…`) + a test Supabase with migrations 001 + 004 applied + `@hedge/api` running (local + Stripe CLI is fine).

### ✅ Engine — AI offer-ranker + parlays + round-ups — BUILT (server), demo-tier, UI deferred to redesign
The full server engine is implemented, tested, and reviewed on branch `feat/chance-ai-ranker-parlays`: `@hedge/api` `POST /offers/rank` builds an offer pool (single-leg candidates + **synthetic parlays** targeted at the **free-order price** via `ComboSource`, native Polymarket-combo adapter stubbed), ranks it via a **per-merchant LLM provider** (Claude / ChatGPT / off — `RankProvider` w/ Anthropic + OpenAI SDKs, platform-held keys, migration `007` `business_chance_settings`), and degrades to the deterministic engine on error/timeout. **Round-ups are the default mechanic** (stake = round-up change → free order); honest framing never overstates an unreachable "free." The drop-in `requestOffers` helper + local fallback are built and tested. **82/82 API tests, demo-tier (no settlement).**
- **Spec/plan:** `docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md` · `docs/superpowers/plans/2026-06-15-chance-ai-ranker-parlays.md`
- ⏭️ **Drop-in UI wiring deferred:** the live `Chance.tsx` is still the slider flow; surfacing round-up-default + parlay rows + ranked order lands with the **Coinbase-style drop-in redesign** (the engine + `requestOffers` are ready to wire then).
- 🔒 **Live ranking pending (needs you):** `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` in `@hedge/api` env + a merchant row in `business_chance_settings` with a non-`off` provider. Default `off` keeps every merchant on the deterministic engine.
- 🔒 **Security follow-up before a real provider goes live:** per-merchant publishable key + origin allowlist + LLM spend budget on the public `/offers/rank` endpoint (today: global rate limiter + default-`off` ⇒ no spend for unknown merchants + bounded inputs).

### 🔨 Up next — Slice 2: Wallet identity + auth
Replace the anonymous device wallet with Supabase auth (sign in to the extension); tie wallets to a real user. (See NEXT.)

---

## SHIPPED — Demo (extension; `chance-extension` repo, local, **not yet published**)

- ✅ Intent-first popup flow: purchase cost → wager → market offerings → place → result, with slide transitions
- ✅ Reads the real purchase amount: **Shopify** `/cart.js`, **WooCommerce** Store API, **Amazon** PDP + cart, JSON-LD, labeled-DOM fallback — **11/11 stress tests** (`npm test`)
- ✅ **Round-ups** — round the purchase up, wager the change
- ✅ Demo wallet: balance chip + funding UI (card via CoverPay→Stripe / CoinFlow) — **simulated**
- ✅ Arcade identity: Press Start 2P wordmark, gold die, rounded popup; multi-venue logos; "view on venue" links
- ✅ Embeddable `<chance-checkout>` drop-in on hedgepayments.com/chance

---

## NEXT — queued payment slices (each gets its own spec → plan → build)

- ⏭️ **Slice 2 — Wallet identity + auth:** replace the anonymous device wallet with Supabase auth (sign in to the extension); tie wallets to a real user.
- ⏭️ **Slice 3 — Bet execution + settlement:** hold stake → resolve win/lose against the wallet; decide venue-routed vs Hedge-as-principal. *(This is where round-ups draws a real stake from the funded balance.)*
- ⏭️ **Slice 4 — Cash-out / payouts:** withdraw winnings.
- ⏭️ **Slice 5 — Compliance/custody hardening:** KYC at funding, custody partner wired.

---

## LATER

- ⏭️ **Chrome Web Store publish** — package + listing assets + submission (manual, dev account).
- ⏭️ **Chance Wallet iOS (neo-bank surface)** — the wallet ledger gets a native home; the extension stays the acquisition driver (fund → play → winnings live in the app).
  - **v1 — wallet companion:** sign in (same Supabase auth as Slice 2), balance, fund (Stripe), activity feed, win notifications. Rides existing custody/KYC gates — no new regulatory surface.
  - **v2 — spend:** card issuance / ACH out via a BaaS partner. Hard-gated on custody + KYC + counsel (true money-transmission territory).
  - **Open question:** relationship to Bankroll (bankroll.live is billed as the consumer wallet) — same product, rebrand, or separate? Decide before v1 kickoff.
- 🔒 **Go-live (real money)** — live Stripe keys, live custody, KYC enforced, counsel sign-off.

---

## GATES (cross-cutting — block real money, not the test-mode build)

| Gate | Status | Notes |
|---|---|---|
| Custody model | open | Licensed partner holds funds (Stripe Treasury/Connect); Hedge ledger only records → keeps Hedge off money-transmitter hook |
| KYC vendor | open | Required at funding before go-live |
| Counsel sign-off | open | Event-contract / money-transmission — see `docs/superpowers/specs/2026-06-04-chance-counsel-questions.md` |
| Live Stripe account | open | `sk_live_…` + approval |
| `@hedge/api` deploy | open | Railway / Render / Fly — must be reachable by the extension + Stripe webhooks |
| Chrome Web Store account | open | Developer account + submission for publish |

---

## How we work

Per slice: **brainstorm** (decide what & why) → **spec** (`docs/superpowers/specs/`) → **plan** (`docs/superpowers/plans/`, TDD tasks) → **execute** (subagent-driven or inline) → update this file. Keep **demo** and **real-money** work clearly separated; never let a simulated flow read as live.

## Docs index
- Brand architecture — `docs/superpowers/specs/2026-06-03-hedge-brand-architecture-design.md`
- Build/structure/enable blueprint — `docs/superpowers/specs/2026-06-04-chance-build-structure-enable-blueprint.md`
- Drop-in design — `docs/superpowers/specs/2026-06-04-chance-dropin-design.md`
- Counsel questions — `docs/superpowers/specs/2026-06-04-chance-counsel-questions.md`
- Funding spec / plan — see **NOW** above
