'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import MetricCard from '../../components/widgets/MetricCard'

interface BNPLProvider {
  id: string
  name: string
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
    revenue: number
    declineRate: number
  }
}

// Mock approval rate data over time (last 7 days)
const APPROVAL_RATE_HISTORY = [
  { date: 'Jan 15', klarna: 76, affirm: 70, afterpay: 68, overall: 73 },
  { date: 'Jan 16', klarna: 78, affirm: 71, afterpay: 69, overall: 74 },
  { date: 'Jan 17', klarna: 75, affirm: 73, afterpay: 71, overall: 73 },
  { date: 'Jan 18', klarna: 79, affirm: 72, afterpay: 70, overall: 75 },
  { date: 'Jan 19', klarna: 77, affirm: 74, afterpay: 72, overall: 75 },
  { date: 'Jan 20', klarna: 80, affirm: 73, afterpay: 71, overall: 76 },
  { date: 'Jan 21', klarna: 78, affirm: 72, afterpay: 70, overall: 75 },
]

// Mock decline reasons
const DECLINE_REASONS = [
  { reason: 'Credit score too low', count: 234, percentage: 42 },
  { reason: 'Existing balance too high', count: 156, percentage: 28 },
  { reason: 'Order amount exceeds limit', count: 89, percentage: 16 },
  { reason: 'Insufficient payment history', count: 45, percentage: 8 },
  { reason: 'Other', count: 33, percentage: 6 },
]

// Mock recent sessions
const RECENT_SESSIONS = [
  { id: 'cps_abc123', amount: 249.99, provider: 'Klarna', status: 'approved', time: '2 min ago' },
  { id: 'cps_def456', amount: 189.00, provider: 'Affirm', status: 'approved', time: '5 min ago' },
  { id: 'cps_ghi789', amount: 599.99, provider: null, status: 'declined', time: '8 min ago' },
  { id: 'cps_jkl012', amount: 129.99, provider: 'Klarna', status: 'approved', time: '12 min ago' },
  { id: 'cps_mno345', amount: 349.00, provider: 'Affirm', status: 'pending', time: '15 min ago' },
]

const BNPL_PROVIDERS: BNPLProvider[] = [
  {
    id: 'klarna',
    name: 'Klarna',
    color: '#FFB3C7',
    enabled: true,
    priority: 1,
    credentials: { configured: true, testMode: true },
    stats: { approvalRate: 78, avgOrderValue: 245, transactions: 1234, revenue: 302430, declineRate: 22 }
  },
  {
    id: 'affirm',
    name: 'Affirm',
    color: '#0FA0EA',
    enabled: true,
    priority: 2,
    credentials: { configured: true, testMode: true },
    stats: { approvalRate: 72, avgOrderValue: 312, transactions: 856, revenue: 267072, declineRate: 28 }
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    color: '#B2FCE4',
    enabled: true,
    priority: 3,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0, revenue: 0, declineRate: 0 }
  },
  {
    id: 'sezzle',
    name: 'Sezzle',
    color: '#382757',
    enabled: false,
    priority: 4,
    credentials: { configured: false, testMode: false },
    stats: { approvalRate: 0, avgOrderValue: 0, transactions: 0, revenue: 0, declineRate: 0 }
  },
]

// Simple SVG Line Chart Component
function ApprovalRateChart({ data, height = 200 }: { data: typeof APPROVAL_RATE_HISTORY, height?: number }) {
  const maxRate = 100
  const minRate = 60
  const range = maxRate - minRate
  const width = 100 // percentage
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }

  const getY = (value: number) => {
    return padding.top + ((maxRate - value) / range) * (height - padding.top - padding.bottom)
  }

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * (100 - padding.left - padding.right)
  }

  const createPath = (key: 'klarna' | 'affirm' | 'overall') => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)}% ${getY(d[key])}`).join(' ')
  }

  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        {[60, 70, 80, 90, 100].map(v => (
          <g key={v}>
            <line
              x1={`${padding.left}%`}
              y1={getY(v)}
              x2={`${100 - padding.right}%`}
              y2={getY(v)}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="4 4"
            />
            <text
              x={`${padding.left - 5}%`}
              y={getY(v) + 4}
              textAnchor="end"
              className="fill-dash-text-muted text-xs"
            >
              {v}%
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={d.date}
            x={`${getX(i)}%`}
            y={height - 8}
            textAnchor="middle"
            className="fill-dash-text-muted text-xs"
          >
            {d.date.split(' ')[1]}
          </text>
        ))}

        {/* Lines */}
        <path d={createPath('overall')} fill="none" stroke="#8B5CF6" strokeWidth={2.5} />
        <path d={createPath('klarna')} fill="none" stroke="#FFB3C7" strokeWidth={2} strokeDasharray="4 2" />
        <path d={createPath('affirm')} fill="none" stroke="#0FA0EA" strokeWidth={2} strokeDasharray="4 2" />

        {/* Data points for overall */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={`${getX(i)}%`}
            cy={getY(d.overall)}
            r={4}
            fill="#8B5CF6"
          />
        ))}
      </svg>
    </div>
  )
}

// Provider Comparison Bar Chart
function ProviderComparisonChart({ providers }: { providers: BNPLProvider[] }) {
  const activeProviders = providers.filter(p => p.enabled && p.credentials.configured)
  const maxApproval = Math.max(...activeProviders.map(p => p.stats.approvalRate), 100)

  return (
    <div className="space-y-4">
      {activeProviders.map(provider => (
        <div key={provider.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-dash-text-primary text-sm font-medium">{provider.name}</span>
            </div>
            <span className="text-dash-text-secondary text-sm">{provider.stats.approvalRate}%</span>
          </div>
          <div className="h-2 bg-dash-surface-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(provider.stats.approvalRate / maxApproval) * 100}%`,
                backgroundColor: provider.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CoverPayDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { mode, isTestMode } = useMode()

  const [providers, setProviders] = useState<BNPLProvider[]>(BNPL_PROVIDERS)
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'waterfall' | 'widget'>('overview')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const toggleProvider = (providerId: string) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  // Widget customization state
  const [widgetConfig, setWidgetConfig] = useState({
    buttonText: 'Pay Later',
    buttonColor: '#8B5CF6',
    buttonTextColor: '#FFFFFF',
    borderRadius: 8,
    showProviderLogos: true,
    showInstallmentPreview: true,
    darkMode: false,
    position: 'inline' as 'inline' | 'modal',
  })

  const enabledProviders = providers.filter(p => p.enabled && p.credentials.configured)
  const totalTransactions = providers.reduce((acc, p) => acc + p.stats.transactions, 0)
  const totalRevenue = providers.reduce((acc, p) => acc + p.stats.revenue, 0)
  const avgApprovalRate = enabledProviders.length > 0
    ? enabledProviders.reduce((acc, p) => acc + p.stats.approvalRate, 0) / enabledProviders.length
    : 0
  const totalDeclined = Math.round(totalTransactions * (1 - avgApprovalRate / 100))
  const waterfallRecoveryRate = 18.5 // Mock: % of initially declined that were approved by subsequent provider

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">CoverPay</h1>
            <p className="text-dash-text-secondary">BNPL Orchestration with Waterfall Routing</p>
          </div>
        </div>
        <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
          {isTestMode ? 'Test Mode' : 'Live Mode'}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dash-surface-bg p-1 rounded-lg w-fit">
        {(['overview', 'providers', 'waterfall', 'widget'] as const).map(tab => (
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
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dash-text-primary">Analytics Overview</h2>
            <div className="flex gap-1 bg-dash-surface-bg p-1 rounded-lg">
              {(['7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-dash-surface-card text-dash-text-primary shadow-sm'
                      : 'text-dash-text-secondary hover:text-dash-text-primary'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Revenue"
              value={`$${(totalRevenue / 1000).toFixed(0)}K`}
              subtitle="via BNPL this period"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Avg. Approval Rate"
              value={`${avgApprovalRate.toFixed(1)}%`}
              subtitle="across all providers"
              trend={{ value: 2.3, isPositive: true }}
            />
            <MetricCard
              title="Total Sessions"
              value={totalTransactions.toLocaleString()}
              subtitle="checkout attempts"
              trend={{ value: 8.7, isPositive: true }}
            />
            <MetricCard
              title="Waterfall Recovery"
              value={`${waterfallRecoveryRate}%`}
              subtitle="declined → approved"
              trend={{ value: 3.2, isPositive: true }}
            />
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-dash-surface-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dash-text-muted text-sm">Active Providers</p>
                  <p className="text-2xl font-bold text-dash-text-primary">{enabledProviders.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </Card>
            <Card className="bg-dash-surface-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dash-text-muted text-sm">Declined Sessions</p>
                  <p className="text-2xl font-bold text-dash-text-primary">{totalDeclined}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </Card>
            <Card className="bg-dash-surface-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dash-text-muted text-sm">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-dash-text-primary">
                    ${enabledProviders.length > 0
                      ? Math.round(enabledProviders.reduce((acc, p) => acc + p.stats.avgOrderValue, 0) / enabledProviders.length)
                      : 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
            <Card className="bg-dash-surface-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dash-text-muted text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-dash-text-primary">94.2%</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Approval Rate Over Time Chart */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <CardTitle>Approval Rate Over Time</CardTitle>
                  <CardDescription>Daily approval rates by provider</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-dash-text-muted">Overall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFB3C7' }} />
                    <span className="text-dash-text-muted">Klarna</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0FA0EA' }} />
                    <span className="text-dash-text-muted">Affirm</span>
                  </div>
                </div>
              </div>
              <ApprovalRateChart data={APPROVAL_RATE_HISTORY} height={220} />
            </Card>

            {/* Provider Comparison */}
            <Card>
              <CardTitle>Provider Comparison</CardTitle>
              <CardDescription>Approval rates by provider</CardDescription>
              <div className="mt-6">
                <ProviderComparisonChart providers={providers} />
              </div>
              <div className="mt-6 pt-4 border-t border-dash-surface-border">
                <p className="text-dash-text-muted text-sm">
                  Klarna leads with {providers.find(p => p.id === 'klarna')?.stats.approvalRate}% approval rate
                </p>
              </div>
            </Card>
          </div>

          {/* Bottom Row: Decline Reasons + Recent Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Decline Reasons */}
            <Card>
              <CardTitle>Decline Reasons</CardTitle>
              <CardDescription>Why customers are being declined</CardDescription>
              <div className="mt-6 space-y-4">
                {DECLINE_REASONS.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dash-text-primary">{item.reason}</span>
                      <span className="text-dash-text-muted">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-dash-surface-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card padding="none">
              <div className="p-6 border-b border-dash-surface-border flex items-center justify-between">
                <div>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Latest checkout attempts</CardDescription>
                </div>
                <Link href="/dashboard/coverpay/transactions">
                  <Button variant="secondary" size="sm">View All</Button>
                </Link>
              </div>
              <div className="divide-y divide-dash-surface-border">
                {RECENT_SESSIONS.map(session => (
                  <div key={session.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === 'approved' ? 'bg-green-500' :
                        session.status === 'declined' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-dash-text-primary text-sm font-medium">
                          ${session.amount.toFixed(2)}
                        </p>
                        <p className="text-dash-text-muted text-xs">{session.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-dash-text-primary text-sm">
                        {session.provider || 'All declined'}
                      </p>
                      <p className="text-dash-text-muted text-xs">{session.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* How Waterfall Works */}
          <Card>
            <CardTitle>How CoverPay Waterfall Works</CardTitle>
            <CardDescription>Automatic routing maximizes approval rates</CardDescription>
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 mt-6">
              {providers.filter(p => p.enabled).slice(0, 4).map((provider, index) => (
                <div key={provider.id} className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-dash-text-primary font-bold border-2"
                      style={{ backgroundColor: provider.color + '30', borderColor: provider.color }}
                    >
                      {provider.name.charAt(0)}
                    </div>
                    <span className="text-dash-text-primary text-sm mt-2 font-medium">{provider.name}</span>
                    <span className="text-dash-text-muted text-xs">Priority {index + 1}</span>
                  </div>
                  {index < providers.filter(p => p.enabled).slice(0, 4).length - 1 && (
                    <div className="flex items-center gap-2 text-dash-text-muted">
                      <span className="text-xs">if declined</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-dash-text-secondary text-sm mt-4">
              When a customer chooses BNPL at checkout, CoverPay automatically routes them through your configured providers
              in order until one approves them. This maximizes approval rates while giving you control over provider priority.
            </p>
          </Card>

          {/* Enhanced Provider Performance Table */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Provider Performance Details</CardTitle>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dash-surface-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Approval Rate</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Avg. Order</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Decline Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-surface-border">
                  {providers.filter(p => p.enabled && p.credentials.configured).map(provider => (
                    <tr key={provider.id} className="hover:bg-dash-surface-bg/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                            style={{ backgroundColor: provider.color + '30', color: provider.color }}
                          >
                            {provider.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-dash-text-primary font-medium">{provider.name}</p>
                            <p className="text-dash-text-muted text-xs">Priority {provider.priority}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-dash-text-primary font-medium">{provider.stats.approvalRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-dash-text-primary">{provider.stats.transactions.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-dash-text-primary">${(provider.stats.revenue / 1000).toFixed(1)}K</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-dash-text-primary">${provider.stats.avgOrderValue}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-red-400">{provider.stats.declineRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Configure BNPL Providers</CardTitle>
            <Button variant="primary">+ Add Provider</Button>
          </div>

          {providers.map((provider) => (
            <Card key={provider.id} padding="none" className={provider.enabled ? 'ring-2 ring-purple-500/30' : ''}>
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
                      <h3 className="text-dash-text-primary font-semibold">{provider.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {provider.credentials.configured ? (
                          <Badge variant="success">Configured</Badge>
                        ) : (
                          <Badge variant="default">Not Configured</Badge>
                        )}
                        {provider.credentials.testMode && (
                          <Badge variant="warning">Test Mode</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
                    >
                      {selectedProvider === provider.id ? 'Hide' : 'Configure'}
                    </Button>
                    <button
                      onClick={() => toggleProvider(provider.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        provider.enabled ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                          provider.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Configuration Panel */}
                {selectedProvider === provider.id && (
                  <div className="mt-6 pt-6 border-t border-dash-surface-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                          {provider.id === 'klarna' ? 'Username' : 'Public Key'}
                        </label>
                        <input
                          type="text"
                          placeholder="Enter key..."
                          className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                          {provider.id === 'klarna' ? 'Password' : 'Secret Key'}
                        </label>
                        <input
                          type="password"
                          placeholder="Enter secret..."
                          className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={provider.credentials.testMode}
                          className="w-4 h-4 rounded border-dash-surface-border text-dash-primary-500"
                        />
                        <span className="text-dash-text-secondary text-sm">Test Mode</span>
                      </label>
                      <Button variant="primary" size="sm">Save Credentials</Button>
                      <Button variant="secondary" size="sm">Test Connection</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Waterfall Tab */}
      {activeTab === 'waterfall' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Waterfall Priority</CardTitle>
              <CardDescription>Drag providers to reorder priority. First provider is tried first.</CardDescription>
            </div>
            <Button variant="primary">Save Order</Button>
          </div>

          <Card padding="none">
            {providers.map((provider, index) => (
              <div
                key={provider.id}
                className={`p-4 flex items-center justify-between border-b border-dash-surface-border last:border-0 ${
                  !provider.enabled ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={index === 0}
                      className="p-1 text-dash-text-muted hover:text-dash-text-primary disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      disabled={index === providers.length - 1}
                      className="p-1 text-dash-text-muted hover:text-dash-text-primary disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="w-8 h-8 bg-dash-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                    style={{ backgroundColor: provider.color + '30', color: provider.color }}
                  >
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-dash-text-primary font-medium">{provider.name}</p>
                    <p className="text-dash-text-muted text-sm">
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
                    <span className="text-dash-text-muted text-sm">Disabled - will be skipped</span>
                  )}
                  {!provider.credentials.configured && provider.enabled && (
                    <span className="text-dash-status-warning text-sm">Configure credentials to enable</span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Widget Tab */}
      {activeTab === 'widget' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Widget Integration</CardTitle>
              <CardDescription>Customize and preview the CoverPay widget for your checkout</CardDescription>
            </div>
            <Link href="/dashboard/coverpay/providers">
              <Button variant="primary">Configure Providers</Button>
            </Link>
          </div>

          {/* Interactive Widget Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customization Panel */}
            <Card>
              <h3 className="text-dash-text-primary font-semibold mb-6">Customize Widget</h3>
              <div className="space-y-6">
                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={widgetConfig.buttonText}
                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                  />
                </div>

                {/* Button Color */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Button Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={widgetConfig.buttonColor}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={widgetConfig.buttonColor}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#000000'].map(color => (
                      <button
                        key={color}
                        onClick={() => setWidgetConfig(prev => ({ ...prev, buttonColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${widgetConfig.buttonColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Border Radius: {widgetConfig.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={widgetConfig.borderRadius}
                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
                    className="w-full accent-dash-primary-500"
                  />
                </div>

                {/* Toggle Options */}
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-dash-text-primary text-sm">Show Provider Logos</span>
                    <button
                      onClick={() => setWidgetConfig(prev => ({ ...prev, showProviderLogos: !prev.showProviderLogos }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${widgetConfig.showProviderLogos ? 'bg-dash-primary-500' : 'bg-dash-surface-border'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${widgetConfig.showProviderLogos ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-dash-text-primary text-sm">Show Installment Preview</span>
                    <button
                      onClick={() => setWidgetConfig(prev => ({ ...prev, showInstallmentPreview: !prev.showInstallmentPreview }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${widgetConfig.showInstallmentPreview ? 'bg-dash-primary-500' : 'bg-dash-surface-border'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${widgetConfig.showInstallmentPreview ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-dash-text-primary text-sm">Dark Mode</span>
                    <button
                      onClick={() => setWidgetConfig(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${widgetConfig.darkMode ? 'bg-dash-primary-500' : 'bg-dash-surface-border'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${widgetConfig.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>

                {/* Widget Position */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Widget Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWidgetConfig(prev => ({ ...prev, position: 'inline' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${widgetConfig.position === 'inline' ? 'border-dash-primary-500 bg-dash-primary-500/10' : 'border-dash-surface-border'}`}
                    >
                      <p className="text-dash-text-primary font-medium text-sm">Inline</p>
                      <p className="text-dash-text-muted text-xs">Embedded in page</p>
                    </button>
                    <button
                      onClick={() => setWidgetConfig(prev => ({ ...prev, position: 'modal' }))}
                      className={`p-3 rounded-lg border-2 transition-all ${widgetConfig.position === 'modal' ? 'border-dash-primary-500 bg-dash-primary-500/10' : 'border-dash-surface-border'}`}
                    >
                      <p className="text-dash-text-primary font-medium text-sm">Modal</p>
                      <p className="text-dash-text-muted text-xs">Opens in overlay</p>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Preview */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-dash-text-primary font-semibold">Live Preview</h3>
                <Badge variant="info">Interactive</Badge>
              </div>

              {/* Preview Container */}
              <div
                className={`rounded-xl p-6 transition-colors ${widgetConfig.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                {/* Mock Checkout Context */}
                <div className="mb-4">
                  <p className={`text-sm ${widgetConfig.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Order Total
                  </p>
                  <p className={`text-2xl font-bold ${widgetConfig.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    $249.99
                  </p>
                </div>

                {/* Widget Button */}
                <button
                  className="w-full py-4 font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: widgetConfig.buttonColor,
                    color: widgetConfig.buttonTextColor,
                    borderRadius: `${widgetConfig.borderRadius}px`,
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  {widgetConfig.buttonText}
                </button>

                {/* Installment Preview */}
                {widgetConfig.showInstallmentPreview && (
                  <p className={`text-center text-sm mt-3 ${widgetConfig.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    or 4 interest-free payments of <span className="font-semibold">$62.50</span>
                  </p>
                )}

                {/* Provider Logos */}
                {widgetConfig.showProviderLogos && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    {enabledProviders.slice(0, 4).map(provider => (
                      <div
                        key={provider.id}
                        className="w-10 h-6 rounded flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: provider.color + '40', color: provider.color }}
                      >
                        {provider.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal Preview Indicator */}
                {widgetConfig.position === 'modal' && (
                  <div className={`mt-4 p-3 rounded-lg border border-dashed ${widgetConfig.darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'} text-center text-xs`}>
                    Opens provider selection modal on click
                  </div>
                )}
              </div>

              {/* Export Button */}
              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="flex-1">Copy Configuration</Button>
                <Button variant="secondary">Reset</Button>
              </div>
            </Card>
          </div>

          {/* Generated Code */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-dash-text-primary font-semibold">Generated Code</h3>
              <Button variant="secondary" size="sm">Copy Code</Button>
            </div>
            <pre className="p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm">
              <code className="text-dash-status-success">{`<script src="https://js.hedgepayments.com/coverpay/v1.js"></script>
<div id="coverpay-checkout"></div>
<script>
  CoverPay.init({
    publishableKey: 'pk_test_your_key_here',
    amount: 249.99,
    currency: 'USD',
    theme: {
      buttonText: '${widgetConfig.buttonText}',
      buttonColor: '${widgetConfig.buttonColor}',
      borderRadius: ${widgetConfig.borderRadius},
      darkMode: ${widgetConfig.darkMode},
      showProviderLogos: ${widgetConfig.showProviderLogos},
      showInstallmentPreview: ${widgetConfig.showInstallmentPreview},
    },
    mode: '${widgetConfig.position}',
    onSuccess: (result) => {
      window.location.href = '/success?txn=' + result.transactionId;
    }
  });
  CoverPay.mount('#coverpay-checkout');
</script>`}</code>
            </pre>
          </Card>

          {/* JavaScript Integration */}
          <Card>
            <h3 className="text-dash-text-primary font-semibold mb-4">JavaScript Widget</h3>
            <p className="text-dash-text-secondary text-sm mb-4">
              Add this code to your checkout page. The widget will automatically handle provider selection and routing.
            </p>
            <pre className="p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm">
              <code className="text-dash-status-success">{`<!-- Include the CoverPay script -->
<script src="https://js.hedgepayments.com/coverpay/v1.js"></script>

<!-- Container for the widget -->
<div id="coverpay-checkout"></div>

<script>
  CoverPay.init({
    publishableKey: 'pk_test_your_key_here',
    amount: 249.99,
    currency: 'USD',
    orderId: 'order_123',
    customer: {
      email: 'customer@example.com',
      phone: '+1234567890',
      name: 'John Doe'
    },
    successUrl: 'https://yoursite.com/success',
    cancelUrl: 'https://yoursite.com/cancel',
    onSuccess: (result) => {
      console.log('Payment approved by:', result.provider);
      console.log('Transaction ID:', result.transactionId);
      window.location.href = '/success?txn=' + result.transactionId;
    },
    onDeclined: (reason) => {
      console.log('All providers declined:', reason);
    },
    onError: (error) => {
      console.error('Error:', error.message);
    }
  });

  // Mount the widget
  CoverPay.mount('#coverpay-checkout');
</script>`}</code>
            </pre>
          </Card>

          {/* React Integration */}
          <Card>
            <h3 className="text-dash-text-primary font-semibold mb-4">React SDK</h3>
            <p className="text-dash-text-secondary text-sm mb-4">
              For React applications, use our React SDK for a more integrated experience.
            </p>
            <pre className="p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm">
              <code className="text-dash-status-success">{`npm install @hedgepayments/coverpay-react`}</code>
            </pre>
            <pre className="p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm mt-4">
              <code className="text-dash-status-success">{`import { CoverPayProvider, CoverPayButton } from '@hedgepayments/coverpay-react';

function Checkout() {
  return (
    <CoverPayProvider publishableKey="pk_test_your_key_here">
      <CoverPayButton
        amount={249.99}
        orderId="order_123"
        customer={{ email: 'customer@example.com' }}
        theme={{
          buttonText: '${widgetConfig.buttonText}',
          buttonColor: '${widgetConfig.buttonColor}',
          borderRadius: ${widgetConfig.borderRadius},
        }}
        onSuccess={(result) => {
          console.log('Approved:', result);
        }}
      />
    </CoverPayProvider>
  );
}`}</code>
            </pre>
          </Card>

          {/* Webhook Configuration */}
          <Card>
            <h3 className="text-dash-text-primary font-semibold mb-4">Webhook Events</h3>
            <p className="text-dash-text-secondary text-sm mb-4">
              Configure your webhook URL to receive real-time payment notifications.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="text-dash-text-primary font-medium">session.created</p>
                  <p className="text-dash-text-muted text-sm">Sent when a checkout session is created</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="text-dash-text-primary font-medium">payment.authorized</p>
                  <p className="text-dash-text-muted text-sm">Sent when payment is authorized by a provider</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="text-dash-text-primary font-medium">payment.captured</p>
                  <p className="text-dash-text-muted text-sm">Sent when payment is captured</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="text-dash-text-primary font-medium">payment.declined</p>
                  <p className="text-dash-text-muted text-sm">Sent when all providers decline</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
