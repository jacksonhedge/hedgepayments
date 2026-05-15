'use client'

import Link from 'next/link'

export default function ReactSDKPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs/checkout" className="hover:text-[#2C2416]">Checkout</Link>
          <span>/</span>
          <span>React SDK</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          React SDK
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Embed secure payment components directly in your React application
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>@hedgepayments/react</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Pre-built, PCI-compliant components for accepting payments. Includes card forms, bank account linking, digital wallets, and crypto checkout - all with full TypeScript support.
        </p>
      </div>

      {/* Installation */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Installation
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>npm</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`npm install @hedgepayments/react`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>yarn</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`yarn add @hedgepayments/react`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>pnpm</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`pnpm add @hedgepayments/react`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Quick Start
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Wrap your app with the provider and start using components:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgePaymentsProvider, HedgePurchase } from '@hedgepayments/react'

function App() {
  return (
    <HedgePaymentsProvider
      merchantId="your_merchant_id"
      env="sandbox"
    >
      <CheckoutPage />
    </HedgePaymentsProvider>
  )
}

function CheckoutPage() {
  return (
    <HedgePurchase
      amount={9999}
      onSuccess={(result) => console.log('Payment successful:', result)}
      onError={(error) => console.error('Payment failed:', error)}
    />
  )
}`}</code>
        </pre>
      </div>

      {/* Provider Props */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          HedgePaymentsProvider
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          The provider component that initializes the SDK and provides context to all child components.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Prop</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Required</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">merchantId</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 px-4 text-[#4CAF50]">Yes</td>
                <td className="py-3 pl-4 text-sm">Your Hedge Payments merchant ID</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">env</td>
                <td className="py-3 px-4 font-mono text-sm">'sandbox' | 'prod'</td>
                <td className="py-3 px-4 text-[#4CAF50]">Yes</td>
                <td className="py-3 pl-4 text-sm">Environment to use</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">sessionKey</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 pl-4 text-sm">Pre-generated session key for authenticated users</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">wallet</td>
                <td className="py-3 px-4 font-mono text-sm">WalletAdapter</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 pl-4 text-sm">Connected wallet for crypto payments</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">theme</td>
                <td className="py-3 px-4 font-mono text-sm">ThemeConfig</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 pl-4 text-sm">Custom theme configuration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HedgePurchase Component */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          HedgePurchase
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Full checkout component with payment method selection, card form, and payment processing.
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgePurchase } from '@hedgepayments/react'

<HedgePurchase
  // Required
  amount={9999}                    // Amount in cents

  // Optional - Payment configuration
  currency="USD"                   // Default: USD
  email="customer@example.com"     // Pre-fill customer email
  paymentMethods={['card', 'ach', 'crypto']}  // Enabled methods

  // Optional - Settlement
  settlementType="USDC"            // 'Credits' | 'USDC' | 'Bank'
  settlementWallet="0x..."         // For USDC settlement

  // Optional - Subscriptions
  planCode="monthly_pro"           // Subscription plan code

  // Optional - Callbacks
  onSuccess={(result) => {}}       // Payment succeeded
  onError={(error) => {}}          // Payment failed
  onReady={() => {}}               // Component loaded

  // Optional - Styling
  height={600}                     // Component height in pixels
  className="my-checkout"          // Additional CSS classes
/>`}</code>
        </pre>
      </div>

      {/* HedgeCardForm Component */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          HedgeCardForm
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Standalone card input form for collecting and tokenizing card details. Use this when you need a custom checkout UI.
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgeCardForm, useHedgePayments } from '@hedgepayments/react'

function CustomCheckout() {
  const { tokenize, processing, error } = useHedgePayments()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = await tokenize()
      // Send token to your backend
      await processPayment(token)
    } catch (err) {
      console.error('Tokenization failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <HedgeCardForm
        onReady={() => console.log('Card form ready')}
        onFocus={(field) => console.log('Focused:', field)}
        onBlur={(field) => console.log('Blurred:', field)}
        onError={(err) => console.error('Form error:', err)}
        styles={{
          base: {
            fontSize: '16px',
            color: '#333',
            fontFamily: 'Inter, sans-serif'
          },
          invalid: {
            color: '#ef4444'
          }
        }}
      />

      {error && <p className="text-red-500">{error.message}</p>}

      <button type="submit" disabled={processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}`}</code>
        </pre>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Prop</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">onReady</td>
                <td className="py-3 px-4 font-mono text-sm">{'() => void'}</td>
                <td className="py-3 pl-4 text-sm">Called when the form is ready to accept input</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">onFocus</td>
                <td className="py-3 px-4 font-mono text-sm">{'(field: string) => void'}</td>
                <td className="py-3 pl-4 text-sm">Called when a field receives focus</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">onBlur</td>
                <td className="py-3 px-4 font-mono text-sm">{'(field: string) => void'}</td>
                <td className="py-3 pl-4 text-sm">Called when a field loses focus</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">onError</td>
                <td className="py-3 px-4 font-mono text-sm">{'(error: Error) => void'}</td>
                <td className="py-3 pl-4 text-sm">Called when validation error occurs</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">styles</td>
                <td className="py-3 px-4 font-mono text-sm">CardStyles</td>
                <td className="py-3 pl-4 text-sm">Custom styles for card inputs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HedgeWithdraw Component */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          HedgeWithdraw
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Component for withdrawing funds to bank accounts, cards, or crypto wallets.
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgeWithdraw } from '@hedgepayments/react'

<HedgeWithdraw
  // Required for crypto withdrawals
  wallet={connectedWallet}
  connection={solanaConnection}

  // Optional
  amount={10000}                   // Pre-fill amount (in cents)
  lockAmount={true}                // Disable amount editing
  email="user@example.com"         // Pre-fill email
  tokens={['USDC', 'SOL']}         // Limit available tokens

  // Callbacks
  onSuccess={(tx) => console.log('Withdrawal successful:', tx)}
  onError={(err) => console.error('Withdrawal failed:', err)}
/>`}</code>
        </pre>
      </div>

      {/* useHedgePayments Hook */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          useHedgePayments Hook
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Access SDK methods and state from any component within the provider.
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { useHedgePayments } from '@hedgepayments/react'

function MyComponent() {
  const {
    // Card tokenization
    tokenize,              // () => Promise<string> - Tokenize card form

    // State
    processing,            // boolean - Payment in progress
    error,                 // Error | null - Current error
    ready,                 // boolean - SDK initialized

    // Bank linking
    createBankToken,       // (opts) => Promise<string>

    // Utilities
    getSessionKey,         // () => Promise<string>
    validateCard,          // () => ValidationResult
  } = useHedgePayments()

  // Use in your component...
}`}</code>
        </pre>
      </div>

      {/* Styling */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Customizing Styles
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Match the payment components to your application's design:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`<HedgePaymentsProvider
  merchantId="your_merchant_id"
  env="sandbox"
  theme={{
    // Colors
    primary: '#10B981',        // Brand color
    background: '#ffffff',     // Background color
    text: '#1f2937',          // Text color
    error: '#ef4444',         // Error color

    // Typography
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',

    // Borders
    borderRadius: '8px',
    borderColor: '#e5e7eb',

    // Inputs
    inputBackground: '#f9fafb',
    inputPadding: '12px 16px',
  }}
>
  <App />
</HedgePaymentsProvider>`}</code>
        </pre>
      </div>

      {/* TypeScript */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          TypeScript Support
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Full TypeScript definitions are included:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import type {
  HedgePaymentsProviderProps,
  HedgePurchaseProps,
  HedgeCardFormProps,
  HedgeWithdrawProps,
  PaymentResult,
  TokenizeResult,
  PaymentMethod,
  SettlementType,
} from '@hedgepayments/react'

// All components and hooks are fully typed
const handleSuccess = (result: PaymentResult) => {
  console.log(result.transactionId)
  console.log(result.amount)
  console.log(result.status)
}`}</code>
        </pre>
      </div>

      {/* What's Next */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          What's Next?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 not-prose">
          <Link
            href="/docs/checkout/card"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              💳 Card Checkout Guide
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Complete tutorial for accepting card payments
            </p>
          </Link>

          <Link
            href="/docs/checkout/checkout-link"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔗 Checkout Links
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              No-code hosted payment pages
            </p>
          </Link>

          <Link
            href="/docs/checkout/api"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔧 API Reference
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Direct API integration for custom UIs
            </p>
          </Link>

          <Link
            href="/docs/testing"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🧪 Testing Guide
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Test cards, sandbox mode, and debugging
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
