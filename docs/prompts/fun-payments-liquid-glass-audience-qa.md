# Front-end QA — Hedge "Fun Payments." Liquid Glass + Audience Split + Login

**Paste this into a browser-driving agent (Claude-in-Chrome / Playwright agent).**

You are a meticulous QA + design reviewer auditing a marketing site as if you were a Stripe-CEO-level acquirer: it must read as *payments infrastructure*, feel premium, and have zero broken behavior. Be adversarial — actively try to break it and report anything that looks off, not just hard failures.

## Setup
- Local dev server: **http://localhost:3000** (run `rm -rf .next && npm run dev` in `~/Projects/HedgePayments/website` first if it's not up).
- Test desktop (1440×900) **and** mobile (390×844).
- After EVERY page/scroll state, capture a screenshot AND check the browser console — **report any console errors or warnings with the exact text**.
- The site is a Next.js static-export; the live site only deploys via Vercel CLI, so you are testing the dev build.

## Core ethos to judge against
Every surface should ladder to: **the quarter = "you don't need much to have fun or win big; a daily little something you won't miss losing can change your life."** Flag any copy/visual that undercuts or ignores this.

---

## 1. Homepage `/` — load + loader
- The flip-grid loader appears, resolves into coins, then fades. Note if it feels too long/short or janky.
- After load: **0 console errors**.

## 2. Liquid Glass (the #1 thing to scrutinize)
- The **navbar** must read as *true* glass: you can see the background/coin **through** it (blurred + slightly color-saturated), with a **bright specular top edge** and a soft drop shadow. It must NOT look like a flat opaque/milky white pill.
- Move the cursor across the navbar: the bright sheen should **follow the pointer** (cursor-reactive).
- Glass **cards** in the For Users / For Businesses sections and the tube "station" cards must show the same see-through refraction. Text on glass must stay legible.
- Judgment call: does the glass look like Apple iOS-26 "Liquid Glass," or cheap/flat? Describe honestly.

## 3. Hero
- Headline **"Fun Payments."** + subhead **"It only takes a quarter."** in crisp dark ink (NOT gray/washed).
- Two buttons under the subhead: **[For Users]** (orange) and **[For Businesses]**. Hovering each should give a subtle **magnetic** pull toward the cursor.
- The big silver Washington quarter bleeds off the bottom-right.
- **QA regressions to confirm are FIXED:**
  - (a) Scroll slowly from 0%→~15%. The headline must **stay crisp** (not fade to gray) while it's visible.
  - (b) During the hero→tube handoff (~10–14% scroll) there must be **exactly ONE coin** on screen at any moment — no double-coin overlap.
  - (c) The resting hero coin should **gently wobble** (small left/right tilt), never spin fully upside-down.
- Brand mark top-left: a small **coin that flips on hover** next to "Hedge" (both faces are heads).

## 4. Navigation
- Order must be exactly: **Hedge · For Users · For Businesses · Products ▾ · Developers · Company · [Get a free quarter]**.
- Hover **Products ▾** → a glass dropdown with **Chance / SideBet / Payments**.
- Click **For Users** → smooth-scrolls to the `#users` section, fully visible below the fixed nav (not hidden under it).
- Click **For Businesses** → smooth-scrolls to `#businesses`.
- Click **Get a free quarter** → scrolls to the claim widget at the bottom.

## 5. For Users section (`#users`)
- Red "FOR USERS" kicker; headline "A daily little something you won't miss losing."; small-stakes lead copy.
- Two glass cards: **SideBet** and **Chance — the wallet**. Confirm wording matches (Chance is described as the wallet).
- The **"$1,000+"** stat must **count up** from 0 when it scrolls into view, and be **orange**.

## 6. For Businesses section (`#businesses`) — the acquirer surface
- Cyan "FOR BUSINESSES" kicker; headline "A payments layer that lifts conversion and AOV."
- Lead must name **SideBet + Chance + payment rails (Debit, ACH)**, **white-labeled via Coinflow**, **powered by Hedge**.
- "**Add Chance in ~5 lines**" with a code snippet (a `<script>` + `<chance-checkout>`) shown in a glass panel, plus a "Read the docs →" link (→ `/docs`).
- Three metric tickers count up: **conversion lift**, **higher AOV**, **repeat-purchase rate**. A small note must say the figures are **illustrative**.
- Three cards: **Built for trust** (KYC/custody/responsible-play, routes to real markets never the house), **The win-it-back loop**, **Aligned economics** (interchange + take rate + widget SaaS).
- Footer line: "**Powered by Hedge · white-labeled via Coinflow**".
- Judgment: would a payments-infra buyer read this as infrastructure (good) or as a casino gimmick (bad)? Explain.

## 7. Claim widget (`#claim`)
- "Take your free quarter." + the `<chance-checkout>` widget mounts and is playable.
- Play it; on result the email-capture card appears ("Save your winnings — keep your quarter"). Submitting an email should show a reserved/confirmation state. (Email POSTs to `/api/subscribe` — a success or graceful error is fine; report which.)

## 8. Login pages (NEW — must feel Stripe-clean, in the Hedge brand)
- `/user-login`: centered glass card on cream, CoinLogo + "Hedge" top-left, "● FOR USERS" kicker, "Welcome back", "Log in to your Chance wallet.", email/password/remember/forgot, orange "Log in →", "Don't have an account? Sign up", "← Back to home". No old "Bookstore" navbar.
- `/business-login`: same clean card, "● MERCHANT LOGIN", "Log in to your Hedge Payments dashboard.", "New here? Start free". No arcade grid/scanlines/"Insert Coin".
- **Functional check (business-login):** enter any email + password and submit. The Supabase auth path should fire and surface an error in the styled error box (with dev placeholder env it will say something like "Failed to fetch" — that's expected and proves the wiring is intact, NOT a bug). Confirm the error renders inside the card cleanly.
- Judge: do these match the "simple yet beautiful, Stripe-like" bar?

## 9. Accessibility & reduced motion
- Enable **prefers-reduced-motion** (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce) and reload `/`:
  - No coin wobble, no count-up animation (final numbers shown immediately), no magnetic buttons, anchor clicks jump instantly.
- Keyboard: Tab from page top — the "Skip to free quarter" link should appear on focus. Tab through nav + login forms; focus rings visible (login inputs get a cyan focus ring).

## 10. Responsive (390px)
- Nav collapses gracefully (links may hide on narrow widths).
- For Businesses dev-row + metrics stack to a single column.
- Login card stays comfortably padded, no horizontal overflow.
- Glass cards don't break layout.

---

## Report format
For each numbered section: ✅ pass / ⚠️ minor / ❌ broken, with a screenshot and one line of evidence. End with:
- **Top 3 things that would impress an acquirer.**
- **Top 3 things that would embarrass us in front of one.**
- Full list of any console errors/warnings (exact text).
- Anything that contradicts the quarter ethos.
