# Hedge Homepage — Liquid Glass System + Audience Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Hedge "Fun Payments." homepage into a true iOS-26 Liquid-Glass + Old-Vegas experience with a two-audience (Users / Businesses) story, backed by the first shared design-token foundation — while fixing the prior QA defects and hardening one pre-existing auth fallback.

**Architecture:** The homepage is a framer-motion scroll cinematic (`app/components/chip/ChipAndAChair.tsx`) rendered at `/`. This plan (1) extracts the Old-Vegas palette into global CSS variables + a TS tokens module so it stops living only inside `chip.module.css`; (2) rebuilds the glass so it is genuinely transparent (real `backdrop-filter` blur+saturate, SVG displacement refraction, bright specular top edge, soft inner glow, cursor-reactive specular) instead of the current flat milky white fill; (3) adds the audience split as two anchored scroll sections (`#users`, `#businesses`) the hero buttons smooth-scroll to; (4) fixes the QA defects (double-coin handoff, hero text fading to gray, coin passing upside-down); (5) hardens the Supabase client fallback to fail closed in production.

**Tech Stack:** Next.js 14 (App Router), React 18, framer-motion (already a dep), CSS Modules, Vitest + @testing-library/react + jsdom (test runner already wired, `npm test`), Playwright MCP for live visual verification.

## Global Constraints

- **Palette (Old Vegas), exact hex:** cream `#fbf3db`, ink `#1b1c22`, red `#fa1007`, cyan `#05abd0`, orange `#f99a0b`, sky `#b1edf9`. These are the canonical tokens; do not introduce new brand colors.
- **Hero copy is locked:** headline `Fun Payments.`, subhead `It only takes a quarter.` Headline and subhead must stay crisp ink (never fade to gray on scroll).
- **Hero buttons:** `[For Users]` and `[For Businesses]` sit under the subhead and **smooth-scroll to on-page sections** `#users` / `#businesses` (decided with user — not separate routes).
- **Product wording (locked, Coinflow named publicly):**
  - For Users: products = **SideBet** + **Chance (the wallet)**. Ethos line: "Small stakes, real upside — it never hurts to lose."
  - For Businesses: products = **SideBet** + **Chance** + **payment rails (Debit, ACH, etc.)**, **white-labeled via Coinflow**, **powered by Hedge**.
- **Nav (audience-first, locked):** `Hedge` brand · `For Users` · `For Businesses` · `Products ▾` (Chance / SideBet / Payments) · `Developers` · `Company` · CTA `Get a free quarter`.
- **Core ethos every surface ladders to:** the quarter = "you don't need much to have fun or win big; a daily little something you won't miss losing can change your life."
- **Verification is mandatory and live:** every task that changes rendered output must be verified with the Playwright MCP against `http://localhost:3000/` (dev server already running on port 3000) — take a screenshot AND assert `browser_console_messages` shows zero errors. Commit per task.
- **Reduced motion:** all motion added must no-op or degrade to a static state under `prefers-reduced-motion: reduce` (existing `usePrefersReducedMotion` hook + CSS media query).
- **Do not regress tests:** `npm test` must stay green (currently 16 tests). `npm run build` must stay green. GOTCHA: never run `npm run build` while `npm run dev` is up — it 404s dev chunks; if you must build, kill dev, `rm -rf .next`, build, then restart dev.
- **No AI-generated coin art.** Coin assets are out of scope for this plan (deferred to follow-up Plan C); keep using the existing `public/images/chip/quarter.png`.

---

## File Structure

**New files:**
- `app/design/tokens.ts` — exported TS constants for the palette + a few shared scales (radii, blur, durations). Single source of truth consumed by components that need values in JS.
- `app/design/tokens.test.ts` — guards the exact hex values so a stray edit can't silently drift the brand.
- `app/components/chip/glass/useGlassPointer.ts` — hook that writes pointer position to CSS custom props (`--gx`, `--gy`) on a ref'd element for cursor-reactive specular/refraction.
- `app/components/chip/hero/AudienceButtons.tsx` — the two hero buttons (smooth-scroll + magnetic hover).
- `app/components/chip/sections/UsersSection.tsx` — `#users` consumer offer.
- `app/components/chip/sections/BusinessesSection.tsx` — `#businesses` merchant/acquisition offer.
- `app/components/chip/sections/CountUp.tsx` — reusable count-up ticker (IntersectionObserver-gated, reduced-motion aware).
- `app/components/chip/sections/CountUp.test.tsx` — count-up math/format test.
- `app/components/chip/sections/sections.module.css` — styles for the two audience sections.
- `app/components/chip/brand/CoinLogo.tsx` — two-headed coin flip-on-hover brand logo (CSS 3D, heads on both faces).
- `app/components/chip/brand/coinLogo.module.css` — its styles.

**Modified files:**
- `app/globals.css` — add palette + token CSS vars under `:root`.
- `app/utils/supabase-client.ts` — harden the empty-env fallback (fail closed in production).
- `app/components/chip/glass/GlassDefs.tsx` — stronger displacement map for visible refraction.
- `app/components/chip/glass/glass.module.css` — rebuild glass layers (transparent, blur+saturate, specular, inner glow, cursor-reactive).
- `app/components/chip/glass/GlassPanel.tsx` — wire the pointer hook + per-panel CSS-var plumbing.
- `app/components/chip/glass/GlassNav.tsx` — audience-first menu + CoinLogo brand.
- `app/components/chip/chip.module.css` — consume token vars; hero-copy crisp fix; section anchors.
- `app/components/chip/beats/SunBeat.tsx` — mount AudienceButtons; fix copy opacity (stay crisp); single-coin handoff; wobble instead of full spin.
- `app/components/chip/ChipAndAChair.tsx` — render the two new sections between TubeJourney and ClaimBeat.

---

## Task 1: Harden the Supabase client fallback (security, independent)

**Files:**
- Modify: `app/utils/supabase-client.ts`

**Interfaces:**
- Produces: `createClientComponentClient()` unchanged signature; behavior now fails closed in production when env is missing.

**Context:** Memory flagged a "TEMP-DEV-BYPASS faking getUser→demo-user". The current file has no such bypass — it returns a real `createBrowserClient` pointed at `https://placeholder.supabase.co` when env vars are empty. That placeholder client will fail auth calls (good), but silently returning a client that looks valid is a footgun before real auth ships. Harden it: in production, missing env is a hard error; in dev, keep the placeholder but warn.

- [ ] **Step 1: Read the current file to confirm state**

Run: `sed -n '1,20p' app/utils/supabase-client.ts`
Expected: matches the placeholder-fallback shown in the plan header (no demo-user bypass present).

- [ ] **Step 2: Replace the fallback with fail-closed-in-prod logic**

```ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// For client components
export function createClientComponentClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Fail closed in production: missing auth config must not silently produce a
    // client that looks valid. In dev/preview we allow a non-functional placeholder
    // so the marketing build can render without secrets.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Supabase env vars are missing in production (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
      )
    }
    console.warn(
      '[supabase] Missing env vars — using a non-functional placeholder client (dev/preview only).'
    )
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
```

- [ ] **Step 3: Verify the build path is unaffected**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep supabase-client || echo "no type errors in supabase-client"`
Expected: `no type errors in supabase-client`

- [ ] **Step 4: Commit**

```bash
git add app/utils/supabase-client.ts
git commit -m "fix(auth): fail closed when Supabase env missing in production"
```

---

## Task 2: Design-token foundation (palette → global CSS vars + TS module)

**Files:**
- Create: `app/design/tokens.ts`
- Create: `app/design/tokens.test.ts`
- Modify: `app/globals.css`
- Modify: `app/components/chip/chip.module.css:42-52` (point the `.cinemaRoot, .staticRoot` vars at the globals)

**Interfaces:**
- Produces: TS exports `palette` (`{ cream, ink, red, cyan, orange, sky }`), `glass` (`{ radius, blur, saturate }`), and `motion` (`{ fast, base }`). CSS exposes `--cream --ink --red --cyan --orange --sky` plus `--glass-radius --glass-blur --glass-saturate` on `:root`.

- [ ] **Step 1: Write the failing token test**

```ts
// app/design/tokens.test.ts
import { describe, it, expect } from 'vitest'
import { palette } from './tokens'

describe('palette tokens', () => {
  it('holds the exact Old-Vegas hex values', () => {
    expect(palette).toEqual({
      cream: '#fbf3db',
      ink: '#1b1c22',
      red: '#fa1007',
      cyan: '#05abd0',
      orange: '#f99a0b',
      sky: '#b1edf9',
    })
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- tokens`
Expected: FAIL — cannot find module `./tokens`.

- [ ] **Step 3: Create the tokens module**

```ts
// app/design/tokens.ts
/** Old-Vegas palette — single source of truth for the Hedge brand colors. */
export const palette = {
  cream: '#fbf3db',
  ink: '#1b1c22',
  red: '#fa1007',
  cyan: '#05abd0',
  orange: '#f99a0b',
  sky: '#b1edf9',
} as const

/** Liquid-glass surface defaults. */
export const glass = {
  radius: '22px',
  blur: '14px',
  saturate: '180%',
} as const

/** Shared motion timings (seconds). */
export const motion = {
  fast: 0.16,
  base: 0.32,
} as const
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- tokens`
Expected: PASS.

- [ ] **Step 5: Add the CSS vars to globals**

Add to `app/globals.css` inside the existing `:root { ... }` block (do not remove existing vars):

```css
  /* Old-Vegas palette — mirrors app/design/tokens.ts */
  --cream: #fbf3db;
  --ink: #1b1c22;
  --red: #fa1007;
  --cyan: #05abd0;
  --orange: #f99a0b;
  --sky: #b1edf9;
  /* Liquid-glass defaults */
  --glass-radius: 22px;
  --glass-blur: 14px;
  --glass-saturate: 180%;
```

- [ ] **Step 6: Point chip.module.css at the inherited vars (DRY)**

In `app/components/chip/chip.module.css`, change the `.cinemaRoot, .staticRoot` block so each brand var falls back through the global value (keeps the cinema scoped but stops duplicating the palette as the source of truth):

```css
.cinemaRoot, .staticRoot {
  position: relative;
  --cream: var(--cream, #fbf3db);
  --ink: var(--ink, #1b1c22);
  --red: var(--red, #fa1007);
  --cyan: var(--cyan, #05abd0);
  --orange: var(--orange, #f99a0b);
  --sky: var(--sky, #b1edf9);
  color: var(--ink);
  background: var(--cream);
}
```

- [ ] **Step 7: Verify live — homepage still renders with the palette intact**

Use Playwright MCP: `browser_navigate http://localhost:3000/`, wait for load, `browser_take_screenshot`, then `browser_console_messages`.
Expected: page looks identical to before (cream canvas, ink text); zero console errors.

- [ ] **Step 8: Commit**

```bash
git add app/design/tokens.ts app/design/tokens.test.ts app/globals.css app/components/chip/chip.module.css
git commit -m "feat(design): extract Old-Vegas palette into global tokens (CSS vars + TS module)"
```

---

## Task 3: Rebuild the glass into true iOS-26 Liquid Glass

**Files:**
- Modify: `app/components/chip/glass/GlassDefs.tsx`
- Modify: `app/components/chip/glass/glass.module.css:1-41` (the `.glass*` layer rules)

**Interfaces:**
- Consumes: `--glass-radius --glass-blur --glass-saturate` (Task 2).
- Produces: `.glass`, `.glassFilter`, `.glassTint`, `.glassEdge`, `.glassContent` classes unchanged in NAME (GlassPanel keeps working) but visually transparent + refractive.

**Context:** Current glass reads as a flat milky-white card: `.glassTint` is `rgba(255,255,255,0.62→0.5)` (almost opaque) and `.glassFilter` only blurs 4px. The fix: make the tint a thin translucent veil so the coin/background show THROUGH, push real `backdrop-filter: blur(var) saturate(var) url(#liquid-glass)`, brighten the specular top edge, add a soft inner glow. The QA note "glass too flat" is resolved here.

- [ ] **Step 1: Strengthen the displacement filter**

Replace the `<filter>` body in `GlassDefs.tsx` so refraction is visibly larger (scale 14 → 22) and the noise is a touch finer:

```tsx
        <filter id="liquid-glass" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="2" seed="17" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
```

- [ ] **Step 2: Rebuild the glass layer CSS**

Replace `glass.module.css` lines 1–41 (the `.glass`, `.glassFilter`, `.glassTint`, `.glassEdge`, `.glassContent` rules) with:

```css
/* ── Liquid-glass surface (true iOS-26: transparent, refractive) ───────── */
.glass {
  position: relative;
  border-radius: var(--glass-radius, 22px);
  isolation: isolate;
  overflow: hidden;
  /* Cursor-reactive specular origin (updated by useGlassPointer); centred default. */
  --gx: 50%;
  --gy: 0%;
}
.glassFilter {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  /* Real refraction: blur + saturation boost + SVG displacement. The url() bends
     the coin/background behind the panel; Safari ignores url() and just blurs. */
  backdrop-filter: blur(var(--glass-blur, 14px)) saturate(var(--glass-saturate, 180%)) url(#liquid-glass);
  -webkit-backdrop-filter: blur(var(--glass-blur, 14px)) saturate(var(--glass-saturate, 180%));
}
.glassTint {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  /* THIN translucent veil so the backdrop shows through (was an opaque milky fill).
     Slightly brighter at the cursor-tracked top corner for a wet-glass sheen. */
  background:
    radial-gradient(120% 80% at var(--gx) var(--gy), rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.10) 46%, rgba(255, 255, 255, 0.16) 100%);
}
.glassEdge {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  pointer-events: none;
  /* Bright specular top edge + hairline rim + soft inner glow + lifted drop. */
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45),
    inset 0 1px 14px rgba(255, 255, 255, 0.45),
    inset 0 -18px 36px rgba(20, 20, 30, 0.05),
    0 22px 50px rgba(20, 20, 30, 0.18);
}
.glassContent {
  position: relative;
  z-index: 3;
  display: block;
}
```

- [ ] **Step 3: Verify live — glass is now transparent + refractive**

Playwright MCP on `http://localhost:3000/`:
1. `browser_navigate`, wait for load.
2. `browser_take_screenshot` of the nav — the coin/cream behind the navbar must be visibly blurred-through (NOT a solid white pill).
3. Scroll to a glass card (tube StationCard) and screenshot — same see-through refraction.
4. `browser_console_messages` → zero errors.
Expected: nav and cards read as wet, see-through glass with a bright top edge; text on them stays legible.

- [ ] **Step 4: If text legibility drops on the brightest coin areas**

Only if step 3 shows washed-out text over the bright coin: bump the tint floor by changing the middle stop `rgba(255,255,255,0.10)` → `rgba(255,255,255,0.18)` (keep it a veil, not a fill). Re-verify.

- [ ] **Step 5: Run the suite + commit**

```bash
npm test
git add app/components/chip/glass/GlassDefs.tsx app/components/chip/glass/glass.module.css
git commit -m "feat(glass): true iOS-26 liquid glass — transparent, refractive, specular edge"
```
Expected: 16/16 (+1 from Task 2 = 17) tests pass.

---

## Task 4: Cursor-reactive glass (specular + refraction track the pointer)

**Files:**
- Create: `app/components/chip/glass/useGlassPointer.ts`
- Modify: `app/components/chip/glass/GlassPanel.tsx`

**Interfaces:**
- Consumes: `.glass` exposes `--gx`/`--gy` (Task 3).
- Produces: `useGlassPointer(ref)` — attaches pointer listeners that set `--gx`/`--gy` on the element; no-ops under reduced motion.

- [ ] **Step 1: Write the hook**

```ts
// app/components/chip/glass/useGlassPointer.ts
'use client'
import { useEffect, type RefObject } from 'react'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

/** Tracks the pointer over a glass element and writes its position to
 *  --gx/--gy (percent) so the specular sheen follows the cursor. No-op under
 *  reduced motion or when the ref is empty. */
export function useGlassPointer(ref: RefObject<HTMLElement>) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      el.style.setProperty('--gx', `${x.toFixed(1)}%`)
      el.style.setProperty('--gy', `${y.toFixed(1)}%`)
    }
    const onLeave = () => {
      el.style.setProperty('--gx', '50%')
      el.style.setProperty('--gy', '0%')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, reduced])
}
```

- [ ] **Step 2: Wire it into GlassPanel behind an opt-in prop**

Modify `GlassPanel.tsx` to accept `reactive?: boolean` (default `false`) and attach the hook to the outer element. Add `import { useRef } from 'react'` and `import { useGlassPointer } from './useGlassPointer'`. Replace the component body:

```tsx
export default function GlassPanel({
  children,
  className = '',
  contentClassName = '',
  as: Tag = 'div',
  reactive = false,
  ...rest
}: GlassPanelProps) {
  const ref = useRef<HTMLElement>(null)
  useGlassPointer(reactive ? ref : { current: null })
  return (
    <Tag ref={ref} className={`${styles.glass} ${className}`} {...rest}>
      <span className={styles.glassFilter} aria-hidden />
      <span className={styles.glassTint} aria-hidden />
      <span className={styles.glassEdge} aria-hidden />
      <span className={`${styles.glassContent} ${contentClassName}`}>{children}</span>
    </Tag>
  )
}
```

Add `reactive?: boolean` to the `GlassPanelProps` interface.

- [ ] **Step 3: Make the nav shell reactive**

In `GlassNav.tsx`, add `reactive` to the outer `<GlassPanel className={styles.navShell} ...>`.

- [ ] **Step 4: Verify live**

Playwright MCP: `browser_navigate http://localhost:3000/`, `browser_hover` over the navbar at two different x positions, screenshot after each. The bright sheen origin should shift toward the cursor. `browser_console_messages` → zero errors.

- [ ] **Step 5: Run suite + commit**

```bash
npm test
git add app/components/chip/glass/useGlassPointer.ts app/components/chip/glass/GlassPanel.tsx app/components/chip/glass/GlassNav.tsx
git commit -m "feat(glass): cursor-reactive specular sheen on glass panels"
```

---

## Task 5: Audience-first nav + two-headed coin brand logo

**Files:**
- Create: `app/components/chip/brand/CoinLogo.tsx`
- Create: `app/components/chip/brand/coinLogo.module.css`
- Modify: `app/components/chip/glass/GlassNav.tsx`

**Interfaces:**
- Consumes: existing `public/images/chip/quarter.png`, palette vars.
- Produces: `<CoinLogo />` — a small coin that flips on hover (CSS 3D, heads on BOTH faces = "create your own luck"); used as the brand mark.

- [ ] **Step 1: Build the CoinLogo component**

```tsx
// app/components/chip/brand/CoinLogo.tsx
'use client'
import styles from './coinLogo.module.css'

/** Brand mark: a quarter that flips on hover. Both faces are heads — the coin
 *  always lands heads ("create your own luck"). Decorative; label lives beside it. */
export default function CoinLogo() {
  return (
    <span className={styles.coin} aria-hidden>
      <span className={styles.inner}>
        <span className={`${styles.face} ${styles.front}`} />
        <span className={`${styles.face} ${styles.back}`} />
      </span>
    </span>
  )
}
```

- [ ] **Step 2: Build its CSS (CSS 3D flip, both faces heads)**

```css
/* app/components/chip/brand/coinLogo.module.css */
.coin {
  display: inline-block;
  width: 26px;
  height: 26px;
  perspective: 600px;
  vertical-align: -6px;
}
.inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0.1, 0.2, 1);
  transform-style: preserve-3d;
}
.coin:hover .inner { transform: rotateY(180deg); }
.face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  backface-visibility: hidden;
  background: url(/images/chip/quarter.png) center / cover no-repeat;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
.back { transform: rotateY(180deg); } /* same image = heads on both faces */
@media (prefers-reduced-motion: reduce) {
  .coin:hover .inner { transform: none; }
}
```

- [ ] **Step 3: Rewrite the nav groups + mount CoinLogo**

In `GlassNav.tsx`: import `CoinLogo`, replace `GROUPS` and add the two top-level audience links. The final nav order must be: brand (CoinLogo + "Hedge"), `For Users`, `For Businesses`, `Products ▾`, `Developers`, `Company`, CTA.

```tsx
import CoinLogo from '../brand/CoinLogo'
// ...
const GROUPS: NavGroup[] = [
  {
    label: 'Products',
    items: [
      { label: 'Chance', href: '/chance' },
      { label: 'SideBet', href: '/sidebet' },
      { label: 'Payments', href: '/products' },
    ],
  },
]
const TOP_LINKS = [
  { label: 'For Users', href: '#users' },
  { label: 'For Businesses', href: '#businesses' },
]
const TRAIL_LINKS = [
  { label: 'Developers', href: '/developers' },
  { label: 'Company', href: '/contact' },
]
```

Then render, inside `<GlassPanel className={styles.navShell} reactive ...>`:

```tsx
        <a className={styles.brand} href="/"><CoinLogo /> Hedge</a>
        <div className={styles.navLinks}>
          {TOP_LINKS.map((l) => (
            <a key={l.label} className={styles.navTrigger} href={l.href}>{l.label}</a>
          ))}
          {GROUPS.map((g) => (
            <div key={g.label} className={styles.navItem}>
              <button type="button" className={styles.navTrigger} aria-haspopup="true">
                {g.label} <span className={styles.chev} aria-hidden>▾</span>
              </button>
              <GlassPanel className={styles.navMenu} as="div">
                {g.items.map((it) => (
                  <a key={it.label} className={styles.navMenuLink} href={it.href}>{it.label}</a>
                ))}
              </GlassPanel>
            </div>
          ))}
          {TRAIL_LINKS.map((l) => (
            <a key={l.label} className={styles.navTrigger} href={l.href}>{l.label}</a>
          ))}
        </div>
        <a className={styles.navCta} href="#claim">Get a free quarter</a>
```

- [ ] **Step 4: Make the brand a flex row (icon + word)**

Add to `glass.module.css` `.brand`:

```css
  display: inline-flex;
  align-items: center;
  gap: 8px;
```

- [ ] **Step 5: Verify live**

Playwright MCP: navigate, screenshot the nav — order must read `🪙 Hedge | For Users  For Businesses  Products ▾  Developers  Company   [Get a free quarter]`. `browser_hover` the brand coin → it flips. Hover `Products ▾` → glass dropdown with Chance/SideBet/Payments. Click `For Users` → page scrolls toward `#users` (anchor exists after Task 7; before then it's a no-op, fine). Zero console errors.

- [ ] **Step 6: Run suite + commit**

```bash
npm test
git add app/components/chip/brand/ app/components/chip/glass/GlassNav.tsx app/components/chip/glass/glass.module.css
git commit -m "feat(nav): audience-first menu + two-headed coin brand logo"
```

---

## Task 6: Hero audience buttons + crisp copy + single-coin handoff + wobble

**Files:**
- Create: `app/components/chip/hero/AudienceButtons.tsx`
- Modify: `app/components/chip/beats/SunBeat.tsx`
- Modify: `app/components/chip/chip.module.css` (button styles; copy-opacity fix; hero coin keyframe)

**Interfaces:**
- Consumes: palette vars; framer-motion `progress` already passed into `SunBeat`.
- Produces: `<AudienceButtons />` rendered under the subhead.

**Context — three QA fixes land here:** (a) hero "Fun Payments." text currently fades via `copyOpacity = useTransform(progress, [0, 0.08], [1, 0])` — that read as "fades to gray". Keep it crisp far longer and never below 1 until the hero is genuinely scrolled past. (b) Double-coin handoff: the hero coin fades at 0.175 while the tube coin appears — they briefly overlap. Tighten the hero coin to finish shrinking into the tube entry point and fade earlier/faster so only one coin reads. (c) Coin upside-down: the 80s full `rotate(-360deg)` spin passes through 180°. Replace the hero idle spin with a gentle wobble.

- [ ] **Step 1: Build AudienceButtons (smooth-scroll + magnetic hover)**

```tsx
// app/components/chip/hero/AudienceButtons.tsx
'use client'
import { useRef } from 'react'
import styles from '../chip.module.css'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

function magnetize(e: React.PointerEvent<HTMLAnchorElement>, on: boolean) {
  const el = e.currentTarget
  if (!on) { el.style.transform = ''; return }
  const r = el.getBoundingClientRect()
  const dx = (e.clientX - (r.left + r.width / 2)) * 0.25
  const dy = (e.clientY - (r.top + r.height / 2)) * 0.25
  el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
}

export default function AudienceButtons() {
  const reduced = usePrefersReducedMotion()
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => { if (!reduced) magnetize(e, true) }
  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => magnetize(e, false)
  return (
    <div className={styles.audienceBtns}>
      <a href="#users" className={`${styles.audienceBtn} ${styles.audiencePrimary}`}
         onPointerMove={onMove} onPointerLeave={onLeave}>For Users</a>
      <a href="#businesses" className={`${styles.audienceBtn} ${styles.audienceSecondary}`}
         onPointerMove={onMove} onPointerLeave={onLeave}>For Businesses</a>
    </div>
  )
}
```

- [ ] **Step 2: Add button + hero-copy + smooth-scroll styles**

Append to `chip.module.css`:

```css
/* Hero audience buttons */
.audienceBtns { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
.audienceBtn {
  padding: 14px 26px; border-radius: 999px; font-weight: 800; font-size: 16px;
  text-decoration: none; transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  will-change: transform;
}
.audiencePrimary { background: var(--orange); color: #2a1500; box-shadow: 0 8px 22px rgba(249,154,11,0.42); }
.audiencePrimary:hover { background: #ffae2e; }
.audienceSecondary { background: rgba(27,28,34,0.06); color: var(--ink); border: 1.5px solid rgba(27,28,34,0.22); }
.audienceSecondary:hover { background: rgba(27,28,34,0.10); }
```

Add a global smooth-scroll + anchor offset so `#users`/`#businesses`/`#claim` clear the fixed nav. Append to `app/globals.css`:

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
:target { scroll-margin-top: 96px; }
```

- [ ] **Step 3: Mount the buttons + keep copy crisp in SunBeat**

In `SunBeat.tsx`: import `AudienceButtons`; change the copy fade so it stays fully crisp through the hero and only fades once the user is well into the scroll (and never renders gray — opacity, not color). Replace the two relevant lines:

```tsx
  const coinOpacity = useTransform(progress, [0, 0.11, 0.13], [1, 1, 0])
  const copyOpacity = useTransform(progress, [0, 0.14, 0.18], [1, 1, 0])
```

And render the buttons after the `scrollCue` paragraph, inside the copy `motion.div`:

```tsx
        <h1 className={styles.heroTitle}>Fun Payments.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <AudienceButtons />
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
```

- [ ] **Step 4: Single-coin handoff — tighten hero coin shrink/fade**

Still in `SunBeat.tsx`, change the coin transforms so it finishes shrinking into the tube entry just before it disappears (it currently scales to 0.1 over [0,0.16] but only fades at 0.175 → overlap). Replace:

```tsx
  const x = useTransform(progress, [0, 0.12], ['33vw', '0vw'])
  const y = useTransform(progress, [0, 0.12], ['30vh', '0vh'])
  const scale = useTransform(progress, [0, 0.12], [1, 0.08])
```

(Coin reaches the centre + near-zero scale at 0.12, then `coinOpacity` from Step 3 fades it out by 0.13 — the tube's centred coin takes over with no double-coin window.)

- [ ] **Step 5: Replace the full-rotation hero spin with a gentle wobble**

In `chip.module.css`, replace the `.heroCoin` animation and `@keyframes heroSpinCcw` so the coin never passes upside-down:

```css
.heroCoin {
  width: 100%;
  height: 100%;
  background: url(/images/chip/quarter.png) center / cover no-repeat;
  border-radius: 50%;
  filter: drop-shadow(0 26px 60px rgba(0, 0, 0, 0.35));
  animation: heroWobble 7s ease-in-out infinite;
}
@keyframes heroWobble {
  0%, 100% { transform: rotate(-7deg); }
  50% { transform: rotate(7deg); }
}
@media (prefers-reduced-motion: reduce) {
  .heroCoin { animation: none; }
}
```

- [ ] **Step 6: Verify live — all four behaviors**

Playwright MCP on `http://localhost:3000/`:
1. Screenshot hero at scroll 0 → two buttons visible under "It only takes a quarter."; headline crisp ink.
2. `browser_evaluate` to scroll to ~8% of page; screenshot → headline still crisp (not gray), coin still present.
3. Watch the hero→tube transition (scroll ~10–14%) via two screenshots → only ONE coin visible at any frame (no double-coin).
4. Observe hero coin at rest → it wobbles, never flips upside-down.
5. Click `For Users` button → smooth-scrolls down (target lands after Task 7).
6. `browser_console_messages` → zero errors.

- [ ] **Step 7: Run suite + commit**

```bash
npm test
git add app/components/chip/hero/ app/components/chip/beats/SunBeat.tsx app/components/chip/chip.module.css app/globals.css
git commit -m "feat(hero): audience buttons + crisp copy, single-coin handoff, gentle wobble"
```

---

## Task 7: `#users` section — consumer offer + count-up ticker

**Files:**
- Create: `app/components/chip/sections/CountUp.tsx`
- Create: `app/components/chip/sections/CountUp.test.tsx`
- Create: `app/components/chip/sections/UsersSection.tsx`
- Create: `app/components/chip/sections/sections.module.css`
- Modify: `app/components/chip/ChipAndAChair.tsx`

**Interfaces:**
- Produces: `<CountUp to={number} prefix? suffix? decimals? />` — animates 0→`to` when scrolled into view; renders the final formatted value immediately under reduced motion or in tests. `<UsersSection />` rendered with `id="users"`.

- [ ] **Step 1: Write the failing CountUp format test**

```tsx
// app/components/chip/sections/CountUp.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountUp from './CountUp'

describe('CountUp', () => {
  it('renders the final formatted value (reduced-motion / no IO)', () => {
    render(<CountUp to={1200} prefix="$" />)
    expect(screen.getByText('$1,200')).toBeInTheDocument()
  })
  it('supports decimals and suffix', () => {
    render(<CountUp to={32.5} suffix="%" decimals={1} />)
    expect(screen.getByText('32.5%')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- CountUp`
Expected: FAIL — cannot find module `./CountUp`.

- [ ] **Step 3: Implement CountUp**

```tsx
// app/components/chip/sections/CountUp.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

interface Props { to: number; prefix?: string; suffix?: string; decimals?: number; durationMs?: number }

function format(n: number, decimals: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function CountUp({ to, prefix = '', suffix = '', decimals = 0, durationMs = 1400 }: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  // Start AT the final value so SSR / reduced-motion / jsdom show the real number;
  // only animate from 0 once we know we're in a real browser AND in view.
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return
    let raf = 0
    let started = false
    const run = (start: number) => {
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / durationMs)
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(to * eased)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true
        setValue(0)
        requestAnimationFrame((t) => run(t))
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, durationMs, reduced])

  return <span ref={ref}>{prefix}{format(value, decimals)}{suffix}</span>
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npm test -- CountUp`
Expected: PASS (both cases — jsdom has no IntersectionObserver, so it stays at the final value).

- [ ] **Step 5: Build the UsersSection**

```tsx
// app/components/chip/sections/UsersSection.tsx
'use client'
import GlassPanel from '../glass/GlassPanel'
import CountUp from './CountUp'
import styles from './sections.module.css'

export default function UsersSection() {
  return (
    <section id="users" className={styles.section} aria-labelledby="users-h">
      <div className={styles.inner}>
        <p className={styles.kicker}>For Users</p>
        <h2 id="users-h" className={styles.h2}>A daily little something you won&apos;t miss losing.</h2>
        <p className={styles.lead}>
          Small stakes, real upside — it never hurts to lose. Put in a quarter, ride the markets,
          and let the wins stack up in your wallet.
        </p>
        <div className={styles.cards}>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>SideBet</h3>
            <p className={styles.cardText}>Tiny side bets on the things you already follow. Win big from a little.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Chance — the wallet</h3>
            <p className={styles.cardText}>Your quarter, your winnings, one balance. Spend it, stake it, grow it.</p>
          </GlassPanel>
        </div>
        <div className={styles.stat}>
          <span className={styles.statBig}><CountUp to={1000} prefix="$" />+</span>
          <span className={styles.statLabel}>a single quarter could become</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Add section styles**

```css
/* app/components/chip/sections/sections.module.css */
.section { position: relative; z-index: 2; padding: 120px 24px; display: grid; place-items: center; }
.inner { max-width: 1040px; width: 100%; text-align: center; }
.kicker { text-transform: uppercase; letter-spacing: 0.18em; font-size: 13px; font-weight: 800; color: var(--red); }
.h2 { font-size: clamp(30px, 5vw, 56px); font-weight: 800; line-height: 1.04; margin-top: 10px; letter-spacing: -0.01em; }
.lead { font-size: clamp(16px, 2.2vw, 21px); opacity: 0.82; max-width: 640px; margin: 16px auto 0; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 44px; }
.card { border-radius: 22px; text-align: left; }
.cardBody { padding: 26px; }
.cardTitle { font-size: 22px; font-weight: 800; }
.cardText { margin-top: 10px; opacity: 0.8; font-size: 15px; line-height: 1.5; }
.stat { margin-top: 48px; display: grid; gap: 4px; }
.statBig { font-size: clamp(44px, 9vw, 96px); font-weight: 900; color: var(--orange); line-height: 1; }
.statLabel { font-size: 14px; letter-spacing: 0.04em; opacity: 0.7; }
```

- [ ] **Step 7: Render it in ChipAndAChair (between TubeJourney and ClaimBeat)**

In `ChipAndAChair.tsx`, import `UsersSection` and add it after `<TubeJourney />`:

```tsx
        <TubeJourney />
        <UsersSection />
        <ClaimBeat />
```

- [ ] **Step 8: Verify live**

Playwright MCP: navigate, click `For Users` in nav (or hero) → smooth-scrolls to the `#users` section, fully visible below the nav (scroll-margin clears it). The `$1,000+` ticker counts up when it enters view. Two glass cards are see-through. Zero console errors.

- [ ] **Step 9: Run suite + commit**

```bash
npm test
git add app/components/chip/sections/ app/components/chip/ChipAndAChair.tsx
git commit -m "feat(home): For Users section + count-up ticker"
```

---

## Task 8: `#businesses` section — merchant / acquisition-grade content

**Files:**
- Create: `app/components/chip/sections/BusinessesSection.tsx`
- Modify: `app/components/chip/sections/sections.module.css` (add code-snippet + metric-grid styles)
- Modify: `app/components/chip/ChipAndAChair.tsx`

**Interfaces:**
- Consumes: `GlassPanel`, `CountUp` (Task 7).
- Produces: `<BusinessesSection />` rendered with `id="businesses"`.

**Context:** This is the "Stripe-CEO buyer" surface. It must read as payments infrastructure: dev-first embed snippet, the payments-layer pitch (Debit/ACH white-labeled via Coinflow, powered by Hedge), illustrative metrics (conversion lift, AOV lift, retention), trust/compliance, and the money model. Metrics are illustrative — label them so.

- [ ] **Step 1: Build the BusinessesSection**

```tsx
// app/components/chip/sections/BusinessesSection.tsx
'use client'
import GlassPanel from '../glass/GlassPanel'
import CountUp from './CountUp'
import styles from './sections.module.css'

const SNIPPET = `<script src="https://hedgepayments.com/embed/chance.js"></script>

<chance-checkout amount="50" mode="flip-to-free"></chance-checkout>`

export default function BusinessesSection() {
  return (
    <section id="businesses" className={styles.section} aria-labelledby="biz-h">
      <div className={styles.inner}>
        <p className={styles.kicker} style={{ color: 'var(--cyan)' }}>For Businesses</p>
        <h2 id="biz-h" className={styles.h2}>A payments layer that lifts conversion and AOV.</h2>
        <p className={styles.lead}>
          SideBet, Chance, and full payment rails — Debit, ACH and more — white-labeled via Coinflow,
          powered by Hedge. One drop-in turns checkout into a reason to come back.
        </p>

        {/* Dev-first: add Chance in ~5 lines */}
        <div className={styles.devRow}>
          <div className={styles.devCopy}>
            <h3 className={styles.cardTitle}>Add Chance in ~5 lines</h3>
            <p className={styles.cardText}>
              Drop one script tag and a custom element. No redirects, no rebuild.
            </p>
            <a className={styles.devLink} href="/docs">Read the docs →</a>
          </div>
          <GlassPanel className={styles.code} reactive contentClassName={styles.codeBody}>
            <pre className={styles.pre}><code>{SNIPPET}</code></pre>
          </GlassPanel>
        </div>

        {/* Illustrative metrics */}
        <div className={styles.metrics}>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={18} suffix="%" /></span><span className={styles.statLabel}>conversion lift</span></div>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={23} suffix="%" /></span><span className={styles.statLabel}>higher AOV</span></div>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={2.4} suffix="x" decimals={1} /></span><span className={styles.statLabel}>repeat-purchase rate</span></div>
        </div>
        <p className={styles.fineprint}>Illustrative figures for demonstration.</p>

        {/* Trust + money model */}
        <div className={styles.cards}>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Built for trust</h3>
            <p className={styles.cardText}>KYC, custody, and responsible-play controls — Hedge routes to real markets, never the house.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>The win-it-back loop</h3>
            <p className={styles.cardText}>A free-order chance on every cart is a reason to return — a defensible retention engine.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Aligned economics</h3>
            <p className={styles.cardText}>Interchange + a transparent take rate + the widget as SaaS. We grow when you grow.</p>
          </GlassPanel>
        </div>

        <p className={styles.poweredBy}>Powered by Hedge · white-labeled via Coinflow</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add the section's extra styles**

Append to `sections.module.css`:

```css
.devRow { display: grid; grid-template-columns: 1fr 1.2fr; gap: 28px; align-items: center; margin-top: 48px; text-align: left; }
.devCopy { align-self: center; }
.devLink { display: inline-block; margin-top: 12px; color: var(--cyan); font-weight: 700; text-decoration: none; }
.devLink:hover { text-decoration: underline; }
.code { border-radius: 18px; }
.codeBody { padding: 20px 22px; }
.pre { margin: 0; overflow-x: auto; }
.pre code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.6; color: var(--ink); white-space: pre; }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
.metric { display: grid; gap: 4px; }
.metricBig { font-size: clamp(36px, 6vw, 64px); font-weight: 900; color: var(--cyan); line-height: 1; }
.fineprint { margin-top: 10px; font-size: 12px; opacity: 0.55; }
.poweredBy { margin-top: 44px; font-size: 14px; font-weight: 700; letter-spacing: 0.02em; opacity: 0.7; }
@media (max-width: 720px) {
  .devRow { grid-template-columns: 1fr; }
  .metrics { grid-template-columns: 1fr; gap: 28px; }
}
```

- [ ] **Step 3: Render it in ChipAndAChair (after UsersSection)**

```tsx
        <UsersSection />
        <BusinessesSection />
        <ClaimBeat />
```

- [ ] **Step 4: Verify live**

Playwright MCP: navigate, click `For Businesses` in the nav → smooth-scrolls to `#businesses`. Confirm: the code snippet renders in a glass panel; the three metric tickers count up on entry; "Illustrative figures for demonstration." is present; "Powered by Hedge · white-labeled via Coinflow" shows. Mobile width (`browser_resize 390x844`) → devRow + metrics stack to one column. Zero console errors.

- [ ] **Step 5: Run suite + commit**

```bash
npm test
git add app/components/chip/sections/BusinessesSection.tsx app/components/chip/sections/sections.module.css app/components/chip/ChipAndAChair.tsx
git commit -m "feat(home): For Businesses acquisition section (embed snippet, metrics, trust, money model)"
```

---

## Task 9: Final full-flow verification + production build gate

**Files:** none (verification only).

- [ ] **Step 1: Full Playwright walkthrough**

On `http://localhost:3000/`: scroll the whole page top→bottom in ~10% increments, screenshotting each. Confirm: loader → hero (crisp copy + 2 buttons + wobbling coin) → single-coin tube handoff → tube journey → `#users` → `#businesses` → claim widget. Nav glass is see-through and cursor-reactive throughout. `browser_console_messages` → zero errors across the whole scroll.

- [ ] **Step 2: Reduced-motion pass**

`browser_navigate` with reduced motion emulated (Playwright `browser_run_code_unsafe` to set `prefers-reduced-motion`, or verify the CSS no-ops). Confirm: no count-up animation (final numbers shown), no coin wobble, no magnetic buttons, instant anchor jumps. Zero errors.

- [ ] **Step 3: Production build gate**

Kill the dev server first (frees port 3000 and avoids the chunk-404 gotcha):
```bash
pkill -f "next dev" || true
rm -rf .next
npm run build
```
Expected: build succeeds (page count ≥ prior 102). Then restart dev: `npm run dev` (background) for any follow-up.

- [ ] **Step 4: Final test run**

```bash
npm test
```
Expected: all tests green (16 original + tokens(1) + CountUp(2) ≈ 19).

- [ ] **Step 5: Commit any verification fixups (only if needed) and push**

```bash
git push origin chip-and-a-chair-homepage
```

---

## Task 10: Stripe-clean login pages (user + business) in the Old-Vegas glass language

**Files:**
- Create: `app/components/auth/AuthShell.tsx`
- Create: `app/components/auth/auth.module.css`
- Modify: `app/user-login/page.tsx`
- Modify: `app/business-login/page.tsx`

**Interfaces:**
- Consumes: palette/glass tokens (Task 2), `GlassPanel` (Tasks 3–4), `CoinLogo` (Task 5).
- Produces: `<AuthShell eyebrow title subtitle footer>{formChildren}</AuthShell>` — a centered glass auth card on the cream canvas with corner color-blooms, the CoinLogo brand mark at top, and shared input/button styling exposed as exported class names from `auth.module.css` (`field`, `label`, `input`, `inputErr`, `fieldErr`, `submit`, `row`, `remember`, `link`, `error`).

**Context:** The user wants both login pages to feel like the Stripe login — clean, simple, beautiful — but in the Hedge brand (Old-Vegas cream + liquid glass), not a copy. Replace `business-login`'s arcade-neon chrome (grid/scanlines/"Insert Coin") and `user-login`'s Bookstore navbar with one shared, restrained glass card. **CRITICAL: keep `business-login`'s Supabase auth behavior exactly** (`createClientComponentClient`, `signInWithPassword`, validation, error states, redirect to `/dashboard`) — this is a restyle, not a logic change. `user-login` stays a static visual form (it has no auth wired today); just restyle it to match.

- [ ] **Step 1: Build AuthShell**

```tsx
// app/components/auth/AuthShell.tsx
'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import CoinLogo from '../chip/brand/CoinLogo'
import styles from './auth.module.css'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

/** Centered glass auth card on the Old-Vegas cream canvas — clean, Stripe-simple,
 *  brand-warm. Shared by the user + business login pages. */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <main className={styles.root}>
      <div className={styles.blooms} aria-hidden />
      <Link href="/" className={styles.brand}><CoinLogo /> Hedge</Link>
      <div className={styles.cardWrap}>
        <div className={styles.card}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>
        {footer && <div className={styles.belowCard}>{footer}</div>}
        <Link href="/" className={styles.back}>← Back to home</Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Build auth.module.css (Stripe-clean, brand-warm)**

```css
/* app/components/auth/auth.module.css */
.root {
  position: relative; min-height: 100vh; background: var(--cream, #fbf3db); color: var(--ink, #1b1c22);
  display: grid; place-items: center; padding: 88px 20px 48px; overflow: hidden;
}
.blooms {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(42% 38% at 84% 14%, rgba(5, 171, 208, 0.16) 0%, rgba(5, 171, 208, 0) 60%),
    radial-gradient(46% 40% at 14% 86%, rgba(249, 154, 11, 0.18) 0%, rgba(249, 154, 11, 0) 62%);
}
.brand {
  position: fixed; top: 26px; left: 28px; z-index: 3; display: inline-flex; align-items: center; gap: 8px;
  font-weight: 800; font-size: 18px; color: var(--ink); text-decoration: none;
}
.cardWrap { position: relative; z-index: 1; width: 100%; max-width: 420px; }
.card {
  position: relative; border-radius: 22px; padding: 36px 32px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow: inset 0 1.5px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.5), 0 30px 60px rgba(20,20,30,0.14);
}
.eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cyan, #05abd0); }
.title { font-size: 28px; font-weight: 800; letter-spacing: -0.01em; margin-top: 6px; }
.subtitle { font-size: 15px; opacity: 0.7; margin-top: 8px; }
.form { display: grid; gap: 16px; margin-top: 26px; }
.field { display: grid; gap: 7px; }
.label { font-size: 13px; font-weight: 600; opacity: 0.85; }
.input {
  width: 100%; padding: 12px 14px; border-radius: 10px; font-size: 15px; color: var(--ink);
  background: rgba(255,255,255,0.85); border: 1px solid rgba(27,28,34,0.16); transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input::placeholder { color: rgba(27,28,34,0.4); }
.input:focus { outline: none; border-color: var(--cyan, #05abd0); box-shadow: 0 0 0 3px rgba(5,171,208,0.18); }
.inputErr { border-color: var(--red, #fa1007); }
.fieldErr { color: var(--red, #fa1007); font-size: 12px; }
.row { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
.remember { display: inline-flex; align-items: center; gap: 8px; opacity: 0.85; }
.link { color: var(--cyan, #05abd0); text-decoration: none; font-weight: 600; }
.link:hover { text-decoration: underline; }
.submit {
  margin-top: 4px; width: 100%; padding: 13px 16px; border: 0; border-radius: 10px; cursor: pointer;
  font-weight: 800; font-size: 15px; color: #2a1500; background: var(--orange, #f99a0b);
  box-shadow: 0 8px 22px rgba(249,154,11,0.4); transition: background 0.15s ease, transform 0.12s ease;
}
.submit:hover { background: #ffae2e; }
.submit:active { transform: scale(0.99); }
.submit:disabled { opacity: 0.6; cursor: default; }
.error { margin-top: 18px; padding: 11px 14px; border-radius: 10px; font-size: 14px; color: var(--red, #fa1007); background: rgba(250,16,7,0.08); border: 1px solid rgba(250,16,7,0.2); }
.belowCard { text-align: center; margin-top: 18px; font-size: 14px; opacity: 0.85; }
.back { display: block; text-align: center; margin-top: 14px; font-size: 13px; opacity: 0.6; color: var(--ink); text-decoration: none; }
.back:hover { opacity: 0.9; }
```

- [ ] **Step 3: Rewrite user-login to use AuthShell (static form, restyled)**

```tsx
// app/user-login/page.tsx
import Link from 'next/link'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/auth.module.css'

export default function UserLogin() {
  return (
    <AuthShell
      eyebrow="● For Users"
      title="Welcome back"
      subtitle="Log in to your Chance wallet."
      footer={<>Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link></>}
    >
      <form className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email address</label>
          <input className={styles.input} type="email" id="email" placeholder="you@email.com" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} type="password" id="password" placeholder="••••••••" required />
        </div>
        <div className={styles.row}>
          <label className={styles.remember}><input type="checkbox" /> Remember me</label>
          <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
        </div>
        <button className={styles.submit} type="submit">Log in →</button>
      </form>
    </AuthShell>
  )
}
```

- [ ] **Step 4: Rewrite business-login's JSX to use AuthShell — KEEP all auth logic**

Keep every hook, handler, and Supabase call in `app/business-login/page.tsx` (lines for `useState`, `handleChange`, `validateForm`, `handleSubmit`, `createClientComponentClient`, redirect to `/dashboard`). ONLY replace the returned JSX (the `return (...)` block) and swap the style import. New import line: `import styles from '../components/auth/auth.module.css'` (remove the old `./page.module.css` import and the framer-motion import if it's now unused). New return:

```tsx
  return (
    <AuthShell
      eyebrow="● Merchant login"
      title="Welcome back"
      subtitle="Log in to your Hedge Payments dashboard."
      footer={<>New here? <Link href="/get-started" className={styles.link}>Start free</Link></>}
    >
      {loginError && <div className={styles.error}>{loginError}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputErr : ''}`} placeholder="you@company.com" />
          {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.inputErr : ''}`} placeholder="••••••••" />
          {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
        </div>
        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} /> Remember me
          </label>
          <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
        </div>
        <button type="submit" disabled={isLoading} className={styles.submit}>
          {isLoading ? 'Logging in…' : 'Log in →'}
        </button>
      </form>
    </AuthShell>
  )
```

Add `import AuthShell from '../components/auth/AuthShell'` (and keep `import Link from 'next/link'`).

- [ ] **Step 5: Verify live (controller does Playwright)**

`/user-login` and `/business-login` both render the centered glass card on cream with the CoinLogo brand, clean inputs, orange CTA, cyan focus ring; no arcade grid/scanlines; no Bookstore navbar. Mobile width (390px) the card is comfortably padded. Zero console errors. (Business auth still posts to Supabase — with placeholder env it will surface an auth error, which is expected and proves the path is intact.)

- [ ] **Step 6: Build-safe check + commit**

```bash
npx tsc --noEmit 2>&1 | grep -E "user-login|business-login|auth/AuthShell" || echo "no type errors in auth pages"
git add app/components/auth/ app/user-login/page.tsx app/business-login/page.tsx
git commit -m "feat(auth): Stripe-clean login pages in the Old-Vegas glass language"
```

---

## Self-Review

**Spec coverage (this plan's scope):**
- Hero two audience buttons + scroll-to-sections → Tasks 6, 7, 8. ✓
- Product wording (Users: SideBet+Chance wallet; Businesses: +rails via Coinflow, powered by Hedge) → Tasks 7, 8. ✓
- Phase 1 true Liquid Glass (transparent, blur+saturate, refraction, specular, inner glow) → Task 3. ✓
- Cursor-reactive glass → Task 4. ✓ (Hero coin parallax folded into existing scroll-driven coin; full parallax tuning deferred to Plan B.)
- Phase 2 shared design system seed (palette tokens, CSS vars, GlassNav/GlassPanel/GlassDefs already modular) → Task 2 (+ existing glass module). ✓ (Full extraction to a top-level shared module + type/brand scale continues in Plan D.)
- Audience-first nav → Task 5. ✓
- Two-headed coin flip-on-hover logo → Task 5. ✓
- Magnetic glass CTAs → Task 6. ✓
- Count-up tickers → Tasks 7, 8. ✓
- Acquisition-grade content (dev-first embed, payments-layer, metrics, defensible loop, trust/compliance, money model, powered-by) → Task 8. ✓
- QA fixes: double-coin (Task 6.4), glass too flat (Task 3), hero text gray-on-scroll (Task 6.3), coin upside-down→wobble (Task 6.5). ✓
- Security gate (supabase-client fail-closed) → Task 1. ✓

**Deferred to follow-up plans (explicitly OUT of this plan's scope):**
- **Plan B — Signature motion suite:** slot-machine 3-reel quarter (lever→spin→land heads) powering "claim your free quarter" + micro-loaders + a "spin to win" on the For Users path; coin-clink audio + haptics (gesture-gated, muted default); Old-Vegas marquee chase-lights on one section; hero-coin pointer parallax tuning.
- **Plan C — Real (non-AI) coin assets:** user-supplied or public-domain US Mint/Wikimedia penny/nickel/dime/quarter photos → `remove_background` + alpha-trim to transparent PNG/webp; two-headed Washington "Create your own luck" wordmark; a CODE-built 3D spinning coin (heads on both faces; react-three-fiber/GLB or CSS-3D, not AI video).
- **Plan D — Phase 3 site-wide rollout:** apply the design system page-by-page to `/store`, `/chance`, `/sidebet`, `/developers`, `/docs`, `/products`, `/contact`, `/signup`, `/dashboard`, `/blog`, etc. — keep each page's content, restyle to the system; promote `#users`/`#businesses` content into standalone `/users` `/businesses` routes if desired.

**Placeholder scan:** No TBD/TODO/"add error handling"/"similar to Task N" left; all code blocks are concrete.

**Type consistency:** `CountUp` props (`to`, `prefix`, `suffix`, `decimals`, `durationMs`) consistent across Tasks 7–8. `GlassPanel` `reactive?: boolean` added in Task 4 and used in Tasks 4,5,7,8. `useGlassPointer(ref)` signature consistent. `palette`/`glass`/`motion` token shapes consistent with the test in Task 2.
