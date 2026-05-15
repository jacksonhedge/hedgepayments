'use client'

import Link from 'next/link'

export default function CardCheckoutPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs/checkout" className="hover:text-[#2C2416]">Checkout</Link>
          <span>/</span>
          <span>Card Checkout</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Card Checkout
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Accept credit cards, debit cards, Apple Pay, and Google Pay with enterprise-grade security
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Supported Card Types</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Visa, Mastercard, American Express, Discover, JCB, Diners Club, and UnionPay. Plus Apple Pay and Google Pay for seamless mobile checkout.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-8">
        <h3 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
          📋 Prerequisites
        </h3>
        <ul className="text-[#2C2416] text-base space-y-2 mb-0">
          <li>Hedge Payments account with API credentials</li>
          <li>Completed business verification (for live payments)</li>
          <li>SSL certificate on your domain (required for card processing)</li>
        </ul>
      </div>

      {/* Step 1: Installation */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 1: Install the SDK
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Install the Hedge Payments React SDK to get started with card checkout:
        </p>

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
        </div>
      </div>

      {/* Step 2: Configure Provider */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 2: Configure the Provider
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Wrap your application with the HedgePaymentsProvider:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgePaymentsProvider } from '@hedgepayments/react'

function App() {
  return (
    <HedgePaymentsProvider
      merchantId="your_merchant_id"
      env="sandbox" // or 'prod' for production
    >
      <YourApp />
    </HedgePaymentsProvider>
  )
}`}</code>
        </pre>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>💡 Tip:</strong> Use <code>env="sandbox"</code> during development. Switch to <code>env="prod"</code> when you're ready to accept real payments.
          </p>
        </div>
      </div>

      {/* Step 3: Add Card Form */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 3: Add the Card Form
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Use the HedgeCardForm component to collect card details securely:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgeCardForm, useHedgePayments } from '@hedgepayments/react'

function CheckoutPage() {
  const { tokenize, processing } = useHedgePayments()

  const handleSubmit = async () => {
    try {
      // Tokenize the card details
      const token = await tokenize()

      // Send token to your backend to create the charge
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          amount: 9999, // $99.99 in cents
          currency: 'USD'
        })
      })

      const result = await response.json()
      console.log('Payment successful:', result)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2>Payment Details</h2>

      <HedgeCardForm
        onReady={() => console.log('Form ready')}
        onError={(error) => console.error('Form error:', error)}
        styles={{
          input: {
            fontSize: '16px',
            color: '#333',
          }
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={processing}
        className="w-full mt-4 py-3 bg-green-600 text-white rounded"
      >
        {processing ? 'Processing...' : 'Pay $99.99'}
      </button>
    </div>
  )
}`}</code>
        </pre>
      </div>

      {/* Step 4: Backend Charge */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 4: Create the Charge (Backend)
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          On your backend, use the token to create a charge:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`import { HedgePayments } from '@hedgepayments/node'

const hedge = new HedgePayments({
  apiKey: process.env.HEDGE_API_KEY,
  apiSecret: process.env.HEDGE_API_SECRET
})

app.post('/api/charge', async (req, res) => {
  const { token, amount, currency } = req.body

  try {
    const charge = await hedge.charges.create({
      token,
      amount,
      currency,
      description: 'Order #12345',
      metadata: {
        orderId: '12345',
        customerId: 'cust_abc123'
      }
    })

    res.json({
      success: true,
      chargeId: charge.id,
      status: charge.status
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/v1/charges \\
  -H "Authorization: Bearer YOUR_API_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "tok_abc123...",
    "amount": 9999,
    "currency": "USD",
    "description": "Order #12345"
  }'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Apple Pay & Google Pay */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Apple Pay & Google Pay
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Enable digital wallet payments with minimal additional configuration:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`import { HedgeCardForm, ApplePayButton, GooglePayButton } from '@hedgepayments/react'

function CheckoutPage() {
  const handlePaymentComplete = (result) => {
    console.log('Payment completed:', result)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Digital Wallet Buttons */}
      <div className="flex gap-4 mb-6">
        <ApplePayButton
          amount={9999}
          currency="USD"
          onComplete={handlePaymentComplete}
          className="flex-1"
        />
        <GooglePayButton
          amount={9999}
          currency="USD"
          onComplete={handlePaymentComplete}
          className="flex-1"
        />
      </div>

      <div className="text-center text-gray-500 my-4">
        — or pay with card —
      </div>

      {/* Card Form */}
      <HedgeCardForm />

      <button className="w-full mt-4 py-3 bg-green-600 text-white rounded">
        Pay $99.99
      </button>
    </div>
  )
}`}</code>
        </pre>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>⚠️ Note:</strong> Apple Pay requires domain verification. Follow our <Link href="/docs/checkout/apple-pay-setup" className="text-[#2C2416] underline">Apple Pay Setup Guide</Link> to register your domain.
          </p>
        </div>
      </div>

      {/* 3D Secure */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          3D Secure Authentication
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          3D Secure is automatically enabled for all card transactions. When required, customers will see a verification step from their bank:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`const charge = await hedge.charges.create({
  token,
  amount: 9999,
  currency: 'USD',
  // 3D Secure options
  threeDSecure: {
    required: true, // Force 3DS for all transactions
    challengePreference: 'challenge_requested' // or 'no_preference'
  },
  // Return URL after 3DS verification
  returnUrl: 'https://yoursite.com/checkout/complete'
})`}</code>
        </pre>

        <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>✓ Liability Shift:</strong> Successful 3D Secure authentication shifts chargeback liability to the card issuer, protecting your business from fraud disputes.
          </p>
        </div>
      </div>

      {/* Test Cards */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Test Cards
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Use these test card numbers in sandbox mode:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Card Number</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Brand</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Result</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4242 4242 4242 4242</td>
                <td className="py-3 px-4">Visa</td>
                <td className="py-3 pl-4 text-[#4CAF50]">Success</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">5555 5555 5555 4444</td>
                <td className="py-3 px-4">Mastercard</td>
                <td className="py-3 pl-4 text-[#4CAF50]">Success</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">3782 822463 10005</td>
                <td className="py-3 px-4">Amex</td>
                <td className="py-3 pl-4 text-[#4CAF50]">Success</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 0002</td>
                <td className="py-3 px-4">Visa</td>
                <td className="py-3 pl-4 text-[#F44336]">Declined</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 3220</td>
                <td className="py-3 px-4">Visa</td>
                <td className="py-3 pl-4 text-[#2196F3]">3DS Required</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">4000 0000 0000 9995</td>
                <td className="py-3 px-4">Visa</td>
                <td className="py-3 pl-4 text-[#F44336]">Insufficient Funds</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[#6B5D4F] text-base">
          Use any future expiration date and any 3-digit CVC (4-digit for Amex).
        </p>
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
            href="/docs/checkout/ach"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🏦 ACH Payments
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Lower fees with bank transfers for US customers
            </p>
          </Link>

          <Link
            href="/docs/guides/webhooks"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔔 Webhooks
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Receive real-time payment notifications
            </p>
          </Link>

          <Link
            href="/docs/checkout/subscriptions"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔄 Subscriptions
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Set up recurring payments with stored cards
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
              Complete testing scenarios and error handling
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
