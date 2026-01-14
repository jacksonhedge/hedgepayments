'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'

interface RoundUpRule {
  id: string
  name: string
  enabled: boolean
  multiplier: number
  minTransaction: number
  maxRoundUp: number
  categories: string[]
}

interface MockTransaction {
  id: string
  merchant: string
  amount: number
  roundUp: number
  category: string
  date: string
  status: 'collected' | 'pending' | 'settled'
}

const MOCK_TRANSACTIONS: MockTransaction[] = [
  { id: '1', merchant: 'Starbucks', amount: 5.75, roundUp: 0.25, category: 'Food & Drink', date: '2024-01-08', status: 'settled' },
  { id: '2', merchant: 'Amazon', amount: 34.99, roundUp: 0.01, category: 'Shopping', date: '2024-01-08', status: 'collected' },
  { id: '3', merchant: 'Uber', amount: 18.50, roundUp: 0.50, category: 'Transportation', date: '2024-01-07', status: 'settled' },
  { id: '4', merchant: 'Netflix', amount: 15.99, roundUp: 0.01, category: 'Entertainment', date: '2024-01-07', status: 'pending' },
  { id: '5', merchant: 'Whole Foods', amount: 67.23, roundUp: 0.77, category: 'Groceries', date: '2024-01-06', status: 'settled' },
  { id: '6', merchant: 'Shell Gas', amount: 42.18, roundUp: 0.82, category: 'Gas', date: '2024-01-06', status: 'settled' },
  { id: '7', merchant: 'Apple', amount: 99.00, roundUp: 1.00, category: 'Shopping', date: '2024-01-05', status: 'collected' },
]

const CATEGORIES = [
  'Food & Drink',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Groceries',
  'Gas',
  'Bills & Utilities',
  'Travel',
  'Health & Fitness'
]

export default function SideBetDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'transactions' | 'integration'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stripeConnected, setStripeConnected] = useState(true)
  const [plaidConnected, setPlaidConnected] = useState(true)

  const [roundUpRules, setRoundUpRules] = useState<RoundUpRule[]>([
    {
      id: '1',
      name: 'Default Round-Up',
      enabled: true,
      multiplier: 1,
      minTransaction: 1.00,
      maxRoundUp: 5.00,
      categories: []
    }
  ])

  const [settings, setSettings] = useState({
    destination: 'gaming_wallet',
    autoSettle: true,
    settleThreshold: 10.00,
    settleCadence: 'daily'
  })

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const totalRoundUps = MOCK_TRANSACTIONS.reduce((acc, t) => acc + t.roundUp, 0)
  const settledAmount = MOCK_TRANSACTIONS.filter(t => t.status === 'settled').reduce((acc, t) => acc + t.roundUp, 0)
  const pendingAmount = MOCK_TRANSACTIONS.filter(t => t.status !== 'settled').reduce((acc, t) => acc + t.roundUp, 0)

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
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SideBet</h1>
                <p className="text-gray-400 text-sm">Round-Ups as a Service</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Active</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-lg w-fit">
          {(['overview', 'settings', 'transactions', 'integration'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
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
                <p className="text-gray-400 text-sm">Total Round-Ups</p>
                <p className="text-3xl font-bold text-white mt-1">${totalRoundUps.toFixed(2)}</p>
                <p className="text-green-400 text-sm mt-1">+$2.34 today</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Settled</p>
                <p className="text-3xl font-bold text-green-400 mt-1">${settledAmount.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mt-1">transferred to destination</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">${pendingAmount.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mt-1">awaiting settlement</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white mt-1">1,234</p>
                <p className="text-gray-500 text-sm mt-1">with linked accounts</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stripe */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Stripe</h3>
                      <p className="text-gray-400 text-sm">Payment Processing</p>
                    </div>
                  </div>
                  {stripeConnected ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
                  ) : (
                    <button className="px-4 py-2 bg-[#635BFF] text-white rounded-lg text-sm hover:bg-[#5851DB] transition-colors">
                      Connect Stripe
                    </button>
                  )}
                </div>
                {stripeConnected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Account</p>
                        <p className="text-white">acct_1234...xyz</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mode</p>
                        <p className="text-yellow-400">Test Mode</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plaid */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Plaid</h3>
                      <p className="text-gray-400 text-sm">Bank Connections</p>
                    </div>
                  </div>
                  {plaidConnected ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
                  ) : (
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition-colors">
                      Connect Plaid
                    </button>
                  )}
                </div>
                {plaidConnected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Client ID</p>
                        <p className="text-white">client_1234...xyz</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Environment</p>
                        <p className="text-yellow-400">Sandbox</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">How SideBet Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Link Bank</h3>
                  <p className="text-gray-400 text-sm">Users connect their bank account via Plaid</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Monitor</h3>
                  <p className="text-gray-400 text-sm">We watch for new transactions automatically</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Round Up</h3>
                  <p className="text-gray-400 text-sm">Calculate round-ups based on your rules</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 text-2xl font-bold">4</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">Settle</h3>
                  <p className="text-gray-400 text-sm">Transfer via Stripe to your chosen destination</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Round-Ups</h2>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-green-400 text-sm hover:text-green-300"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-white/10">
                {MOCK_TRANSACTIONS.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{transaction.merchant.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.merchant}</p>
                        <p className="text-gray-500 text-sm">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${transaction.amount.toFixed(2)}</p>
                      <p className="text-green-400 text-sm">+${transaction.roundUp.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Round-Up Rules */}
            <div className="bg-white/5 rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Round-Up Rules</h2>
                  <p className="text-gray-400 text-sm">Configure how round-ups are calculated</p>
                </div>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                  + Add Rule
                </button>
              </div>

              <div className="p-6 space-y-4">
                {roundUpRules.map((rule) => (
                  <div key={rule.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => {
                            setRoundUpRules(prev => prev.map(r =>
                              r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                            ))
                          }}
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-green-600"
                        />
                        <span className="text-white font-medium">{rule.name}</span>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Multiplier</label>
                        <select
                          value={rule.multiplier}
                          onChange={(e) => {
                            setRoundUpRules(prev => prev.map(r =>
                              r.id === rule.id ? { ...r, multiplier: parseFloat(e.target.value) } : r
                            ))
                          }}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        >
                          <option value="1" className="bg-slate-800">1x (Standard)</option>
                          <option value="2" className="bg-slate-800">2x (Double)</option>
                          <option value="3" className="bg-slate-800">3x (Triple)</option>
                          <option value="5" className="bg-slate-800">5x</option>
                          <option value="10" className="bg-slate-800">10x</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Min Transaction</label>
                        <input
                          type="number"
                          value={rule.minTransaction}
                          onChange={(e) => {
                            setRoundUpRules(prev => prev.map(r =>
                              r.id === rule.id ? { ...r, minTransaction: parseFloat(e.target.value) } : r
                            ))
                          }}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Max Round-Up</label>
                        <input
                          type="number"
                          value={rule.maxRoundUp}
                          onChange={(e) => {
                            setRoundUpRules(prev => prev.map(r =>
                              r.id === rule.id ? { ...r, maxRoundUp: parseFloat(e.target.value) } : r
                            ))
                          }}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm text-gray-400 mb-2">Exclude Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              setRoundUpRules(prev => prev.map(r => {
                                if (r.id !== rule.id) return r
                                const categories = r.categories.includes(category)
                                  ? r.categories.filter(c => c !== category)
                                  : [...r.categories, category]
                                return { ...r, categories }
                              }))
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              rule.categories.includes(category)
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settlement Settings */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Settlement Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Round-Up Destination</label>
                  <select
                    value={settings.destination}
                    onChange={(e) => setSettings(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="gaming_wallet" className="bg-slate-800">Gaming Wallet</option>
                    <option value="savings" className="bg-slate-800">Savings Account</option>
                    <option value="investment" className="bg-slate-800">Investment Account</option>
                    <option value="charity" className="bg-slate-800">Charity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Settlement Cadence</label>
                  <select
                    value={settings.settleCadence}
                    onChange={(e) => setSettings(prev => ({ ...prev, settleCadence: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="realtime" className="bg-slate-800">Real-time</option>
                    <option value="daily" className="bg-slate-800">Daily</option>
                    <option value="weekly" className="bg-slate-800">Weekly</option>
                    <option value="threshold" className="bg-slate-800">On Threshold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Settlement Threshold</label>
                  <input
                    type="number"
                    value={settings.settleThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, settleThreshold: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="$10.00"
                  />
                  <p className="text-gray-500 text-xs mt-1">Minimum amount before auto-settlement</p>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSettle}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoSettle: e.target.checked }))}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-green-600"
                    />
                    <div>
                      <span className="text-white">Auto-Settlement</span>
                      <p className="text-gray-500 text-sm">Automatically transfer round-ups</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Transaction History</h2>
              <div className="flex items-center gap-2">
                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                  <option className="bg-slate-800">All Status</option>
                  <option className="bg-slate-800">Settled</option>
                  <option className="bg-slate-800">Collected</option>
                  <option className="bg-slate-800">Pending</option>
                </select>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">
                  Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Merchant</th>
                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Category</th>
                    <th className="text-right p-4 text-gray-400 text-sm font-medium">Amount</th>
                    <th className="text-right p-4 text-gray-400 text-sm font-medium">Round-Up</th>
                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Date</th>
                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {MOCK_TRANSACTIONS.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{transaction.merchant.charAt(0)}</span>
                          </div>
                          <span className="text-white">{transaction.merchant}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{transaction.category}</td>
                      <td className="p-4 text-white text-right">${transaction.amount.toFixed(2)}</td>
                      <td className="p-4 text-green-400 text-right font-medium">+${transaction.roundUp.toFixed(2)}</td>
                      <td className="p-4 text-gray-400">{transaction.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'settled'
                            ? 'bg-green-500/20 text-green-400'
                            : transaction.status === 'collected'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Integration Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Integration Guide</h2>
              <p className="text-gray-400 text-sm mt-1">Add SideBet round-ups to your application</p>
            </div>

            {/* Quick Start */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Start</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">1. Install the SDK</p>
                  <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto">
                    <code className="text-green-400">npm install @hedgepayments/sidebet</code>
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">2. Initialize with your API key</p>
                  <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto">
                    <code className="text-green-400">{`import { SideBet } from '@hedgepayments/sidebet';

const sidebet = new SideBet({
  apiKey: 'pk_test_xxx',
  environment: 'sandbox'
});`}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">3. Link a bank account</p>
                  <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto">
                    <code className="text-green-400">{`// Open Plaid Link for bank connection
const connection = await sidebet.linkBankAccount({
  userId: 'user_123',
  onSuccess: (publicToken) => {
    // Exchange token with your backend
  }
});`}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">4. Enable round-ups</p>
                  <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto">
                    <code className="text-green-400">{`// Enable round-ups for the user
await sidebet.enableRoundUps({
  userId: 'user_123',
  connectionId: 'conn_xxx',
  destination: 'gaming_wallet',
  multiplier: 1
});`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Webhook Events */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Webhook Events</h3>
              <div className="space-y-3">
                {[
                  { event: 'roundup.created', desc: 'A new round-up was calculated' },
                  { event: 'roundup.collected', desc: 'Round-up amount was collected from user' },
                  { event: 'roundup.settled', desc: 'Round-up was transferred to destination' },
                  { event: 'connection.linked', desc: 'User linked a new bank account' },
                  { event: 'connection.removed', desc: 'User removed a bank connection' }
                ].map(({ event, desc }) => (
                  <div key={event} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <code className="text-green-400">{event}</code>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Credentials</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Publishable Key</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-green-400 font-mono text-sm">
                      pk_test_sb_abc123xyz456
                    </code>
                    <button className="px-3 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
                  <input
                    type="url"
                    placeholder="https://yourapp.com/webhooks/sidebet"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
