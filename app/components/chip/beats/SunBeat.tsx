'use client'
import { motion, useTransform } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function SunBeat({ progress, count, reduced }: BeatProps) {
  // Beat 0 (sun) and beat 1 (full screen) share this sticky section.
  const p0 = useBeatProgress(progress, 0, count)
  const p1 = useBeatProgress(progress, 1, count)

  // The CSS coin IS the sun: it sits on the horizon glow at rest, rises slightly
  // through beat 0, then scales up to fill the screen in beat 1. The backdrop is a
  // coinless ocean-dusk plate, so the coin is the single hero element.
  const y = useTransform(p0, [0, 1], [40, 0])
  const scale = useTransform(p1, [0, 1], [1, 4])
  const morph = useTransform(p1, [0, 1], [0, 0]) // stays a coin here
  // Lift the headline to the top; fade it out as the coin scales up so they never collide.
  const copyOpacity = useTransform(p1, [0, 0.5], [1, 0])

  return (
    <section className={styles.beat} aria-label="The Sun">
      <div
        className={styles.sunBackdrop}
        style={{ backgroundImage: 'url(/images/chip/beat0-ocean-plate.webp)' }}
        aria-hidden
      />
      {!reduced && (
        <div className={styles.coinLayer} aria-hidden>
          <Quarter scale={scale} rotate={0} x={0} y={y} morph={morph} variant="sun" />
        </div>
      )}
      <motion.div
        className={`${styles.beatInner} ${styles.sunInner}`}
        style={reduced ? undefined : { opacity: copyOpacity }}
      >
        <h1 className={styles.title}>A Chip and a Chair.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </motion.div>
    </section>
  )
}
