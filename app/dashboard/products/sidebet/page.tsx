'use client'

import { useState } from 'react'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import MetricCard from '../../components/widgets/MetricCard'

export default function SideBetDashboard() {
  const { isTestMode } = useMode()
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'transactions'>('overview')

  // Mock stats
  const stats = {
    totalRoundups: 1234.56,
    settled: 987.00,
    pending: 247.56,
    activeUsers: 1234,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">SideBet</h1>
            <p className="text-dash-text-secondary">Round-Ups as a Service with Stripe</p>
          </div>
        </div>
        <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
          {isTestMode ? 'Test Mode' : 'Live Mode'}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dash-surface-bg p-1 rounded-lg w-fit">
        {(['overview', 'settings', 'transactions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-dash-surface-card text-dash-text-primary shadow-sm'
                : 'text-dash-text-secondary hover:text-dash-text-primary'
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
            <MetricCard
              title="Total Round-Ups"
              value={`$${stats.totalRoundups.toFixed(2)}`}
              trend={{ value: 12.5, isPositive: true }}
              subtitle="all time"
            />
            <MetricCard
              title="Settled"
              value={`$${stats.settled.toFixed(2)}`}
              subtitle="transferred to destination"
            />
            <MetricCard
              title="Pending"
              value={`$${stats.pending.toFixed(2)}`}
              subtitle="awaiting settlement"
            />
            <MetricCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              subtitle="with linked accounts"
            />
          </div>

          {/* How It Works */}
          <Card>
            <CardTitle>How SideBet Works</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-dash-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dash-primary-500 text-2xl font-bold">1</span>
                </div>
                <h3 className="text-dash-text-primary font-medium mb-1">Link Bank</h3>
                <p className="text-dash-text-secondary text-sm">Users connect their bank account via Plaid</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dash-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dash-primary-500 text-2xl font-bold">2</span>
                </div>
                <h3 className="text-dash-text-primary font-medium mb-1">Monitor</h3>
                <p className="text-dash-text-secondary text-sm">We watch for new transactions automatically</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dash-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dash-primary-500 text-2xl font-bold">3</span>
                </div>
                <h3 className="text-dash-text-primary font-medium mb-1">Round Up</h3>
                <p className="text-dash-text-secondary text-sm">Calculate round-ups based on your rules</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-dash-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-dash-primary-500 text-2xl font-bold">4</span>
                </div>
                <h3 className="text-dash-text-primary font-medium mb-1">Settle</h3>
                <p className="text-dash-text-secondary text-sm">Transfer via Stripe to your chosen destination</p>
              </div>
            </div>
          </Card>

          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-dash-text-primary font-semibold">Bank Account</h3>
                    <p className="text-dash-text-secondary text-sm">via Plaid</p>
                  </div>
                </div>
                <Button variant="primary" size="sm">Connect Bank</Button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-dash-text-primary font-semibold">Destination</h3>
                    <p className="text-dash-text-secondary text-sm">Gaming Wallet</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardTitle>Round-Up Rules</CardTitle>
            <CardDescription>Configure how round-ups are calculated</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm text-dash-text-secondary mb-2">Multiplier</label>
                <select className="w-full px-4 py-2 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary">
                  <option>1x (Standard)</option>
                  <option>2x (Double)</option>
                  <option>3x (Triple)</option>
                  <option>5x</option>
                  <option>10x</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dash-text-secondary mb-2">Min Transaction</label>
                <input
                  type="number"
                  defaultValue="1.00"
                  className="w-full px-4 py-2 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-dash-text-secondary mb-2">Max Round-Up</label>
                <input
                  type="number"
                  defaultValue="5.00"
                  className="w-full px-4 py-2 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button variant="primary">Save Settings</Button>
            </div>
          </Card>

          <Card>
            <CardTitle>Settlement Settings</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm text-dash-text-secondary mb-2">Settlement Cadence</label>
                <select className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary">
                  <option>Real-time</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>On Threshold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dash-text-secondary mb-2">Settlement Threshold</label>
                <input
                  type="number"
                  defaultValue="10.00"
                  className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary"
                  placeholder="$10.00"
                />
                <p className="text-dash-text-muted text-xs mt-1">Minimum amount before auto-settlement</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-dash-surface-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <CardTitle>No transactions yet</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2">
            Connect a bank account to start tracking round-ups from your purchases.
          </CardDescription>
          <div className="mt-6">
            <Button variant="primary">Connect Bank Account</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
