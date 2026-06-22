'use client'
import { useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

const TARGET = 18.75 // seeded payout for the cinematic

export default function WinningsBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 5, count)
  const amount = useTransform(p, [0, 1], [0.25, TARGET])
  const [shown, setShown] = useState(reduced ? TARGET : 0.25)
  useMotionValueEvent(amount, 'change', (v) => setShown(v))

  return (
    <section className={styles.beat} aria-label="The winnings">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>This is how far a quarter can go.</h2>
        <p className={styles.payout}>${(reduced ? TARGET : shown).toFixed(2)}</p>
      </div>
    </section>
  )
}
