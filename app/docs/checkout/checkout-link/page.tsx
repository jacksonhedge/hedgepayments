'use client'

import Link from 'next/link'

export default function CheckoutLinkPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs/checkout" className="hover:text-[#2C2416]">Checkout</Link>
          <span>/</span>
          <span>Checkout Link</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Checkout Link
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Generate hosted payment URLs with no frontend development required
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Easiest Integration</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Checkout Links are the simplest way to accept payments. Generate a URL, redirect your customer, and we handle everything else - payment collection, security, and confirmations.
        </p>
      </div>

      {/* Use Cases */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          When to Use Checkout Links
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>✓ <strong>Invoices & payment requests:</strong> Email or text customers a link to pay</li>
          <li>✓ <strong>Simple e-commerce:</strong> Quick checkout without complex integration</li>
          <li>✓ <strong>Donations:</strong> One-click payment pages for nonprofits</li>
          <li>✓ <strong>Event tickets:</strong> Sell access with pre-set amounts</li>
          <li>✓ <strong>Service deposits:</strong> Collect payments before appointments</li>
        </ul>
      </div>

      {/* Create via Dashboard */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Create via Dashboard
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          The easiest way - no code required:
        </p>

        <ol className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li><strong>1.</strong> Go to your <Link href="/dashboard" className="text-[#2C2416] underline">Hedge Payments Dashboard</Link></li>
          <li><strong>2.</strong> Click "Payments" → "Create Checkout Link"</li>
          <li><strong>3.</strong> Enter amount, description, and optional settings</li>
          <li><strong>4.</strong> Copy the generated URL and share with your customer</li>
        </ol>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>💡 Tip:</strong> You can also create checkout links directly from invoices in the dashboard.
          </p>
        </div>
      </div>

      {/* Create via API */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Create via API
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Programmatically generate checkout links:
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

const checkoutLink = await hedge.checkoutLinks.create({
  // Required
  amount: 9999,                    // Amount in cents ($99.99)

  // Optional - Basic info
  currency: 'USD',
  description: 'Premium Plan - Annual',
  customerEmail: 'customer@example.com',

  // Optional - Redirect URLs
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',

  // Optional - Payment settings
  paymentMethods: ['card', 'ach'],  // Allowed methods
  expiresAt: '2024-12-31T23:59:59Z', // Link expiration

  // Optional - Metadata
  metadata: {
    orderId: 'order_123',
    customerId: 'cust_456'
  }
})

console.log('Checkout URL:', checkoutLink.url)
// https://checkout.hedgepayments.com/pay/cs_abc123...`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/v1/checkout-links \\
  -H "Authorization: Bearer YOUR_API_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 9999,
    "currency": "USD",
    "description": "Premium Plan - Annual",
    "success_url": "https://yoursite.com/success",
    "cancel_url": "https://yoursite.com/cancel"
  }'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Response Object */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Response Object
        </h2>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "cs_abc123xyz",
  "url": "https://checkout.hedgepayments.com/pay/cs_abc123xyz",
  "amount": 9999,
  "currency": "USD",
  "description": "Premium Plan - Annual",
  "status": "open",           // open, complete, expired
  "customer_email": "customer@example.com",
  "success_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel",
  "expires_at": "2024-12-31T23:59:59Z",
  "metadata": {
    "orderId": "order_123"
  },
  "created_at": "2024-01-15T10:30:00Z"
}`}</code>
        </pre>
      </div>

      {/* Customization */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Customization Options
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Parameter</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">amount</td>
                <td className="py-3 px-4 font-mono text-sm">integer</td>
                <td className="py-3 pl-4 text-sm">Amount in cents (required)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">currency</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">USD, EUR, GBP, BRL (default: USD)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">description</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Shown on checkout page</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">customer_email</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Pre-fill customer email</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">success_url</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Redirect after payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">cancel_url</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Redirect on cancel</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment_methods</td>
                <td className="py-3 px-4 font-mono text-sm">string[]</td>
                <td className="py-3 pl-4 text-sm">['card', 'ach', 'crypto', 'apple_pay']</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">expires_at</td>
                <td className="py-3 px-4 font-mono text-sm">string</td>
                <td className="py-3 pl-4 text-sm">ISO 8601 expiration date</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">allow_promotion_codes</td>
                <td className="py-3 px-4 font-mono text-sm">boolean</td>
                <td className="py-3 pl-4 text-sm">Enable discount codes</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">metadata</td>
                <td className="py-3 px-4 font-mono text-sm">object</td>
                <td className="py-3 pl-4 text-sm">Custom key-value pairs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Branding */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Custom Branding
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Customize the checkout page appearance in your dashboard settings:
        </p>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>• Upload your company logo</li>
          <li>• Set primary and secondary brand colors</li>
          <li>• Custom success/thank you message</li>
          <li>• Custom terms and conditions link</li>
        </ul>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            Configure branding at <Link href="/dashboard/settings/branding" className="text-[#2C2416] underline">Dashboard → Settings → Branding</Link>
          </p>
        </div>
      </div>

      {/* Webhooks */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Payment Notifications
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Set up webhooks to receive payment confirmations:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`app.post('/webhooks/hedge', async (req, res) => {
  const event = hedge.webhooks.verify(req.body, req.headers['x-hedge-signature'])

  if (event.type === 'checkout.completed') {
    const session = event.data

    // Fulfill the order
    await fulfillOrder({
      orderId: session.metadata.orderId,
      customerEmail: session.customer_email,
      amount: session.amount
    })
  }

  res.status(200).send('OK')
})`}</code>
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
            href="/docs/checkout/react-sdk"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              ⚛️ React SDK
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Embed checkout in your React app
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
              Handle payment events
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
