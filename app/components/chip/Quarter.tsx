'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import styles from './chip.module.css'

type Num = number | MotionValue<number>
// Translate props may carry CSS units (px/vh), so they also accept string motion values.
type Len = number | string | MotionValue<number> | MotionValue<string>

export interface QuarterProps {
  scale: Num
  rotate: Num
  x: Len
  y: Len
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
  // Always create a fallback MotionValue (rules-of-hooks: unconditional).
  const fallback = useMotionValue(typeof morph === 'number' ? morph : 0)

  // Keep fallback synced when morph is a plain number (static / reduced-motion).
  useEffect(() => {
    if (typeof morph === 'number') fallback.set(morph)
  }, [morph, fallback])

  // Select which MotionValue drives the crossfade — not a conditional hook call.
  const morphMV = typeof morph === 'number' ? fallback : morph

  // Coin face fades OUT as morph goes 0→1; logo fades IN.
  const coinOpacity = useTransform(morphMV, (v) => 1 - v)

  return (
    <motion.div
      data-testid="quarter"
      data-morph-state={morphState(morph)}
      className={[styles.quarter, variant === 'sun' ? styles.quarterSun : ''].filter(Boolean).join(' ')}
      style={{ scale, rotate, x, y }}
      aria-label="A US quarter"
      role="img"
    >
      {/* Coin face — reuses the /chance silver-coin look; ridged edge via CSS. */}
      <motion.div className={styles.coinFace} style={{ opacity: coinOpacity }}>
        <span className={styles.coinDenom}>25¢</span>
      </motion.div>
      {/* Venue logo crossfade (Polymarket → Kalshi handled by parent swapping children later). */}
      <motion.div className={styles.coinLogo} style={{ opacity: morphMV }} aria-hidden>
        <span className={styles.coinLogoText}>position</span>
      </motion.div>
    </motion.div>
  )
}
