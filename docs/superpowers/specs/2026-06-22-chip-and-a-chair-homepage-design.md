# Hedge Payments homepage — "A Chip and a Chair" — Design

> **Status:** Design (pending written-spec review)
> **Date:** 2026-06-22
> **Surface:** `hedgepayments.com/` (the marketing homepage). Replaces the current `ArcadeLanding`.

## Summary

Replace the Hedge Payments homepage with a **scroll-driven cinematic** built around one metaphor — **"A Chip and a Chair"** (in poker, a chip and a seat means you can still win it all). The hero is a **quarter**: the smallest stake, framed as a rare *opportunity* (Ready-Player-One energy — the quarter is the thing that keeps you in the game and could change everything). The visitor scrolls through the quarter's journey — from a giant "setting-sun" coin, into a **"DEPOSIT QUARTER"** arcade slot, down a **factory-floor conveyor of opportunities** (real prediction markets + the tables), to a payout — and at the end is handed **their own free quarter** to actually play. Cinematic first, hands-on at the end.

The ending opt-in is **play-then-capture**: open the Chance widget (back a real market OR hit the roulette table), then capture email to "save your winnings — keep your quarter." Email is also the **claim gate** for a real, us-funded quarter once the real-money gates clear.

## Goals

- A distinctive, cinematic, scroll-driven homepage that *is* the brand — not a templated landing page.
- One coherent metaphor (the quarter / "chip and a chair") carried beat to beat.
- Convert the cinematic into a hands-on trial: the visitor plays with a free quarter, then gives email.
- Reuse what exists: the **`<chance-checkout>` widget** (markets + roulette), the spinning-coin tech from `/chance`, framer-motion (already a dependency), and the existing email wiring (ConvertKit / SendGrid).
- Keep **demo** and **real-money** work cleanly separated (per [[project_chance_roadmap]]).
- 60fps, accessible, and a graceful `prefers-reduced-motion` path.

## Non-goals (v1)

- Real-money execution of the funded quarter (gated — see Gates). v1 is demo play + email capture + a "reserved" claim state.
- A pre-rendered Blender/canvas frame-sequence for the coin (approach B) — deferred; v1 is CSS/SVG + framer-motion.
- GSAP/Lenis smooth-scroll (approach C) — only if framer-motion proves limiting.
- Rebuilding the other marketing pages (`/store`, `/chance`, docs) — out of scope.

## Decisions locked in brainstorming

- **Experience model:** cinematic scroll → opt-in at the end to play with a free quarter.
- **Placement:** this becomes `hedgepayments.com/`. The current `ArcadeLanding` is **retired to a fallback route** (`/classic`), not deleted.
- **Conveyor stations (the "opportunities"):** two types — **Markets** (Polymarket + Kalshi) and **the Tables** (roulette). (Chance-checkout and parlays were considered and dropped from the belt for focus.)
- **Opt-in:** **play then capture** — open the Chance widget, then email-capture after the result.
- **Funded quarter:** the email unlocks a real us-funded $0.25 — but only behind the real-money gates; v1 ships demo play + email claim.
- **Build approach: A — framer-motion + sticky/pinned sections** (no new deps).

## The experience — scroll beats

Each beat is a full-height **sticky** section; scroll progress (`useScroll`) drives transforms (`useTransform`) on the quarter and scene. Transform/opacity only.

| # | Beat | What happens |
|---|------|--------------|
| 0 | **The Sun** | Dark scene. A giant quarter low on the horizon like a setting sun, ridged edge catching light, a shimmering reflection ("ocean") below. Title **"A Chip and a Chair."** · sub **"It only takes a quarter."** · scroll cue. |
| 1 | **Full screen** | Scroll → the quarter rises and scales until it fills the viewport — peak grandeur, every ridge. |
| 2 | **Deposit** | Scroll → it shrinks, tips edge-on, rolls toward a **"DEPOSIT QUARTER"** coin slot. *Clink* — "Insert coin to begin." Deposit kicks off the journey. |
| 3 | **Roll + morph** | The quarter rolls into the machine and morphs into a real venue logo (Polymarket → Kalshi). **"Your 25¢ becomes a real position."** |
| 4 | **Factory floor** | The quarter lands on a horizontal, scroll-linked **conveyor belt of opportunities**. Stations ride by: **Markets** (a real prop resolves YES, the tally ticks up) and **the Tables** (roulette lands on a number, rides on). Running total climbs. |
| 5 | **The winnings** | Arrives at a payout display — **"This is how far a quarter can go."** A big number. |
| 6 | **Take your quarter** | A fresh quarter slides toward the viewer — **"Take your free quarter."** Opens the Chance widget → play → on `chance:result`, an email-capture card: **"Save your winnings — keep your quarter."** |

Copy is a first pass; refine in build.

## Architecture & components

New homepage under `app/`, composed of small, focused units:

```
app/page.tsx                      # renders <ChipAndAChair/> (was <ArcadeLanding/>)
app/classic/page.tsx              # renders <ArcadeLanding/> — retired fallback
app/components/chip/
  ChipAndAChair.tsx               # orchestrator: scroll container + beat sections + progress
  Quarter.tsx                     # the CSS/SVG silver coin (scale/rotate/roll/morph driven by scroll progress props)
  beats/SunBeat.tsx               # beat 0–1 (sun → full screen)
  beats/DepositBeat.tsx           # beat 2 (DEPOSIT QUARTER slot)
  beats/MorphBeat.tsx             # beat 3 (coin → venue logo)
  beats/ConveyorBeat.tsx          # beat 4 (horizontal belt of Market + Table stations)
  beats/WinningsBeat.tsx          # beat 5 (payout tally)
  beats/ClaimBeat.tsx             # beat 6 (widget mount + email capture)
  useBeatProgress.ts              # wraps useScroll/useTransform; maps global scroll → per-beat 0..1
  chip.module.css                 # tokens + beat styles
```

- **`ChipAndAChair`** owns the tall scroll container and renders the beats as sticky sections. It uses `useScroll({ target })` once and passes each beat its local progress (0→1) via `useBeatProgress`. No beat reads global scroll directly — they take a `progress` prop, so each is testable/understandable in isolation.
- **`Quarter`** is purely presentational: given `{ scale, rotate, x, y, morph }` (numbers/MotionValues), it renders the coin and the logo crossfade. Reuses the spinning-coin approach from `/chance` (`coin3d`), restyled silver/ridged. The logo morph crossfades the coin face into an inline venue SVG.
- **`ConveyorBeat`** maps beat progress → horizontal `translateX` of a belt of station cards (Market cards show a real-prop mock resolving; Table cards show a roulette result). A running tally counts up.
- **`ClaimBeat`** lazy-mounts `<chance-checkout>` (loaded via the existing `/embed/chance.js` `<script>` pattern, `amount` tiny to read as "a quarter," round-up/markets + the new tables flow), listens for `chance:result`, then shows the email-capture card.

## The opt-in: demo now, funded quarter later

**v1 (no gates — ships now):**
1. Beat 6 hands a **demo** free quarter and opens the widget. Play is simulated (`chance:result` is demo, no settlement) — same posture as the rest of Chance.
2. On result → email-capture card. Submit posts to the existing list (ConvertKit form or SendGrid via the existing API route — pick in the plan). Success state: **"Your free quarter is reserved — we'll email you when it's live."**

**Real funded quarter (gated — lights up later, same UI):**
- The captured email becomes the **claim** for a real us-funded **$0.25** credit.
- Real path requires: wallet ledger credit (`credit_wallet`, migration 004 — built), **bet execution + settlement** (Payment Slice 3 — not built), eligibility/KYC at claim, custody partner, counsel sign-off, `@hedge/api` deployed, live keys. See [[project_chance_roadmap]] gates.
- When those clear, the same Claim beat swaps the demo result for a real placed position; no front-end rework.

## Reduced-motion, accessibility, performance

- **`prefers-reduced-motion`:** render a **static stacked** version — each beat becomes a normal, non-pinned section (the quarter is a static silver coin; no scroll-scrub, no roll). Same content and the same opt-in. Detected with a media-query hook; chosen at mount.
- **Skip link:** a persistent "Skip to free quarter →" jumps to beat 6 for anyone who doesn't want the scroll.
- **Performance:** animate only `transform`/`opacity` (GPU-composited); the coin is CSS/SVG (no heavy assets in v1); the widget script and `<chance-checkout>` mount lazily at beat 6; images (venue logos) are inline SVG where possible.
- **SEO/OG:** the page still renders meaningful text (headline, sub, the beats' copy) server-side so it's indexable; add a static `/og/home.png` (the homepage OG is currently broken — see [[project_hedgepayments_hosting]]).

## Data flow (happy path)

1. Load `/` → `ChipAndAChair` mounts; `useScroll` tracks the tall container.
2. Scroll drives beats 0–5 (transforms only; no network).
3. Beat 6 → widget loads + opens → visitor plays → `chance:result` (demo).
4. Email-capture submit → POST to list endpoint → "reserved" success state.
5. (Future) email → real funded-quarter claim behind the gates.

## Testing

- **`useBeatProgress`** — pure math (global scroll fraction → per-beat 0..1, clamped); unit-tested (Vitest/Jest per repo).
- **`Quarter`** — given progress props, renders coin vs logo-morph at the right thresholds; presentational unit test.
- **`ClaimBeat`** — widget mounts; a `chance:result` event reveals the capture card; submit calls the endpoint (mocked); reduced-motion renders the static path.
- **Smoke / Playwright on `/`** — scroll through the beats, reach the widget, play, see capture; `/classic` still renders ArcadeLanding; `prefers-reduced-motion` renders the static version.

## Build sequencing

1. Move `ArcadeLanding` to `/classic`; stub `<ChipAndAChair/>` at `/`.
2. `useBeatProgress` + the sticky scroll container (+ tests).
3. `Quarter` (coin + scale/rotate/roll + logo morph) (+ test).
4. Beats 0–2 (Sun → Full screen → Deposit slot).
5. Beat 3 (morph) + Beat 4 (conveyor) + Beat 5 (winnings).
6. Beat 6 (widget mount + email capture + endpoint).
7. Reduced-motion static path + skip link + OG image.
8. Polish pass (timing, easing, copy), Playwright smoke, retire-checks.

## Open questions for the plan

- Email endpoint: ConvertKit form vs the existing SendGrid API route — pick in the plan.
- The funded-quarter "reserved" copy + whether to show a placeholder "claimed: N quarters" counter.
- Whether Beat 4's Market cards pull a live prop (via the widget's Polymarket fetch) or use seeded mocks for the cinematic (lean: seeded mocks for determinism + speed; live is a later enhancement).

## Docs / related
- Chance roadmap + gates — `ROADMAP.md`, [[project_chance_roadmap]]
- The shared widget (markets + roulette + die) — `public/embed/chance.js`
- Hosting/deploy + OG note — [[project_hedgepayments_hosting]]
