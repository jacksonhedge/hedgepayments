'use client'
import { useEffect, type RefObject } from 'react'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

/** Tracks the pointer over a glass element and writes its position to
 *  --gx/--gy (percent) so the specular sheen follows the cursor. No-op under
 *  reduced motion or when the ref is empty. */
export function useGlassPointer(ref: RefObject<HTMLElement>) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      el.style.setProperty('--gx', `${x.toFixed(1)}%`)
      el.style.setProperty('--gy', `${y.toFixed(1)}%`)
    }
    const onLeave = () => {
      el.style.setProperty('--gx', '50%')
      el.style.setProperty('--gy', '0%')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, reduced])
}
