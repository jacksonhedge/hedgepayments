'use client'
import { useTransform } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

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
