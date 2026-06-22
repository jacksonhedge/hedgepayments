'use client'
import { motion, useTransform } from 'framer-motion'
import Quarter from '../Quarter'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function SunBeat({ progress, reduced }: BeatProps) {
  // The headline holds while the coin is its big off-page hero size, then fades as
  // the coin sweeps to centre and scales up to fill the screen.
  const copyOpacity = useTransform(progress, [0.1, 0.15], [1, 0])

  return (
    <section className={styles.beat} aria-label="Fun Payments">
      {/* Reduced motion has no traveling coin, so show a static quarter here. */}
      {reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={1} rotate={0} x={0} y={0} morph={0} variant="silver" />
        </div>
      )}

      <motion.div
        className={`${styles.beatInner} ${styles.heroInner}`}
        style={reduced ? undefined : { opacity: copyOpacity }}
      >
        <h1 className={styles.heroTitle}>Fun Payments.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </motion.div>
    </section>
  )
}
