'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Hedge Research — sportsbook, casino & fintech product research, run by a
// panel of real, vetted testers on real money across live operators.
// Structure mirrors a classic research-services page: hero → about → panel →
// services → inquiry form.

const CLIENTS = ['SideBet', 'Chance™', 'FantasyLink', 'CoverPay', 'FraternityBase', 'Street Corner Casino']

const STATS = [
  { value: '250+', label: 'Vetted testers' },
  { value: '40+', label: 'Operators covered' },
  { value: '12', label: 'States licensed' },
  { value: '1,800+', label: 'Journeys recorded' },
]

const TESTER_SEGMENTS = [
  {
    name: 'Sharp bettors',
    desc: 'High-volume, multi-book users who notice limit changes, odds lag and cash-out friction before anyone else.',
  },
  {
    name: 'Casual & first-time',
    desc: 'New-to-market users who surface onboarding, KYC and deposit drop-off exactly where it happens.',
  },
  {
    name: 'College-age (21+)',
    desc: 'Drawn from the FraternityBase network — the cohort every operator is trying to acquire and retain.',
  },
  {
    name: 'Payments-savvy',
    desc: 'Testers who run every rail — debit, ACH, PayPal, Venmo, crypto — and report on speed, fees and failure modes.',
  },
]

const SERVICES = [
  {
    title: 'Comprehensive Product Testing',
    desc: 'In-depth, scripted tests of your app or site against industry benchmarks — every step of the customer journey, from registration and KYC to deposit, bet placement, cash-out and withdrawal.',
    icon: (
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    title: 'Payments & Wallet Benchmarks',
    desc: 'Deposit/withdrawal speed, approval rates, fee transparency and rail coverage, measured side-by-side across competitors. Built on what we see operating Hedge rails every day.',
    icon: <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  },
  {
    title: 'Consumer & Competitive Analysis',
    desc: 'Surveys, interviews and customer-journey evaluations from our tester panel that show where you sit in the market and why users pick a competitor.',
    icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  {
    title: 'Subscription Research',
    desc: 'Monthly reports on online performance, promo effectiveness and payments UX, sourced directly from sports betting and iGaming customer data.',
    icon: <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />,
  },
]

const PROCESS = [
  { step: '01', title: 'Scope', desc: 'We agree on journeys, operators, states and tester segments.' },
  { step: '02', title: 'Recruit', desc: 'Testers are matched from the panel and verified for location and eligibility.' },
  { step: '03', title: 'Test', desc: 'Real accounts, real money, screen-recorded, timestamped and scored.' },
  { step: '04', title: 'Report', desc: 'Benchmarks, findings and a prioritized fix list delivered in 2–3 weeks.' },
]

type FormState = { name: string; email: string; company: string; title: string; message: string }
const EMPTY: FormState = { name: '', email: '', company: '', title: '', message: '' }

export default function ResearchPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/research-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-6">
            Hedge Research
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Sportsbook, Casino &amp; Payments Research
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Market research, consumer insights and competitive benchmarks — delivered by a panel of real,
            vetted testers using real money on live products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition">
              Request a proposal
            </a>
            <a href="#services" className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 font-semibold transition">
              See what we test
            </a>
          </div>
        </div>
      </section>

      {/* About + stats */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real testers. Real money. Real findings.</h2>
          <p className="text-gray-600 mb-4">
            Hedge Research makes sure sportsbooks, casinos and fintech products perform the way they should. Our
            tester panel runs scripted and free-form QA across registration, KYC, deposits, wagering, cash-out and
            withdrawals — and because we operate payments rails ourselves, we know exactly where money gets stuck.
          </p>
          <p className="text-gray-600 mb-6">
            The same panel has tested and shaped every product built on Hedge rails.
          </p>
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((c) => (
              <span key={c} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tester panel */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our testers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every tester is identity-verified, 21+, located in a licensed state and paid per completed journey.
              Segments are matched to your target customer.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTER_SEGMENTS.map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-200 p-6 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-2">{t.name}</h3>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#contact" className="text-emerald-700 font-semibold hover:underline">
              Want to join the panel as a tester? Get in touch →
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Hedge Research can do for you</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-8 flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How an engagement works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS.map((p) => (
              <div key={p.step}>
                <div className="text-emerald-400 font-mono text-sm mb-2">{p.step}</div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Talk to the research team</h2>
        <p className="text-gray-600 text-center mb-10">
          Tell us what you want to learn and we&apos;ll come back with a scope and quote.
        </p>
        {status === 'sent' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
            <p className="font-semibold text-emerald-800">Thanks — we&apos;ll be in touch within one business day.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name" value={form.name} onChange={update('name')} required />
              <Field label="Work email" type="email" value={form.email} onChange={update('email')} required />
              <Field label="Company" value={form.company} onChange={update('company')} required />
              <Field label="Title" value={form.title} onChange={update('title')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={update('message')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="What product, markets and journeys do you want tested?"
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-red-600">Something went wrong — email research@hedgepayments.com instead.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold transition"
            >
              {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
          </form>
        )}
      </section>

      <Footer />
    </main>
  )
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && '*'}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  )
}
