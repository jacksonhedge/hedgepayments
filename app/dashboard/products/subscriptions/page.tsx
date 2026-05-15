'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function SubscriptionsDashboard() {
  const { isTestMode } = useMode()
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-dash-status-success rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">Subscriptions</h1>
            <p className="text-dash-text-secondary">Recurring billing and subscription management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" size="md">Not Enabled</Badge>
          <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
            {isTestMode ? 'Test Mode' : 'Live Mode'}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-dash-surface-border">
        <nav className="flex gap-6">
          {(['overview', 'plans', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-dash-status-success text-dash-status-success'
                  : 'border-transparent text-dash-text-secondary hover:text-dash-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Enable Subscriptions Banner */}
          <Card className="bg-dash-status-success/10 border-dash-status-success/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-dash-status-success rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-dash-text-primary">Enable Subscriptions</h2>
                <p className="text-dash-text-secondary text-sm mt-1">
                  Create subscription plans and start billing your customers on a recurring basis.
                  Supports daily, weekly, monthly, and annual billing cycles.
                </p>
                <div className="mt-4">
                  <Button variant="primary">Enable Subscriptions</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="w-10 h-10 bg-dash-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Flexible Billing Cycles</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Daily, weekly, monthly, or annual billing. Set custom trial periods and billing anchors.
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-dash-status-info/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-status-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Multiple Payment Methods</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Accept cards and ACH for subscriptions. Automatic payment method updates.
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-dash-status-warning/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Smart Dunning</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Automatic retry logic and customer notifications to recover failed payments.
              </p>
            </Card>
          </div>

          {/* Integration Preview */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Integration Preview</CardTitle>
              <CardDescription>How subscription billing will work once enabled</CardDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-dash-surface-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dash-text-primary">{`// Create a subscription plan
const plan = await hedge.subscriptions.createPlan({
  name: 'Pro Monthly',
  amount: 2999, // $29.99
  interval: 'month',
  intervalCount: 1,
  trialDays: 14,
});

// Subscribe a customer
const subscription = await hedge.subscriptions.create({
  customerId: 'cus_xxx',
  planId: plan.id,
  paymentMethodId: 'pm_xxx',
});

// Handle subscription events via webhooks
// subscription.created
// subscription.updated
// subscription.canceled
// invoice.paid
// invoice.payment_failed`}</pre>
              </div>
              <Link href="/docs/checkout/subscriptions">
                <Button variant="secondary">View Documentation</Button>
              </Link>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle className="mb-4">Pricing</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">Same as Card/ACH</p>
                <p className="text-sm text-dash-text-secondary mt-1">Per recurring payment</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">$0</p>
                <p className="text-sm text-dash-text-secondary mt-1">Monthly platform fee</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">Unlimited</p>
                <p className="text-sm text-dash-text-secondary mt-1">Subscription plans</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'plans' && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-dash-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle>Enable Subscriptions First</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2">
            Enable subscriptions to create and manage subscription plans for your customers.
          </CardDescription>
          <div className="mt-6">
            <Button variant="primary">Enable Subscriptions</Button>
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-dash-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <CardTitle>Enable Subscriptions First</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2">
            Enable subscriptions to configure billing settings, dunning, and notifications.
          </CardDescription>
          <div className="mt-6">
            <Button variant="primary">Enable Subscriptions</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
