# Chance Wallet — Funding (Cash-in) Design — Slice 1

**Date:** 2026-06-05
**Status:** Draft for review
**Scope:** First sub-project of the Chance payments/wallet effort — fund a real wallet balance via CoverPay→Stripe (test mode), on Hedge's existing wallet ledger. Includes the price-listing round-up option (already shipped to the demo).

---

## 1. Goal

Turn the Chance extension's demo balance into a **real, funded wallet balance** — money loaded by card (Stripe, test mode) is recorded in Hedge's shared wallet ledger and shown in the popup — with the whole pipeline one config-flip from going live. No real money moves in this slice.

## 2. Context (what already exists)

- **Wallet ledger schema** — `supabase/migrations/001_hedge_wallet_system.sql`: `wallets` (multi-currency, `balance_available` in smallest unit), `transactions` (`transaction_type` incl. `deposit`/`hold`/`release`/`payment`/`refund`), `users` (with `kyc_status`, `risk_level`), `payment_method_type`. This is the ledger we reuse — Chance is a **branded view of this shared Hedge wallet**, not a separate silo.
- **CoverPay sessions** — `app/api/coverpay/sessions/route.ts` creates a `coverpay_sessions` row in Supabase and looks up the business by key, **but performs no Stripe charge.** Stripe is in the provider registry/config only — **the Stripe half is unbuilt.**
- **Hosting reality** — the website is `output: 'export'` (static); its `app/api/*` routes do **not** run in prod. The Express service **`@hedge/api`** (`packages/api`, `node dist/index.js`) is the real backend and the home for funding + Stripe + webhooks.

## 3. Decisions (locked with user)

1. **Wallet model:** Chance = a Chance-branded surface on Hedge's shared wallet ledger. One ledger, one custody, one KYC.
2. **Build target:** Stripe **test mode, real end-to-end flow** (real ledger writes to a test wallet). No real money; flip-to-live later.
3. **Funding approach:** **A — hosted Stripe Checkout via `@hedge/api`, opened in a new tab**, recorded under a CoverPay session (CoverPay-compatible).
4. **Identity (this slice):** anonymous **device wallet** (a `walletId` created on first use, stored in `chrome.storage`). Real Supabase auth is a later sub-project.
5. **Round-ups:** in the price listing, **"round up → wager the change"** (round the purchase up to the next $5; the spare change is the Chance stake). Already shipped to the demo popup.

## 4. Scope of the whole effort (decomposition)

Built one slice at a time, each its own spec → plan → implementation:

1. **Funding / cash-in** ← *this spec*
2. Wallet identity + Supabase auth in the extension
3. Bet execution + settlement (hold stake → resolve win/lose; venue/principal model)
4. Cash-out / payouts
5. Compliance/custody hardening (KYC at funding, custody partner) — cross-cutting, gates real-money go-live

## 5. Architecture (Slice 1)

### 5.1 Backend — `@hedge/api` (Express)

- **`POST /v1/chance/wallet`** → creates a device wallet (seeded/anon user), returns `{ walletId }`. Idempotent per device token.
- **`POST /v1/chance/funding/sessions`** `{ walletId, amount, currency='USD' }`:
  1. insert a `coverpay_sessions` row (`provider:'stripe'`, `status:'pending'`, amount, walletId);
  2. create a **Stripe Checkout Session** (test, `mode:'payment'`, single line item for `amount`, `client_reference_id = coverpaySessionId`, `metadata.walletId`, `success_url`/`cancel_url`);
  3. return `{ checkoutUrl, sessionId }`.
- **`POST /v1/chance/funding/webhook`** ← Stripe. Verify signature (`STRIPE_WEBHOOK_SECRET`). On `checkout.session.completed`: call `credit_wallet(...)` (idempotent), mark the `coverpay_sessions` row `completed`.
- **`GET /v1/chance/wallet/:walletId`** → `{ balance_available, currency }`.
- **CORS:** allow `chrome-extension://<id>` for the session-create + wallet GET. Webhook is server-to-server.

### 5.2 Ledger writes — reuse migration 001

A Postgres RPC **`credit_wallet(p_wallet_id, p_amount, p_external_ref)`** that, in one transaction:
- inserts a `transactions` row (`type:'deposit'`, `status:'completed'`, `external_ref` = Stripe session id, **UNIQUE**),
- increments `wallets.balance_available` by `p_amount` (smallest unit),
- is **idempotent**: if a row with that `external_ref` exists, no-op (duplicate webhooks credit once).

*Accommodation:* `wallets.user_id` is `NOT NULL` → seed one `anon/device` user for device wallets in this slice (relaxed when real auth lands).

### 5.3 Extension (popup)

- `startFunding(amount,'card')` becomes real: ensure `walletId` (create on first run) → `POST …/funding/sessions` → `chrome.tabs.create(checkoutUrl)` (Stripe Checkout test) → connecting screen reads "Opening secure checkout…".
- **Balance** is sourced from `GET …/wallet/:id` (real ledger); `chrome.storage` keeps only a last-known value for instant paint, reconciled on open. Re-fetch on popup open and after returning from Checkout.
- Config: `API_BASE` constant + `host_permissions` for that origin.

### 5.4 Round-ups (price listing)

- **Demo (shipped):** "round up to next $5 → wager the change" sets the stake = spare change and jumps to markets.
- **Real flow:** the round-up is a **stake preset** drawn from the wallet at bet time (a `hold` on the wallet, settled in the bet-execution slice). It is *not* a separate funding rail. (The recurring Acorns-style "sweep round-ups into balance" is a deliberately deferred, separate option.)

## 6. Data flow

```
popup → POST /funding/sessions (+coverpay_sessions row)
      → Stripe Checkout (new tab, test card 4242…)
      → Stripe webhook → credit_wallet (transactions + balance, idempotent)
      → popup GET /wallet → shows new balance
```

## 7. Error handling

- session-create fails → popup: "Couldn't start checkout, try again."
- invalid webhook signature → 400, no credit.
- duplicate webhook → idempotent no-op (UNIQUE `external_ref`).
- user cancels Checkout → `coverpay_sessions` stays `pending`/expires; balance unchanged.

## 8. Testing

- **Unit:** `credit_wallet` idempotency (double webhook → single credit); amount/smallest-unit math.
- **Integration:** Stripe CLI `stripe listen --forward-to …/webhook` + trigger `checkout.session.completed` → balance reflects.
- **E2E:** popup → create session → test card `4242 4242 4242 4242` → webhook credits → popup shows new balance.
- **Extension harness:** funding call with mocked `fetch` added to the existing jsdom stress suite.

## 9. Custody / compliance + go-live gates (NOT built in this slice)

- Test mode moves **no real money.**
- **Intended production custody:** Stripe holds funds (platform account → later Connect/Treasury); Hedge's ledger only **records** → keeps Hedge off the money-transmitter hook.
- **Go-live additionally requires:** live Stripe keys, **KYC at funding** (tie wallet to a verified user), custody partner decision, counsel sign-off.

## 10. Out of scope (Slice 1)

Auth UI, cash-out, bet execution/settlement, KYC, real money, Stripe Connect/Treasury, recurring round-up funding sweep.

## 11. Open items

- Deployment target for `@hedge/api` (must be reachable by the extension + Stripe webhooks): Railway / Render / Fly. Local dev uses Stripe CLI forwarding.
- Confirm migration 001 is applied to the (test) Supabase project; apply if not.
