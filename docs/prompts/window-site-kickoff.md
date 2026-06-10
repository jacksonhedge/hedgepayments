# Window 1 — Marketing Site Kickoff

Paste this into a fresh Claude Code window opened at `~/Projects/HedgePayments/website`:

---

You own the **marketing site** work stream (`app/` and `public/` only — do NOT touch `packages/` or `supabase/`; other Claude windows own those).

**Context:** hedgepayments.com was just repositioned (commit `56dc0a7`, deployed 2026-06-09): Hedge Payments = white-label payments infrastructure (Coinflow-style). Chance™ + SideBet = first-party products "powered by Hedge Payments". CoverPay + FraternityBase = clients on Hedge rails. The homepage (`app/components/ArcadeLanding.tsx`) already reflects this.

**Your backlog, in order:**

1. **Legal pages** — create real `/privacy`, `/terms`, and `/responsible-gaming` pages in the arcade brand style, and point the footer placeholders (`app/components/Footer.tsx` legal links, currently `#`) at them. Responsible Gaming matters most — we're gambling-adjacent (Chance routes stakes to prediction markets; the 1-800-GAMBLER line is already in the footer). Draft sensible startup-grade copy; flag anything that needs counsel review rather than inventing legal claims.

2. **Retire the stale `/products` page** (`app/products/page.tsx`) — it's an old design era (bookstore style, lists "Bankroll" and "College Casino Tour" as Hedge products) and contradicts the new architecture. Replace it with a redirect to `/` or rebuild it as a thin "what runs on Hedge" page matching the arcade brand and OUR PRODUCT vs CLIENT framing.

3. **CoverPay client-showcase page** — the homepage CLIENT card links to `/demo/coverpay`. Build a proper `/clients/coverpay` case-study-style page: what CoverPay is (BNPL aggregation over Klarna/Affirm/Afterpay/Sezzle/Zip/PayPal), how it runs on Hedge rails, with the existing demo embedded or linked. Then repoint the homepage card.

4. **Sweep for old-brand leftovers** — grep `app/` for "Bankroll" presented as a Hedge product, "PayFlip", "HedgePay" used as a product name (vs. the company), and "College Casino Tour". Fix what contradicts the white-label story.

**Rules:**
- Build check before any commit: `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder SUPABASE_SERVICE_ROLE_KEY=placeholder node_modules/.bin/next build`
- Commit per task, small commits, `git add` specific files only (other windows share this checkout).
- Do NOT deploy to Vercel without asking — the user triggers deploys.
- Use the brainstorm → spec → plan superpowers loop for task 3 (it's a real page design); tasks 1, 2, 4 can be executed directly.
