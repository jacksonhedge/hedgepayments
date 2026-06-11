'use client'

import React, { useState } from 'react'
import styles from './book.module.css'

// Paste your Calendly (or Cal.com) link here to switch the page from
// lead-form mode to live scheduling. Example: 'https://calendly.com/hedge-sales/30min'
const SCHEDULER_URL = ''

const SALES_EMAIL = 'info@hedgepayments.com'

const INTERESTS = [
  'White-label payments (the rails)',
  'Chance™ at checkout',
  'SideBet for sportsbooks',
  'Something else',
]

export default function BookPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [interest, setInterest] = useState(INTERESTS[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle')

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Sales call — ${company || name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nInterested in: ${interest}\n\n${message}`,
    )
    return `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, company, interest, message }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('fallback')
      }
    } catch {
      setStatus('fallback')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <a href="/" className={styles.back}>‹ hedgepayments.com</a>

        <div className={styles.head}>
          <span className={styles.kicker}>★ PLAYER 2 JOINING ★</span>
          <h1 className={styles.h1}>
            Book a demo<span className={styles.cursor}>_</span>
          </h1>
          <p className={styles.lede}>
            See the rails live — white-label wallets, ledger, payouts, and the
            Chance™ checkout. 30 minutes, no deck-reading, real product.
          </p>
        </div>

        {SCHEDULER_URL ? (
          <div className={styles.schedWrap}>
            <iframe
              src={SCHEDULER_URL}
              className={styles.sched}
              title="Schedule a call"
            />
            <p className={styles.alt}>
              Scheduler not loading? Email{' '}
              <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
            </p>
          </div>
        ) : status === 'sent' ? (
          <div className={styles.done}>
            <div className={styles.doneBadge}>✦</div>
            <h2>You&apos;re on the board.</h2>
            <p>
              We&apos;ll reply within one business day to lock a time. Want it
              faster? <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span>Name *</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                />
              </label>
              <label className={styles.field}>
                <span>Work email *</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ada@company.com"
                />
              </label>
            </div>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span>Company</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company, Inc."
                />
              </label>
              <label className={styles.field}>
                <span>Interested in</span>
                <select value={interest} onChange={(e) => setInterest(e.target.value)}>
                  {INTERESTS.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className={styles.field}>
              <span>What are you building?</span>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A sportsbook, a storefront, a wallet app…"
              />
            </label>

            {status === 'fallback' && (
              <p className={styles.err}>
                Hmm — our lead box is offline. Your note is ready to send by email
                instead: <a href={mailtoHref()}>open prefilled email →</a>
              </p>
            )}

            <button className={styles.cta} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request a time →'}
            </button>
            <p className={styles.alt}>
              Prefer email? <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
