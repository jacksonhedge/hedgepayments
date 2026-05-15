'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CodeBlock, Callout, StepList, FlowDiagram, NavCards } from '../components'

type Strategy = 'nearest-dollar' | 'nearest-5' | 'percentage' | 'fixed-amount' | 'dynamic'

function calculateRoundUp(
  betCents: number,
  strategy: Strategy,
  percentage: number,
  fixedCents: number,
  multiplier: number
): number {
  if (betCents <= 0) return 0

  switch (strategy) {
    case 'nearest-dollar': {
      const remainder = betCents % 100
      return remainder === 0 ? 0 : 100 - remainder
    }
    case 'nearest-5': {
      const remainder = betCents % 500
      return remainder === 0 ? 0 : 500 - remainder
    }
    case 'percentage': {
      return Math.round(betCents * (percentage / 100))
    }
    case 'fixed-amount': {
      return fixedCents
    }
    case 'dynamic': {
      const remainder = betCents % 100
      const base = remainder === 0 ? 0 : 100 - remainder
      return Math.round(base * multiplier)
    }
    default:
      return 0
  }
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function RoundUpCalculator() {
  const [betInput, setBetInput] = useState('23.47')
  const [strategy, setStrategy] = useState<Strategy>('nearest-dollar')
  const [percentage, setPercentage] = useState(5)
  const [fixedCents, setFixedCents] = useState(100)
  const [multiplier, setMultiplier] = useState(3)
  const [animating, setAnimating] = useState(false)

  const PER_TX_MAX = 1000 // $10.00
  const DAILY_MAX = 5000  // $50.00

  const betCents = Math.round(parseFloat(betInput || '0') * 100)
  const rawRoundUp = calculateRoundUp(betCents, strategy, percentage, fixedCents, multiplier)
  const isCappedPerTx = rawRoundUp > PER_TX_MAX
  const roundUpCents = Math.min(rawRoundUp, PER_TX_MAX)
  const totalDebit = betCents + roundUpCents

  const triggerAnimation = useCallback(() => {
    setAnimating(true)
    const timeout = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    triggerAnimation()
  }, [betInput, strategy, percentage, fixedCents, multiplier, triggerAnimation])

  const strategies: { value: Strategy; label: string; description: string }[] = [
    { value: 'nearest-dollar', label: 'Nearest Dollar', description: 'Round to next $1' },
    { value: 'nearest-5', label: 'Nearest $5', description: 'Round to next $5' },
    { value: 'percentage', label: 'Percentage', description: `${percentage}% of bet` },
    { value: 'fixed-amount', label: 'Fixed Amount', description: `${formatCents(fixedCents)} per tx` },
    { value: 'dynamic', label: 'Dynamic', description: `${multiplier}x natural round-up` },
  ]

  return (
    <div className="my-8 rounded-xl border border-[#D4C5B0] bg-white shadow-[0_1px_3px_rgba(44,36,22,0.06),0_8px_24px_rgba(44,36,22,0.04)] overflow-hidden" role="region" aria-label="Interactive round-up calculator">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#D4C5B0] bg-[#FAF8F5]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8l-8 8M8 8l8 8" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
              Round-Up Calculator
            </h3>
            <p className="text-xs text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>
              Try different strategies and see the result in real time
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Inputs */}
          <div className="space-y-6">
            {/* Bet Amount Input */}
            <div>
              <label
                className="block text-sm font-semibold text-[#2C2416] mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Bet Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7E6E] text-lg font-medium">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={betInput}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
                      setBetInput(val)
                    }
                  }}
                  className="w-full pl-8 pr-4 py-3 text-lg font-mono text-[#2C2416] bg-[#FAF8F5] border border-[#D4C5B0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Strategy Selection */}
            <div>
              <label
                className="block text-sm font-semibold text-[#2C2416] mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Strategy
              </label>
              <div className="space-y-2">
                {strategies.map((s) => (
                  <label
                    key={s.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 focus-within:ring-2 focus-within:ring-[#4CAF50]/40 ${
                      strategy === s.value
                        ? 'border-[#4CAF50] bg-[#4CAF50]/[0.04] shadow-[0_0_0_1px_rgba(76,175,80,0.2)]'
                        : 'border-[#D4C5B0] bg-white hover:border-[#8B7E6E]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      strategy === s.value ? 'border-[#4CAF50]' : 'border-[#D4C5B0]'
                    }`}>
                      {strategy === s.value && (
                        <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-[#2C2416] font-mono">{s.label}</span>
                      <span className="text-xs text-[#8B7E6E] ml-2">{s.description}</span>
                    </div>
                    <input
                      type="radio"
                      name="strategy"
                      value={s.value}
                      checked={strategy === s.value}
                      onChange={() => setStrategy(s.value)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Strategy-specific controls */}
            {strategy === 'percentage' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#D4C5B0] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                    Percentage
                  </label>
                  <span className="text-sm font-mono font-semibold text-[#4CAF50]">{percentage}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#D4C5B0] rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                  aria-label={`Percentage: ${percentage}%`}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={percentage}
                  aria-valuetext={`${percentage} percent`}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#8B7E6E] font-mono">1%</span>
                  <span className="text-[10px] text-[#8B7E6E] font-mono">10%</span>
                </div>
              </div>
            )}

            {strategy === 'fixed-amount' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#D4C5B0] rounded-lg">
                <label className="block text-sm font-medium text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Fixed Amount (cents)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={fixedCents}
                    onChange={(e) => setFixedCents(Math.max(1, Math.min(1000, Number(e.target.value))))}
                    className="w-full px-3 py-2 text-sm font-mono text-[#2C2416] bg-white border border-[#D4C5B0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B7E6E]">
                    = {formatCents(fixedCents)}
                  </span>
                </div>
              </div>
            )}

            {strategy === 'dynamic' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#D4C5B0] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                    Multiplier
                  </label>
                  <span className="text-sm font-mono font-semibold text-[#4CAF50]">{multiplier}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#D4C5B0] rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                  aria-label={`Multiplier: ${multiplier}x`}
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-valuenow={multiplier}
                  aria-valuetext={`${multiplier} times multiplier`}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#8B7E6E] font-mono">1x</span>
                  <span className="text-[10px] text-[#8B7E6E] font-mono">5x</span>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Result */}
          <div className="flex flex-col justify-center">
            <div
              className={`p-6 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#F0EDE8] border border-[#D4C5B0] transition-all duration-300 ${
                animating ? 'scale-[1.01]' : 'scale-100'
              }`}
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Bet amount</span>
                  <span className="text-lg font-mono font-medium text-[#2C2416]">{formatCents(betCents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Round-up</span>
                  <div className="flex items-center gap-2">
                    {isCappedPerTx && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/30">
                        CAPPED
                      </span>
                    )}
                    <span className={`text-lg font-mono font-semibold transition-all duration-300 ${
                      animating ? 'text-[#4CAF50] scale-105' : 'text-[#4CAF50]'
                    }`}>
                      +{formatCents(roundUpCents)}
                    </span>
                  </div>
                </div>
                {isCappedPerTx && (
                  <div className="text-[11px] text-[#B45309] bg-[#F59E0B]/[0.06] border border-[#F59E0B]/20 rounded-md px-3 py-2 font-mono">
                    Raw: {formatCents(rawRoundUp)} &rarr; Capped to per-tx max of {formatCents(PER_TX_MAX)}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-[#D4C5B0] my-4" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Total debit</span>
                <span className={`text-2xl font-mono font-bold text-[#2C2416] transition-all duration-300 ${
                  animating ? 'scale-105' : 'scale-100'
                }`}>
                  {formatCents(totalDebit)}
                </span>
              </div>

              {/* Summary line */}
              <div className="mt-4 p-3 bg-white/80 rounded-lg border border-[#D4C5B0]/60">
                <p className="text-xs text-[#6B5D4F] font-mono text-center leading-relaxed">
                  Bet: <strong className="text-[#2C2416]">{formatCents(betCents)}</strong>
                  {' '}&rarr; Round-up: <strong className="text-[#4CAF50]">{formatCents(roundUpCents)}</strong>
                  {' '}&rarr; Total: <strong className="text-[#2C2416]">{formatCents(totalDebit)}</strong>
                </p>
              </div>

              {/* Daily cap note */}
              <p className="text-[10px] text-[#8B7E6E] mt-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>
                Daily maximum: {formatCents(DAILY_MAX)} per consumer across all transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const howItWorksSteps = [
  {
    title: 'Consumer places a bet',
    description: 'A $23.47 bet is placed on your sportsbook platform. Your backend sends the bet data to SideBet via a single API call.',
  },
  {
    title: 'Round-up calculated',
    description: 'SideBet calculates the round-up based on your configured strategy (e.g., $0.53 to the nearest dollar). Caps are enforced automatically.',
    highlight: true,
  },
  {
    title: 'ACH micro-debit initiated',
    description: 'The round-up amount is debited from the consumer\'s linked bank account via ACH. SideBet handles origination, retries, and error handling.',
  },
  {
    title: 'Funds settled to merchant',
    description: 'Funds settle to your merchant account in USDC (instant) or USD (3 business days). You receive webhooks as the payment moves through the pipeline.',
  },
]

const navCards = [
  {
    title: 'Quickstart Guide',
    description: 'Go from zero to your first round-up in under 10 minutes',
    href: '/docs/sidebet/quickstart',
  },
  {
    title: 'API Reference',
    description: 'Complete endpoint documentation with request/response schemas',
    href: '/docs/sidebet/api-reference',
  },
  {
    title: 'Webhooks',
    description: 'Handle ACH lifecycle events and settlement notifications',
    href: '/docs/sidebet/webhooks',
  },
  {
    title: 'ACH Payments',
    description: 'Learn about the underlying ACH infrastructure powering SideBet',
    href: '/docs/checkout/ach',
  },
]

const requestCode = `curl -X POST https://api.hedgepayments.com/api/roundup/initiate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "betAmount": 2347,
    "consumerId": "user_abc123",
    "strategy": "nearest-dollar",
    "merchantId": "merch_xyz789"
  }'`

const responseCode = `{
  "id": "roundup_9f8e7d6c",
  "roundUpCents": 53,
  "betAmountCents": 2347,
  "status": "pending",
  "skipped": false,
  "consumerId": "user_abc123",
  "merchantId": "merch_xyz789"
}`

export default function SideBetOverviewPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header with Breadcrumb */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416] transition-colors">Docs</Link>
          <span>/</span>
          <span>SideBet</span>
          <span>/</span>
          <span>Overview</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          SideBet
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Round-ups-as-a-service for sportsbooks and gaming platforms
        </p>
      </div>

      {/* What is SideBet */}
      <Callout variant="success" title="What is SideBet?">
        <p>
          SideBet is a B2B round-up-as-a-service API. Sportsbooks and gaming platforms like FanDuel,
          DraftKings, and Betr integrate SideBet to automatically round up consumer bets and sweep
          the spare change via ACH micro-debits. It turns every wager into a micro-savings event
          — consumers build balances effortlessly, and merchants drive engagement and retention.
        </p>
      </Callout>

      {/* How It Works */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          How It Works
        </h2>
        <p className="text-[#6B5D4F] text-base leading-relaxed mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          The integration flow is straightforward. Your platform sends bet data, and SideBet handles the rest:
        </p>
        <StepList steps={howItWorksSteps} />
      </div>

      {/* Interactive Round-Up Calculator */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-2"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Round-Up Calculator
        </h2>
        <p className="text-[#6B5D4F] text-base leading-relaxed mb-0" style={{ fontFamily: 'Georgia, serif' }}>
          Experiment with different strategies and amounts to see how round-ups are calculated.
        </p>
        <RoundUpCalculator />
      </div>

      {/* Round-Up Strategies Table */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Round-Up Strategies
        </h2>
        <p className="text-[#6B5D4F] text-base leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          SideBet supports five configurable strategies. Each merchant selects a strategy that applies to all their consumers:
        </p>
        <div className="overflow-x-auto mb-6 not-prose">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Strategy</th>
                <th className="py-3 px-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
                <th className="py-3 pl-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Example ($23.47 bet)</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm text-[#2C2416]">nearest-dollar</td>
                <td className="py-3 px-4 text-sm">Round up to the next whole dollar</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50] font-mono text-sm">$0.53</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm text-[#2C2416]">nearest-5</td>
                <td className="py-3 px-4 text-sm">Round up to the next $5 increment</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50] font-mono text-sm">$1.53</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm text-[#2C2416]">percentage</td>
                <td className="py-3 px-4 text-sm">Add a percentage (1-10%) of the bet amount</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50] font-mono text-sm">$1.17 (at 5%)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm text-[#2C2416]">fixed-amount</td>
                <td className="py-3 px-4 text-sm">Add a fixed dollar amount per transaction</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50] font-mono text-sm">$1.00 (if fixed = 100)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm text-[#2C2416]">dynamic</td>
                <td className="py-3 px-4 text-sm">Multiply the natural round-up by a configurable factor</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50] font-mono text-sm">$1.59 (at 3x)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Caps & Limits */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Caps & Limits
        </h2>
        <p className="text-[#6B5D4F] text-base leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Consumer protection is built in. Merchants configure caps to prevent excessive charges:
        </p>
        <div className="space-y-4 mb-6 not-prose">
          <div className="p-5 bg-white border border-[#D4C5B0] rounded-lg">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                Per-Transaction Maximum
              </p>
            </div>
            <p className="text-sm text-[#6B5D4F] ml-9" style={{ fontFamily: 'Georgia, serif' }}>
              Maximum round-up for any single transaction. If the calculated round-up exceeds this value, it is capped. Default: <strong className="text-[#2C2416]">$10.00</strong>. Configurable per merchant.
            </p>
          </div>
          <div className="p-5 bg-white border border-[#D4C5B0] rounded-lg">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                Daily Maximum
              </p>
            </div>
            <p className="text-sm text-[#6B5D4F] ml-9" style={{ fontFamily: 'Georgia, serif' }}>
              Maximum total round-ups per consumer per calendar day. Once hit, subsequent transactions are skipped. Default: <strong className="text-[#2C2416]">$50.00</strong>. Configurable per merchant.
            </p>
          </div>
        </div>
        <Callout variant="warning" title="Daily cap behavior">
          <p>
            When a consumer hits their daily cap, the API returns <code className="text-xs bg-[#F59E0B]/10 px-1.5 py-0.5 rounded font-mono">{'{ "skipped": true }'}</code> and
            no ACH debit is initiated. Your UI should handle this gracefully.
          </p>
        </Callout>
      </div>

      {/* Settlement */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Settlement
        </h2>
        <div className="overflow-x-auto mb-6 not-prose">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 px-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Speed</th>
                <th className="py-3 pl-4 text-[#2C2416] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Details</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50 bg-[#4CAF50]/[0.03]">
                <td className="py-3.5 pr-4 font-semibold text-[#2C2416] text-sm">USDC</td>
                <td className="py-3.5 px-4 font-semibold text-[#4CAF50] text-sm">Instant</td>
                <td className="py-3.5 pl-4 text-sm">Settled to merchant&apos;s USDC wallet on-chain as soon as the ACH clears</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-[#2C2416] text-sm">USD</td>
                <td className="py-3.5 px-4 text-sm">3 business days</td>
                <td className="py-3.5 pl-4 text-sm">Standard ACH settlement to merchant&apos;s bank account</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ACH Flow Diagram */}
        <FlowDiagram />
      </div>

      {/* Quick Integration */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Quick Integration
        </h2>
        <p className="text-[#6B5D4F] text-base leading-relaxed mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Initiate a round-up with a single API call. SideBet calculates the amount, debits the consumer, and settles to you:
        </p>

        <CodeBlock
          code={requestCode}
          language="bash"
          title="Initiate a round-up"
        />

        <CodeBlock
          code={responseCode}
          language="json"
          title="Response"
        />

        <Callout variant="success" title="That's it.">
          <p>
            One POST request per bet. SideBet handles the round-up calculation, ACH origination,
            retries, and settlement. You receive webhooks as the payment moves through the pipeline.
          </p>
        </Callout>
      </div>

      {/* Explore the Docs */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Explore the Docs
        </h2>
        <NavCards cards={navCards} />
      </div>
    </div>
  )
}
