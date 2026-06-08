# Hedge Link — Token Handshake (Slice 1) — Design

**Date:** 2026-06-08
**Status:** Draft for review
**Scope:** Slice 1 of Hedge Link. A merchant's server mints a scoped, short-lived, single-use `link_token`; the iframe app exchanges it on `INIT` for the session config; invalid/expired → `EXIT(INVALID_LINK_TOKEN)`. Closes the Slice-0 deferred terminal-error path.

---

## 1. Goal

Replace the stubbed token from Slice 0 with a real, Plaid-style handshake: server mints `link_token` → loader passes it in `INIT` (already wired) → the iframe app exchanges it with `@hedge/api` → gets the session config (product + scoped config) → mounts the flow, or exits with `INVALID_LINK_TOKEN`.

## 2. Context

- **Slice 0 (done):** the shell. `INIT { token, env, theme, receivedRedirectUri }` already flows loader → iframe; the app's `main.tsx` `onInit` mounts the `hello` flow. The loader's `onExit(error)` terminal path exists but nothing populates `error` yet.
- **`@hedge/api`** (`packages/api`, Express + TS) already has Supabase (`lib/supabase`), config, and the `chance`/`marketing` routers + `walletStore` pattern (service + route + jest tests). Migrations live in `supabase/migrations/` (latest `004`).

## 3. Decisions (locked with user)

1. **Token model:** opaque random token + a **`link_sessions`** Supabase table (single-use, revocable, scoped) — not a stateless JWT.
2. **Mint auth:** a simple shared **`X-Hedge-Key`** header (env `HEDGE_LINK_KEY`) for now; real per-merchant keys are later.
3. **Exchange semantics:** idempotent within TTL — first exchange marks `opened`; repeated exchange (refresh/re-entry) still returns config until expiry. Full `consumed` happens on success (a later bet/payment slice).
4. **Errors:** invalid / unknown / expired / consumed → `410 { error_code: 'INVALID_LINK_TOKEN' }`; the app turns that into `EXIT(INVALID_LINK_TOKEN)`.

## 4. Architecture

### 4.1 DB — `supabase/migrations/005_link_sessions.sql`
```sql
CREATE TABLE IF NOT EXISTS link_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  product TEXT NOT NULL,
  env TEXT NOT NULL DEFAULT 'sandbox',
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'opened', 'consumed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  opened_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_link_sessions_token ON link_sessions(token);
```

### 4.2 `@hedge/api` — `linkStore` (Supabase data access) + `linkRouter`
- **`src/services/linkStore.ts`** — `createSession({product, config, env}) → {token, expiresAt}` (insert; `token = 'lt_' + random(32)`, `expires_at = now + 30min`); `exchange(token) → {product, config, env} | null` (find by token; if missing / `expires_at < now` / `status==='consumed'` → null; else if `pending` set `opened`+`opened_at`; return).
- **`src/routes/link.ts`** mounted at `/api/v1/link`:
  - `POST /sessions` — require `X-Hedge-Key === config.hedge.linkKey` (else 401); body `{product, config?, env?}` (product required); → `200 { link_token, expires_at }`.
  - `POST /sessions/:token/exchange` — no key (the token is the credential); `exchange(token)` → `200 {product, config, env}` or `410 { error: 'INVALID_LINK_TOKEN', error_code: 'INVALID_LINK_TOKEN' }`.
- **Config:** add `config.hedge.linkKey = process.env.HEDGE_LINK_KEY || ''`.

### 4.3 `packages/link` app — exchange on INIT
- **`src/app/linkClient.ts`** — `exchangeToken(apiBase, token) → Promise<{product, config, env}>`; throws on non-200. `apiBase` resolved from `__HEDGE_LINK_API_BASE` (test/local override) else a default per env.
- **`src/app/main.tsx`** `onInit`: `exchangeToken(apiBase, init.token)` → on success `mountHello(root, ctx_with_config)`; on failure `bridge.exit({ error_type: 'LINK_ERROR', error_code: 'INVALID_LINK_TOKEN', error_message: String(e) })`. (Loader's `onExit(error)` then fires — closes the Slice-0 gap.)

## 5. Data flow
```
merchant server: POST /v1/link/sessions (X-Hedge-Key) {product,config} -> {link_token}
host page:       Hedge.create({ token: link_token }).open()
iframe app:      onINIT -> POST /v1/link/sessions/:token/exchange
                   200 {product,config} -> mount flow
                   410 INVALID_LINK_TOKEN -> bridge.exit -> host onExit(error)
```

## 6. Error model
- Mint without/with-wrong `X-Hedge-Key` → `401`.
- Mint missing `product` → `400`.
- Exchange unknown/expired/consumed token → `410 { error_code: 'INVALID_LINK_TOKEN' }` → app `EXIT(INVALID_LINK_TOKEN)`.

## 7. Testing
- **`@hedge/api` (jest, mocked supabase):** `linkStore.createSession` inserts + returns token/expiry; `exchange` valid → config + opened; expired → null; consumed → null; unknown → null. Router: mint rejects bad key (401), rejects missing product (400), returns link_token; exchange returns config (200) and 410 on invalid.
- **`packages/link` (vitest, mocked fetch):** `exchangeToken` resolves config on 200, rejects on 410; `main.tsx` INIT path (exchange success → flow mounts; exchange 410 → `bridge.exit` called with `INVALID_LINK_TOKEN`).
- **Migration:** extend `supabase/verify-migrations.sh` to also apply `005` and assert a round-trip `createSession`→`exchange` against the local Postgres harness.

## 8. Out of scope
Per-merchant API keys (shared key only), product-specific `config` schemas/validation, consume-on-success, rate limiting on mint, the `js.hedgepayments.com` deploy.
