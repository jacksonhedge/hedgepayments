'use client'

import Link from 'next/link'

export default function CoverPayProvidersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/docs/coverpay" className="hover:text-white">CoverPay</Link>
          <span>/</span>
          <span className="text-white">Provider Setup</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">Provider Setup</h1>
        <p className="text-xl text-gray-300 mb-12">
          Configure your BNPL provider credentials to enable the waterfall routing.
        </p>

        {/* Klarna */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#FFB3C730', color: '#FFB3C7' }}
            >
              K
            </div>
            <h2 className="text-2xl font-bold text-white">Klarna</h2>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Required Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username (API Key)</label>
                <p className="text-gray-300 text-sm">
                  Found in Klarna Merchant Portal under Settings → API Credentials
                </p>
                <code className="text-green-400 text-sm">Format: PK12345_abcd1234...</code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password (API Secret)</label>
                <p className="text-gray-300 text-sm">
                  Generated when you create API credentials in the Merchant Portal
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Merchant ID</label>
                <p className="text-gray-300 text-sm">
                  Your Klarna Merchant ID (starts with K)
                </p>
                <code className="text-green-400 text-sm">Format: K12345678</code>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">Sandbox URLs</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>API: <code className="text-green-400">https://api.playground.klarna.com</code></li>
                <li>Portal: <code className="text-green-400">https://portal.playground.klarna.com</code></li>
              </ul>
            </div>
            <a
              href="https://docs.klarna.com/klarna-payments/get-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-green-400 hover:text-green-300 text-sm"
            >
              Klarna Documentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Affirm */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#0FA0EA30', color: '#0FA0EA' }}
            >
              A
            </div>
            <h2 className="text-2xl font-bold text-white">Affirm</h2>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Required Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Public API Key</label>
                <p className="text-gray-300 text-sm">
                  Found in Affirm Merchant Dashboard under Developer → API Keys
                </p>
                <code className="text-green-400 text-sm">Format: public_xxx...</code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Private API Key</label>
                <p className="text-gray-300 text-sm">
                  Your secret key for server-side API calls
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Merchant ID (optional)</label>
                <p className="text-gray-300 text-sm">
                  Required only if you have multiple merchant accounts
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">Sandbox URLs</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>API: <code className="text-green-400">https://sandbox.affirm.com/api/v2</code></li>
                <li>Dashboard: <code className="text-green-400">https://sandbox.affirm.com</code></li>
              </ul>
            </div>
            <a
              href="https://docs.affirm.com/affirm-developers/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-green-400 hover:text-green-300 text-sm"
            >
              Affirm Documentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Afterpay */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#B2FCE430', color: '#10B981' }}
            >
              A
            </div>
            <h2 className="text-2xl font-bold text-white">Afterpay</h2>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Required Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Merchant ID</label>
                <p className="text-gray-300 text-sm">
                  Your Afterpay Merchant ID from the Merchant Portal
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Secret Key</label>
                <p className="text-gray-300 text-sm">
                  API secret key for authentication
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">Sandbox URLs</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>API: <code className="text-green-400">https://api-sandbox.afterpay.com</code></li>
                <li>Portal: <code className="text-green-400">https://portal-sandbox.afterpay.com</code></li>
              </ul>
            </div>
            <a
              href="https://developers.afterpay.com/afterpay-online/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-green-400 hover:text-green-300 text-sm"
            >
              Afterpay Documentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sezzle */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white"
              style={{ backgroundColor: '#38275730' }}
            >
              S
            </div>
            <h2 className="text-2xl font-bold text-white">Sezzle</h2>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Required Credentials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Public Key</label>
                <p className="text-gray-300 text-sm">
                  Found in Sezzle Merchant Dashboard under Settings → API Keys
                </p>
                <code className="text-green-400 text-sm">Format: sz_pub_xxx...</code>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Private Key</label>
                <p className="text-gray-300 text-sm">
                  Your secret key for server-side API calls
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Merchant UUID</label>
                <p className="text-gray-300 text-sm">
                  Your unique merchant identifier
                </p>
                <code className="text-green-400 text-sm">Format: uuid-xxx-xxx</code>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2">Sandbox URLs</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>API: <code className="text-green-400">https://sandbox.gateway.sezzle.com</code></li>
                <li>Dashboard: <code className="text-green-400">https://sandbox.dashboard.sezzle.com</code></li>
              </ul>
            </div>
            <a
              href="https://docs.sezzle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-green-400 hover:text-green-300 text-sm"
            >
              Sezzle Documentation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Waterfall Priority */}
        <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20 mb-12">
          <h3 className="text-xl font-bold text-white mb-4">Waterfall Priority</h3>
          <p className="text-gray-300 mb-4">
            After configuring your providers, set the waterfall priority order in the dashboard.
            When a customer checks out, providers are tried in order until one approves.
          </p>
          <ul className="text-gray-300 space-y-2 list-disc ml-6">
            <li>Drag providers to reorder priority</li>
            <li>First enabled provider is tried first</li>
            <li>If declined, the next provider is automatically tried</li>
            <li>This maximizes approval rates while respecting your preferences</li>
          </ul>
          <Link
            href="/dashboard/coverpay/providers"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Configure in Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
