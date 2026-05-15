'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import MetricCard from '../../components/widgets/MetricCard'

export default function CardCheckoutDashboard() {
  const { isTestMode } = useMode()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-dash-primary-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">Card Checkout</h1>
            <p className="text-dash-text-secondary">Accept credit/debit cards, Apple Pay & Google Pay</p>
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
                  ? 'border-dash-primary-500 text-dash-primary-500'
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
              value="$8,240.00"
              trend={{ value: 15.2, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Transactions"
              value="98"
              trend={{ value: 12.1, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Avg. Transaction"
              value="$84.08"
              trend={{ value: 2.5, isPositive: true }}
              subtitle="this month"
            />
            <MetricCard
              title="Success Rate"
              value="98.9%"
              trend={{ value: 0.3, isPositive: true }}
              subtitle="card payments"
            />
          </div>

          {/* Quick Integration */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Quick Integration</CardTitle>
              <CardDescription>Get started with card payments in minutes</CardDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-dash-surface-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dash-text-primary">{`import { HedgePaymentsProvider, HedgeCardForm } from '@hedgepayments/react';

function Checkout() {
  return (
    <HedgePaymentsProvider
      merchantId="your_merchant_id"
      env="${isTestMode ? 'sandbox' : 'prod'}"
    >
      <HedgeCardForm
        amount={2500} // $25.00
        onSuccess={(result) => console.log('Payment successful!', result)}
        onError={(error) => console.error('Payment failed:', error)}
      />
    </HedgePaymentsProvider>
  );
}`}</pre>
              </div>
              <div className="flex gap-3">
                <Link href="/docs/checkout/card">
                  <Button variant="primary">View Documentation</Button>
                </Link>
                <Link href="/docs/checkout/react-sdk">
                  <Button variant="secondary">React SDK Reference</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Supported Payment Methods */}
          <Card>
            <CardTitle className="mb-4">Supported Payment Methods</CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <span className="text-sm text-dash-text-primary">Visa</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
                <span className="text-sm text-dash-text-primary">Mastercard</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  AMEX
                </div>
                <span className="text-sm text-dash-text-primary">Amex</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  DISC
                </div>
                <span className="text-sm text-dash-text-primary">Discover</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-white text-xs">

                </div>
                <span className="text-sm text-dash-text-primary">Apple Pay</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-6 bg-white border border-dash-surface-border rounded flex items-center justify-center text-xs">
                  G
                </div>
                <span className="text-sm text-dash-text-primary">Google Pay</span>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle className="mb-4">Pricing</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">2.9% + $0.30</p>
                <p className="text-sm text-dash-text-secondary mt-1">Domestic cards</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">3.9% + $0.30</p>
                <p className="text-sm text-dash-text-secondary mt-1">International cards</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">0%</p>
                <p className="text-sm text-dash-text-secondary mt-1">Apple Pay / Google Pay surcharge</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardTitle className="mb-4">Recent Card Transactions</CardTitle>
          <div className="text-center py-8 text-dash-text-secondary">
            {isTestMode ? (
              <p>No test transactions yet. Create a test payment using the SDK.</p>
            ) : (
              <p>Card transactions will appear here once you go live.</p>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardTitle className="mb-4">3D Secure Settings</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">Enable 3D Secure</p>
                  <p className="text-sm text-dash-text-secondary">Add extra authentication for high-risk transactions</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div>
                  <p className="font-medium text-dash-text-primary">3DS Threshold</p>
                  <p className="text-sm text-dash-text-secondary">Require 3DS for transactions above this amount</p>
                </div>
                <span className="text-dash-text-primary font-medium">$100.00</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-4">Digital Wallets</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">

                  </div>
                  <div>
                    <p className="font-medium text-dash-text-primary">Apple Pay</p>
                    <p className="text-sm text-dash-text-secondary">Accept payments from Apple devices</p>
                  </div>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-dash-surface-border rounded-lg flex items-center justify-center">
                    G
                  </div>
                  <div>
                    <p className="font-medium text-dash-text-primary">Google Pay</p>
                    <p className="text-sm text-dash-text-secondary">Accept payments from Android devices</p>
                  </div>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
