'use client'

import { motion, type MotionValue } from 'framer-motion'
import styles from './chip.module.css'

type Num = number | MotionValue<number>

export interface QuarterProps {
  scale: Num
  rotate: Num
  x: Num
  y: Num
  /** 0 = silver coin, 1 = venue logo. */
  morph: Num
  variant?: 'sun' | 'silver'
}

// The morph crossfade is deterministic for tests: at >= 0.5 we are "logo".
function morphState(morph: Num): 'coin' | 'logo' {
  const v = typeof morph === 'number' ? morph : morph.get()
  return v >= 0.5 ? 'logo' : 'coin'
}

export default function Quarter({ scale, rotate, x, y, morph, variant = 'silver' }: QuarterProps) {
  return (
    <motion.div
      data-testid="quarter"
      data-morph-state={morphState(morph)}
      className={`${styles.quarter} ${variant === 'sun' ? styles.quarterSun : ''}`}
      style={{ scale, rotate, x, y }}
      aria-label="A US quarter"
      role="img"
    >
      {/* Coin face — reuses the /chance silver-coin look; ridged edge via CSS. */}
      <motion.div className={styles.coinFace} style={{ opacity: typeof morph === 'number' ? 1 - morph : undefined }}>
        <span className={styles.coinDenom}>25¢</span>
      </motion.div>
      {/* Venue logo crossfade (Polymarket → Kalshi handled by parent swapping children later). */}
      <motion.div className={styles.coinLogo} style={{ opacity: morph }} aria-hidden>
        <span className={styles.coinLogoText}>position</span>
      </motion.div>
    </motion.div>
  )
}
