# "A Chip and a Chair" Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hedge Payments homepage with a scroll-driven cinematic ("A Chip and a Chair") where a quarter travels from a setting-sun coin through a deposit slot, a conveyor of opportunities, to a payout, ending in a hands-on free-quarter trial that captures email.

**Architecture:** A single client orchestrator `<ChipAndAChair/>` owns one tall scroll container and a `useScroll` tracker; it renders seven full-height **sticky** beat sections, passing each its local `0→1` progress (derived by `useBeatProgress`). Beats are presentational and driven only by their `progress` prop. The animated coin is a CSS/SVG `<Quarter/>` (no video in v1); a Higgsfield still backdrop sits behind Beat 0. The final beat lazy-mounts the existing `<chance-checkout>` widget and, on `chance:result`, shows an email-capture card that POSTs to the existing `/api/subscribe` route. A `prefers-reduced-motion` path renders the same content as a static stacked page.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, framer-motion 12 (already a dep), Tailwind + CSS Modules, Vitest + @testing-library/react + jsdom (new at app root), the existing `public/embed/chance.js` web component.

## Global Constraints

- **No new runtime deps.** framer-motion 12.23.12 is already installed; use it. New deps are **dev-only** (Vitest test stack). (Spec "Build approach A — no new deps".)
- **Demo vs real-money stay cleanly separated.** v1 ships **demo play + email capture + a "reserved" claim state only**. No wallet credit, no settlement, no KYC. (Spec "Non-goals", [[project_chance_roadmap]].)
- **Animate only `transform` and `opacity`** (GPU-composited). No animating layout/width/top. (Spec "Performance".)
- **The page must render meaningful copy server-side** (headline, sub, each beat's text) so it is indexable; only motion is client-side. (Spec "SEO/OG".)
- **Reuse, don't fork:** the widget is loaded via the existing `<script src="/embed/chance.js">` injection pattern (copy from `app/chance/page.tsx`); the coin reuses the `/chance` spinning-coin styling; email uses `POST /api/subscribe`.
- **`ArcadeLanding` is retired, not deleted** — it moves to `/classic`.
- **Reduced-motion + a persistent "Skip to free quarter →" link** are required, not optional.
- **No user-facing infra vocab** ("scrape", etc.) — not relevant here but keep copy consumer-friendly. ([[feedback_no_scrape_in_user_copy]].)
- Hero backdrop asset already in repo: `public/images/chip/beat0-sun-quarter.webp` (1920×1080-ish, 94KB) with PNG source alongside.

---

## File Structure

```
app/page.tsx                          # MODIFY: render <ChipAndAChair/> (was <ArcadeLanding/>)
app/classic/page.tsx                  # CREATE: render <ArcadeLanding/> (retired fallback)
app/components/chip/
  ChipAndAChair.tsx                   # CREATE: orchestrator — scroll container, beats, reduced-motion switch, skip link
  Quarter.tsx                         # CREATE: CSS/SVG coin; scale/rotate/roll/morph from numeric props
  useBeatProgress.ts                  # CREATE: beatProgress() pure fn + useBeatProgress() hook
  beats/SunBeat.tsx                   # CREATE: beats 0–1 (sun → full screen)
  beats/DepositBeat.tsx               # CREATE: beat 2 (DEPOSIT QUARTER slot)
  beats/MorphBeat.tsx                 # CREATE: beat 3 (coin → venue logo)
  beats/ConveyorBeat.tsx              # CREATE: beat 4 (belt of Market + Table stations, running tally)
  beats/WinningsBeat.tsx              # CREATE: beat 5 (payout tally)
  beats/ClaimBeat.tsx                 # CREATE: beat 6 (widget mount + email capture)
  chip.module.css                     # CREATE: tokens + beat styles
  __tests__/useBeatProgress.test.ts   # CREATE
  __tests__/Quarter.test.tsx          # CREATE
  __tests__/ClaimBeat.test.tsx        # CREATE
  __tests__/ChipAndAChair.test.tsx    # CREATE
vitest.config.ts                      # CREATE (app root)
vitest.setup.ts                       # CREATE (app root) — jest-dom + matchMedia stub
package.json                          # MODIFY: add "test" script + dev deps
app/opengraph-image.tsx               # (existing) verify homepage OG renders; Task 8
```

---

## Task 1: Test harness + retire ArcadeLanding to `/classic` + stub homepage

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `app/classic/page.tsx`, `app/components/chip/ChipAndAChair.tsx` (stub)
- Modify: `package.json` (add `test` script + dev deps), `app/page.tsx`

**Interfaces:**
- Produces: `npm test` runs Vitest against `app/**/*.test.ts(x)`; `<ChipAndAChair/>` default-exported client component (stub for now); route `/classic` renders `ArcadeLanding`; route `/` renders `<ChipAndAChair/>`.

- [ ] **Step 1: Install dev deps**

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website
npm i -D vitest@^1.6.0 jsdom@^24.0.0 @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.4.0 @testing-library/user-event@^14.6.1 @vitejs/plugin-react@^4.3.0
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['app/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`** (jest-dom matchers + a `matchMedia` stub so reduced-motion code doesn't throw in jsdom)

```ts
import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia; default to "no reduced-motion preference".
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}
```

- [ ] **Step 4: Add the test script** to `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a failing route test** — `app/components/chip/__tests__/ChipAndAChair.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import ChipAndAChair from '../ChipAndAChair'

describe('ChipAndAChair (stub)', () => {
  it('renders the hero headline server-side text', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/A Chip and a Chair/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run it — verify it fails**

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: FAIL — cannot resolve `../ChipAndAChair`.

- [ ] **Step 7: Create the stub `app/components/chip/ChipAndAChair.tsx`**

```tsx
'use client'

export default function ChipAndAChair() {
  return (
    <main>
      <h1>A Chip and a Chair.</h1>
      <p>It only takes a quarter.</p>
    </main>
  )
}
```

- [ ] **Step 8: Run the test — verify it passes**

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: PASS.

- [ ] **Step 9: Retire ArcadeLanding to `/classic`** — create `app/classic/page.tsx`

```tsx
import ArcadeLanding from '../components/ArcadeLanding'

// The previous arcade homepage, retired here as a fallback (not deleted).
export default function ClassicHome() {
  return <ArcadeLanding />
}
```

- [ ] **Step 10: Point `/` at the new orchestrator** — replace `app/page.tsx` contents

```tsx
import ChipAndAChair from './components/chip/ChipAndAChair'

// Previous arcade landing retired to /classic.
export default function Home() {
  return <ChipAndAChair />
}
```

- [ ] **Step 11: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds; `/` and `/classic` both appear in the route list.

- [ ] **Step 12: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json app/page.tsx app/classic/page.tsx app/components/chip/ChipAndAChair.tsx app/components/chip/__tests__/ChipAndAChair.test.tsx
git commit -m "feat(home): test harness + retire ArcadeLanding to /classic + stub ChipAndAChair"
```

---

## Task 2: `useBeatProgress` — global scroll → per-beat local progress

**Files:**
- Create: `app/components/chip/useBeatProgress.ts`, `app/components/chip/__tests__/useBeatProgress.test.ts`

**Interfaces:**
- Produces:
  - `beatProgress(global: number, index: number, count: number): number` — pure, clamped to `[0,1]`. Beat `index` occupies the `[index/count, (index+1)/count]` slice of the global `0→1` scroll.
  - `useBeatProgress(scrollYProgress: MotionValue<number>, index: number, count: number): MotionValue<number>` — framer hook mapping the same slice to `0→1` (clamped).

- [ ] **Step 1: Write the failing test** — `__tests__/useBeatProgress.test.ts`

```ts
import { beatProgress } from '../useBeatProgress'

describe('beatProgress', () => {
  const COUNT = 7
  it('is 0 before the beat starts', () => {
    expect(beatProgress(0, 3, COUNT)).toBe(0)
  })
  it('is 1 after the beat ends', () => {
    expect(beatProgress(1, 0, COUNT)).toBe(1)
  })
  it('is 0.5 at the midpoint of a beat slice', () => {
    // beat 0 slice is [0, 1/7]; midpoint = 1/14
    expect(beatProgress(1 / 14, 0, COUNT)).toBeCloseTo(0.5, 5)
  })
  it('clamps below 0 and above 1', () => {
    expect(beatProgress(-0.2, 2, COUNT)).toBe(0)
    expect(beatProgress(2, 2, COUNT)).toBe(1)
  })
  it('maps the start of beat index to 0', () => {
    expect(beatProgress(2 / COUNT, 2, COUNT)).toBeCloseTo(0, 5)
  })
})
```

- [ ] **Step 2: Run it — verify it fails**

Run: `npx vitest run app/components/chip/__tests__/useBeatProgress.test.ts`
Expected: FAIL — `beatProgress` not exported.

- [ ] **Step 3: Implement `useBeatProgress.ts`**

```ts
import { useTransform, type MotionValue } from 'framer-motion'

/** Pure: map global scroll fraction (0..1) to beat `index`'s local progress (0..1, clamped). */
export function beatProgress(global: number, index: number, count: number): number {
  const slice = 1 / count
  const local = (global - index * slice) / slice
  if (local < 0) return 0
  if (local > 1) return 1
  return local
}

/** Hook: same mapping as a MotionValue, for scroll-linked transforms. */
export function useBeatProgress(
  scrollYProgress: MotionValue<number>,
  index: number,
  count: number,
): MotionValue<number> {
  const slice = 1 / count
  return useTransform(scrollYProgress, [index * slice, (index + 1) * slice], [0, 1], {
    clamp: true,
  })
}
```

- [ ] **Step 4: Run the test — verify it passes**

Run: `npx vitest run app/components/chip/__tests__/useBeatProgress.test.ts`
Expected: PASS (5 assertions).

- [ ] **Step 5: Commit**

```bash
git add app/components/chip/useBeatProgress.ts app/components/chip/__tests__/useBeatProgress.test.ts
git commit -m "feat(home): useBeatProgress — global scroll to per-beat local progress"
```

---

## Task 3: `Quarter` — the CSS/SVG coin (scale / rotate / roll / morph)

**Files:**
- Create: `app/components/chip/Quarter.tsx`, `app/components/chip/chip.module.css`, `app/components/chip/__tests__/Quarter.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Quarter scale rotate x y morph variant />` where each transform prop is `number | MotionValue<number>` and:
  - `morph` (0→1): 0 = silver coin face shown, 1 = venue logo shown. The component sets `data-morph-state="coin" | "logo"` at the 0.5 threshold for deterministic testing.
  - `variant?: 'sun' | 'silver'` (default `'silver'`) — `'sun'` tints the coin warm for Beat 0.
  - Root element has `data-testid="quarter"`.

- [ ] **Step 1: Write the failing test** — `__tests__/Quarter.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import Quarter from '../Quarter'

describe('Quarter', () => {
  it('shows the coin face when morph is 0', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={0} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'coin')
  })
  it('shows the venue logo when morph is 1', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={1} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'logo')
  })
  it('renders a coin label for accessibility', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={0} />)
    expect(screen.getByLabelText(/quarter/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it — verify it fails**

Run: `npx vitest run app/components/chip/__tests__/Quarter.test.tsx`
Expected: FAIL — cannot resolve `../Quarter`.

- [ ] **Step 3: Implement `Quarter.tsx`**

```tsx
'use client'

import { motion, type MotionValue } from 'framer-motion'
import styles from './chip.module.css'

type Num = number | MotionValue<number>

export interface QuarterProps {
  scale: Num
  rotate: Num
  x: Num
  y: Num
  /** 0 = silver coin, 1 = venue logo. */
  morph: Num
  variant?: 'sun' | 'silver'
}

// The morph crossfade is deterministic for tests: at >= 0.5 we are "logo".
function morphState(morph: Num): 'coin' | 'logo' {
  const v = typeof morph === 'number' ? morph : morph.get()
  return v >= 0.5 ? 'logo' : 'coin'
}

export default function Quarter({ scale, rotate, x, y, morph, variant = 'silver' }: QuarterProps) {
  return (
    <motion.div
      data-testid="quarter"
      data-morph-state={morphState(morph)}
      className={`${styles.quarter} ${variant === 'sun' ? styles.quarterSun : ''}`}
      style={{ scale, rotate, x, y }}
      aria-label="A US quarter"
      role="img"
    >
      {/* Coin face — reuses the /chance silver-coin look; ridged edge via CSS. */}
      <motion.div className={styles.coinFace} style={{ opacity: typeof morph === 'number' ? 1 - morph : undefined }}>
        <span className={styles.coinDenom}>25¢</span>
      </motion.div>
      {/* Venue logo crossfade (Polymarket → Kalshi handled by parent swapping children later). */}
      <motion.div className={styles.coinLogo} style={{ opacity: morph }} aria-hidden>
        <span className={styles.coinLogoText}>position</span>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Add coin styles to `chip.module.css`** (transform/opacity only)

```css
.quarter {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  will-change: transform;
}
.coinFace,
.coinLogo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  /* ridged silver edge */
  background:
    radial-gradient(circle at 35% 30%, #fafafa 0%, #cfcfcf 45%, #9a9a9a 75%, #6f6f6f 100%);
  box-shadow:
    inset 0 0 0 10px #b9b9b9,
    inset 0 0 24px rgba(0, 0, 0, 0.35),
    0 18px 50px rgba(0, 0, 0, 0.55);
}
.quarterSun .coinFace {
  background:
    radial-gradient(circle at 50% 50%, #ffe7b0 0%, #f7b733 45%, #d97706 78%, #7c3a06 100%);
  box-shadow: 0 0 120px 30px rgba(247, 183, 51, 0.55), inset 0 0 0 8px #f7b733;
}
.coinDenom { font-weight: 800; font-size: 64px; color: #4a4a4a; }
.coinLogo { background: #0b0b0f; }
.coinLogoText { color: #e7e7ea; font-weight: 700; letter-spacing: 0.04em; }
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `npx vitest run app/components/chip/__tests__/Quarter.test.tsx`
Expected: PASS (3 assertions).

- [ ] **Step 6: Commit**

```bash
git add app/components/chip/Quarter.tsx app/components/chip/chip.module.css app/components/chip/__tests__/Quarter.test.tsx
git commit -m "feat(home): Quarter coin component with morph crossfade"
```

---

## Task 4: `ChipAndAChair` orchestrator — sticky scroll container, reduced-motion switch, skip link

**Files:**
- Modify: `app/components/chip/ChipAndAChair.tsx` (replace the stub), `app/components/chip/chip.module.css`, `app/components/chip/__tests__/ChipAndAChair.test.tsx`
- Create: `app/components/chip/usePrefersReducedMotion.ts`

**Interfaces:**
- Consumes: `useScroll` (framer), `useBeatProgress`, `usePrefersReducedMotion()`.
- Produces: `<ChipAndAChair/>` renders a tall scroll container (`BEAT_COUNT = 7` sticky sections), a persistent **"Skip to free quarter →"** anchor to `#claim`, and switches to a static stacked layout when reduced motion is preferred. For now the beat sections render placeholder text; Tasks 5–7 fill them in.

- [ ] **Step 1: Create `usePrefersReducedMotion.ts`**

```ts
'use client'
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
```

- [ ] **Step 2: Update the test** — `__tests__/ChipAndAChair.test.tsx` (replace contents)

```tsx
import { render, screen } from '@testing-library/react'
import ChipAndAChair from '../ChipAndAChair'

describe('ChipAndAChair', () => {
  it('renders the hero headline and sub server-side', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/A Chip and a Chair/i)).toBeInTheDocument()
    expect(screen.getByText(/It only takes a quarter/i)).toBeInTheDocument()
  })
  it('renders a skip link to the claim beat', () => {
    render(<ChipAndAChair />)
    const skip = screen.getByRole('link', { name: /skip to free quarter/i })
    expect(skip).toHaveAttribute('href', '#claim')
  })
  it('renders all beat copy server-side for SEO', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/DEPOSIT QUARTER/i)).toBeInTheDocument()
    expect(screen.getByText(/how far a quarter can go/i)).toBeInTheDocument()
    expect(screen.getByText(/Take your free quarter/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run it — verify it fails**

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: FAIL — skip link / beat copy not present in the stub.

- [ ] **Step 4: Implement the orchestrator** — replace `ChipAndAChair.tsx`

```tsx
'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import styles from './chip.module.css'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import SunBeat from './beats/SunBeat'
import DepositBeat from './beats/DepositBeat'
import MorphBeat from './beats/MorphBeat'
import ConveyorBeat from './beats/ConveyorBeat'
import WinningsBeat from './beats/WinningsBeat'
import ClaimBeat from './beats/ClaimBeat'

export const BEAT_COUNT = 7

export default function ChipAndAChair() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref })

  return (
    <main className={reduced ? styles.staticRoot : styles.cinemaRoot}>
      <a href="#claim" className={styles.skip}>Skip to free quarter →</a>

      {/* Tall scroll container; beats are sticky in cinema mode, stacked in reduced mode. */}
      <div ref={ref} className={styles.scrollContainer} data-reduced={reduced || undefined}>
        <SunBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <DepositBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <MorphBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <ConveyorBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <WinningsBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <ClaimBeat reduced={reduced} />
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Create minimal beat stubs** so the orchestrator compiles and the SEO copy test passes. Each beat file exports a default component rendering its sticky section + copy. Create all six with these bodies (real animation comes in Tasks 5–7):

`beats/SunBeat.tsx`:
```tsx
'use client'
import type { MotionValue } from 'framer-motion'
import styles from '../chip.module.css'

export interface BeatProps {
  progress: MotionValue<number>
  count: number
  reduced: boolean
}

export default function SunBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The Sun">
      <div className={styles.beatInner}>
        <h1 className={styles.title}>A Chip and a Chair.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
      </div>
    </section>
  )
}
```

`beats/DepositBeat.tsx`:
```tsx
'use client'
import type { MotionValue } from 'framer-motion'
import styles from '../chip.module.css'
export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }
export default function DepositBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Deposit">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>DEPOSIT QUARTER</h2>
        <p className={styles.sub}>Insert coin to begin.</p>
      </div>
    </section>
  )
}
```

`beats/MorphBeat.tsx`:
```tsx
'use client'
import type { MotionValue } from 'framer-motion'
import styles from '../chip.module.css'
export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }
export default function MorphBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Becomes a position">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Your 25¢ becomes a real position.</h2>
      </div>
    </section>
  )
}
```

`beats/ConveyorBeat.tsx`:
```tsx
'use client'
import type { MotionValue } from 'framer-motion'
import styles from '../chip.module.css'
export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }
export default function ConveyorBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The factory floor">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>A floor full of opportunities.</h2>
      </div>
    </section>
  )
}
```

`beats/WinningsBeat.tsx`:
```tsx
'use client'
import type { MotionValue } from 'framer-motion'
import styles from '../chip.module.css'
export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }
export default function WinningsBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The winnings">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>This is how far a quarter can go.</h2>
      </div>
    </section>
  )
}
```

`beats/ClaimBeat.tsx` (minimal stub; Task 7 fills the widget + capture):
```tsx
'use client'
import styles from '../chip.module.css'

export interface ClaimBeatProps { reduced: boolean }

export default function ClaimBeat(_props: ClaimBeatProps) {
  return (
    <section id="claim" className={styles.beat} aria-label="Take your free quarter">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Take your free quarter.</h2>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Add layout styles to `chip.module.css`** (sticky beats; static stacked when reduced)

```css
.cinemaRoot, .staticRoot { position: relative; color: #f4f4f5; background: #07070b; }
.skip {
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
  z-index: 50; padding: 8px 16px; border-radius: 999px;
  background: rgba(255,255,255,0.1); color: #fff; font-size: 14px;
  backdrop-filter: blur(6px); text-decoration: none;
}
.skip:focus { outline: 2px solid #f7b733; }
.scrollContainer { display: block; }
.beat {
  position: sticky; top: 0; height: 100vh;
  display: grid; place-items: center; overflow: hidden;
}
/* Reduced-motion: sections stack normally, no pinning. */
.scrollContainer[data-reduced] .beat { position: relative; height: auto; min-height: 60vh; padding: 80px 0; }
.beatInner { text-align: center; max-width: 880px; padding: 0 24px; }
.title { font-size: clamp(28px, 6vw, 72px); font-weight: 800; line-height: 1.02; }
.sub { font-size: clamp(16px, 2.4vw, 24px); opacity: 0.8; margin-top: 16px; }
```

- [ ] **Step 7: Run the orchestrator test — verify it passes**

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: PASS (3 assertions).

- [ ] **Step 8: Run the full suite + build**

Run: `npm test && npm run build`
Expected: all tests pass; build succeeds.

- [ ] **Step 9: Commit**

```bash
git add app/components/chip/
git commit -m "feat(home): orchestrator with sticky beats, reduced-motion switch, skip link"
```

---

## Task 5: Beats 0–2 — Sun → Full screen → Deposit slot (scroll-linked)

**Files:**
- Modify: `app/components/chip/beats/SunBeat.tsx`, `app/components/chip/beats/DepositBeat.tsx`, `app/components/chip/chip.module.css`

**Interfaces:**
- Consumes: `BeatProps { progress, count, reduced }`, `useBeatProgress`, `Quarter`, hero asset `/images/chip/beat0-sun-quarter.webp`.
- Produces: SunBeat owns beats 0 (index 0) and 1 (index 1); DepositBeat owns beat 2 (index 2). When `reduced`, render the static coin (no scroll transforms).

- [ ] **Step 1: Implement `SunBeat.tsx`** (sun → rises + scales to full screen)

```tsx
'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'

export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }

export default function SunBeat({ progress, count, reduced }: BeatProps) {
  // Beat 0 (sun) and beat 1 (full screen) share this sticky section.
  const p0 = useBeatProgress(progress, 0, count)
  const p1 = useBeatProgress(progress, 1, count)

  // Beat 0: coin sits low like a sun, slight rise. Beat 1: scales up to fill.
  const y = useTransform(p0, [0, 1], [120, 0])
  const scale = useTransform(p1, [0, 1], [1, 4])
  const morph = useTransform(p1, [0, 1], [0, 0]) // stays a coin here

  return (
    <section className={styles.beat} aria-label="The Sun">
      <div
        className={styles.sunBackdrop}
        style={{ backgroundImage: 'url(/images/chip/beat0-sun-quarter.webp)' }}
        aria-hidden
      />
      <div className={styles.beatInner}>
        <h1 className={styles.title}>A Chip and a Chair.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </div>
      {!reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={scale} rotate={0} x={0} y={y} morph={morph} variant="sun" />
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Implement `DepositBeat.tsx`** (coin shrinks, tips, rolls to the slot)

```tsx
'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'

export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }

export default function DepositBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 2, count)
  const scale = useTransform(p, [0, 1], [4, 1])
  const rotate = useTransform(p, [0, 1], [0, 540]) // rolls
  const x = useTransform(p, [0, 1], [-220, 0])     // rolls toward the slot
  const morph = useTransform(p, [0, 1], [0, 0])

  return (
    <section className={styles.beat} aria-label="Deposit">
      <div className={styles.beatInner}>
        <div className={styles.slot} aria-hidden>
          <span className={styles.slotLabel}>DEPOSIT QUARTER</span>
          <span className={styles.slotMouth} />
        </div>
        <p className={styles.sub}>Insert coin to begin.</p>
      </div>
      {!reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={scale} rotate={rotate} x={x} y={0} morph={morph} />
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 3: Add Beat 0–2 styles to `chip.module.css`**

```css
.sunBackdrop {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  opacity: 0.55;
}
.coinLayer { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.scrollCue { margin-top: 40px; opacity: 0.6; font-size: 14px; letter-spacing: 0.2em; }
.slot {
  position: relative; width: 320px; max-width: 80vw; margin: 0 auto 24px;
  padding: 28px; border-radius: 16px; background: #14141c;
  box-shadow: inset 0 0 0 2px #2a2a3a, 0 20px 60px rgba(0,0,0,0.6);
}
.slotLabel { display: block; font-weight: 800; letter-spacing: 0.12em; color: #f7b733; }
.slotMouth { display: block; height: 14px; margin-top: 16px; border-radius: 8px; background: #050508; box-shadow: inset 0 2px 6px rgba(0,0,0,0.8); }
```

- [ ] **Step 4: Run the suite — existing tests still pass** (SunBeat/DepositBeat still render their copy)

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: PASS (DEPOSIT QUARTER + headline copy still present).

- [ ] **Step 5: Build to confirm no type errors**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add app/components/chip/beats/SunBeat.tsx app/components/chip/beats/DepositBeat.tsx app/components/chip/chip.module.css
git commit -m "feat(home): beats 0-2 — sun, full-screen, deposit slot (scroll-linked)"
```

---

## Task 6: Beats 3–5 — Morph → Conveyor → Winnings

**Files:**
- Modify: `app/components/chip/beats/MorphBeat.tsx`, `app/components/chip/beats/ConveyorBeat.tsx`, `app/components/chip/beats/WinningsBeat.tsx`, `app/components/chip/chip.module.css`

**Interfaces:**
- Consumes: `BeatProps`, `useBeatProgress`, `Quarter`.
- Produces: MorphBeat (index 3) crossfades coin→logo; ConveyorBeat (index 4) translates a belt of seeded station cards and counts a tally; WinningsBeat (index 5) counts a payout number up. Conveyor uses **seeded mock** stations (deterministic — per spec open-question lean).

- [ ] **Step 1: Implement `MorphBeat.tsx`**

```tsx
'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'

export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }

export default function MorphBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 3, count)
  const morph = useTransform(p, [0.2, 0.8], [0, 1])
  const rotate = useTransform(p, [0, 1], [0, 360])

  return (
    <section className={styles.beat} aria-label="Becomes a position">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Your 25¢ becomes a real position.</h2>
        <p className={styles.sub}>Polymarket. Kalshi. Real venues.</p>
      </div>
      {!reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={1.2} rotate={rotate} x={0} y={0} morph={morph} />
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Implement `ConveyorBeat.tsx`** (seeded stations + tally)

```tsx
'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import { motion } from 'framer-motion'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'

export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }

// Seeded, deterministic stations for the cinematic (live data is a later enhancement).
const STATIONS = [
  { kind: 'market', label: 'Will it rain in NYC Saturday?', result: 'YES', gain: 0.4 },
  { kind: 'table', label: 'Roulette', result: '17 red', gain: 1.1 },
  { kind: 'market', label: 'Fed holds rates in July?', result: 'YES', gain: 0.8 },
  { kind: 'table', label: 'Roulette', result: '00 green', gain: 2.0 },
  { kind: 'market', label: 'Home team wins tonight?', result: 'YES', gain: 0.6 },
] as const

export default function ConveyorBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 4, count)
  // Belt slides left as you scroll through this beat.
  const x = useTransform(p, [0, 1], ['10%', '-60%'])

  return (
    <section className={styles.beat} aria-label="The factory floor">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>A floor full of opportunities.</h2>
      </div>
      <div className={styles.beltViewport} aria-hidden={reduced ? undefined : true}>
        <motion.div className={styles.belt} style={reduced ? undefined : { x }}>
          {STATIONS.map((s, i) => (
            <div key={i} className={`${styles.station} ${s.kind === 'table' ? styles.stationTable : styles.stationMarket}`}>
              <span className={styles.stationKind}>{s.kind === 'table' ? 'TABLE' : 'MARKET'}</span>
              <span className={styles.stationLabel}>{s.label}</span>
              <span className={styles.stationResult}>{s.result} · +${s.gain.toFixed(2)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Implement `WinningsBeat.tsx`** (count-up tied to scroll)

```tsx
'use client'
import { useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { useState } from 'react'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'

export interface BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }

const TARGET = 18.75 // seeded payout for the cinematic

export default function WinningsBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 5, count)
  const amount = useTransform(p, [0, 1], [0.25, TARGET])
  const [shown, setShown] = useState(reduced ? TARGET : 0.25)
  useMotionValueEvent(amount, 'change', (v) => setShown(v))

  return (
    <section className={styles.beat} aria-label="The winnings">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>This is how far a quarter can go.</h2>
        <p className={styles.payout}>${(reduced ? TARGET : shown).toFixed(2)}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add Beat 3–5 styles to `chip.module.css`**

```css
.beltViewport { position: absolute; inset: 0; display: grid; align-content: center; overflow: hidden; }
.belt { display: flex; gap: 24px; padding: 0 24px; will-change: transform; }
.station {
  flex: 0 0 280px; padding: 20px; border-radius: 14px; text-align: left;
  background: #11111a; box-shadow: inset 0 0 0 1px #262636, 0 16px 40px rgba(0,0,0,0.5);
}
.stationMarket { border-top: 3px solid #4ade80; }
.stationTable { border-top: 3px solid #f7b733; }
.stationKind { font-size: 11px; letter-spacing: 0.18em; opacity: 0.6; }
.stationLabel { display: block; margin: 8px 0; font-weight: 700; }
.stationResult { color: #4ade80; font-weight: 700; }
.payout { font-size: clamp(48px, 12vw, 140px); font-weight: 900; color: #f7b733; margin-top: 8px; }
```

- [ ] **Step 5: Run the suite + build**

Run: `npm test && npm run build`
Expected: pass + success.

- [ ] **Step 6: Commit**

```bash
git add app/components/chip/beats/MorphBeat.tsx app/components/chip/beats/ConveyorBeat.tsx app/components/chip/beats/WinningsBeat.tsx app/components/chip/chip.module.css
git commit -m "feat(home): beats 3-5 — morph, conveyor, winnings tally"
```

---

## Task 7: Beat 6 — ClaimBeat: widget mount + `chance:result` → email capture

**Files:**
- Modify: `app/components/chip/beats/ClaimBeat.tsx`, `app/components/chip/chip.module.css`
- Create: `app/components/chip/__tests__/ClaimBeat.test.tsx`

**Interfaces:**
- Consumes: `public/embed/chance.js` (`<chance-checkout>` web component; emits `chance:result`), `POST /api/subscribe` (`{ name, email }` → `{ success }`).
- Produces: `<ClaimBeat reduced />` — lazy-injects the embed script (same pattern as `app/chance/page.tsx`), mounts a small-`amount` `<chance-checkout>`, listens for `chance:result`, then reveals an email-capture card. Submitting POSTs to `/api/subscribe` and shows the "reserved" success state.

- [ ] **Step 1: Write the failing test** — `__tests__/ClaimBeat.test.tsx`

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ClaimBeat from '../beats/ClaimBeat'

describe('ClaimBeat', () => {
  beforeEach(() => {
    // @ts-expect-error test stub
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
  })

  it('reveals the email-capture card after a chance:result', async () => {
    const { container } = render(<ClaimBeat reduced={false} />)
    const host = container.querySelector('chance-checkout')!
    expect(host).toBeTruthy()
    // capture card hidden until a result fires
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument()
    host.dispatchEvent(new CustomEvent('chance:result', { detail: { won: true, amountBack: 0.5 }, bubbles: true }))
    expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument()
  })

  it('posts to /api/subscribe and shows the reserved state on submit', async () => {
    const { container } = render(<ClaimBeat reduced={false} />)
    const host = container.querySelector('chance-checkout')!
    host.dispatchEvent(new CustomEvent('chance:result', { detail: { won: true }, bubbles: true }))
    const input = await screen.findByPlaceholderText(/email/i)
    fireEvent.change(input, { target: { value: 'player@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /reserve|save|keep/i }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', expect.objectContaining({ method: 'POST' })))
    expect(await screen.findByText(/reserved/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it — verify it fails**

Run: `npx vitest run app/components/chip/__tests__/ClaimBeat.test.tsx`
Expected: FAIL — no `<chance-checkout>` host / no capture card.

- [ ] **Step 3: Implement `ClaimBeat.tsx`**

```tsx
'use client'

import { createElement, useEffect, useRef, useState } from 'react'
import styles from '../chip.module.css'

export interface ClaimBeatProps { reduced: boolean }

type Phase = 'play' | 'capture' | 'done'

export default function ClaimBeat({ reduced }: ClaimBeatProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('play')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load the embed exactly as a merchant would — a single <script src>. (Mirrors app/chance/page.tsx.)
  useEffect(() => {
    if (customElements.get('chance-checkout')) return
    if (document.querySelector('script[data-chance-embed]')) return
    const s = document.createElement('script')
    s.src = '/embed/chance.js'
    s.async = true
    s.setAttribute('data-chance-embed', '')
    document.body.appendChild(s)
  }, [])

  // Reveal the capture card once the visitor plays.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const onResult = () => setPhase((p) => (p === 'play' ? 'capture' : p))
    host.addEventListener('chance:result', onResult as EventListener)
    return () => host.removeEventListener('chance:result', onResult as EventListener)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // /api/subscribe requires a name; derive one from the email local-part.
        body: JSON.stringify({ name: email.split('@')[0] || 'Quarter Claim', email }),
      })
      setPhase('done')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="claim" className={styles.beat} aria-label="Take your free quarter">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Take your free quarter.</h2>

        {/* The widget — tiny amount so it reads as "a quarter". */}
        <div ref={hostRef} className={styles.widgetHost}>
          {createElement('chance-checkout', { amount: '2', mode: 'flip-to-free' })}
        </div>

        {phase === 'capture' && (
          <form className={styles.captureCard} onSubmit={submit}>
            <p className={styles.captureLead}>Save your winnings — keep your quarter.</p>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.captureInput}
              aria-label="Email"
            />
            <button type="submit" disabled={submitting} className={styles.captureBtn}>
              {submitting ? 'Reserving…' : 'Reserve my quarter'}
            </button>
          </form>
        )}

        {phase === 'done' && (
          <p className={styles.reserved}>
            Your free quarter is reserved — we’ll email you when it’s live.
          </p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add ClaimBeat styles to `chip.module.css`**

```css
.widgetHost { margin: 32px auto 0; max-width: 480px; }
.captureCard { margin: 28px auto 0; max-width: 420px; display: grid; gap: 12px; }
.captureLead { font-weight: 700; }
.captureInput { padding: 14px 16px; border-radius: 10px; border: 1px solid #2a2a3a; background: #11111a; color: #fff; }
.captureBtn { padding: 14px 16px; border-radius: 10px; border: 0; font-weight: 800; background: #f7b733; color: #1a1205; cursor: pointer; }
.captureBtn:disabled { opacity: 0.6; cursor: default; }
.reserved { margin-top: 24px; color: #4ade80; font-weight: 700; }
```

- [ ] **Step 5: Run the ClaimBeat test — verify it passes**

Run: `npx vitest run app/components/chip/__tests__/ClaimBeat.test.tsx`
Expected: PASS (2 assertions).

- [ ] **Step 6: Run the full suite + build**

Run: `npm test && npm run build`
Expected: pass + success.

- [ ] **Step 7: Commit**

```bash
git add app/components/chip/beats/ClaimBeat.tsx app/components/chip/chip.module.css app/components/chip/__tests__/ClaimBeat.test.tsx
git commit -m "feat(home): ClaimBeat — widget mount, chance:result, email capture to /api/subscribe"
```

---

## Task 8: Reduced-motion polish + homepage OG image

**Files:**
- Modify: `app/components/chip/__tests__/ChipAndAChair.test.tsx` (add a reduced-motion render assertion), `app/opengraph-image.tsx` (verify/repair homepage OG)
- Verify: every beat renders its copy and a static coin when `reduced` is true.

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (already built). When reduced, beats render copy + a single static `<Quarter/>` with neutral props, no scroll transforms (already guarded by `reduced &&` in Tasks 5–6; ClaimBeat is unaffected).

- [ ] **Step 1: Add a reduced-motion test** to `__tests__/ChipAndAChair.test.tsx`

```tsx
it('renders the static stacked layout under reduced motion', () => {
  // Force reduced-motion preference.
  window.matchMedia = ((q: string) => ({
    matches: q.includes('reduce'),
    media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia

  render(<ChipAndAChair />)
  // Same content is present; the cinematic coin layers are not required.
  expect(screen.getByText(/Take your free quarter/i)).toBeInTheDocument()
  expect(screen.getByText(/how far a quarter can go/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run it — verify it passes** (reduced path already implemented)

Run: `npx vitest run app/components/chip/__tests__/ChipAndAChair.test.tsx`
Expected: PASS. If it fails because a beat throws under `reduced`, guard that beat's scroll transforms with `reduced` as in Task 5.

- [ ] **Step 3: Verify the homepage OG renders** — open `app/opengraph-image.tsx` and confirm it produces a valid image for `/`. If it references retired `ArcadeLanding` content or throws, update its text to the new hero copy ("A Chip and a Chair · It only takes a quarter."). Keep it a static `ImageResponse`.

Run: `npm run build`
Expected: build emits the opengraph image route without error.

- [ ] **Step 4: Manual OG check**

Run: `npm run dev` then in a browser open `http://localhost:3000/opengraph-image` (or the configured OG route).
Expected: a rendered card with the new hero copy.

- [ ] **Step 5: Commit**

```bash
git add app/components/chip/__tests__/ChipAndAChair.test.tsx app/opengraph-image.tsx
git commit -m "feat(home): reduced-motion assertion + homepage OG copy"
```

---

## Task 9: End-to-end smoke verification on `/`

**Files:** none (verification only). Uses the running dev server + the Playwright MCP available in this session.

**Interfaces:** verifies the full happy path and the retire-checks.

- [ ] **Step 1: Start a clean dev server** (per the session gotcha)

```bash
cd /Users/jeremyalbus/Projects/HedgePayments/website
rm -rf .next && npm run dev
```

- [ ] **Step 2: Drive `/` with the Playwright MCP** — navigate to `http://localhost:3000/`, take a snapshot, confirm the hero headline "A Chip and a Chair." is visible and the skip link is present.

- [ ] **Step 3: Scroll through the beats** — scroll the page in increments; confirm the deposit slot, conveyor stations, and the payout number appear; reach `#claim` and confirm `<chance-checkout>` mounts.

- [ ] **Step 4: Exercise the trial** — open the widget, play to a result, confirm the email-capture card appears; submit a test email and confirm the "reserved" state. (Network POST to `/api/subscribe` returns success even without ConvertKit/Supabase configured locally — it degrades gracefully.)

- [ ] **Step 5: Retire-checks** — navigate to `http://localhost:3000/classic` and confirm `ArcadeLanding` renders. Confirm `/` no longer renders the old arcade landing.

- [ ] **Step 6: Reduced-motion** — re-run with the OS "Reduce motion" setting on (or emulate via the MCP) and confirm the page is a readable static stack with the same copy and the same trial.

- [ ] **Step 7: Final full test run + build**

```bash
npm test && npm run build
```
Expected: all green.

- [ ] **Step 8: Report results** — summarize what was verified (with the snapshot/screenshots) before any deploy. Do not deploy until the user asks (deploy steps live in the session gotchas).

---

## Self-Review

**Spec coverage:**
- Beats 0–6 → Tasks 5 (0–2), 6 (3–5), 7 (6). ✓
- Retire ArcadeLanding to `/classic` → Task 1. ✓
- `useBeatProgress` pure math + test → Task 2. ✓
- `Quarter` morph + test → Task 3. ✓
- Orchestrator sticky container + reduced-motion + skip link → Task 4. ✓
- Widget reuse + `chance:result` + email capture → Task 7. ✓
- Reduced-motion static path + OG → Tasks 4/5/8. ✓
- Playwright/MCP smoke → Task 9. ✓
- Demo-only / no real-money → enforced by Global Constraints + ClaimBeat posting only to the email list. ✓
- Seeded-mock conveyor (open-question lean) → Task 6. ✓
- Email endpoint decision (ConvertKit vs SendGrid) → **resolved: `POST /api/subscribe`** (ConvertKit + Supabase, graceful degradation). ✓

**Open spec questions resolved in this plan:**
- Email endpoint → `/api/subscribe`.
- Beat-4 data → seeded mocks (deterministic), live is a later enhancement.
- "claimed: N quarters" counter → **not** included in v1 (kept minimal); can be added later behind the reserved state.

**Placeholder scan:** no TBD/"handle edge cases"/"similar to Task N" — all steps carry real code/commands. ✓

**Type consistency:** `BeatProps { progress: MotionValue<number>; count: number; reduced: boolean }` is identical across SunBeat/DepositBeat/MorphBeat/ConveyorBeat/WinningsBeat; `ClaimBeatProps { reduced }` distinct (no scroll). `Quarter` props (`scale/rotate/x/y/morph/variant`) match every call site. `beatProgress`/`useBeatProgress` signatures match Task 2 ↔ usages in Tasks 5–6. ✓

## Docs / related
- Spec: `docs/superpowers/specs/2026-06-22-chip-and-a-chair-homepage-design.md`
- Widget: `public/embed/chance.js`; mount pattern: `app/chance/page.tsx`
- Email route: `app/api/subscribe/route.ts`
- Hosting/deploy + OG note: [[project_hedgepayments_hosting]]; roadmap/gates: [[project_chance_roadmap]]
