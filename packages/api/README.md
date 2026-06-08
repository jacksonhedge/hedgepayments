# @hedge/api

**The Hedge / Chance backend.** Express + TypeScript.

The marketing site (`website/`) is a Next.js **static export** (`output: 'export'`) — it cannot run server code, so all server logic (payments, webhooks, the wallet ledger) lives here. Any `app/api/*` route in the website is dead in production; build new backend work as a route in this service instead.

## What's here
- `src/index.ts` — Express app (helmet, cors, rate-limit). Mounts:
  - `POST /api/v1/chance/funding/webhook` — Stripe webhook (raw body, mounted before `express.json()`)
  - `POST /api/v1/chance/wallet` · `GET /api/v1/chance/wallet/:id` · `POST /api/v1/chance/funding/sessions`
  - `GET /health`
- `src/services/` — `walletStore` (Supabase), `fundingService` (Stripe Checkout + webhook credit)
- `src/routes/` — `chance` (JSON), `chanceWebhook` (raw)
- Ledger lives in Supabase Postgres (`../../supabase/migrations/001*`, `004*`). Verify with `../../supabase/verify-migrations.sh`.

## Run locally
```bash
cp .env.example .env   # fill in Supabase + Stripe TEST keys
npm install
npm run dev            # :3000
stripe listen --forward-to localhost:3000/api/v1/chance/funding/webhook
```
See `CHANCE_FUNDING.md` for the full Stripe test-mode E2E.

## Test
```bash
npm test                          # jest (services + routes), mocks Stripe/Supabase
bash ../../supabase/verify-migrations.sh   # real Postgres: migrations + credit_wallet idempotency
```

## Deploy
Container-based (Railway / Render / Fly all accept the `Dockerfile`):
```bash
docker build -t hedge-api .
docker run -p 3000:3000 --env-file .env hedge-api
```
Set the same env vars in the platform. Point the extension's `chance-extension/config.js` `CHANCE_API_BASE` at the deployed origin (`https://<host>/api/v1/chance`) and add that origin to the extension's `host_permissions`.

## Env
See `.env.example`. Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are server-only — never ship them to the extension or the static site.
