'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Flip-grid loading screen (ported from flip-grid-loader.html).
 * A full-screen grid of "keycap" tiles flips randomly while the page loads, then
 * blooms into quarter coins from the centre out (silver centre, Afremov-coloured
 * outward) once ready, and fades away. Drives itself: starts on mount, completes
 * on window-load (with a min display), then calls onDone.
 */
export default function FlipLoader({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const scene = root.querySelector<HTMLDivElement>('[data-scene]')!
    const tag = root.querySelector<HTMLDivElement>('[data-tag]')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    // Loading flicker = a mix of US coins (penny / nickel / dime / quarter). Built
    // without SVG gradient IDs so the same markup can be reused across tiles freely.
    const DENOMS = [
      { v: '1¢', rim: '#7a4a1e', field: '#c0792e', hi: '#e6a85c', eng: '#5a3414' },  // penny (copper)
      { v: '5¢', rim: '#5f6470', field: '#b9bdc8', hi: '#eef0f5', eng: '#474b55' },  // nickel
      { v: '10¢', rim: '#5f6470', field: '#c3c7d2', hi: '#f2f4f8', eng: '#474b55' }, // dime
      { v: '25¢', rim: '#565b6b', field: '#c3c7d2', hi: '#f3f4f8', eng: '#565b6b' }, // quarter
    ]
    const denomCoin = (d: (typeof DENOMS)[number]) =>
      `<svg class="coin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48.5" fill="${d.rim}"/><circle cx="50" cy="50" r="47" fill="none" stroke="${d.hi}" stroke-width="3" stroke-dasharray="0.7 1.25" opacity="0.7"/><circle cx="50" cy="50" r="44" fill="${d.field}"/><circle cx="42" cy="38" r="22" fill="${d.hi}" opacity="0.32"/><text class="cc-val" x="50" y="59" text-anchor="middle" fill="${d.eng}">${d.v}</text></svg>`
    const COINS = DENOMS.map(denomCoin)
    const AFREMOV = [188, 210, 232, 258, 284, 312, 340, 18, 38, 52, 98, 150]
    const SILVER = { hi: '#f3f4f8', mid: '#c3c7d2', lo: '#7e8290', eng: '#565b6b' }
    const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`

    const SPARK = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b8a4dc"/></linearGradient></defs><path d="M50 14 C53 36,64 47,86 50 C64 53,53 64,50 86 C47 64,36 53,14 50 C36 47,47 36,50 14 Z" fill="url(#spk)" style="filter:drop-shadow(0 1px 1px rgba(40,22,70,.6))"/></svg>`

    function coinSVG(c: { hi: string; mid: string; lo: string; eng: string }, uid: number) {
      return `<svg class="coin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g${uid}" cx="36%" cy="30%" r="78%"><stop offset="0%" stop-color="${c.hi}"/><stop offset="55%" stop-color="${c.mid}"/><stop offset="100%" stop-color="${c.lo}"/></radialGradient><path id="lib${uid}" d="M24 41 A 27 27 0 0 1 76 41" fill="none"/></defs><circle cx="50" cy="50" r="48.5" fill="${c.lo}"/><circle cx="50" cy="50" r="47" fill="none" stroke="${c.hi}" stroke-width="3" stroke-dasharray="0.7 1.25" opacity="0.7"/><circle cx="50" cy="50" r="44" fill="url(#g${uid})"/><circle cx="50" cy="50" r="40.5" fill="none" stroke="${c.eng}" stroke-width="0.8" opacity="0.5"/><text class="cc-lib" fill="${c.eng}"><textPath href="#lib${uid}" startOffset="50%" text-anchor="middle">LIBERTY</textPath></text><text class="cc-star" x="29" y="56" fill="${c.eng}">✦</text><text class="cc-star" x="71" y="56" fill="${c.eng}" text-anchor="end">✦</text><text class="cc-val" x="50" y="59" text-anchor="middle" fill="${c.hi}" opacity="0.55">25¢</text><text class="cc-val" x="50" y="58.4" text-anchor="middle" fill="${c.eng}">25¢</text><text class="cc-date" x="50" y="74" text-anchor="middle" fill="${c.eng}">2026</text></svg>`
    }

    function colorsFor(t: Tile, cr: number, cc: number) {
      const dr = t.r - cr, dc = t.c - cc
      const ang = (Math.atan2(dr, dc) * 180 / Math.PI + 360) % 360
      const dist = Math.hypot(dr, dc)
      let idx = Math.round(ang / (360 / AFREMOV.length) + dist) % AFREMOV.length
      if (idx < 0) idx += AFREMOV.length
      const h = AFREMOV[idx], s = 84, j = Math.random() * 8 - 4
      return { hi: hsl(h, s, 74 + j), mid: hsl(h, s, 55 + j), lo: hsl(h, s, 33 + j), eng: hsl(h, s, 20) }
    }

    type Tile = { tile: HTMLDivElement; back: HTMLDivElement; r: number; c: number; flipped: boolean; nextAt: number; dist: number }
    let tiles: Tile[] = [], cols = 0, rows = 0, raf = 0
    let state: 'idle' | 'loading' | 'resolving' | 'done' = 'idle'
    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    function build() {
      const w = innerWidth, h = innerHeight
      const T = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--flip-tile')) || 78
      cols = Math.max(5, Math.floor(w / T))
      rows = Math.max(6, Math.floor(h / T) + 1)
      scene.style.gridTemplateColumns = `repeat(${cols},1fr)`
      scene.style.gridTemplateRows = `repeat(${rows},1fr)`
      scene.innerHTML = ''
      tiles = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div'); cell.className = 'cell'
        const tile = document.createElement('div'); tile.className = 'tile'
        const front = document.createElement('div'); front.className = 'face front'; front.innerHTML = SPARK
        const back = document.createElement('div'); back.className = 'face back'
        tile.append(front, back); cell.append(tile); scene.append(cell)
        tiles.push({ tile, back, r, c, flipped: false, nextAt: 0, dist: 0 })
      }
      cancelAnimationFrame(raf)
      if (reduced) { state = 'resolving'; complete(); return }
      raf = requestAnimationFrame(loop)
      start()
    }

    const scheduleTile = (t: Tile, now: number) => { t.nextAt = now + (t.flipped ? rand(500, 1400) : rand(250, 2600)) }

    function loop(now: number) {
      if (state === 'loading') {
        for (const t of tiles) {
          if (now >= t.nextAt) {
            if (t.flipped) { t.flipped = false; t.tile.classList.remove('flipped') }
            else {
              t.flipped = true; t.tile.classList.add('flipped')
              t.back.innerHTML = COINS[(Math.random() * COINS.length) | 0]
            }
            scheduleTile(t, now)
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }

    function start() {
      state = 'loading'
      tag.textContent = 'loading'; tag.classList.remove('ready')
      const now = performance.now()
      for (const t of tiles) { t.flipped = false; t.tile.classList.remove('flipped'); t.nextAt = now + rand(0, 1400) }
    }

    function complete() {
      if (state === 'resolving' || state === 'done') return
      state = 'resolving'
      tag.textContent = 'ready'; tag.classList.add('ready')
      const cr = (rows - 1) / 2, cc = (cols - 1) / 2
      let best = Infinity, center: Tile | null = null
      for (const t of tiles) { t.dist = Math.hypot(t.r - cr, t.c - cc); if (t.dist < best) { best = t.dist; center = t } }
      let uid = 0
      for (const t of tiles) {
        t.tile.classList.remove('flipped'); t.flipped = false
        const col = t === center ? SILVER : colorsFor(t, cr, cc)
        t.back.innerHTML = coinSVG(col, uid++)
      }
      if (reduced) { for (const t of tiles) t.tile.classList.add('flipped'); state = 'done'; return }
      const maxd = Math.max(...tiles.map((t) => t.dist))
      const flipMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flip-ms')) || 420
      setTimeout(() => {
        for (const t of tiles) setTimeout(() => t.tile.classList.add('flipped'), t.dist * 26)
        setTimeout(() => { state = 'done' }, maxd * 26 + 500)
      }, Math.round(flipMs * 0.7))
    }

    build()
    let rt: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(rt); rt = setTimeout(build, 200) }
    addEventListener('resize', onResize)

    // ── drive completion off real readiness ──────────────────────────────
    const startedAt = performance.now()
    const MIN_MS = 1700
    let finished = false
    function finish() {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_MS - (performance.now() - startedAt))
      setTimeout(() => {
        complete()
        // after the bloom settles, fade the overlay out and hand off
        setTimeout(() => {
          setFading(true)
          setTimeout(() => onDone?.(), 650)
        }, reduced ? 300 : 1500)
      }, wait)
    }
    if (document.readyState === 'complete') finish()
    else addEventListener('load', finish, { once: true })
    const safety = setTimeout(finish, 4000) // never hang

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      removeEventListener('resize', onResize)
      removeEventListener('load', finish)
    }
  }, [onDone])

  return (
    <div ref={rootRef} id="flip-loader" data-fading={fading || undefined} aria-hidden>
      <div data-scene />
      <div data-tag>loading</div>
    </div>
  )
}
