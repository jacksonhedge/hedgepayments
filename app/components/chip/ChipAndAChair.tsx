'use client'

import { useRef, useState } from 'react'
import { useScroll } from 'framer-motion'
import styles from './chip.module.css'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import FlipLoader from './loader/FlipLoader'
import GlassDefs from './glass/GlassDefs'
import GlassNav from './glass/GlassNav'
import TubeJourney from './tube/TubeJourney'
import SunBeat from './beats/SunBeat'
import ClaimBeat from './beats/ClaimBeat'

export const BEAT_COUNT = 7

export default function ChipAndAChair() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref })
  const [loading, setLoading] = useState(true)

  return (
    <main className={reduced ? styles.staticRoot : styles.cinemaRoot}>
      {loading && <FlipLoader onDone={() => setLoading(false)} />}
      <GlassDefs />
      <a href="#claim" className={styles.skip}>Skip to free quarter →</a>
      <GlassNav />

      {/* Dark page backdrop behind everything. */}
      <div className={styles.pageBackdrop} aria-hidden />

      {/* Hero → the machine (coin rides the tube, info pops in) → claim. */}
      <div ref={ref} className={styles.scrollContainer} data-reduced={reduced || undefined}>
        <SunBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <TubeJourney />
        <ClaimBeat />
      </div>
    </main>
  )
}
