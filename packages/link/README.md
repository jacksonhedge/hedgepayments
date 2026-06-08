# @hedge/link — the Hedge Link drop-in shell (Slice 0)

Iframe-based, Plaid-Link-style drop-in. Loader (`src/loader.ts`) runs in the host page and bridges
postMessage to a sandboxed iframe app (`src/app/*`). Token is stubbed in Slice 0.

## Build & test
- `npm test`  — Vitest (protocol + loader + app)
- `npm run build` — emits `dist/loader/link.js` + `dist/app/`

## Local cross-origin demo (true isolation: two origins)
1. Serve the app on :5174 — `npx vite preview --outDir dist/app --port 5174` (after `npm run build`)
2. Serve the loader+example on :5173 — `npx vite --port 5173` (or `python3 -m http.server 5173`)
3. Open `http://localhost:5173/examples/host.html`, click "Pay with Hedge".
   Expect: modal opens, "Confirm" -> the host log shows `event OPEN`, `SUCCESS {...}`, modal closes.
   Isolation: the host page cannot read into the iframe (different origin) — that's the point.

## Embed contract (what a merchant writes)
```html
<script src="https://js.hedgepayments.com/link/stable/link.js"></script>
<script>
  const link = Hedge.create({ token, onSuccess, onExit, onEvent, onLoad })
  btn.onclick = () => link.open()
</script>
```

## Deploy (later)
Host `dist/loader/link.js` at `js.hedgepayments.com/link/stable/link.js` (stable channel, no SRI —
see the spec) and `dist/app` at `js.hedgepayments.com/link/app`.
