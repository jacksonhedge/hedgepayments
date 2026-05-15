'use client'

import Link from 'next/link'

export default function CoverPayDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <h1 className="text-4xl font-bold text-white">CoverPay</h1>
          </div>
          <p className="text-xl text-gray-300">
            BNPL Orchestration Widget - Route customers through multiple Buy Now, Pay Later providers
            with intelligent waterfall logic.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-2xl mb-2">🔀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Waterfall Routing</h3>
            <p className="text-gray-400 text-sm">
              If one provider declines, automatically try the next one in your priority order.
              Maximize approval rates.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-2xl mb-2">🔑</div>
            <h3 className="text-lg font-semibold text-white mb-2">Bring Your Own Keys</h3>
            <p className="text-gray-400 text-sm">
              Use your existing Klarna, Affirm, Afterpay, and Sezzle accounts. Keep your relationships.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Drop-in Widget</h3>
            <p className="text-gray-400 text-sm">
              Add a single script tag to your checkout. Works with any platform - Shopify, WooCommerce, custom.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-2xl mb-2">⚛️</div>
            <h3 className="text-lg font-semibold text-white mb-2">React SDK</h3>
            <p className="text-gray-400 text-sm">
              First-class React support with hooks and components for seamless integration.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
        <div className="space-y-4">
          <Link
            href="/docs/coverpay/quickstart"
            className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Quick Start</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Get CoverPay running on your checkout in 5 minutes
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/docs/coverpay/providers"
            className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Provider Setup</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Configure Klarna, Affirm, Afterpay, and Sezzle credentials
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/docs/coverpay/react-sdk"
            className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">React SDK</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Components and hooks for React applications
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/docs/coverpay/api-reference"
            className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">API Reference</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Sessions, eligibility, webhooks, and more
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Quick Code Example */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Quick Example</h2>
        <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
          <code className="text-green-400 text-sm">{`<!-- Add to your checkout page -->
<script src="https://js.hedgepayments.com/coverpay/v1.js"></script>
<div id="coverpay-checkout"></div>

<script>
  CoverPay.init({
    publishableKey: 'pk_test_xxx',
    amount: 249.99,
    orderId: 'order_123',
    customer: { email: 'customer@example.com' },
    onSuccess: (result) => {
      console.log('Approved by:', result.provider);
      window.location.href = '/success';
    }
  });
  CoverPay.mount('#coverpay-checkout');
</script>`}</code>
        </pre>

        {/* Supported Providers */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6">Supported Providers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Klarna', color: '#FFB3C7' },
            { name: 'Affirm', color: '#0FA0EA' },
            { name: 'Afterpay', color: '#B2FCE4' },
            { name: 'Sezzle', color: '#382757' },
          ].map((provider) => (
            <div
              key={provider.name}
              className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
            >
              <div
                className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: provider.color + '30', color: provider.color }}
              >
                {provider.name.charAt(0)}
              </div>
              <div className="text-white font-medium">{provider.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
