# Window 3 — Hedge Link / API Kickoff

Paste this into a fresh Claude Code window opened at `~/Projects/HedgePayments/website`:

---

You own the **Hedge Link SDK + Link API** work stream. Your file territory: `packages/link/**`, `packages/api/src/routes/link.ts`, `packages/api/src/services/linkStore.ts`, and their tests. Do NOT touch `app/` (marketing site) or the wallet/funding files (`walletStore`, `chance.ts` routes, `chanceWebhook`) — other Claude windows own those. You do NOT own any `supabase/migrations/` numbers right now; if Slice 3 needs a migration, coordinate with the user first (the wallet window owns 007+).

**Context:** Hedge Link is our Plaid-style drop-in SDK (iframe + postMessage bridge, sandboxed origin, loader at `packages/link/src/loader.ts`). Shipped so far:
- Slice 0: shell (loader, iframe app, bridge, hello flow)
- Slice 1: link_token mint + exchange (`link_sessions` table, migrations 005/006)
- Slice 2 (shipped 2026-06-09): the full Chance flow as a Preact `mountFlow` — `packages/link/src/app/flows/chance/` (engine.ts pure functions, Chance.tsx 5 views, atomic consume-on-success via `POST /sessions/:token/consume` with 409/410 semantics). 47 link tests + 32 API tests green.
- Specs/plans in `docs/superpowers/specs/` and `docs/superpowers/plans/` (hedge-link-*).

**Your task: define and build Slice 3.** Candidate directions (from the Slice 2 spec's out-of-scope list — brainstorm with the user to pick):
- **Per-merchant API keys** — replace the shared `X-Hedge-Key` with real per-merchant keys + key management (fits the white-label infra positioning)
- **Deploy to js.hedgepayments.com** — production hosting for loader + iframe app (was pencilled as Slice 5)
- **Second product flow** — port SideBet or a generic payment flow into the Link shell to prove multi-product dispatch
- **Real consume hardening** — rate limiting on consume, webhook on session consumed (merchant server notification)

**Process — superpowers loop, strictly:** read the existing hedge-link specs/plans first, then brainstorm Slice 3 scope with the user, write spec → plan → execute with subagent-driven development.

**Rules:**
- Tests stay green: `cd packages/link && npx vitest run` (47) and `cd packages/api && npx jest --no-coverage` (32).
- A standalone browser demo exists at `packages/link/demo.html` + `src/demo.ts` (run `npx vite@5 --config demo.config.mjs --port 5174` from `packages/link`) — keep it working; it's the fastest manual test.
- Commit per task, `git add` specific files only (shared checkout).
- Don't deploy anything without asking.
