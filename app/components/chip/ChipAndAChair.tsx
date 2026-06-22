'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import styles from './chip.module.css'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import TravelingQuarter from './TravelingQuarter'
import GlassDefs from './glass/GlassDefs'
import GlassNav from './glass/GlassNav'
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
      <GlassDefs />
      <a href="#claim" className={styles.skip}>Skip to free quarter →</a>
      <GlassNav />

      {/* Backdrop (z0) sits behind the coin (z1) which sits behind the beats + copy (z2). */}
      {!reduced && <div className={styles.pageBackdrop} aria-hidden />}

      {/* One quarter the visitor follows the whole way (cinema mode only). */}
      {!reduced && <TravelingQuarter progress={scrollYProgress} />}

      {/* Tall scroll container; beats are sticky in cinema mode, stacked in reduced mode. */}
      <div ref={ref} className={styles.scrollContainer} data-reduced={reduced || undefined}>
        <SunBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <DepositBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <MorphBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <ConveyorBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <WinningsBeat progress={scrollYProgress} count={BEAT_COUNT} reduced={reduced} />
        <ClaimBeat />
      </div>
    </main>
  )
}
