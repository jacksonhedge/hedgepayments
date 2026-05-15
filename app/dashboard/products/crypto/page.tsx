'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function CryptoDashboard() {
  const { isTestMode } = useMode()
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-dash-status-warning rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">Crypto Payments</h1>
            <p className="text-dash-text-secondary">Accept USDC, SOL, ETH and more on Solana</p>
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
          {(['overview', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-dash-status-warning text-dash-status-warning'
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
          {/* Enable Crypto Banner */}
          <Card className="bg-dash-status-warning/10 border-dash-status-warning/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-dash-status-warning rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-dash-text-primary">Enable Crypto Payments</h2>
                <p className="text-dash-text-secondary text-sm mt-1">
                  Start accepting cryptocurrency payments with instant settlement. Connect your Solana wallet to get started.
                </p>
                <div className="mt-4">
                  <Button variant="primary">Enable Crypto Payments</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Supported Cryptocurrencies */}
          <Card>
            <CardTitle className="mb-4">Supported Cryptocurrencies</CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  USDC
                </div>
                <div>
                  <p className="font-medium text-dash-text-primary">USDC</p>
                  <p className="text-xs text-dash-text-secondary">USD Coin</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SOL
                </div>
                <div>
                  <p className="font-medium text-dash-text-primary">SOL</p>
                  <p className="text-xs text-dash-text-secondary">Solana</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ETH
                </div>
                <div>
                  <p className="font-medium text-dash-text-primary">ETH</p>
                  <p className="text-xs text-dash-text-secondary">Ethereum</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dash-surface-bg rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  USDT
                </div>
                <div>
                  <p className="font-medium text-dash-text-primary">USDT</p>
                  <p className="text-xs text-dash-text-secondary">Tether</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="w-10 h-10 bg-dash-status-success/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Instant Settlement</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Receive funds instantly in your wallet. No waiting for bank transfers.
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-dash-status-info/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-status-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Low Fees</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Only 1% per transaction. No chargebacks, no disputes.
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-dash-status-warning/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dash-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="font-semibold text-dash-text-primary">Global Reach</h3>
              <p className="text-dash-text-secondary text-sm mt-2">
                Accept payments from anywhere in the world with no geographic restrictions.
              </p>
            </Card>
          </div>

          {/* Integration Preview */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Integration Preview</CardTitle>
              <CardDescription>How crypto checkout will work once enabled</CardDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-dash-surface-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-dash-text-primary">{`import { HedgePaymentsProvider, HedgeCryptoCheckout } from '@hedgepayments/react';

function CryptoCheckout() {
  return (
    <HedgePaymentsProvider
      merchantId="your_merchant_id"
      env="${isTestMode ? 'sandbox' : 'prod'}"
    >
      <HedgeCryptoCheckout
        amount={5000} // $50.00
        acceptedCurrencies={['USDC', 'SOL', 'ETH']}
        onSuccess={(result) => {
          console.log('Crypto payment confirmed!', result.txHash);
        }}
      />
    </HedgePaymentsProvider>
  );
}`}</pre>
              </div>
              <Link href="/docs/checkout/crypto">
                <Button variant="secondary">View Documentation</Button>
              </Link>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle className="mb-4">Pricing</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">1%</p>
                <p className="text-sm text-dash-text-secondary mt-1">Per transaction</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">Instant</p>
                <p className="text-sm text-dash-text-secondary mt-1">Settlement time</p>
              </div>
              <div className="p-4 bg-dash-surface-bg rounded-lg">
                <p className="text-2xl font-semibold text-dash-text-primary">0%</p>
                <p className="text-sm text-dash-text-secondary mt-1">Chargeback rate</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'settings' && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-dash-status-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dash-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <CardTitle>Enable Crypto Payments First</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2">
            Connect your Solana wallet to enable crypto payments and access settings.
          </CardDescription>
          <div className="mt-6">
            <Button variant="primary">Enable Crypto Payments</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
