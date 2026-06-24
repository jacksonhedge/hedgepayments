'use client'
import { motion, useTransform } from 'framer-motion'
import styles from '../chip.module.css'
import type { BeatProps } from './types'
import AudienceButtons from '../hero/AudienceButtons'

export default function SunBeat({ progress, reduced }: BeatProps) {
  // As you start scrolling, the big hero coin rolls from off the bottom-right to
  // top-centre (the tube entry), shrinking + fading so it "drops into" the machine.
  // Coin reaches centre + near-zero scale at 0.12, then coinOpacity fades it out
  // by 0.13 — tube's centred coin takes over with no double-coin window.
  const x = useTransform(progress, [0, 0.12], ['33vw', '0vw'])
  const y = useTransform(progress, [0, 0.12], ['30vh', '0vh'])
  const scale = useTransform(progress, [0, 0.12], [1, 0.08])
  const coinOpacity = useTransform(progress, [0, 0.11, 0.13], [1, 1, 0])
  const copyOpacity = useTransform(progress, [0, 0.14, 0.18], [1, 1, 0])

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
        <AudienceButtons />
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </motion.div>
    </section>
  )
}
