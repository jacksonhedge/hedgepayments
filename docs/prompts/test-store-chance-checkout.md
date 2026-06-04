# Browser-agent QA — Store → Checkout → Chance flow (+ link preview)

Paste the fenced block below into your browser extension. It tests the simulated
Shopify storefront, the Chance win-back checkout, and the shareable link preview.

> **Important — no sub-routes.** The whole flow lives on one page (`/store`) as a
> click-through state machine. Do **not** type URLs like `/store/checkout`,
> `/store/chance`, or `/store/result` — they 404. Reach every step by **clicking**
> on-page buttons, starting from `https://hedgepayments.com/store`.

---

## Prompt

```
Go to https://hedgepayments.com/store and test this simulated Shopify store + the
"Chance" win-back checkout. It is ONE page — never type a sub-path in the URL bar;
reach every step by clicking buttons. Report a short pass/fail per section with any
visual bugs, broken images, or things that look off, plus screenshots where noted.

1) PRODUCT PAGE
   - Header "LUMEN", product image, title, ★ rating, price, description all render.
   - Default product is the "Lumen 75% Mechanical Keyboard" at $85.00.
   - Click each of the 3 thumbnails; confirm image/name/price update (keyboard $85,
     headphones $129, lamp $45). Return to the keyboard.
   - Confirm an "EXPRESS CHECKOUT" row with FIVE buttons: Debit, Credit (dark),
     Venmo (blue), Klarna (pink), and Chance (full-width green).
   - Confirm the "Chance" word is in a CURSIVE script font, and the green Chance
     button visibly SHIMMERS/GLOWS (an animated sheen sweeps across + a soft green
     glow pulse). Note if either is missing.

2) CHECKOUT
   - Click "Buy it now". Confirm a Shopify-style checkout: Contact / Delivery /
     Payment on the left, order summary on the right (Subtotal $85, Shipping Free,
     Total $85.00 USD).
   - Confirm all FIVE payment methods are listed: Debit card, Credit card, Venmo
     (blue text), Klarna (pink chip), Chance (cursive + "Win it back" badge).
   - Click each and confirm its detail expands:
       * Debit / Credit → card number, expiry, CVC fields
       * Venmo → "You'll approve $85.00 in the Venmo app."
       * Klarna → "4 payments of $21.25 every 2 weeks · 0% interest."
   - Confirm the summary button reads "Pay $85.00" for card/Venmo/Klarna, and
     "Continue with Chance →" (cursive Chance) when Chance is selected.

3) CHANCE — MARKETS (look closely at the venue branding)
   - Select Chance → "Continue with Chance →". Confirm "Win back your Keyboard" and
     a "Chance by Hedge" pill (cursive Chance).
   - Confirm SIX market cards. Each venue must be EASY to identify:
       * Polymarket cards → a light-BLUE pill containing the blue Polymarket icon +
         the bold blue word "Polymarket".
       * Kalshi cards → a light-TEAL pill containing the Kalshi logo.
     Report any logo image that fails to load or looks low-res.
   - Each card shows: "% chance", a bold market question, a green "Yes X¢" pill, and
     a "$X back" amount (the longshot says "$85 back · whole order").
   - Click a card: confirm it gets an OBVIOUS green selection — green fill, a thicker
     green ring, and its "Yes" pill turns solid green. The bottom button should read
     "Place to win back $X".

4) RESULT
   - Click "Place to win back $X". Confirm a "Resolving on Kalshi/Polymarket…"
     spinner state with the venue logo for ~2 seconds.
   - Confirm it reveals a WIN ("You won $X back!", green, with a breakdown: order −
     win-back = a lower "You paid" amount, and "Settled on" + venue logo) OR a LOSS
     ("So close!"). Run it a few times to try to see both.
   - Confirm the footer "Powered by Hedge · markets via Polymarket & Kalshi".
   - Click the final button; confirm it returns to the product page (state resets).

5) LINK / SHARE PREVIEW
   - Check the page's HTML <head> (view source or read meta tags). Confirm:
       * og:image  = https://hedgepayments.com/og/store.png
       * og:title  = "Buy it. Then win it back."
       * og:image:width 1200, og:image:height 630
   - Open https://hedgepayments.com/og/store.png directly and confirm it loads as a
     1200×630 image showing "Buy it. Then win it back.", a receipt ($85 → $59, won
     $26 back), and the Polymarket + Kalshi logos.
   - (Optional) Paste https://hedgepayments.com/store into https://www.opengraph.xyz
     and confirm the unfurl card shows that image + title.

Report: pass/fail per section. Screenshots of (a) the express buttons, (b) the
Chance market cards with venue pills, (c) a win result, and (d) the og:image.
Flag any broken/low-res logo, missing shimmer, missing cursive, or a link preview
that doesn't show the image.
```
