'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

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
