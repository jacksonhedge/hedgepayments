import type { MotionValue } from 'framer-motion'

export interface BeatProps {
  progress: MotionValue<number>
  count: number
  reduced: boolean
}

