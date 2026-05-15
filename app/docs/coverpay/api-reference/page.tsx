'use client'

import Link from 'next/link'

export default function CoverPayAPIReferencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/docs/coverpay" className="hover:text-white">CoverPay</Link>
          <span>/</span>
          <span className="text-white">API Reference</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">API Reference</h1>
        <p className="text-xl text-gray-300 mb-4">
          REST API for CoverPay BNPL checkout sessions.
        </p>
        <p className="text-gray-400 mb-12">
          Base URL: <code className="text-green-400">https://api.hedgepayments.com</code>
        </p>

        {/* Create Session */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-mono rounded">POST</span>
            <code className="text-white text-lg">/coverpay/sessions</code>
          </div>
          <p className="text-gray-300 mb-4">Create a new checkout session.</p>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Request Body</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto mb-4">
            <code className="text-green-400 text-sm">{`{
  "publishableKey": "pk_test_xxx",
  "amount": 249.99,
  "currency": "USD",
  "orderId": "order_123",
  "customer": {
    "email": "customer@example.com",
    "phone": "+1234567890",
    "name": "John Doe"
  },
  "successUrl": "https://yoursite.com/success",
  "cancelUrl": "https://yoursite.com/cancel",
  "metadata": {}
}`}</code>
          </pre>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Response</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`{
  "success": true,
  "session": {
    "id": "uuid",
    "token": "cps_xxxxxxxxxxxx",
    "amount": 249.99,
    "currency": "USD",
    "status": "pending",
    "expiresAt": "2024-01-21T12:30:00Z",
    "providers": [
      { "id": "klarna", "name": "Klarna" },
      { "id": "affirm", "name": "Affirm" }
    ]
  }
}`}</code>
          </pre>
        </div>

        {/* Get Session */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-500 text-white text-sm font-mono rounded">GET</span>
            <code className="text-white text-lg">/coverpay/sessions/:token</code>
          </div>
          <p className="text-gray-300 mb-4">Get session details by token or ID.</p>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Response</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`{
  "success": true,
  "session": {
    "id": "uuid",
    "token": "cps_xxxxxxxxxxxx",
    "amount": 249.99,
    "currency": "USD",
    "status": "pending",
    "orderId": "order_123",
    "customer": {
      "email": "customer@example.com",
      "phone": "+1234567890",
      "name": "John Doe"
    },
    "selectedProvider": null,
    "eligibilityResults": {},
    "providersAttempted": [],
    "expiresAt": "2024-01-21T12:30:00Z",
    "createdAt": "2024-01-21T12:00:00Z",
    "providers": [...]
  }
}`}</code>
          </pre>
        </div>

        {/* Check Eligibility */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-mono rounded">POST</span>
            <code className="text-white text-lg">/coverpay/sessions/:token/eligibility</code>
          </div>
          <p className="text-gray-300 mb-4">Check eligibility with all configured providers in parallel.</p>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Response</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`{
  "success": true,
  "eligibility": {
    "eligible": true,
    "providers": [
      {
        "id": "klarna",
        "name": "Klarna",
        "plans": [
          {
            "id": "klarna_pay4",
            "name": "Pay in 4",
            "installments": 4,
            "amount": 62.50,
            "apr": 0
          }
        ],
        "limit": 1500
      },
      {
        "id": "affirm",
        "name": "Affirm",
        "plans": [
          {
            "id": "affirm_pay4",
            "name": "Pay in 4",
            "installments": 4,
            "amount": 62.50,
            "apr": 0
          },
          {
            "id": "affirm_monthly_6",
            "name": "6 Monthly Payments",
            "installments": 6,
            "amount": 41.67,
            "apr": 0
          }
        ],
        "limit": 17500
      }
    ],
    "declined": [
      {
        "id": "afterpay",
        "name": "Afterpay",
        "reason": "Amount exceeds limit"
      }
    ],
    "recommendedProvider": { ... }
  }
}`}</code>
          </pre>
        </div>

        {/* Select Provider */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-mono rounded">POST</span>
            <code className="text-white text-lg">/coverpay/sessions/:token/select</code>
          </div>
          <p className="text-gray-300 mb-4">Select a provider and get the checkout URL.</p>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Request Body</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto mb-4">
            <code className="text-green-400 text-sm">{`{
  "providerId": "klarna",
  "planId": "klarna_pay4"
}`}</code>
          </pre>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Response</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`{
  "success": true,
  "checkout": {
    "provider": "klarna",
    "providerName": "Klarna",
    "checkoutUrl": "https://checkout.klarna.com/xxx",
    "sessionId": "klarna_session_xxx",
    "orderId": "KLARNA-123456789",
    "planId": "klarna_pay4"
  }
}`}</code>
          </pre>
        </div>

        {/* Webhooks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Webhooks</h2>
          <p className="text-gray-300 mb-4">
            Configure a webhook URL in your dashboard to receive real-time payment notifications.
          </p>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Event Types</h3>
            <div className="space-y-4">
              <div>
                <code className="text-green-400">session.created</code>
                <p className="text-gray-400 text-sm mt-1">A checkout session was created</p>
              </div>
              <div>
                <code className="text-green-400">payment.authorized</code>
                <p className="text-gray-400 text-sm mt-1">Payment was authorized by a provider</p>
              </div>
              <div>
                <code className="text-green-400">payment.captured</code>
                <p className="text-gray-400 text-sm mt-1">Payment was captured</p>
              </div>
              <div>
                <code className="text-green-400">payment.declined</code>
                <p className="text-gray-400 text-sm mt-1">All providers declined the payment</p>
              </div>
              <div>
                <code className="text-green-400">payment.refunded</code>
                <p className="text-gray-400 text-sm mt-1">Payment was refunded</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-400 mb-2">Webhook Payload</h3>
          <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
            <code className="text-green-400 text-sm">{`{
  "event": "payment.authorized",
  "session": {
    "id": "uuid",
    "token": "cps_xxxxxxxxxxxx",
    "orderId": "order_123",
    "status": "authorized"
  },
  "provider": "klarna",
  "transactionId": "uuid",
  "timestamp": "2024-01-21T12:15:00Z"
}`}</code>
          </pre>
        </div>

        {/* Error Codes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Error Codes</h2>
          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr>
                  <td className="py-2"><code className="text-red-400">invalid_key</code></td>
                  <td>401</td>
                  <td>Invalid publishable key</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="text-red-400">session_not_found</code></td>
                  <td>404</td>
                  <td>Session not found</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="text-red-400">session_expired</code></td>
                  <td>410</td>
                  <td>Session has expired</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="text-red-400">no_providers</code></td>
                  <td>400</td>
                  <td>No BNPL providers configured</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="text-red-400">provider_not_eligible</code></td>
                  <td>400</td>
                  <td>Selected provider not eligible</td>
                </tr>
                <tr>
                  <td className="py-2"><code className="text-red-400">checkout_failed</code></td>
                  <td>422</td>
                  <td>Provider checkout creation failed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Rate Limits</h3>
          <ul className="text-gray-300 space-y-2">
            <li>Session creation: <code className="text-green-400">100 requests/minute</code></li>
            <li>Eligibility checks: <code className="text-green-400">60 requests/minute</code></li>
            <li>Other endpoints: <code className="text-green-400">300 requests/minute</code></li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            Rate limit headers are included in all responses: <code className="text-green-400">X-RateLimit-Remaining</code>
          </p>
        </div>
      </div>
    </div>
  )
}
