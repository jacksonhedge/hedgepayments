'use client'

import Link from 'next/link'

export default function CoverPayReactSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/docs/coverpay" className="hover:text-white">CoverPay</Link>
          <span>/</span>
          <span className="text-white">React SDK</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">React SDK</h1>
        <p className="text-xl text-gray-300 mb-12">
          First-class React components and hooks for seamless CoverPay integration.
        </p>

        {/* Installation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">npm install @hedgepayments/coverpay-react</code>
          </pre>
          <p className="text-gray-400 text-sm mt-2">or with yarn:</p>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto mt-2">
            <code className="text-green-400 text-sm">yarn add @hedgepayments/coverpay-react</code>
          </pre>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <p className="text-gray-300 mb-4">
            Wrap your app with CoverPayProvider and use the CoverPayButton component.
          </p>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`import { CoverPayProvider, CoverPayButton } from '@hedgepayments/coverpay-react';

function App() {
  return (
    <CoverPayProvider publishableKey="pk_test_xxx">
      <Checkout />
    </CoverPayProvider>
  );
}

function Checkout() {
  return (
    <CoverPayButton
      amount={249.99}
      orderId="order_123"
      customer={{ email: 'customer@example.com' }}
      onSuccess={(result) => {
        console.log('Approved by:', result.provider);
        window.location.href = '/success';
      }}
      onDeclined={(declined) => {
        console.log('All providers declined');
      }}
    />
  );
}`}</code>
          </pre>
        </div>

        {/* Components */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Components</h2>

          {/* CoverPayProvider */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">CoverPayProvider</h3>
            <p className="text-gray-300 mb-4">
              Context provider that configures the SDK. Wrap your app or checkout component.
            </p>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Props</h4>
            <div className="bg-black/30 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-2">Prop</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Required</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr>
                    <td className="py-1"><code className="text-green-400">publishableKey</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Your publishable API key</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">apiBase</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>API base URL (default: production)</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">testMode</code></td>
                    <td>boolean</td>
                    <td>No</td>
                    <td>Enable test mode (default: true)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CoverPayButton */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">CoverPayButton</h3>
            <p className="text-gray-300 mb-4">
              A ready-to-use button that opens the provider selection modal and handles checkout.
            </p>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Props</h4>
            <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-2">Prop</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Required</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr>
                    <td className="py-1"><code className="text-green-400">amount</code></td>
                    <td>number</td>
                    <td>Yes</td>
                    <td>Order total</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">currency</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>Currency code (default: USD)</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">orderId</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>Your order reference</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">customer</code></td>
                    <td>Customer</td>
                    <td>No</td>
                    <td>Customer info (email, phone, name)</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">onSuccess</code></td>
                    <td>function</td>
                    <td>No</td>
                    <td>Called when payment is approved</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">onDeclined</code></td>
                    <td>function</td>
                    <td>No</td>
                    <td>Called when all providers decline</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">onError</code></td>
                    <td>function</td>
                    <td>No</td>
                    <td>Called on error</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">buttonText</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>Button text (default: Pay Later)</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">className</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>CSS class name</td>
                  </tr>
                  <tr>
                    <td className="py-1"><code className="text-green-400">style</code></td>
                    <td>CSSProperties</td>
                    <td>No</td>
                    <td>Inline styles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* useCoverPay Hook */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">useCoverPay Hook</h2>
          <p className="text-gray-300 mb-4">
            For custom integrations, use the useCoverPay hook to access the full API.
          </p>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`import { useCoverPay } from '@hedgepayments/coverpay-react';

function CustomCheckout() {
  const {
    status,
    session,
    eligibility,
    selectedProvider,
    selectedPlan,
    error,
    isLoading,
    createSession,
    checkEligibility,
    selectProvider,
    checkout,
    reset,
  } = useCoverPay();

  const handleInit = async () => {
    await createSession({
      amount: 249.99,
      orderId: 'order_123',
      customer: { email: 'customer@example.com' },
    });
    await checkEligibility();
  };

  const handleProviderSelect = (providerId: string) => {
    selectProvider(providerId);
  };

  const handleCheckout = async () => {
    const result = await checkout();
    // Redirect to provider
    window.location.href = result.checkoutUrl;
  };

  return (
    <div>
      <button onClick={handleInit} disabled={isLoading}>
        Initialize
      </button>

      {eligibility?.providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => handleProviderSelect(provider.id)}
          className={selectedProvider?.id === provider.id ? 'selected' : ''}
        >
          {provider.name}
        </button>
      ))}

      <button onClick={handleCheckout} disabled={!selectedProvider}>
        Checkout with {selectedProvider?.name}
      </button>
    </div>
  );
}`}</code>
          </pre>

          <h3 className="text-lg font-semibold text-white mt-8 mb-4">Return Values</h3>
          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-2">Property</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr>
                  <td className="py-1"><code className="text-green-400">status</code></td>
                  <td>CoverPayStatus</td>
                  <td>Current status (idle, creating_session, etc.)</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">session</code></td>
                  <td>Session | null</td>
                  <td>Current session data</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">eligibility</code></td>
                  <td>EligibilityResult | null</td>
                  <td>Provider eligibility results</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">selectedProvider</code></td>
                  <td>Provider | null</td>
                  <td>Currently selected provider</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">selectedPlan</code></td>
                  <td>PaymentPlan | null</td>
                  <td>Currently selected payment plan</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">error</code></td>
                  <td>Error | null</td>
                  <td>Current error, if any</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">isLoading</code></td>
                  <td>boolean</td>
                  <td>True during API operations</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">createSession</code></td>
                  <td>function</td>
                  <td>Create a checkout session</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">checkEligibility</code></td>
                  <td>function</td>
                  <td>Check provider eligibility</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">selectProvider</code></td>
                  <td>function</td>
                  <td>Select a provider and plan</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">checkout</code></td>
                  <td>function</td>
                  <td>Initiate checkout with selected provider</td>
                </tr>
                <tr>
                  <td className="py-1"><code className="text-green-400">reset</code></td>
                  <td>function</td>
                  <td>Reset all state</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TypeScript Types */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">TypeScript Support</h3>
          <p className="text-gray-300 mb-4">
            All components and hooks are fully typed. Import types as needed:
          </p>
          <pre className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400 text-sm">{`import type {
  Customer,
  Provider,
  PaymentPlan,
  Session,
  EligibilityResult,
  CheckoutResult,
  CoverPayStatus,
} from '@hedgepayments/coverpay-react';`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
