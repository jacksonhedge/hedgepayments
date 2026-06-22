'use client'
import { motion, useTransform } from 'framer-motion'
import Quarter from '../Quarter'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function SunBeat({ progress, reduced }: BeatProps) {
  // The headline is visible at rest and fades as the shared traveling coin scales
  // up to fill the screen (same global-scroll window as the coin's grandeur stop).
  const copyOpacity = useTransform(progress, [0.1, 0.16], [1, 0])

  return (
    <section className={styles.beat} aria-label="Fun Payments">
      <div className={styles.heroBackdrop} aria-hidden />

      {/* Reduced motion has no traveling coin, so show a static quarter here. */}
      {reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={1} rotate={0} x={0} y={0} morph={0} variant="silver" />
        </div>
      )}

      <motion.div
        className={`${styles.beatInner} ${styles.sunInner}`}
        style={reduced ? undefined : { opacity: copyOpacity }}
      >
        <h1 className={styles.title}>Fun Payments.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </motion.div>
    </section>
  )
}
