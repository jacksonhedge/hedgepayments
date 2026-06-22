'use client'

import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from './Quarter'
import styles from './chip.module.css'

export interface TravelingQuarterProps {
  /** Global scroll progress (0..1) across all beats. */
  progress: MotionValue<number>
}

/**
 * ONE silver quarter the user follows the whole way. Driven entirely by global
 * scroll, it: enters from below the fold → settles as the hero → scales up to
 * "peak grandeur" → rolls toward the deposit slot → rides above the markets /
 * tables / winnings → and is finally presented as the free quarter. It is a
 * single fixed element so the visitor tracks the same coin end to end.
 *
 * Stops below are global scroll fractions (0..1) across the six sticky beats:
 * Sun ~0–.17 · Deposit ~.17–.33 · Morph ~.33–.50 · Conveyor ~.50–.67 ·
 * Winnings ~.67–.83 · Claim ~.83–1.
 */
export default function TravelingQuarter({ progress }: TravelingQuarterProps) {
  const STOPS = [0, 0.05, 0.12, 0.16, 0.22, 0.3, 0.42, 0.62, 0.8, 1]

  // Settle as hero (scale 1) → fill the screen (3.2) → shrink to roll/deposit →
  // small while riding above the later beats → present near full size at the end.
  const scale = useTransform(progress, STOPS, [0.85, 1, 1, 3.2, 1, 0.8, 0.55, 0.55, 0.8, 0.8])

  // Starts well below the fold (54vh), settles low-centre under the headline (9vh),
  // centres to fill (0), then lifts into the upper-mid to ride above later content.
  const y = useTransform(progress, STOPS, [
    '54vh', '9vh', '9vh', '0vh', '4vh', '0vh', '-20vh', '-20vh', '-30vh', '-30vh',
  ])

  // A small lateral roll toward the deposit slot, then back to centre.
  const x = useTransform(progress, [0, 0.16, 0.22, 0.3, 1], ['0px', '0px', '-150px', '0px', '0px'])

  // A vigorous roll into the deposit slot, then it settles near-upright for the rest
  // of the journey (so it doesn't read as spinning upside-down while it rides along).
  const rotate = useTransform(progress, [0, 0.05, 0.22, 0.3, 1], [-30, 0, 320, 360, 372])

  // Stays a coin throughout — the copy carries "becomes a real position", not a logo swap.
  const morph = useTransform(progress, [0, 1], [0, 0])

  return (
    <div className={styles.travelLayer} aria-hidden>
      <Quarter scale={scale} rotate={rotate} x={x} y={y} morph={morph} variant="silver" />
    </div>
  )
}
