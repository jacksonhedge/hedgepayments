'use client'

import { useState } from 'react'
import Script from 'next/script'

// FantasyLink is a standalone service (its own server/Supabase project), not
// part of this Next app — the widget is loaded the same way Stripe.js or the
// real Plaid Link SDK is: a <script src> pointed at the provider's own host.
const FANTASYLINK_ORIGIN = process.env.NEXT_PUBLIC_FANTASYLINK_ORIGIN || 'http://localhost:4100'
const FANTASYLINK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_FANTASYLINK_PUBLISHABLE_KEY ||
  'pk_live_fb6e15f99ac3b47e81f5d80598cde4cbe0c5ec591e37e4fb'

type FantasyLinkResult = {
  provider: string
  account: { displayName: string; avatarUrl: string | null }
  league: { name: string; season: string; totalRosters: number; scoringType: string | null }
  roster: {
    wins: number
    losses: number
    ties: number
    pointsFor: number
    slots: Array<{
      isStarter: boolean
      player: { fullName: string; position: string | null; team: string | null; headshotUrl: string | null }
    }>
  } | null
}

declare global {
  interface Window {
    FantasyLink?: {
      open: (options: {
        publishableKey: string
        onSuccess?: (data: FantasyLinkResult) => void
        onExit?: () => void
      }) => { close: () => void }
    }
  }
}

const PROVIDERS = [
  { key: 'sleeper', name: 'Sleeper', status: 'Live', logo: '/logos/sleeper.jpg' },
  { key: 'espn', name: 'ESPN', status: 'Live', logo: '/logos/espn.png' },
  { key: 'yahoo', name: 'Yahoo', status: 'Coming soon', logo: '/logos/yahoo.png' },
]

const EMBED_SNIPPET = `<script src="${FANTASYLINK_ORIGIN}/sdk/fantasylink.js"></script>
<script>
  FantasyLink.open({
    publishableKey: 'pk_live_...',
    onSuccess: (data) => {
      // { provider, account, league, roster }
    },
  });
</script>`

export default function FantasyLinkPage() {
  const [sdkReady, setSdkReady] = useState(false)
  const [result, setResult] = useState<FantasyLinkResult | null>(null)

  const openWidget = () => {
    if (!window.FantasyLink) return
    window.FantasyLink.open({
      publishableKey: FANTASYLINK_PUBLISHABLE_KEY,
      onSuccess: (data) => setResult(data),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src={`${FANTASYLINK_ORIGIN}/sdk/fantasylink.js`} onReady={() => setSdkReady(true)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold tracking-wide uppercase mb-6">
            Hedge Solutions
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${FANTASYLINK_ORIGIN}/logos/fantasylink.png`}
            alt=""
            className="h-14 w-auto mx-auto mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">FantasyLink</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Plaid, but for fantasy football. One connect flow for Sleeper, ESPN, and Yahoo —
            leagues, rosters, and members, dropped into any product with a few lines of code.
          </p>
          <button
            onClick={openWidget}
            disabled={!sdkReady}
            className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-semibold text-base hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sdkReady ? 'Connect a fantasy account' : 'Loading widget…'}
          </button>
        </div>
      </section>

      {/* Providers */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">One integration, every platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PROVIDERS.map((p) => (
            <div key={p.key} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${FANTASYLINK_ORIGIN}${p.logo}`}
                alt=""
                className="w-11 h-11 rounded-xl object-contain bg-white"
              />
              <div>
                <div className="font-semibold text-gray-900">{p.name}</div>
                <div className={`text-xs ${p.status === 'Live' ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>
                  {p.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live result */}
      {result && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              {result.account.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.account.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
              )}
              <div>
                <div className="font-semibold text-gray-900">{result.account.displayName}</div>
                <div className="text-xs text-gray-500">Connected via {result.provider}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="font-semibold text-gray-900">{result.league.name}</div>
              <div className="text-xs text-gray-500 mb-4">
                {result.league.season} · {result.league.totalRosters} teams · {result.league.scoringType}
              </div>
              {result.roster && (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    {result.roster.wins}-{result.roster.losses}
                    {result.roster.ties ? `-${result.roster.ties}` : ''} · {result.roster.pointsFor.toFixed(1)} pts
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {result.roster.slots
                      .sort((a, b) => Number(b.isStarter) - Number(a.isStarter))
                      .map((s, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 border rounded-lg px-2 py-1.5 ${
                            s.isStarter ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 opacity-60'
                          }`}
                        >
                          {s.player.headshotUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.player.headshotUrl} alt="" className="w-7 h-7 rounded-full bg-gray-100" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-900 truncate">{s.player.fullName}</div>
                            <div className="text-[10px] text-gray-500">
                              {s.player.position}
                              {s.player.team ? ` · ${s.player.team}` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Developer snippet */}
      <section className="bg-gray-900 text-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-2">Drop it into your product</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Same pattern as Plaid Link — a script tag and a publishable key. No SDK install, no
            backend proxy required for the widget itself.
          </p>
          <pre className="bg-black/40 border border-white/10 rounded-xl p-5 overflow-x-auto text-sm">
            <code>{EMBED_SNIPPET}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}
