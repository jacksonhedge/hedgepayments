'use client'

import Link from 'next/link'

export default function CancelPaymentPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/reference" className="hover:text-[#2C2416]">Payments</Link>
          <span>/</span>
          <span>Cancel Payment</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Cancel Payment
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Cancel a payment before it has been fully processed
        </p>
      </div>

      {/* Endpoint */}
      <div className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded mb-8 flex items-center gap-4">
        <span className="bg-[#F59E0B] text-white px-3 py-1 rounded text-sm font-mono font-bold">POST</span>
        <code className="text-lg">/v1/payments/:id/cancel</code>
      </div>

      {/* When Cancellation is Allowed */}
      <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-8">
        <h3 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
          When Can You Cancel?
        </h3>
        <p className="text-[#2C2416] text-base mb-3">
          A payment can only be canceled when its status is <code>pending</code> or <code>initiated</code>. Once a payment reaches <code>processing</code>, <code>succeeded</code>, or <code>failed</code>, it cannot be canceled.
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          For payments that have already succeeded, use the <Link href="/docs/payments/refund" className="text-[#2C2416] underline">Refund endpoint</Link> instead.
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
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">Authorization</td>
                <td className="py-3 px-4 text-sm text-[#4CAF50] font-semibold">Yes</td>
                <td className="py-3 pl-4 text-sm">Bearer token with your API secret key</td>
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
                <td className="py-3 pl-4 text-sm">The payment ID to cancel (e.g., <code>pay_abc123xyz</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Request Body (Optional)
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Field</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Type</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">reason</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">Optional cancellation reason for your records</td>
              </tr>
            </tbody>
          </table>
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

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Returns the updated payment object with <code>status: "canceled"</code>:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "pay_abc123xyz",
  "object": "payment",
  "amount": 9999,
  "currency": "USD",
  "status": "canceled",
  "payment_method": "card",
  "customer_email": "customer@example.com",
  "cancellation_reason": "customer_requested",
  "canceled_at": "2024-06-15T10:32:00Z",
  "created_at": "2024-06-15T10:30:00Z",
  "updated_at": "2024-06-15T10:32:00Z"
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
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`import { HedgePayments } from '@hedgepayments/node'

const hedge = new HedgePayments({
  apiKey: process.env.HEDGE_API_KEY,
  apiSecret: process.env.HEDGE_API_SECRET
})

try {
  const payment = await hedge.payments.cancel('pay_abc123xyz', {
    reason: 'customer_requested'
  })

  console.log('Payment canceled:', payment.id)
  console.log('Status:', payment.status) // 'canceled'
} catch (err) {
  if (err.code === 'payment_not_cancelable') {
    console.error('Payment has already been processed')
    // Use refund endpoint instead
  }
}`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/v1/payments/pay_abc123xyz/cancel \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
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
              <tr>
                <td className="py-3 pr-4 font-mono font-semibold">412</td>
                <td className="py-3 px-4 text-sm font-mono">payment_not_cancelable</td>
                <td className="py-3 pl-4 text-sm">Payment status is not <code>pending</code> or <code>initiated</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// 412 error example
{
  "error": {
    "code": "payment_not_cancelable",
    "message": "Payment pay_abc123xyz cannot be canceled. Current status: succeeded.",
    "details": {
      "payment_id": "pay_abc123xyz",
      "current_status": "succeeded",
      "cancelable_statuses": ["pending", "initiated"]
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
            href="/docs/payments/refund"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Refund Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Issue full or partial refunds for completed payments
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
              Check the current status of a payment
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
