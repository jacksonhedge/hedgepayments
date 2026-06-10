# Window 2 — Chance Wallet Kickoff

Paste this into a fresh Claude Code window opened at `~/Projects/HedgePayments/website`:

---

You own the **Chance wallet / payments** work stream. Your file territory: `packages/api/src/**` wallet+funding files (`walletStore`, `chance.ts` routes, `chanceWebhook`), `supabase/migrations/` (you own migration numbers **007+**), and `packages/api/CHANCE_FUNDING.md`. Do NOT touch `app/` (marketing site) or `packages/link/` + `packages/api/src/routes/link.ts` + `linkStore.ts` (Hedge Link) — other Claude windows own those.

**Context:** ROADMAP.md (repo root) is the source of truth. Payments Slice 1 (funding/cash-in) is BUILT in Stripe test mode — confirmed-payment pipeline, idempotent `credit_wallet` (migration 004), webhook with raw body, 12/12 tests. Live E2E is blocked on the user providing Stripe test keys. Real money is gated on custody/KYC/counsel (see GATES in ROADMAP.md).

**Your task: Slice 2 — Wallet identity + auth.**
Replace the anonymous device wallet with Supabase auth: users sign in (extension + web), wallets tie to a real `user_id` instead of a device. Per ROADMAP: "Replace the anonymous device wallet with Supabase auth (sign in to the extension); tie wallets to a real user."

**Process — the superpowers loop, strictly:**
1. Read first: `ROADMAP.md`, `docs/superpowers/specs/2026-06-05-chance-wallet-funding-design.md`, `docs/superpowers/plans/2026-06-08-chance-wallet-funding-slice1.md`, `packages/api/CHANCE_FUNDING.md`, and the current `walletStore` + wallet routes.
2. **Brainstorm** the Slice 2 design with the user (auth flow, wallet migration path for existing anonymous wallets, extension sign-in UX, what changes in the API contract).
3. Write the spec to `docs/superpowers/specs/`, then the plan to `docs/superpowers/plans/`, then execute with subagent-driven development.

**Key design questions to raise in brainstorming (don't decide unilaterally):**
- Anonymous → authed wallet migration: merge on sign-in, or fresh wallet + manual claim?
- Where auth lives: extension popup sign-in vs. web-first sign-in with extension token handoff
- Does `POST /wallet` stay (anonymous create) or become auth-required?

**Rules:**
- Tests: `cd packages/api && npx jest --no-coverage` must stay green (32 passing now).
- Migration numbering: you own 007+. If you see an unexpected 007 appear, another window broke the boundary — stop and flag it.
- Commit per task, `git add` specific files only (shared checkout).
- No real Stripe keys, no real money paths — test mode only; the gates in ROADMAP.md block go-live.
