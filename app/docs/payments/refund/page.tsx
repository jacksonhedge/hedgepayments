'use client'

import Link from 'next/link'

export default function RefundPaymentPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/reference" className="hover:text-[#2C2416]">Payments</Link>
          <span>/</span>
          <span>Refund Payment</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Refund Payment
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Issue full or partial refunds for completed payments
        </p>
      </div>

      {/* Endpoint */}
      <div className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded mb-8 flex items-center gap-4">
        <span className="bg-[#F59E0B] text-white px-3 py-1 rounded text-sm font-mono font-bold">POST</span>
        <code className="text-lg">/v1/payments/:id/refund</code>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Full and Partial Refunds</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          You can refund the full amount or a partial amount. Multiple partial refunds are allowed up to the original payment amount. Refunds can only be issued on payments with status <code>succeeded</code> or <code>partially_refunded</code>.
        </p>
      </div>

      {/* Request */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Request
        </h2>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Headers
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Header</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Required</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">Authorization</td>
                <td className="py-3 px-4 text-sm text-[#4CAF50] font-semibold">Yes</td>
                <td className="py-3 pl-4 text-sm">Bearer token with your API secret key</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">Content-Type</td>
                <td className="py-3 px-4 text-sm text-[#4CAF50] font-semibold">Yes</td>
                <td className="py-3 pl-4 text-sm">application/json</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Path Parameters
        </h3>

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
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">id</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">The payment ID to refund (e.g., <code>pay_abc123xyz</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Request Body
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Field</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Required</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">amount</td>
                <td className="py-3 px-4 text-sm">integer?</td>
                <td className="py-3 px-4 text-sm">No</td>
                <td className="py-3 pl-4 text-sm">Amount to refund in cents. Omit for full refund</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">reason</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 px-4 text-sm">No</td>
                <td className="py-3 pl-4 text-sm"><code>customer_requested</code>, <code>duplicate</code>, <code>fraudulent</code>, or custom string</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">metadata</td>
                <td className="py-3 px-4 text-sm">object?</td>
                <td className="py-3 px-4 text-sm">No</td>
                <td className="py-3 pl-4 text-sm">Additional metadata to attach to the refund</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Timing */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Refund Timing
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Refund timing depends on the original payment method:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Payment Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Refund Initiated</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Customer Receives Funds</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Credit Card</td>
                <td className="py-3 px-4">Instant</td>
                <td className="py-3 pl-4">5-10 business days</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Debit Card</td>
                <td className="py-3 px-4">Instant</td>
                <td className="py-3 pl-4">3-5 business days</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">ACH</td>
                <td className="py-3 px-4">Next business day</td>
                <td className="py-3 pl-4">5-7 business days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>Note:</strong> Refund timing is determined by the customer's bank or card issuer. The times above are estimates. Hedge Payments initiates the refund immediately, but the customer's financial institution controls the final deposit.
          </p>
        </div>
      </div>

      {/* Response */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Response
        </h2>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Full Refund
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "pay_abc123xyz",
  "object": "payment",
  "amount": 9999,
  "currency": "USD",
  "status": "refunded",
  "refunded_amount": 9999,
  "refunds": [
    {
      "id": "ref_xyz789",
      "amount": 9999,
      "reason": "customer_requested",
      "status": "succeeded",
      "created_at": "2024-06-16T14:00:00Z"
    }
  ],
  "created_at": "2024-06-15T10:30:00Z",
  "updated_at": "2024-06-16T14:00:00Z"
}`}</code>
        </pre>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Partial Refund
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "pay_abc123xyz",
  "object": "payment",
  "amount": 9999,
  "currency": "USD",
  "status": "partially_refunded",
  "refunded_amount": 2500,
  "refunds": [
    {
      "id": "ref_xyz789",
      "amount": 2500,
      "reason": "customer_requested",
      "status": "succeeded",
      "created_at": "2024-06-16T14:00:00Z"
    }
  ],
  "created_at": "2024-06-15T10:30:00Z",
  "updated_at": "2024-06-16T14:00:00Z"
}`}</code>
        </pre>
      </div>

      {/* Code Examples */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Code Examples
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js - Full Refund</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`import { HedgePayments } from '@hedgepayments/node'

const hedge = new HedgePayments({
  apiKey: process.env.HEDGE_API_KEY,
  apiSecret: process.env.HEDGE_API_SECRET
})

// Full refund (omit amount)
const payment = await hedge.payments.refund('pay_abc123xyz', {
  reason: 'customer_requested'
})

console.log('Refund status:', payment.status) // 'refunded'
console.log('Refunded amount:', payment.refunded_amount / 100)`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js - Partial Refund</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`// Partial refund ($25.00 of a $99.99 payment)
const payment = await hedge.payments.refund('pay_abc123xyz', {
  amount: 2500,
  reason: 'customer_requested',
  metadata: {
    refund_item: 'shipping_fee'
  }
})

console.log('Status:', payment.status) // 'partially_refunded'
console.log('Refunded so far:', payment.refunded_amount / 100) // 25.00
console.log('Remaining refundable:', (payment.amount - payment.refunded_amount) / 100) // 74.99`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL - Full Refund</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/v1/payments/pay_abc123xyz/refund \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reason": "customer_requested"
  }'`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL - Partial Refund</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/v1/payments/pay_abc123xyz/refund \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "reason": "customer_requested"
  }'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Error Responses */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Responses
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-20" style={{ fontFamily: 'Georgia, serif' }}>Code</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Error</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">401</td>
                <td className="py-3 px-4 text-sm font-mono">unauthorized</td>
                <td className="py-3 pl-4 text-sm">Invalid or missing API key</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">404</td>
                <td className="py-3 px-4 text-sm font-mono">not_found</td>
                <td className="py-3 pl-4 text-sm">Payment not found with the given ID</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">412</td>
                <td className="py-3 px-4 text-sm font-mono">payment_not_refundable</td>
                <td className="py-3 pl-4 text-sm">Payment status does not allow refunds</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono font-semibold">422</td>
                <td className="py-3 px-4 text-sm font-mono">refund_amount_exceeded</td>
                <td className="py-3 pl-4 text-sm">Refund amount exceeds the remaining refundable amount</td>
              </tr>
            </tbody>
          </table>
        </div>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// 422 error example
{
  "error": {
    "code": "refund_amount_exceeded",
    "message": "Refund amount exceeds the remaining refundable amount.",
    "details": {
      "payment_id": "pay_abc123xyz",
      "original_amount": 9999,
      "already_refunded": 7500,
      "remaining_refundable": 2499,
      "requested_refund": 5000
    }
  }
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
              Check the refund status on a payment
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
              Webhooks
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Listen for payment.refunded events
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
