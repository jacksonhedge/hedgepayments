# Browser-agent prompt — test the Chance extension demo (3 steps)

Paste the block below into your browser agent. It's written so it works whether or
not the agent can load the unpacked extension: Part A tests the live web demo (no
extension needed); Part B tests the loaded extension. Replace the `[...]` notes if
needed.

---

You are testing **Chance — a Hedge Pay product**, a demo that lets a shopper back a
real prediction market at checkout for a shot at a discount (up to a free order).
It is a **labeled demo — no real money**; outcomes are simulated. Work carefully,
take a screenshot at each numbered step, and write a short PASS/FAIL report at the
end with anything that looked broken.

## Part A — the live web demo (no extension required)

1. Go to **https://hedgepayments.com/chance**. Confirm the page loads (an arcade-
   styled "Northwind Goods" checkout with a spinning gold coin). Screenshot.
2. Click the green **"Add Chance — win it back?"** button. A sheet opens titled
   **"Turn your order into a win"** with a "Demo · no real money yet" chip in the
   header. Screenshot.
3. Click **"Get started →"**. You should see two sliders — **how much to risk** and
   **the discount you win** — and a live readout showing a **% chance**, odds, "pay
   today", and a count like **"Find N markets →"**. Move each slider once and
   confirm the % chance and the market count update live. Screenshot.
4. Click **"Find N markets →"**. You should see a list of **real prediction markets**
   (Polymarket), each with a chance % and an expiration ("ends in 6h" / "ends Fri").
   Screenshot.
5. Click one market row, then the green **"Risk $X & place"** button. A
   **"Connecting to Polymarket…"** animation (two logos joined by moving dots) plays,
   then a **result** screen (a win "You won $X off!" or a loss "So close!") with a
   breakdown. Screenshot the result.
6. In the right-hand panel, switch **Mode** to **"Win it back"** and **Theme** to
   **"Dark"**, then repeat steps 2–5 once. Confirm the copy changes (free to play /
   stake on the house) and the dark theme renders. Screenshot.

## Part B — the browser extension (only if it's installed)

The unpacked extension lives at `~/Projects/HedgePayments/chance-extension` and is
loaded via `chrome://extensions` → Developer mode → **Load unpacked**.
[If you cannot load unpacked extensions, skip Part B and say so.]

7. Click the **✦ Chance** toolbar icon. A popup opens titled **Chance · live
   markets** listing ~12 markets with their chance % and "ends …" — this is **step
   1** (it shows the odds). Screenshot.
8. Go to a checkout page — either **https://hedgepayments.com/chance** or any real
   store's checkout (add an item to a cart → proceed to checkout). Within a few
   seconds a **floating Chance bubble** ("Win up to $X back") should appear in the
   bottom-right — **step 2**. Screenshot.
9. Click the bubble. The same Chance flow from Part A should open (intro → sliders →
   markets → result) — **step 3**. Walk it once and screenshot the result.

## Report

For each step: PASS/FAIL + the screenshot. Call out anything that errored, looked
visually broken, or didn't match the description (especially: did the bubble appear
on the checkout? did the result screen render? did the "Demo · no real money" label
show?). Note the browser + OS used.
