'use client'

import Link from 'next/link'

export default function GetPaymentPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/reference" className="hover:text-[#2C2416]">Payments</Link>
          <span>/</span>
          <span>Get Payment</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Get Payment
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Retrieve the details of an existing payment by its ID
        </p>
      </div>

      {/* Endpoint */}
      <div className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded mb-8 flex items-center gap-4">
        <span className="bg-[#4CAF50] text-white px-3 py-1 rounded text-sm font-mono font-bold">GET</span>
        <code className="text-lg">/v1/payments/:id</code>
      </div>

      {/* Request Headers */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Request Headers
        </h2>

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
      </div>

      {/* Path Parameters */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Path Parameters
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
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">id</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">The payment ID (e.g., <code>pay_abc123xyz</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Body */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Response Body
        </h2>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "pay_abc123xyz",
  "object": "payment",
  "amount": 9999,
  "currency": "USD",
  "status": "succeeded",
  "payment_method": "card",
  "customer_email": "customer@example.com",
  "customer_id": "cust_xyz789",
  "description": "Order #1234",
  "statement_descriptor": "HEDGE PAYMENTS",
  "merchant_id": "merch_abc123",
  "checkout_session_id": "cs_def456",
  "refunded_amount": 0,
  "fee": 320,
  "net_amount": 9679,
  "metadata": {
    "orderId": "order_1234",
    "sku": "PREMIUM_PLAN"
  },
  "failure_code": null,
  "failure_message": null,
  "settled": true,
  "settled_at": "2024-06-15T10:35:00Z",
  "created_at": "2024-06-15T10:30:00Z",
  "updated_at": "2024-06-15T10:35:00Z"
}`}</code>
        </pre>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Response Fields
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
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">id</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Unique payment identifier</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">object</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Always <code>"payment"</code></td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">amount</td>
                <td className="py-3 px-4 text-sm">integer</td>
                <td className="py-3 pl-4 text-sm">Payment amount in cents</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">currency</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Three-letter ISO currency code (e.g., <code>"USD"</code>)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">status</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Current payment status (see below)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment_method</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm"><code>"card"</code>, <code>"ach"</code>, or <code>"crypto"</code></td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">customer_email</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Customer's email address</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">customer_id</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">Associated customer ID, if any</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">description</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">Description set at payment creation</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">refunded_amount</td>
                <td className="py-3 px-4 text-sm">integer</td>
                <td className="py-3 pl-4 text-sm">Total amount refunded in cents</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">fee</td>
                <td className="py-3 px-4 text-sm">integer</td>
                <td className="py-3 pl-4 text-sm">Processing fee charged in cents</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">net_amount</td>
                <td className="py-3 px-4 text-sm">integer</td>
                <td className="py-3 pl-4 text-sm">Amount after fees in cents</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">metadata</td>
                <td className="py-3 px-4 text-sm">object</td>
                <td className="py-3 pl-4 text-sm">Arbitrary key-value metadata</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">failure_code</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">Error code if payment failed</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">failure_message</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">Human-readable failure reason</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">settled</td>
                <td className="py-3 px-4 text-sm">boolean</td>
                <td className="py-3 pl-4 text-sm">Whether funds have been settled to merchant</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">settled_at</td>
                <td className="py-3 px-4 text-sm">string?</td>
                <td className="py-3 pl-4 text-sm">ISO 8601 timestamp of settlement</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">created_at</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">ISO 8601 creation timestamp</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">updated_at</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">ISO 8601 last update timestamp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Status Values */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Payment Status Values
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Status</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#F59E0B]">pending</span></td>
                <td className="py-3 pl-4 text-sm">Payment created but not yet initiated</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#2196F3]">initiated</span></td>
                <td className="py-3 pl-4 text-sm">Payment has been submitted for processing</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#2196F3]">processing</span></td>
                <td className="py-3 pl-4 text-sm">Payment is being processed by the payment network</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#4CAF50]">succeeded</span></td>
                <td className="py-3 pl-4 text-sm">Payment completed successfully</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#F44336]">failed</span></td>
                <td className="py-3 pl-4 text-sm">Payment failed (see failure_code for details)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#8B7E6E]">canceled</span></td>
                <td className="py-3 pl-4 text-sm">Payment was canceled before processing</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#9C27B0]">refunded</span></td>
                <td className="py-3 pl-4 text-sm">Payment was fully refunded</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm"><span className="text-[#9C27B0]">partially_refunded</span></td>
                <td className="py-3 pl-4 text-sm">Payment was partially refunded</td>
              </tr>
            </tbody>
          </table>
        </div>
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

const payment = await hedge.payments.retrieve('pay_abc123xyz')

console.log('Payment status:', payment.status)
console.log('Amount:', payment.amount / 100) // $99.99
console.log('Net amount:', payment.net_amount / 100) // after fees`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl https://api.hedgepayments.com/v1/payments/pay_abc123xyz \\
  -H "Authorization: Bearer sk_live_your_api_key"`}</code>
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
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">401</td>
                <td className="py-3 pl-4 text-sm">Invalid or missing API key</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono font-semibold">404</td>
                <td className="py-3 pl-4 text-sm">Payment not found with the given ID</td>
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
            href="/docs/payments/cancel"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Cancel Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Cancel a pending or initiated payment
            </p>
          </Link>

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
              Issue full or partial refunds
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
