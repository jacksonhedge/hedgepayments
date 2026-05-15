'use client'

import Link from 'next/link'

export default function TestingPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Testing & Sandbox
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Test your integration before going live with real payments
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Sandbox Environment</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          The sandbox environment is a complete replica of production. All API endpoints work identically, but no real money is processed. Test thoroughly before switching to production.
        </p>
      </div>

      {/* Environment Setup */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Environment Setup
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Environment</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Base URL</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Key Prefix</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Sandbox</td>
                <td className="py-3 px-4 font-mono text-sm">https://api-sandbox.hedgepayments.com</td>
                <td className="py-3 pl-4 font-mono text-sm">sk_test_</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Production</td>
                <td className="py-3 px-4 font-mono text-sm">https://api.hedgepayments.com</td>
                <td className="py-3 pl-4 font-mono text-sm">sk_live_</td>
              </tr>
            </tbody>
          </table>
        </div>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// SDK Configuration
import { HedgePayments } from '@hedgepayments/node'

// Sandbox
const hedgeTest = new HedgePayments({
  apiKey: process.env.HEDGE_TEST_API_KEY,  // pk_test_...
  apiSecret: process.env.HEDGE_TEST_SECRET, // sk_test_...
  environment: 'sandbox'
})

// Production
const hedgeLive = new HedgePayments({
  apiKey: process.env.HEDGE_LIVE_API_KEY,  // pk_live_...
  apiSecret: process.env.HEDGE_LIVE_SECRET, // sk_live_...
  environment: 'production'
})`}</code>
        </pre>
      </div>

      {/* Test Cards */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Test Card Numbers
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Use these card numbers in sandbox mode. Use any future expiration date and any 3-digit CVC (4-digit for Amex).
        </p>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Successful Payments
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Number</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Brand</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4242 4242 4242 4242</td>
                <td className="py-3 px-4">Visa</td>
                <td className="py-3 pl-4">Succeeds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">5555 5555 5555 4444</td>
                <td className="py-3 px-4">Mastercard</td>
                <td className="py-3 pl-4">Succeeds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">3782 822463 10005</td>
                <td className="py-3 px-4">Amex</td>
                <td className="py-3 pl-4">Succeeds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">6011 1111 1111 1117</td>
                <td className="py-3 px-4">Discover</td>
                <td className="py-3 pl-4">Succeeds</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">3566 0020 2036 0505</td>
                <td className="py-3 px-4">JCB</td>
                <td className="py-3 pl-4">Succeeds</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Decline Scenarios
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Number</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Error Code</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 0002</td>
                <td className="py-3 px-4 font-mono text-sm">card_declined</td>
                <td className="py-3 pl-4">Generic decline</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 9995</td>
                <td className="py-3 px-4 font-mono text-sm">insufficient_funds</td>
                <td className="py-3 pl-4">Insufficient funds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 9987</td>
                <td className="py-3 px-4 font-mono text-sm">lost_card</td>
                <td className="py-3 pl-4">Lost card</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 9979</td>
                <td className="py-3 px-4 font-mono text-sm">stolen_card</td>
                <td className="py-3 pl-4">Stolen card</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 0069</td>
                <td className="py-3 px-4 font-mono text-sm">expired_card</td>
                <td className="py-3 pl-4">Expired card</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">4000 0000 0000 0127</td>
                <td className="py-3 px-4 font-mono text-sm">incorrect_cvc</td>
                <td className="py-3 pl-4">Incorrect CVC</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          3D Secure Test Cards
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Number</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Behavior</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 3220</td>
                <td className="py-3 pl-4">3DS required, authentication succeeds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">4000 0000 0000 3063</td>
                <td className="py-3 pl-4">3DS required, authentication fails</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">4000 0000 0000 3055</td>
                <td className="py-3 pl-4">3DS supported but not required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Test ACH */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Test ACH Accounts
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          For Plaid sandbox bank linking:
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            <div>
              <p className="text-[#8B7E6E] mb-1">Username</p>
              <code className="text-[#2C2416]">user_good</code>
            </div>
            <div>
              <p className="text-[#8B7E6E] mb-1">Password</p>
              <code className="text-[#2C2416]">pass_good</code>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Account Number</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Routing</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Result</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">1111222233330000</td>
                <td className="py-3 px-4 font-mono">011401533</td>
                <td className="py-3 pl-4 text-[#4CAF50]">Success</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono">1111222233331111</td>
                <td className="py-3 px-4 font-mono">011401533</td>
                <td className="py-3 pl-4 text-[#F44336]">Insufficient Funds</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono">1111222233332222</td>
                <td className="py-3 px-4 font-mono">011401533</td>
                <td className="py-3 pl-4 text-[#F44336]">Account Closed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Webhooks */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Testing Webhooks
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Test webhook delivery without making real transactions:
        </p>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Local Development
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`# Install the Hedge CLI
npm install -g @hedgepayments/cli

# Forward webhooks to your local server
hedge listen --forward-to localhost:3000/webhooks/hedge

# In another terminal, trigger test events
hedge trigger payment.succeeded
hedge trigger payment.failed
hedge trigger ach.returned`}</code>
        </pre>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          API Trigger
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Trigger a test webhook event via API
await hedge.webhooks.trigger({
  event: 'payment.succeeded',
  payload: {
    id: 'pay_test123',
    amount: 9999,
    status: 'succeeded'
  }
})`}</code>
        </pre>
      </div>

      {/* Sandbox Limits */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Sandbox Limitations
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>• No real money is processed</li>
          <li>• Test transactions are automatically cleared after 24 hours</li>
          <li>• Rate limits are more permissive than production</li>
          <li>• Webhook retries happen faster for easier testing</li>
          <li>• Some fraud checks are disabled</li>
        </ul>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>⚠️ Important:</strong> Never use real card numbers in sandbox mode, and never use test card numbers in production.
          </p>
        </div>
      </div>

      {/* Go Live Checklist */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Go-Live Checklist
        </h2>

        <div className="space-y-3 not-prose mb-6">
          {[
            'Switch from sandbox to production API keys',
            'Verify webhook endpoint is publicly accessible',
            'Test a real transaction with a small amount',
            'Configure production webhook URL in dashboard',
            'Enable email notifications for failed payments',
            'Set up monitoring and alerting',
            'Review and configure fraud rules',
            'Complete business verification (KYB)',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white border border-[#D4C5B0] rounded">
              <input type="checkbox" className="w-5 h-5 rounded border-[#D4C5B0]" />
              <span className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>{item}</span>
            </div>
          ))}
        </div>
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
              Set up event notifications
            </p>
          </Link>

          <Link
            href="/docs/reference/errors"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              ❌ Error Handling
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Handle errors gracefully
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
