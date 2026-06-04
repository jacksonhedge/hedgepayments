# Chance Browser Extension — Plan

**Date:** 2026-06-04
**Status:** Plan (pre-build) — for review
**Scope:** A MetaMask-style Chrome (MV3) extension that rides along to **any** checkout, detects when a shopper is buying, reads the order total, and offers **Chance** — reusing the existing `<chance-checkout>` widget. Shopper-installed distribution: no merchant integration required.

---

## 1. One-paragraph summary

Instead of merchants pasting our script, the **shopper installs Chance once** and it works on every store they visit. An MV3 extension watches each page for checkout/purchase signals, auto-detects the order total, and slides in a **floating Chance bubble**. Tapping it opens the same Plaid-style Chance sheet we already built (loaded from `hedgepayments.com/embed/chance.js`), pre-filled with the detected amount. A toolbar **popup** is the Chance "wallet" (account, recent plays, settings). The widget already supports the integration: a headless `trigger="none"` mode + a `chance:open` event were added so the extension can open the sheet programmatically.

---

## 2. Decisions (settled)

| Decision | Choice |
|---|---|
| Platform | Chrome **Manifest V3** (service worker, content scripts, action popup) |
| Trigger UX | **Floating Chance bubble** on detected checkouts (+ openable from the toolbar icon) |
| Amount | **Auto-detect the order total** from the page, with manual override |
| Widget | **Reuse the hosted `chance.js`** (inject into the page context) — one source of truth |
| Widget hook | Already shipped: `trigger="none"` (headless) + `chance:open` event |
| Settlement | Same as the embed — **simulated** for now; real routing later (Hedge Pay = router, not house) |

**Open decision (recommended in §8):** bubble + popup aesthetic — arcade-neon (brand energy) vs Plaid-white (checkout trust).

---

## 3. Architecture

```
                ┌──────────────── Chrome extension (MV3) ────────────────┐
                │                                                         │
  toolbar  ───▶ │  action popup (popup.html)  ── the Chance "wallet"      │
                │      account · recent plays · settings · manual open    │
                │                                                         │
                │  background.js (service worker)                         │
                │      badge per-tab · storage · message hub              │
                └───────────────▲─────────────────────────────────────────┘
                                │ chrome.runtime messages
  any web page ────────────────┼───────────────────────────────────────────
   (isolated world)            │
   content.js  ── detect checkout + parse total → draw FLOATING BUBBLE
        │   bubble click  →  window.postMessage({source:'chance-ext', amount})
        ▼
   (page world, via web_accessible_resource)
   page-bridge.js ── loads hosted chance.js, creates <chance-checkout trigger="none">,
                     on message: set amount + dispatch chance:open → sheet opens
        │   chance:result (DOM event, bubbles) ─────────────────────────────▶ content.js → storage
```

**Why the page-bridge split:** content scripts run in an *isolated world* and can't call page-defined custom-element methods. The page-bridge runs in the *page world*, so it can drive `<chance-checkout>` directly. Content ↔ page communicate via `window.postMessage` + DOM events. (MV3 forbids remote code in the *extension* context, but injecting a `<script src>` that runs in the **page** context is allowed — that's how we reuse the hosted widget.)

---

## 4. Files

```
chance-extension/
  manifest.json            MV3: action(popup), background SW, content_scripts(all_urls),
                           host_permissions, web_accessible_resources(page-bridge.js)
  background.js            badge per tab on detect; storage; message routing
  content.js               checkout detection + total parsing + floating bubble (isolated world)
  content.css              bubble styles (Shadow DOM to avoid host-page CSS bleed)
  page-bridge.js           page world: load chance.js, create headless element, open on message
  popup.html / .js / .css  the Chance "wallet" popup
  icons/16,48,128.png      extension icons (Chance ✦ / coin)
  README.md                load-unpacked + dev instructions
```

Repo location: `~/Projects/HedgePayments/chance-extension/` (its own folder; can become its own repo / Chrome Web Store item later).

---

## 5. Checkout detection (the hard part)

A **scored signal** approach, re-evaluated on load + debounced DOM mutations (checkouts are SPA-ish):

- **URL** — `/checkout`, `/cart`, `/payment`, `/order`, `/billing`; `checkout.shopify.com`, `*.myshopify.com/checkouts/*`, `checkout.stripe.com`.
- **Platform markers** — `window.Shopify`, `body.woocommerce-checkout`, Stripe Checkout DOM, BigCommerce/Magento hints.
- **DOM cues** — card inputs (`autocomplete=cc-number`, `[name*=card]`), Stripe/Braintree iframes, buttons reading *Place order / Pay / Complete purchase*.
- **Total parsing** — look for "Order total / Grand total / Total due" labels and known selectors (`.order-total`, `[data-checkout-payment-due-target]`, `.cart-subtotal`), then the largest nearby currency value; normalize currency + amount.

Detection returns `{ isCheckout: boolean, confidence, amount, currency }`. Bubble shows only above a confidence threshold; if `amount` is missing, the bubble asks the shopper to confirm it (manual override). Start with Shopify/Stripe/WooCommerce (the long tail), iterate with a per-site override map.

---

## 6. UX

- **Bubble** — a small Chance ✦/coin button that slides in bottom-right on a detected checkout (Shadow DOM, never blocks the page). Shows the prize tease ("win up to $X back"). Click → opens the sheet via the page-bridge.
- **Sheet** — the existing Plaid-style intent-first flow (intro → risk/win sliders → live markets → handshake → result), pre-filled with the detected amount.
- **Popup (wallet)** — status ("Chance is watching for checkouts"), recent plays (from `chrome.storage`), settings (default mode, enable/disable per site), and a manual "Open Chance on this page" button.
- **Badge** — the toolbar icon badges when a checkout is detected on the active tab.

---

## 7. Permissions & privacy

- `host_permissions`: `<all_urls>` (needed to detect checkouts anywhere) — explained in the store listing.
- `permissions`: `storage` (settings/history), `activeTab`/`scripting` as needed. **No** `webRequest`/network interception.
- **Privacy posture:** detection + total parsing happen **locally**; market data is fetched client-side from Polymarket; nothing about the shopper's cart is sent to a Hedge server in this phase. A privacy policy is required for Chrome Web Store review. The bubble is dismissible and per-site disable is offered.
- **No remote code in the extension context** (MV3 rule). The hosted widget loads in the *page* context, which is compliant.

---

## 8. Aesthetic (recommended)

**Bubble + popup: arcade-neon** (the coin/✦, brand energy — it's the shopper-facing Chance surface and should feel fun/branded, matching the landing). **The opened sheet stays Plaid-white** (checkout-grade trust at the moment of decision). This mirrors how the brand already splits: playful wrapper, clean transactional core. *Flip to all-Plaid-white if you'd rather the extension feel maximally fintech-trustworthy.*

---

## 9. Phased roadmap

1. **P0 — Scaffold**: manifest, background, popup shell, content script that injects a static bubble on a test page; load-unpacked working. *(proof it runs)*
2. **P1 — Detection**: checkout scoring + total parsing across Shopify / Stripe Checkout / WooCommerce; badge on detect. Verified on real stores.
3. **P2 — Widget integration**: page-bridge loads `chance.js`, bubble opens the sheet with the detected amount; `chance:result` saved to history.
4. **P3 — Wallet popup**: account/settings/recent plays, per-site enable/disable.
5. **P4 — Polish + store**: arcade bubble, icons, privacy policy, Web Store listing + review.

---

## 10. Open questions / risks

- **Detection robustness** across the messy long tail of checkouts — start narrow (top platforms), expand with overrides; never false-trigger.
- **Merchant ToS / injecting UI** on third-party checkouts — review; the bubble is shopper-initiated and non-blocking, but some sites may object.
- **Compliance** — same prediction-market/sweepstakes questions as the embed (counsel before real money), now shopper-side rather than merchant-side.
- **Chrome Web Store review** — `<all_urls>` + a financial product invites scrutiny; need a clear privacy policy + justification.
- **Settlement** — simulated until the real routing/execution phase lands.
- **Kalshi** — still needs a backend proxy for live US data (Polymarket is live client-side).
- **Safari/Firefox** — MV3 is largely portable; out of scope for v1.

---

## 11. Next step

Build **P0** (a loadable MV3 scaffold with the bubble on a test page) once this plan is approved, then iterate detection on real stores.
