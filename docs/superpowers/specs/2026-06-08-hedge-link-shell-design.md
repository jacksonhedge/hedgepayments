# Hedge Link — Shared Drop-in Shell (Slice 0) — Design

**Date:** 2026-06-08
**Status:** Draft for review
**Scope:** First slice of "Hedge Link" — a Plaid-Link-style, **iframe-based**, third-party-embeddable drop-in SDK shared across CoverPay, Hedge Payments, Chance, and SideBet. This slice builds the **product-agnostic shell** (loader + isolated iframe app + token-aware embed API + event/metadata plumbing). No product flow and no real token exchange yet.

---

## 1. Goal

A merchant embeds one stable script and gets a secure, isolated, themed modal flow with a Plaid-familiar API — `Hedge.create({ token, onSuccess, onExit, onEvent }) → { open, exit, destroy }`. Slice 0 proves the entire embed / isolation / event machinery end-to-end with a trivial `hello` flow, so every product later just plugs into the shell.

## 2. Context

- **Chance drop-in** (`public/embed/chance.js`) — a vanilla **Web Component** (Shadow DOM, emits `chance:*` events, headless `trigger="none"`). Runs *in* the host page.
- **CoverPay** (`packages/coverpay-react`) — a **React SDK** (`CoverPayProvider`/`useCoverPay`/`CoverPayButton`) with a session/eligibility/checkout API shape.
- **`@hedge/api`** (`packages/api`, Express) — the backend that will mint Link tokens (Slice 1).
- **The gap vs Plaid:** neither uses an **iframe**, so there's no security boundary against an untrusted host page. Since the chosen embedder is **third-party merchants**, the iframe boundary is required.

## 3. Decisions (locked with user)

1. **Isolation:** iframe-based (sandboxed, served from a Hedge origin) — third-party-safe.
2. **Order:** build the **shared shell first**, product-agnostic; products are pluggable flows.
3. **Plaid-aligned API + behaviors**, adopting these insights from Plaid Link:
   - **Stable-channel loader, not pinned versions** — merchants embed one unversioned URL forever; the iframe app is versioned server-side and hot-updated behind it.
   - **Pre-init + queued open** — `create()` pre-warms the iframe; `open()` is instant; `open()` before ready is queued until `onLoad`.
   - **Rich stable event taxonomy + metadata on every event** (`session_id`, `request_id`, `timestamp`); event order is **not** guaranteed.
   - **Two-tier errors** — `onExit(error, meta)` (terminal) vs `onEvent('ERROR', meta)` (recoverable); `INVALID_LINK_TOKEN` → `destroy()` + recreate.
   - **Published CSP guidance** is a deliverable, not an afterthought.
   - **`exit({force})`** vs confirm; `destroy()` cleans up; React adapter auto-destroys on unmount.

## 4. Scope of the whole effort (decomposition)

Each slice is its own spec → plan → build:

0. **Shared shell** ← *this spec*
1. **Token handshake** — `@hedge/api POST /v1/link/sessions` mints a short-lived, single-use, scoped `link_token` (+ update-mode); the iframe app verifies it.
2. **Chance flow** — port the existing flow into the shell (proves the pattern).
3. **CoverPay flow** — B2B checkout / provider selection.
4. **SideBet + Wallet flows.**
5. **Adapters + docs** — `@hedgepayments/link-react` (generalize coverpay-react) + JS, CSP docs, an embed playground.

## 5. Architecture — four units + hosting

### 5.1 `link.js` — the loader (host page)
The small script the merchant embeds. Responsibilities:
- Expose `window.Hedge.create(config)` → a **handler** `{ open, exit, destroy, ready, error }`.
- On `create()`: inject a hidden, **pre-warmed** sandboxed `<iframe>` (the Link app) + a hidden overlay; begin loading immediately.
- On `open()`: reveal the overlay/iframe with animation; **queue** the open if not yet `READY`.
- Own the modal chrome the host can't fake: backdrop, focus-trap, ESC, scroll-lock.
- Run the **postMessage bridge** (origin-checked) and relay iframe events → the host's `onSuccess`/`onExit`/`onEvent`.
- `exit(opts)`: `{force:true}` closes immediately; otherwise asks the flow whether to confirm. `destroy()`: remove iframe + overlay + listeners.

### 5.2 Link app — the iframe content (Hedge origin)
A tiny static SPA (**Vite + Preact**, framework-light) served from `js.hedgepayments.com`. Responsibilities:
- Receive `INIT{token, env, theme, receivedRedirectUri}` from the loader.
- Render the shared **shell** (themed header, progress, loading + error states) and `mountFlow()` for the product.
- Talk to `@hedge/api` with the token (Slice 1+).
- Post lifecycle messages out (`READY`, `RESIZE`, `EVENT`, `SUCCESS`, `EXIT`).

### 5.3 postMessage bridge — typed, origin-checked
- **loader → iframe:** `INIT { token, env, theme?, receivedRedirectUri? }`, `OPEN`, `REQUEST_EXIT { force }`.
- **iframe → loader:** `READY`, `RESIZE { height }`, `EVENT { name, meta }`, `SUCCESS { result, meta }`, `EXIT { error?, meta }`.
- Both directions verify `event.origin` against an allowlist (Hedge origin ↔ the embedding host). Unknown origins dropped.
- **Metadata envelope** on every `EVENT`/`SUCCESS`/`EXIT`: `{ session_id, request_id, timestamp, ...eventSpecific }`.

### 5.4 Flow contract — how products plug in
```
mountFlow(root, ctx) where ctx = { token, config, api, emit, exit }
  emit(name, meta?)        // → EVENT to the host
  // flow calls emit('SUCCESS', result) / emit('EXIT', {error?}) to finish
```
The shell is product-agnostic; a flow is a module the app loads by product type. **Slice 0 ships a trivial `hello` flow** (a button → `emit('SUCCESS')`).

### 5.5 Hosting / versioning (insight #2)
- **Loader (stable channel, unversioned):** `https://js.hedgepayments.com/link/stable/link.js` — merchants embed this once; auto-updated. (Optional `/link/<pinned>/link.js` for enterprises who require pinning.)
- **Iframe app (versioned server-side):** `https://js.hedgepayments.com/link/app` — the loader passes a min-compatible version; the app is hot-updated behind the stable loader so a merchant's embed never breaks.
- Both served from `js.hedgepayments.com` (Vercel/CDN, cache-friendly).

## 6. The embed API (what a merchant writes)
```html
<script src="https://js.hedgepayments.com/link/stable/link.js"></script>
<script>
  const link = Hedge.create({
    token: LINK_TOKEN,                  // short-lived, single-use, from your server (Slice 1)
    env: 'sandbox',                     // 'sandbox' | 'production'
    onSuccess: (result, meta) => {/* confirm server-side */},
    onExit:    (error, meta) => {},
    onEvent:   (name, meta) => {},      // OPEN, TRANSITION_VIEW, ERROR, ...
    onLoad:    () => {},                // queued open() waits for this
    receivedRedirectUri: window.location.href, // OAuth re-launch (optional)
    theme:     { accent: '#0e9f6e', logoUrl: '...' },
  })
  // link: { open(), exit(opts?), destroy(), ready, error }
  payButton.onclick = () => link.open()
</script>
```

## 7. Event taxonomy (stable core; products extend)
Stable, programmatic-safe events: **`OPEN`**, **`TRANSITION_VIEW`** (`{ view }`), **`SUCCESS`**, **`EXIT`**, **`ERROR`** (`{ error_type, error_code, error_message, display_message? }`). Products add namespaced events (e.g. `chance:MARKET_SELECTED`, `coverpay:PROVIDER_SELECTED`). Consumers must treat order as **unspecified** and sort by `timestamp`.

## 8. Error model (two-tier)
- **`onExit(error, meta)`** — terminal: user bailed, or init failed (e.g. `INVALID_LINK_TOKEN`, `LOAD_ERROR`). `error` is nullable (clean user exit).
- **`onEvent('ERROR', meta)`** — recoverable mid-flow error; the flow keeps going.
- **Token refresh pattern:** on `onExit` with `error_code === 'INVALID_LINK_TOKEN'`, the host calls `link.destroy()` and re-`create()`s with a fresh token (documented).

## 9. Security / CSP (deliverable)
- iframe `sandbox="allow-scripts allow-forms allow-popups allow-same-origin"` (same-origin scoped to the Hedge app origin; `allow-popups` for OAuth).
- postMessage origin allowlist both ways; drop unknown origins.
- The **token is the only client-held credential** (short-lived, scoped — Slice 1). No secrets in `link.js` or the iframe app.
- **No SRI on the stable loader (deliberate):** an `integrity="sha384-…"` hash can't be pinned on an auto-updating stable-channel script — it changes every release and would break every embed. So, like Plaid.js / Stripe.js, `link.js` omits SRI; trust is anchored instead in (a) serving from Hedge's own controlled origin over HTTPS, (b) keeping the loader *tiny* — its only job is to bootstrap the sandboxed iframe, and (c) the server-side token + iframe boundary doing the real work. The optional pinned-version URL (`/link/<pinned>/link.js`) MAY publish an `integrity` for enterprises that require it.
- **Publish merchant CSP** (part of Slice 5 docs, designed now):
  `frame-src https://js.hedgepayments.com; connect-src https://api.hedgepayments.com; script-src https://js.hedgepayments.com` (+ a nonce alternative).

## 10. Theming
Host passes `theme` (accent, logo, radius) via `create()` → `INIT`; the shell applies CSS variables. Shell stays consistent across products; only the flow "middle" changes. (Deep per-merchant theming is bounded — Plaid keeps Link visually consistent for trust; we follow suit.)

## 11. What Slice 0 delivers
Merchant embeds `link.js` → `Hedge.create()` pre-warms a sandboxed iframe → `open()` reveals the modal → the `hello` flow → click → `SUCCESS{...}` posts back (with the full metadata envelope) → host's `onSuccess` fires → modal closes. Fully isolated (host JS cannot reach the iframe), themed, `ready`/`onLoad`/queued-open working, two-tier error plumbing in place. `token` is accepted and **stubbed** (any string; no real verification — that's Slice 1).

## 12. Testing
- **Loader (jsdom):** `create()` pre-warms; `open()` before `READY` queues then fires on `READY`; `exit({force})`; `destroy()` removes all artifacts; message relay to callbacks; **unknown-origin messages rejected**.
- **Protocol:** message shapes + the metadata envelope (`session_id`/`request_id`/`timestamp` present).
- **Cross-origin embed page:** a host page on a *different* origin loads `link.js`, drives open→success→close, and asserts (a) the lifecycle fires and (b) the host cannot read into the iframe (isolation).

## 13. Out of scope (later slices)
Real token handshake (Slice 1), product flows (2–4), framework adapters + CSP docs + playground (5). No real money, no product logic in this slice.

## 14. Open items
- Exact `js.hedgepayments.com` hosting target (Vercel project vs CDN) and how the iframe app build (Vite) deploys alongside the Next site.
- Min-version negotiation detail between loader and iframe app.
- Whether to also keep the existing Chance Web Component as a "lite" non-iframe embed (decided per-product later).
