'use client'

import Link from 'next/link'

export default function APIReferencePage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <span>API Reference</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          API Reference
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Complete reference for the Hedge Payments REST API
        </p>
      </div>

      {/* Base URLs */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Base URLs
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Environment</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Base URL</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Sandbox</td>
                <td className="py-3 px-4 font-mono text-sm">https://api-sandbox.hedgepayments.com</td>
                <td className="py-3 pl-4">Testing and development</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Production</td>
                <td className="py-3 px-4 font-mono text-sm">https://api.hedgepayments.com</td>
                <td className="py-3 pl-4">Live transactions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-6">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>Important:</strong> Always use the sandbox environment for testing. Sandbox and production API keys are not interchangeable.
          </p>
        </div>
      </div>

      {/* Authentication */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Authentication
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Hedge Payments uses two authentication methods depending on the context:
        </p>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          API Key (Server-side)
        </h3>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-4">
          Use your API secret key in the <code>Authorization</code> header for all server-side requests:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`Authorization: Bearer sk_live_your_api_secret_key`}</code>
        </pre>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          JWT (Client-side)
        </h3>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-4">
          For client-side SDK operations, use a short-lived JWT obtained from your server. JWTs are scoped to a specific customer and expire after 15 minutes.
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Server-side: generate a client token
const token = await hedge.clientTokens.create({
  customerId: 'cust_abc123',
  scopes: ['checkout', 'payment_methods']
})

// Client-side: pass the token to the SDK
<HedgeProvider clientToken={token.jwt}>
  <CheckoutForm />
</HedgeProvider>`}</code>
        </pre>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>Never expose your API secret key in client-side code.</strong> Use publishable keys or JWTs for browser and mobile applications.
          </p>
        </div>
      </div>

      {/* Request/Response Format */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Request / Response Format
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-6">
          <li>All request bodies must be <strong>JSON</strong> with <code>Content-Type: application/json</code></li>
          <li>All responses are <strong>JSON</strong> encoded in <strong>UTF-8</strong></li>
          <li>Monetary amounts are in <strong>cents</strong> (e.g., <code>9999</code> = $99.99)</li>
          <li>Timestamps are <strong>ISO 8601</strong> format in UTC</li>
          <li>IDs use prefixed strings (e.g., <code>pay_</code>, <code>cust_</code>, <code>evt_</code>)</li>
        </ul>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Example request
curl -X POST https://api.hedgepayments.com/v1/payments \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 9999,
    "currency": "USD",
    "customer_email": "customer@example.com"
  }'

// Example response
{
  "id": "pay_abc123",
  "amount": 9999,
  "currency": "USD",
  "status": "pending",
  "created_at": "2024-06-15T10:30:00Z"
}`}</code>
        </pre>
      </div>

      {/* Rate Limits */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Rate Limits
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          API requests are limited to <strong>100 requests per minute</strong> per API key. Rate limit headers are included in every response:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1718450460`}</code>
        </pre>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          If you exceed the limit, you will receive a <code>429 Too Many Requests</code> response. Wait until the <code>X-RateLimit-Reset</code> timestamp before retrying.
        </p>
      </div>

      {/* Versioning */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Versioning
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          The current API version is <strong>v1</strong>. The version is included in the URL path:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`https://api.hedgepayments.com/v1/payments`}</code>
        </pre>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Breaking changes will be introduced in new versions. Non-breaking additions (new fields, new endpoints) may be added to the current version without notice.
        </p>
      </div>

      {/* Endpoints */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Endpoints
        </h2>

        {/* Auth */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Auth
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/auth/client-token</td>
                <td className="py-3 pl-4 text-sm">Generate a client-side JWT</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/auth/api-keys</td>
                <td className="py-3 pl-4 text-sm">List API keys for your account</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payments */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Payments
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/payments</td>
                <td className="py-3 pl-4 text-sm">Create a new payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/payments/:id</td>
                <td className="py-3 pl-4 text-sm">Retrieve a payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/payments</td>
                <td className="py-3 pl-4 text-sm">List all payments</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/payments/:id/cancel</td>
                <td className="py-3 pl-4 text-sm">Cancel a pending payment</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/payments/:id/refund</td>
                <td className="py-3 pl-4 text-sm">Refund a payment (full or partial)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checkout */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Checkout
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/checkout/sessions</td>
                <td className="py-3 pl-4 text-sm">Create a checkout session</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/checkout/sessions/:id</td>
                <td className="py-3 pl-4 text-sm">Retrieve a checkout session</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/checkout/sessions/:id/expire</td>
                <td className="py-3 pl-4 text-sm">Expire a checkout session</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Merchants */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Merchants
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/merchants</td>
                <td className="py-3 pl-4 text-sm">Create a merchant account</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/merchants/:id</td>
                <td className="py-3 pl-4 text-sm">Retrieve a merchant</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#F59E0B]">PATCH</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/merchants/:id</td>
                <td className="py-3 pl-4 text-sm">Update merchant settings</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/merchants/:id/balance</td>
                <td className="py-3 pl-4 text-sm">Get merchant balance</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Round-Ups */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Round-Ups
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/roundups/configure</td>
                <td className="py-3 pl-4 text-sm">Configure round-up settings</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/roundups</td>
                <td className="py-3 pl-4 text-sm">List round-up transactions</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/roundups/summary</td>
                <td className="py-3 pl-4 text-sm">Get round-up summary and totals</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Webhooks */}
        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Webhooks
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-24" style={{ fontFamily: 'Georgia, serif' }}>Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Path</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/webhooks/endpoints</td>
                <td className="py-3 pl-4 text-sm">Register a webhook endpoint</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#2196F3]">GET</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/webhooks/endpoints</td>
                <td className="py-3 pl-4 text-sm">List webhook endpoints</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4"><code className="text-[#F44336]">DELETE</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/webhooks/endpoints/:id</td>
                <td className="py-3 pl-4 text-sm">Delete a webhook endpoint</td>
              </tr>
              <tr>
                <td className="py-3 pr-4"><code className="text-[#4CAF50]">POST</code></td>
                <td className="py-3 px-4 font-mono text-sm">/v1/webhooks/test</td>
                <td className="py-3 pl-4 text-sm">Send a test webhook event</td>
              </tr>
            </tbody>
          </table>
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
            href="/docs/reference/errors"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Error Codes
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Complete list of error codes and how to handle them
            </p>
          </Link>

          <Link
            href="/docs/payments/get"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Get Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Retrieve payment details by ID
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
              Webhooks Guide
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Set up real-time event notifications
            </p>
          </Link>

          <Link
            href="/docs/guides/settlement"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Settlement Guide
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Understand USDC and USD settlement options
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
