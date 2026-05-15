'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProviderConfig {
  id: string
  name: string
  logo: string
  type: 'payment' | 'banking'
  color: string
  keys: { label: string; placeholder: string; value: string }[]
  connected: boolean
}

const INITIAL_PROVIDERS: ProviderConfig[] = [
  {
    id: 'coinflow',
    name: 'CoinFlow',
    logo: '/images/sidebet-icon.svg',
    type: 'payment',
    color: '#6366f1',
    keys: [
      { label: 'Merchant ID', placeholder: 'cf_merchant_...', value: '' },
      { label: 'API Key', placeholder: 'cf_live_...', value: '' },
    ],
    connected: false,
  },
  {
    id: 'paynearme',
    name: 'PayNearMe',
    logo: '/images/sidebet-icon.svg',
    type: 'payment',
    color: '#10b981',
    keys: [
      { label: 'Site ID', placeholder: 'pnm_site_...', value: '' },
      { label: 'Auth Token', placeholder: 'pnm_auth_...', value: '' },
    ],
    connected: false,
  },
  {
    id: 'paysafe',
    name: 'Paysafe',
    logo: '/images/sidebet-icon.svg',
    type: 'payment',
    color: '#3b82f6',
    keys: [
      { label: 'Account ID', placeholder: 'ps_acct_...', value: '' },
      { label: 'API Key', placeholder: 'ps_key_...', value: '' },
    ],
    connected: false,
  },
  {
    id: 'plaid',
    name: 'Plaid',
    logo: '/images/sidebet-icon.svg',
    type: 'banking',
    color: '#000000',
    keys: [
      { label: 'Client ID', placeholder: 'plaid_client_...', value: '' },
      { label: 'Secret', placeholder: 'plaid_secret_...', value: '' },
    ],
    connected: false,
  },
  {
    id: 'ach',
    name: 'ACH Direct',
    logo: '/images/sidebet-icon.svg',
    type: 'banking',
    color: '#059669',
    keys: [
      { label: 'Routing Key', placeholder: 'ach_route_...', value: '' },
      { label: 'API Secret', placeholder: 'ach_secret_...', value: '' },
    ],
    connected: false,
  },
]

function ConnectionLine({ from, to, active, animated }: { from: string; to: string; active: boolean; animated: boolean }) {
  return (
    <div className={`absolute h-[2px] transition-all duration-700 ${active ? 'opacity-100' : 'opacity-20'}`}
      style={{
        background: active
          ? 'linear-gradient(90deg, #6366f1, #a855f7, #6366f1)'
          : '#475569',
        backgroundSize: '200% 100%',
        animation: animated ? 'flowPulse 2s linear infinite' : 'none',
      }}
    />
  )
}

export default function ProphetDemo() {
  const [providers, setProviders] = useState<ProviderConfig[]>(INITIAL_PROVIDERS)
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [prophetActive, setProphetActive] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [processingFlow, setProcessingFlow] = useState(false)
  const [flowStep, setFlowStep] = useState<number>(0)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const paymentProviders = providers.filter(p => p.type === 'payment')
  const bankingProviders = providers.filter(p => p.type === 'banking')
  const connectedCount = providers.filter(p => p.connected).length

  const handleKeyChange = (providerId: string, keyIndex: number, value: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId
        ? { ...p, keys: p.keys.map((k, i) => i === keyIndex ? { ...k, value } : k) }
        : p
    ))
  }

  const handleConnect = (providerId: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, connected: true } : p
    ))
    setExpandedProvider(null)

    // Activate Prophet when at least one of each type is connected
    const updated = providers.map(p => p.id === providerId ? { ...p, connected: true } : p)
    const hasPayment = updated.some(p => p.type === 'payment' && p.connected)
    const hasBanking = updated.some(p => p.type === 'banking' && p.connected)
    if (hasPayment && hasBanking) {
      setProphetActive(true)
    }
  }

  const handleDisconnect = (providerId: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, connected: false, keys: p.keys.map(k => ({ ...k, value: '' })) } : p
    ))
    const updated = providers.map(p => p.id === providerId ? { ...p, connected: false } : p)
    const hasPayment = updated.some(p => p.type === 'payment' && p.connected)
    const hasBanking = updated.some(p => p.type === 'banking' && p.connected)
    if (!hasPayment || !hasBanking) {
      setProphetActive(false)
    }
  }

  const simulatePaymentFlow = async () => {
    if (!prophetActive || processingFlow) return
    setProcessingFlow(true)

    // Step 1: Select optimal route
    setFlowStep(1)
    const connectedPayments = providers.filter(p => p.type === 'payment' && p.connected)
    const chosen = connectedPayments[Math.floor(Math.random() * connectedPayments.length)]
    await new Promise(r => setTimeout(r, 800))

    // Step 2: Prophet processes
    setFlowStep(2)
    setSelectedRoute(chosen.id)
    await new Promise(r => setTimeout(r, 1200))

    // Step 3: Settle to wallet
    setFlowStep(3)
    await new Promise(r => setTimeout(r, 800))

    // Step 4: Complete
    setFlowStep(4)
    const amount = Math.round((Math.random() * 45 + 5) * 100) / 100
    setWalletBalance(prev => Math.round((prev + amount) * 100) / 100)
    await new Promise(r => setTimeout(r, 1500))

    setFlowStep(0)
    setProcessingFlow(false)
    setSelectedRoute(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      <style jsx global>{`
        @keyframes flowPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6), 0 0 60px rgba(168, 85, 247, 0.3); }
        }
        @keyframes prophetSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dotTravel {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes walletPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {prophetActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a1a]" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Prophet</h1>
              <p className="text-xs text-gray-500">Payment Orchestration Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{connectedCount}/{providers.length} providers</span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              prophetActive
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
            }`}>
              {prophetActive ? 'Engine Active' : 'Awaiting Connections'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Flow Visualization */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 items-start mb-8">

          {/* LEFT: Provider Nodes */}
          <div className="space-y-3">
            {/* Payment Providers Section */}
            <div className="mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-3 px-1">Payment Processors</h3>
              <div className="space-y-3">
                {paymentProviders.map(provider => (
                  <ProviderNode
                    key={provider.id}
                    provider={provider}
                    expanded={expandedProvider === provider.id}
                    onToggle={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                    onKeyChange={handleKeyChange}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    isActiveRoute={selectedRoute === provider.id}
                    flowStep={flowStep}
                  />
                ))}
              </div>
            </div>

            {/* Banking Providers Section */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-3 px-1">Banking & ACH</h3>
              <div className="space-y-3">
                {bankingProviders.map(provider => (
                  <ProviderNode
                    key={provider.id}
                    provider={provider}
                    expanded={expandedProvider === provider.id}
                    onToggle={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                    onKeyChange={handleKeyChange}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    isActiveRoute={false}
                    flowStep={flowStep}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Prophet Node + Connection Lines */}
          <div className="flex flex-col items-center justify-center px-4 min-h-[500px] relative">
            {/* Incoming lines */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-center gap-[60px]">
              {providers.map((p, i) => (
                <div key={p.id} className="relative h-[2px]">
                  <div
                    className={`h-full transition-all duration-500 ${p.connected ? 'opacity-100' : 'opacity-10'}`}
                    style={{
                      background: p.connected
                        ? `linear-gradient(90deg, ${p.color}40, ${p.color})`
                        : '#1e293b',
                      width: '100%',
                    }}
                  />
                  {p.connected && flowStep >= 1 && (selectedRoute === p.id || p.type === 'banking') && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                      style={{
                        background: p.color,
                        boxShadow: `0 0 8px ${p.color}`,
                        animation: 'dotTravel 1.5s ease-in-out infinite',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Prophet Core */}
            <div
              className={`relative z-10 transition-all duration-700 ${prophetActive ? 'scale-100' : 'scale-95 opacity-60'}`}
              style={{
                animation: prophetActive ? 'nodeGlow 3s ease-in-out infinite' : 'none',
              }}
            >
              {/* Outer ring */}
              <div className="w-48 h-48 rounded-full border border-indigo-500/20 flex items-center justify-center relative">
                {prophetActive && (
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent"
                    style={{
                      borderTopColor: '#818cf8',
                      borderRightColor: '#a78bfa',
                      animation: 'prophetSpin 4s linear infinite',
                    }}
                  />
                )}

                {/* Inner ring */}
                <div className="w-36 h-36 rounded-full border border-indigo-500/10 flex items-center justify-center bg-indigo-500/[0.03]">
                  {/* Core */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex flex-col items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-indigo-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-bold text-indigo-300 tracking-wide">PROPHET</span>
                  </div>
                </div>
              </div>

              {/* Status label below */}
              <div className="text-center mt-4">
                <p className={`text-xs font-medium ${processingFlow ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {flowStep === 0 && !processingFlow && 'Idle'}
                  {flowStep === 1 && 'Analyzing Routes...'}
                  {flowStep === 2 && `Routing via ${providers.find(p => p.id === selectedRoute)?.name}`}
                  {flowStep === 3 && 'Settling to Wallet...'}
                  {flowStep === 4 && 'Complete!'}
                </p>
              </div>
            </div>

            {/* Outgoing line to wallet */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[2px]">
              <div
                className={`h-full transition-all duration-500 ${prophetActive ? 'opacity-100' : 'opacity-10'}`}
                style={{
                  background: prophetActive
                    ? 'linear-gradient(90deg, #818cf8, #22c55e)'
                    : '#1e293b',
                }}
              />
              {flowStep >= 3 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"
                  style={{
                    boxShadow: '0 0 8px #22c55e',
                    animation: 'dotTravel 1s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT: User Wallet */}
          <div className="flex items-center justify-start min-h-[500px]">
            <div
              className={`w-full max-w-xs transition-all duration-500 ${flowStep === 4 ? 'scale-[1.02]' : 'scale-100'}`}
              style={{ animation: flowStep === 4 ? 'walletPulse 0.6s ease-in-out' : 'none' }}
            >
              <div className={`rounded-2xl border p-6 transition-all duration-500 ${
                prophetActive
                  ? 'bg-gradient-to-br from-green-500/[0.08] to-emerald-500/[0.04] border-green-500/20'
                  : 'bg-white/[0.02] border-white/5'
              }`}>
                {/* Wallet icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    prophetActive
                      ? 'bg-green-500/20'
                      : 'bg-white/5'
                  }`}>
                    <svg className={`w-6 h-6 ${prophetActive ? 'text-green-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">User Wallet</h3>
                    <p className="text-xs text-gray-500">Settlement Destination</p>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-1">Available Balance</p>
                  <p className={`text-4xl font-bold tracking-tight transition-colors ${
                    walletBalance > 0 ? 'text-green-400' : 'text-gray-600'
                  }`}>
                    ${walletBalance.toFixed(2)}
                  </p>
                </div>

                {/* Wallet details */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <span className={prophetActive ? 'text-green-400' : 'text-gray-600'}>
                      {prophetActive ? 'Receiving' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Network</span>
                    <span className="text-gray-400">USDC (Base)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Settlement</span>
                    <span className="text-gray-400">Instant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={simulatePaymentFlow}
            disabled={!prophetActive || processingFlow}
            className={`px-8 py-3 rounded-xl font-medium text-sm transition-all ${
              prophetActive && !processingFlow
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            {processingFlow ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Simulate Payment Flow'
            )}
          </button>

          {walletBalance > 0 && (
            <button
              onClick={() => setWalletBalance(0)}
              className="px-6 py-3 rounded-xl text-sm text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
            >
              Reset Wallet
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
            <span className="text-2xl mb-3 block">⚡</span>
            <h4 className="text-sm font-medium text-white mb-1">Smart Routing</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Prophet analyzes fees, success rates, and latency to choose the optimal payment processor for each transaction.</p>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
            <span className="text-2xl mb-3 block">🛡️</span>
            <h4 className="text-sm font-medium text-white mb-1">Failover Protection</h4>
            <p className="text-xs text-gray-500 leading-relaxed">If a provider goes down, Prophet automatically reroutes through the next best option with zero downtime.</p>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
            <span className="text-2xl mb-3 block">📊</span>
            <h4 className="text-sm font-medium text-white mb-1">Unified Analytics</h4>
            <p className="text-xs text-gray-500 leading-relaxed">One dashboard for all providers. Track volume, fees, and performance across CoinFlow, PayNearMe, and Paysafe.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Provider Node Component ─── */

function ProviderNode({
  provider,
  expanded,
  onToggle,
  onKeyChange,
  onConnect,
  onDisconnect,
  isActiveRoute,
  flowStep,
}: {
  provider: ProviderConfig
  expanded: boolean
  onToggle: () => void
  onKeyChange: (id: string, keyIndex: number, value: string) => void
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  isActiveRoute: boolean
  flowStep: number
}) {
  const allKeysFilled = provider.keys.every(k => k.value.length > 3)

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        provider.connected
          ? isActiveRoute && flowStep > 0
            ? 'bg-indigo-500/[0.08] border-indigo-500/30'
            : 'bg-white/[0.04] border-white/10'
          : expanded
            ? 'bg-white/[0.04] border-white/10'
            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: provider.connected ? provider.color : '#1e293b' }}
          >
            {provider.name.charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">{provider.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              {provider.type === 'payment' ? 'Payment Processor' : 'Bank Connection'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {provider.connected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] font-medium text-green-400">Connected</span>
            </span>
          ) : (
            <svg className={`w-4 h-4 text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded: Key Inputs */}
      {expanded && !provider.connected && (
        <div className="px-4 pb-4 space-y-3">
          <div className="h-px bg-white/5" />
          {provider.keys.map((key, i) => (
            <div key={key.label}>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">{key.label}</label>
              <input
                type="text"
                value={key.value}
                onChange={e => onKeyChange(provider.id, i, e.target.value)}
                placeholder={key.placeholder}
                className="w-full px-3 py-2 bg-black/30 border border-white/5 rounded-lg text-sm text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 font-mono text-xs"
              />
            </div>
          ))}
          <button
            onClick={() => allKeysFilled && onConnect(provider.id)}
            disabled={!allKeysFilled}
            className={`w-full py-2.5 rounded-lg text-xs font-medium transition-all ${
              allKeysFilled
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            Connect Provider
          </button>
        </div>
      )}

      {/* Expanded: Connected state */}
      {expanded && provider.connected && (
        <div className="px-4 pb-4 space-y-3">
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Status</span>
            <span className="text-green-400">Operational</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Latency</span>
            <span className="text-gray-400">{Math.floor(Math.random() * 50 + 20)}ms</span>
          </div>
          <button
            onClick={() => onDisconnect(provider.id)}
            className="w-full py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
