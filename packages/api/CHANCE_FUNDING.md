# Chance wallet funding — run & test (Stripe test mode)

## Env (`packages/api/.env`)
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — test Supabase project (migration 001 + 004 applied)
- `STRIPE_SECRET_KEY` = `sk_test_...`
- `STRIPE_WEBHOOK_SECRET` = from `stripe listen` (below)
- `CHANCE_ANON_USER_ID` = `00000000-0000-0000-0000-0000000000a1`

## Run
1. `cd packages/api && npm run dev` (port 3000)
2. `stripe listen --forward-to localhost:3000/api/v1/chance/funding/webhook`
   - copy the `whsec_...` into `STRIPE_WEBHOOK_SECRET`, restart the server
3. Extension: set `chance-extension/config.js` `CHANCE_API_BASE` to `http://localhost:3000/api/v1/chance`, reload the unpacked extension

## E2E
1. Popup → balance → "Add $25 · pay with card" → Stripe Checkout opens
2. Pay with test card `4242 4242 4242 4242`, any future expiry/CVC
3. `stripe listen` shows `checkout.session.completed` forwarded → 200
4. Reopen the popup → balance shows **$25.00** (from `GET /wallet/:id`)
5. Re-trigger the same event (`stripe events resend <id>`) → balance still $25.00 (idempotent)
