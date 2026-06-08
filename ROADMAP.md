# Chance — Product Roadmap

> **Chance, a Hedge Pay product.** Shoppers risk a little to win a discount (up to a free order) by backing a real prediction market. Hedge Pay is the **router, not the house**.
>
> **This file is the source of truth.** Mirrored to Notion. The per-slice engine is the superpowers loop (**brainstorm → spec → plan → execute**); this file sequences the slices and tracks the gates above them.
>
> **Last updated:** 2026-06-08

Status legend: ✅ shipped · 🔨 in progress · ⏭️ queued · 🔒 blocked on a gate

---

## NOW

### 🔨 Payments — Slice 1: Funding (cash-in) — *Stripe test mode*
Load real money (Stripe **test**) into a wallet on Hedge's shared ledger, confirmed by webhook, shown in the extension. One config-flip from live.
- **Spec:** `docs/superpowers/specs/2026-06-05-chance-wallet-funding-design.md`
- **Plan:** `docs/superpowers/plans/2026-06-08-chance-wallet-funding-slice1.md` (9 TDD tasks, ready to execute)
- **Decisions locked:** Chance = branded view of Hedge's shared wallet ledger (migration 001); hosted Stripe Checkout via `@hedge/api`; anonymous device wallet for now.
- 🔒 **Blocked on:** Stripe test keys (`sk_test_…`) + a test Supabase with migrations 001 + 004 applied + an `@hedge/api` deploy target (or local + Stripe CLI).

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
