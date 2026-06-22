'use client'
import { motion, useTransform } from 'framer-motion'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function SunBeat({ progress, reduced }: BeatProps) {
  // As you start scrolling, the big hero coin rolls from off the bottom-right to
  // top-centre (the tube entry), shrinking + fading so it "drops into" the machine.
  const x = useTransform(progress, [0, 0.12], ['33vw', '0vw'])
  const y = useTransform(progress, [0, 0.12], ['30vh', '-34vh'])
  const scale = useTransform(progress, [0, 0.12], [1, 0.16])
  const coinOpacity = useTransform(progress, [0, 0.1, 0.135], [1, 1, 0])
  const copyOpacity = useTransform(progress, [0, 0.07], [1, 0])

  return (
    <section className={styles.beat} aria-label="Fun Payments">
      {reduced ? (
        <div className={styles.heroCoinWrap} aria-hidden>
          <div className={styles.heroCoin} />
        </div>
      ) : (
        <motion.div className={styles.heroCoinWrap} style={{ x, y, scale, opacity: coinOpacity }} aria-hidden>
          <div className={styles.heroCoin} />
        </motion.div>
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
