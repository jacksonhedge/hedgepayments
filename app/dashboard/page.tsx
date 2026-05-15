'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { useMode } from './contexts/ModeContext'
import { Card, CardHeader, CardTitle, CardDescription } from './components/ui/Card'
import Badge from './components/ui/Badge'
import Button from './components/ui/Button'
import MetricCard from './components/widgets/MetricCard'
import ActivityFeed from './components/widgets/ActivityFeed'

interface BusinessAccount {
  id: string
  business_name: string
  contact_first_name: string
  contact_last_name: string
  contact_email: string
  business_type: string
  onboarding_status: string
  // Legacy product statuses
  coverpay_status: string
  gateway_status: string
  sidebet_status: string
  // Checkout product statuses
  card_checkout_status?: string
  ach_status?: string
  crypto_status?: string
  digital_wallets_status?: string
  subscriptions_status?: string
  api_key_test: string
  api_secret_test: string
  api_key_live?: string
  api_secret_live?: string
  webhook_secret: string
}

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  started: { label: 'Started', variant: 'default' },
  profile_complete: { label: 'Profile Complete', variant: 'info' },
  products_selected: { label: 'Products Selected', variant: 'info' },
  underwriting: { label: 'Underwriting', variant: 'warning' },
  documents_pending: { label: 'Documents Pending', variant: 'warning' },
  under_review: { label: 'Under Review', variant: 'info' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'error' },
  suspended: { label: 'Suspended', variant: 'error' },
  not_requested: { label: 'Not Requested', variant: 'default' },
  requested: { label: 'Requested', variant: 'info' },
  pending_underwriting: { label: 'Underwriting', variant: 'warning' },
  pending_documents: { label: 'Documents Needed', variant: 'warning' },
  active: { label: 'Active', variant: 'success' },
}

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

export default function DashboardHome() {
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const { mode, isTestMode } = useMode()

  const [account, setAccount] = useState<BusinessAccount | null>(null)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const isWelcome = searchParams.get('welcome') === 'true'

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: businessAccount } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (businessAccount) {
        setAccount(businessAccount)
      }
    }

    fetchAccount()
  }, [supabase])

  const copyToClipboard = async (text: string, keyType: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(keyType)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Mock activity data
  const recentActivity = [
    {
      id: '1',
      type: 'payment' as const,
      title: 'Payment received',
      description: '$125.00 from customer@example.com',
      timestamp: '5m ago',
      status: 'success' as const,
    },
    {
      id: '2',
      type: 'webhook' as const,
      title: 'Webhook delivered',
      description: 'payment.completed sent to https://example.com',
      timestamp: '12m ago',
      status: 'success' as const,
    },
    {
      id: '3',
      type: 'customer' as const,
      title: 'New customer',
      description: 'john.doe@example.com signed up',
      timestamp: '1h ago',
    },
    {
      id: '4',
      type: 'api' as const,
      title: 'API request',
      description: 'POST /v1/payments/create',
      timestamp: '2h ago',
      status: 'success' as const,
    },
  ]

  const products = [
    {
      id: 'card',
      name: 'Card Checkout',
      description: 'Credit/debit cards, Apple Pay, Google Pay',
      href: '/dashboard/products/card',
      status: account?.card_checkout_status || 'active',
      icon: (
        <svg className="w-6 h-6 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    },
    {
      id: 'ach',
      name: 'ACH Payments',
      description: 'Bank transfers with lower fees (0.5%)',
      href: '/dashboard/products/ach',
      status: account?.ach_status || 'active',
      icon: (
        <svg className="w-6 h-6 text-dash-status-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
    {
      id: 'crypto',
      name: 'Crypto Payments',
      description: 'USDC, SOL, ETH and more on Solana',
      href: '/dashboard/products/crypto',
      status: account?.crypto_status || 'not_requested',
      icon: (
        <svg className="w-6 h-6 text-dash-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      description: 'Recurring billing and subscription management',
      href: '/dashboard/products/subscriptions',
      status: account?.subscriptions_status || 'not_requested',
      icon: (
        <svg className="w-6 h-6 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
  ]

  const getApiKey = () => isTestMode ? account?.api_key_test : account?.api_key_live
  const getSecretKey = () => isTestMode ? account?.api_secret_test : account?.api_secret_live

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {isWelcome && (
        <Card className="bg-dash-status-success/5 border-dash-status-success/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-dash-status-success rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dash-text-primary">Welcome to Hedge Payments!</h2>
              <p className="text-dash-text-secondary text-sm mt-1">
                Your application has been submitted. Our team will review it and get back to you within 1-2 business days.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dash-text-primary">
          Welcome back, {account?.contact_first_name}
        </h1>
        <p className="text-dash-text-secondary mt-1">{account?.business_name}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume"
          value="$12,450.00"
          trend={{ value: 12.5, isPositive: true }}
          subtitle="vs last month"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Transactions"
          value="142"
          trend={{ value: 8.3, isPositive: true }}
          subtitle="this month"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          }
        />
        <MetricCard
          title="Customers"
          value="89"
          trend={{ value: 4.1, isPositive: true }}
          subtitle="total active"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Success Rate"
          value="98.5%"
          trend={{ value: 0.5, isPositive: true }}
          subtitle="payment completion"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Grid */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Your Products</CardTitle>
              <CardDescription>Manage and configure your payment products</CardDescription>
            </div>
            <div className="divide-y divide-dash-surface-border">
              {products.map((product) => {
                const statusInfo = STATUS_BADGES[product.status] || STATUS_BADGES.not_requested

                return (
                  <Link
                    key={product.id}
                    href={product.href}
                    className="flex items-center gap-4 p-4 hover:bg-dash-surface-hover transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-dash-surface-bg border border-dash-surface-border flex items-center justify-center">
                      {product.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-dash-text-primary">{product.name}</h3>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </div>
                      <p className="text-sm text-dash-text-secondary truncate">{product.description}</p>
                    </div>
                    <ArrowRightIcon />
                  </Link>
                )
              })}
            </div>
          </Card>

          {/* API Keys Section */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  {isTestMode ? 'Test keys for development' : 'Live keys for production'}
                </CardDescription>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setShowApiKeys(!showApiKeys)}>
                {showApiKeys ? 'Hide Keys' : 'Show Keys'}
              </Button>
            </div>

            {showApiKeys && (
              <div className="p-6 space-y-4">
                {/* Publishable Key */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Publishable Key
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-status-success font-mono text-sm overflow-x-auto">
                      {getApiKey() || 'No key available'}
                    </code>
                    <button
                      onClick={() => copyToClipboard(getApiKey() || '', 'pk')}
                      className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
                    >
                      {copiedKey === 'pk' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Secret Key
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-status-error font-mono text-sm overflow-x-auto">
                      {getSecretKey() || 'No key available'}
                    </code>
                    <button
                      onClick={() => copyToClipboard(getSecretKey() || '', 'sk')}
                      className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
                    >
                      {copiedKey === 'sk' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <p className="text-xs text-dash-status-error mt-1">Never share your secret key publicly</p>
                </div>

                {/* Webhook Secret */}
                <div>
                  <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                    Webhook Secret
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-status-warning font-mono text-sm overflow-x-auto">
                      {account?.webhook_secret || 'No webhook secret'}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account?.webhook_secret || '', 'whsec')}
                      className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
                    >
                      {copiedKey === 'whsec' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>

                {!isTestMode && !account?.api_key_live && (
                  <div className="p-4 bg-dash-status-warning/10 border border-dash-status-warning/20 rounded-lg">
                    <p className="text-sm text-dash-status-warning">
                      Live API keys will be available once your application is approved.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <h3 className="text-sm font-medium text-dash-text-secondary mb-3">Application Status</h3>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_BADGES[account?.onboarding_status || 'started']?.variant || 'default'} size="md">
                {STATUS_BADGES[account?.onboarding_status || 'started']?.label || account?.onboarding_status}
              </Badge>
            </div>
          </Card>

          {/* Activity Feed */}
          <ActivityFeed
            activities={recentActivity}
            onViewAll={() => {}}
          />

          {/* Quick Links */}
          <Card>
            <h3 className="text-sm font-medium text-dash-text-secondary mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/docs"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-dash-primary-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <span className="text-sm text-dash-text-primary">Documentation</span>
              </Link>
              <Link
                href="/dashboard/developers/api-keys"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-dash-status-info/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-dash-status-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <span className="text-sm text-dash-text-primary">API Keys</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-dash-status-warning/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-dash-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm text-dash-text-primary">Settings</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
