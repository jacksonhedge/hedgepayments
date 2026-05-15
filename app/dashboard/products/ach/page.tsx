'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import MetricCard from '../../components/widgets/MetricCard'

export default function ACHDashboard() {
  const { isTestMode } = useMode()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-dash-status-info rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">ACH Payments</h1>
            <p className="text-dash-text-secondary">Bank transfers with lower fees via Plaid</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" size="md">Active</Badge>
          <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
            {isTestMode ? 'Test Mode' : 'Live Mode'}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-dash-surface-border">
        <nav className="flex gap-6">
          {(['overview', 'transactions', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-dash-status-info text-dash-status-info'
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
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Volume"
              value="$4,210.00"
              trend={{ value: 22.5, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Transactions"
              value="44"
              trend={{ value: 18.2, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Avg. Transaction"
              value="$95.68"
              trend={{ value: 5.1, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Settlement Time"
              value="3-5 days"
              subtitle="standard ACH"
            />
          </div>

          {/* Fee Comparison */}
          <Card className="bg-dash-status-success/5 border-dash-status-success/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-dash-status-success rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-dash-text-primary">Save up to 80% on fees</h2>
                <p className="text-dash-text-secondary text-sm mt-1">
                  ACH payments cost only 0.5% per transaction (capped at $5) compared to 2.9% + $0.30 for cards.
                  A $200 payment saves you $5.80 in fees.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Integration */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Quick Integration</CardTitle>
              <CardDescription>Accept ACH payments with Plaid bank linking</CardDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-dash-surface-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dash-text-primary">{`import { HedgePaymentsProvider, HedgeACHForm } from '@hedgepayments/react';

function ACHCheckout() {
  return (
    <HedgePaymentsProvider
      merchantId="your_merchant_id"
      env="${isTestMode ? 'sandbox' : 'prod'}"
    >
      <HedgeACHForm
        amount={10000} // $100.00
        onSuccess={(result) => {
          // ACH payments are pending until settled
          console.log('Payment initiated!', result.status);
        }}
        onError={(error) => console.error('Payment failed:', error)}
      />
    </HedgePaymentsProvider>
  );
}`}</pre>
              </div>
              <div className="flex gap-3">
                <Link href="/docs/checkout/ach">
                  <Button variant="primary">View Documentation</Button>
                </Link>
                <Link href="/docs/checkout/react-sdk">
                  <Button variant="secondary">React SDK Reference</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* ACH Status Flow */}
          <Card>
            <CardTitle className="mb-4">ACH Payment Status Flow</CardTitle>
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {[
                { status: 'pending', label: 'Pending', description: 'Payment initiated' },
                { status: 'processing', label: 'Processing', description: 'Bank verification' },
                { status: 'completed', label: 'Completed', description: 'Funds settled' },
              ].map((step, index) => (
                <div key={step.status} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 2 ? 'bg-dash-status-success' : 'bg-dash-status-info'
                    }`}>
                      <span className="text-white font-medium">{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-dash-text-primary mt-2">{step.label}</p>
                    <p className="text-xs text-dash-text-secondary">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="w-20 h-0.5 bg-dash-surface-border mx-4" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle className="mb-4">Pricing</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">0.5%</p>
                <p className="text-sm text-dash-text-secondary mt-1">Per transaction (capped at $5)</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">$0</p>
                <p className="text-sm text-dash-text-secondary mt-1">Setup or monthly fees</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">$5 max</p>
                <p className="text-sm text-dash-text-secondary mt-1">Fee cap on any transaction</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardTitle className="mb-4">Recent ACH Transactions</CardTitle>
          <div className="text-center py-8 text-dash-text-secondary">
            {isTestMode ? (
              <div className="space-y-4">
                <p>No test transactions yet. Use these test credentials with Plaid:</p>
                <div className="inline-block text-left bg-dash-surface-bg rounded-lg p-4 font-mono text-sm">
                  <p><span className="text-dash-text-secondary">Username:</span> user_good</p>
                  <p><span className="text-dash-text-secondary">Password:</span> pass_good</p>
                </div>
              </div>
            ) : (
              <p>ACH transactions will appear here once you go live.</p>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardTitle className="mb-4">ACH Settings</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Plaid Integration</p>
                  <p className="text-sm text-dash-text-secondary">Bank account verification via Plaid Link</p>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Minimum Transaction</p>
                  <p className="text-sm text-dash-text-secondary">Minimum amount for ACH payments</p>
                </div>
                <span className="text-dash-text-primary font-medium">$1.00</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Maximum Transaction</p>
                  <p className="text-sm text-dash-text-secondary">Maximum amount for ACH payments</p>
                </div>
                <span className="text-dash-text-primary font-medium">$25,000.00</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-4">Return Handling</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Automatic Retry</p>
                  <p className="text-sm text-dash-text-secondary">Retry failed ACH debits automatically</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Return Webhook</p>
                  <p className="text-sm text-dash-text-secondary">Receive notifications for ACH returns</p>
                </div>
                <Badge variant="success">Configured</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
