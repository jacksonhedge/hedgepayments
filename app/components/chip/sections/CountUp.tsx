'use client'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

interface Props { to: number; prefix?: string; suffix?: string; decimals?: number; durationMs?: number }

function format(n: number, decimals: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function CountUp({ to, prefix = '', suffix = '', decimals = 0, durationMs = 1400 }: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  // Start AT the final value so SSR / reduced-motion / jsdom show the real number;
  // only animate from 0 once we know we're in a real browser AND in view.
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return
    let raf = 0
    let started = false
    const run = (start: number) => {
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / durationMs)
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(to * eased)
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true
        setValue(0)
        requestAnimationFrame((t) => run(t))
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, durationMs, reduced])

  return <span ref={ref}>{prefix}{format(value, decimals)}{suffix}</span>
}
