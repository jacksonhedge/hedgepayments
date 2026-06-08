# Front-End Build-Out — Kickoff Brief (paste into the new window)

**Mission:** Build out a cohesive front-end across the four Hedge products — **CoverPay, Hedge Payments, Chance, SideBet** — so they feel like one product family on a shared design system, not four disconnected surfaces.

## Repo & stack
- Single Next.js app: `~/Projects/HedgePayments/website` (Next **14** App Router, TypeScript).
- **Hosting:** Vercel (project `hedgepayments-website`). As of 2026-06-08 it's a **server build** — `output: 'export'` was removed, so Next API routes run again.
- **Styling:** Tailwind (`tailwind.config.js`) + CSS Modules + `framer-motion`. Aesthetic leans **arcade-neon** (see `app/components/ArcadeLanding*`, the `/chance` + `/store` pages, Press Start 2P / gold-die motifs).
- **Data/auth:** **Supabase only** (Firebase was fully removed today). Browser client: `app/utils/supabase-browser.ts`; server: `app/utils/supabase.ts` + `supabase-server.ts`.
- **Backend:** `@hedge/api` (Express + TS) at `packages/api` — the home for server logic, deployable via its `Dockerfile` (not yet deployed). Mounts `/api/v1/chance/*`, `/api/v1/waitlist`, `/api/v1/subscribe`.

## Brand architecture
Hedge = parent over **HedgePay** (B2B flagship), **SideBet**, **Chance**, FraternityBase on a shared payment spine; **CoverPay** = internal Stripe layer. Full spec: `docs/superpowers/specs/2026-06-03-hedge-brand-architecture-design.md`.

## Current front-end map
**Marketing / product pages (`app/`):**
- **Chance:** `/chance` (demo), `/store` (Shopify×Chance demo) — the most polished, arcade aesthetic.
- **SideBet:** `/sidebet`, `/sidebet/prophet-demo`; `app/docs/sidebet`.
- **Hedge Payments:** `/`, `/products`, `/get-started`, `/partners`, `/marketing-partners`, `/developers`, `/docs`.
- **CoverPay:** `app/docs/coverpay`, `app/dashboard/coverpay` (B2B checkout product; its backend routes were removed today — rebuild as an `@hedge/api` slice when needed).

**Dashboard (logged-in, `app/dashboard/`):** shared shell (`layout.tsx`) + surfaces: `balances`, `customers`, `transactions`, `settings`, `products`, `developers`, `coverpay`, `sidebet`.

**Auth:** `business-signup` (now Supabase Auth), `business-login`, `user-login`, `signup`.

**Components (`app/components/`):** Hero, Navbar, Footer, Features, ArcadeLanding, WaitlistForm, RoundUpsDemo, JackpotDisplay, LogoTicker, PartnerLogos… — mixed CSS Modules + Tailwind. **No formal design system yet** (this is the gap).

## State / gotchas (2026-06-08)
- Everything is committed to `main` **locally; nothing is deployed.**
- Deploy is **Vercel-only** now (GitHub Pages + Firebase deploy paths removed).
- Waitlist/subscribe were 404 in prod (static export) — just fixed.
- Slack signup notifications wired (needs `SLACK_WEBHOOK_URL`).
- `ROADMAP.md` at repo root = source of truth (mirrored to Notion).

## Suggested approach
1. **Design-system foundation first** — tokens (color/type/spacing), the arcade aesthetic codified, a small shared component library — so the four products are visually one family. Highest leverage; prevents per-product drift.
2. **Then build per-product surfaces** on it — marketing pages + dashboard surfaces (CoverPay + SideBet are the thinnest / most in need).
3. Keep **demo vs real** clearly separated; data via Supabase / `@hedge/api`.

## First moves for the new window
- Read: `ROADMAP.md`, the brand-architecture spec above, `tailwind.config.js` + `app/globals.css` + `app/components/`.
- Decide the design-system direction (probably brainstorm the foundation first), then build product-by-product.
