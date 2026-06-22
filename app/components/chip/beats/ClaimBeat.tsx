'use client'

import { createElement, useEffect, useRef, useState } from 'react'
import styles from '../chip.module.css'
import type { ClaimBeatProps } from './types'

type Phase = 'play' | 'capture' | 'done'

export default function ClaimBeat({ reduced }: ClaimBeatProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('play')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load the embed exactly as a merchant would — a single <script src>. (Mirrors app/chance/page.tsx.)
  useEffect(() => {
    if (typeof customElements !== 'undefined' && customElements.get('chance-checkout')) return
    if (document.querySelector('script[data-chance-embed]')) return
    const s = document.createElement('script')
    s.src = '/embed/chance.js'
    s.async = true
    s.setAttribute('data-chance-embed', '')
    document.body.appendChild(s)
  }, [])

  // Reveal the capture card once the visitor plays.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const onResult = () => setPhase((p) => (p === 'play' ? 'capture' : p))
    host.addEventListener('chance:result', onResult as EventListener)
    return () => host.removeEventListener('chance:result', onResult as EventListener)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // /api/subscribe requires a name; derive one from the email local-part.
        body: JSON.stringify({ name: email.split('@')[0] || 'Quarter Claim', email }),
      })
      setPhase('done')
    } finally {
      setSubmitting(false)
    }
  }

  void reduced // consumed by parent scroll orchestration; not used locally

  return (
    <section id="claim" className={styles.beat} aria-label="Take your free quarter">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Take your free quarter.</h2>

        {/* The widget — tiny amount so it reads as "a quarter". */}
        <div ref={hostRef} className={styles.widgetHost}>
          {createElement('chance-checkout', { amount: '2', mode: 'flip-to-free' })}
        </div>

        {phase === 'capture' && (
          <form className={styles.captureCard} onSubmit={submit}>
            <p className={styles.captureLead}>Save your winnings — keep your quarter.</p>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.captureInput}
              aria-label="Email"
            />
            <button type="submit" disabled={submitting} className={styles.captureBtn}>
              {submitting ? 'Reserving…' : 'Reserve my quarter'}
            </button>
          </form>
        )}

        {phase === 'done' && (
          <p className={styles.reserved}>
            Your free quarter is reserved — we&apos;ll email you when it&apos;s live.
          </p>
        )}
      </div>
    </section>
  )
}
