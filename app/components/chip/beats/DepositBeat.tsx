'use client'
import { useTransform } from 'framer-motion'
import Quarter from '../Quarter'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

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
