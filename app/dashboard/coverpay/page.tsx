'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'

interface BNPLProvider {
  id: string
  name: string
  logo: string
  color: string
  enabled: boolean
  priority: number
  credentials: {
    configured: boolean
    testMode: boolean
  }
  stats: {
    approvalRate: number
    avgOrderValue: number
    transactions: number
  }
}

const BNPL_PROVIDERS: BNPLProvider[] = [
  {
    id: 'klarna',
    name: 'Klarna',
    logo: '/logos/klarna.svg',
    color: '#FFB3C7',
    enabled: true,
    priority: 1,
    credentials: { configured: true, testMode: true },
    stats: { approvalRate: 78, avgOrderValue: 245, transactions: 1234 }
  },
  {
    id: 'affirm',
    name: 'Affirm',
    logo: '/logos/affirm.svg',
    color: '#0FA0EA',
    enabled: true,
    priority: 2,
    credentials: { configured: true, testMode: true },
    stats: { approvalRate: 72, avgOrderValue: 312, transactions: 856 }
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    logo: '/logos/afterpay.svg',
    color: '#B2FCE4',
    enabled: true,
    priority: 3,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0 }
  },
  {
    id: 'sezzle',
    name: 'Sezzle',
    logo: '/logos/sezzle.svg',
    color: '#382757',
    enabled: false,
    priority: 4,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0 }
  },
  {
    id: 'zip',
    name: 'Zip',
    logo: '/logos/zip.svg',
    color: '#AA8FFF',
    enabled: false,
    priority: 5,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0 }
  },
  {
    id: 'paypal',
    name: 'PayPal Pay Later',
    logo: '/logos/paypal.svg',
    color: '#003087',
    enabled: false,
    priority: 6,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0 }
  }
]

export default function CoverPayDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [providers, setProviders] = useState<BNPLProvider[]>(BNPL_PROVIDERS)
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'waterfall' | 'preview'>('overview')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/business-login')
        return
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  const toggleProvider = (providerId: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const moveProviderUp = (index: number) => {
    if (index === 0) return
    const newProviders = [...providers]
    const temp = newProviders[index]
    newProviders[index] = newProviders[index - 1]
    newProviders[index - 1] = temp
    newProviders.forEach((p, i) => p.priority = i + 1)
    setProviders(newProviders)
  }

  const moveProviderDown = (index: number) => {
    if (index === providers.length - 1) return
    const newProviders = [...providers]
    const temp = newProviders[index]
    newProviders[index] = newProviders[index + 1]
    newProviders[index + 1] = temp
    newProviders.forEach((p, i) => p.priority = i + 1)
    setProviders(newProviders)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const enabledProviders = providers.filter(p => p.enabled && p.credentials.configured)
  const totalTransactions = providers.reduce((acc, p) => acc + p.stats.transactions, 0)
  const avgApprovalRate = enabledProviders.length > 0
    ? enabledProviders.reduce((acc, p) => acc + p.stats.approvalRate, 0) / enabledProviders.length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CoverPay</h1>
                <p className="text-gray-400 text-sm">BNPL Orchestration</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Test Mode</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg w-fit">
          {(['overview', 'providers', 'waterfall', 'preview'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Active Providers</p>
                <p className="text-3xl font-bold text-white mt-1">{enabledProviders.length}</p>
                <p className="text-gray-500 text-sm mt-1">of {providers.length} configured</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Avg. Approval Rate</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{avgApprovalRate.toFixed(1)}%</p>
                <p className="text-gray-500 text-sm mt-1">across all providers</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-white mt-1">{totalTransactions.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-1">this month</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Waterfall Success</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">94.2%</p>
                <p className="text-gray-500 text-sm mt-1">users approved</p>
              </div>
            </div>

            {/* How Waterfall Works */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">How CoverPay Waterfall Works</h2>
              <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
                {providers.filter(p => p.enabled).slice(0, 4).map((provider, index) => (
                  <div key={provider.id} className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: provider.color + '30', border: `2px solid ${provider.color}` }}
                      >
                        {provider.name.charAt(0)}
                      </div>
                      <span className="text-white text-sm mt-2">{provider.name}</span>
                      <span className="text-gray-500 text-xs">Priority {index + 1}</span>
                    </div>
                    {index < providers.filter(p => p.enabled).slice(0, 4).length - 1 && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xs">if declined</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4">
                When a customer chooses BNPL at checkout, CoverPay automatically routes them through your configured providers
                in order until one approves them. This maximizes approval rates while giving you control over provider priority.
              </p>
            </div>

            {/* Provider Quick Stats */}
            <div className="bg-white/5 rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Provider Performance</h2>
              </div>
              <div className="divide-y divide-white/10">
                {providers.filter(p => p.enabled && p.credentials.configured).map(provider => (
                  <div key={provider.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                        style={{ backgroundColor: provider.color + '30', color: provider.color }}
                      >
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{provider.name}</p>
                        <p className="text-gray-500 text-sm">Priority {provider.priority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-white font-medium">{provider.stats.approvalRate}%</p>
                        <p className="text-gray-500 text-xs">Approval Rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${provider.stats.avgOrderValue}</p>
                        <p className="text-gray-500 text-xs">Avg. Order</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{provider.stats.transactions.toLocaleString()}</p>
                        <p className="text-gray-500 text-xs">Transactions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Configure BNPL Providers</h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                + Add Provider
              </button>
            </div>

            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`bg-white/5 rounded-xl border transition-colors ${
                  provider.enabled ? 'border-purple-500/50' : 'border-white/10'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                        style={{ backgroundColor: provider.color + '30', color: provider.color }}
                      >
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{provider.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {provider.credentials.configured ? (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                              Configured
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded">
                              Not Configured
                            </span>
                          )}
                          {provider.credentials.testMode && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              Test Mode
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                      >
                        {selectedProvider === provider.id ? 'Hide' : 'Configure'}
                      </button>
                      <button
                        onClick={() => toggleProvider(provider.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          provider.enabled ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            provider.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Configuration Panel */}
                  {selectedProvider === provider.id && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            {provider.id === 'klarna' ? 'Username' : 'Public Key'}
                          </label>
                          <input
                            type="text"
                            placeholder="Enter key..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            {provider.id === 'klarna' ? 'Password' : 'Secret Key'}
                          </label>
                          <input
                            type="password"
                            placeholder="Enter secret..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={provider.credentials.testMode}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600"
                          />
                          <span className="text-gray-300 text-sm">Test Mode</span>
                        </label>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                          Save Credentials
                        </button>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Waterfall Tab */}
        {activeTab === 'waterfall' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Waterfall Priority</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Drag providers to reorder priority. First provider is tried first.
                </p>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                Save Order
              </button>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/10">
              {providers.map((provider, index) => (
                <div
                  key={provider.id}
                  className={`p-4 flex items-center justify-between ${
                    !provider.enabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveProviderUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveProviderDown(index)}
                        disabled={index === providers.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                      style={{ backgroundColor: provider.color + '30', color: provider.color }}
                    >
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{provider.name}</p>
                      <p className="text-gray-500 text-sm">
                        {provider.enabled && provider.credentials.configured
                          ? `${provider.stats.approvalRate}% approval rate`
                          : provider.enabled
                            ? 'Not configured'
                            : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!provider.enabled && (
                      <span className="text-gray-500 text-sm">Disabled - will be skipped</span>
                    )}
                    {!provider.credentials.configured && provider.enabled && (
                      <span className="text-amber-500 text-sm">Configure credentials to enable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Waterfall Rules */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Advanced Routing Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Route high-value orders differently</p>
                    <p className="text-gray-400 text-sm">Orders over $500 skip to Affirm first</p>
                  </div>
                  <button className="px-3 py-1 bg-white/5 text-gray-400 rounded text-sm">Configure</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Category-based routing</p>
                    <p className="text-gray-400 text-sm">Route specific product categories to preferred providers</p>
                  </div>
                  <button className="px-3 py-1 bg-white/5 text-gray-400 rounded text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Checkout Preview</h2>
              <p className="text-gray-400 text-sm mt-1">
                Preview how CoverPay will appear to your customers at checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mock Checkout */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-gray-900 font-semibold text-lg mb-4">Payment Method</h3>

                <div className="space-y-3">
                  {/* Credit Card Option */}
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                    <input type="radio" name="payment" className="w-4 h-4 text-purple-600" />
                    <svg className="w-8 h-5" viewBox="0 0 32 20">
                      <rect width="32" height="20" rx="2" fill="#1A1F71"/>
                      <text x="16" y="13" fontSize="8" fill="white" textAnchor="middle">VISA</text>
                    </svg>
                    <span className="text-gray-900">Credit Card</span>
                  </label>

                  {/* CoverPay BNPL Option */}
                  <div className="border-2 border-purple-500 rounded-lg overflow-hidden">
                    <label className="flex items-center gap-3 p-4 cursor-pointer bg-purple-50">
                      <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-purple-600" />
                      <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">CP</span>
                      </div>
                      <div>
                        <span className="text-gray-900 font-medium">Pay in Installments</span>
                        <span className="text-purple-600 text-sm ml-2">Powered by CoverPay</span>
                      </div>
                    </label>

                    <div className="p-4 bg-white border-t border-purple-200">
                      <p className="text-gray-600 text-sm mb-3">Choose your provider:</p>
                      <div className="space-y-2">
                        {providers.filter(p => p.enabled && p.credentials.configured).map((provider, index) => (
                          <label
                            key={provider.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300"
                          >
                            <input
                              type="radio"
                              name="bnpl"
                              defaultChecked={index === 0}
                              className="w-4 h-4 text-purple-600"
                            />
                            <div
                              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                              style={{ backgroundColor: provider.color + '30', color: provider.color }}
                            >
                              {provider.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{provider.name}</span>
                            </div>
                            <span className="text-gray-500 text-sm">4 payments of $62.25</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>$249.00</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-semibold text-lg">
                    <span>Total</span>
                    <span>$249.00</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Complete Purchase
                </button>
              </div>

              {/* Configuration Options */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-white font-semibold mb-4">Customize Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Button Text</label>
                      <input
                        type="text"
                        defaultValue="Pay in Installments"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
                      <div className="flex gap-2">
                        {['#9333EA', '#3B82F6', '#10B981', '#F59E0B'].map(color => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-300 text-sm">Show provider logos</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-300 text-sm">Show installment preview</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                  <h3 className="text-white font-semibold mb-4">Integration Code</h3>
                  <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto text-sm">
                    <code className="text-green-400">{`<script src="https://js.hedgepayments.com/coverpay.js"></script>
<script>
  CoverPay.init({
    apiKey: 'pk_test_xxx',
    onSuccess: (session) => {
      console.log('Approved!', session);
    }
  });
</script>`}</code>
                  </pre>
                  <button className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
