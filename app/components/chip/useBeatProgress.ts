import { useTransform, type MotionValue } from 'framer-motion'

/** Pure: map global scroll fraction (0..1) to beat `index`'s local progress (0..1, clamped). */
export function beatProgress(global: number, index: number, count: number): number {
  const slice = 1 / count
  const local = (global - index * slice) / slice
  if (local < 0) return 0
  if (local > 1) return 1
  return local
}

/** Hook: same mapping as a MotionValue, for scroll-linked transforms. */
export function useBeatProgress(
  scrollYProgress: MotionValue<number>,
  index: number,
  count: number,
): MotionValue<number> {
  const slice = 1 / count
  return useTransform(scrollYProgress, [index * slice, (index + 1) * slice], [0, 1], {
    clamp: true,
  })
}
