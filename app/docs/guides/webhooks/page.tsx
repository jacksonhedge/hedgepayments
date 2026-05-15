'use client'

import Link from 'next/link'

export default function WebhooksPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Guides</Link>
          <span>/</span>
          <span>Webhooks</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Webhooks
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Receive real-time notifications for payment events
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>What are Webhooks?</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Webhooks are HTTP callbacks that notify your server when events occur in your Hedge Payments account - like successful payments, failed transactions, or subscription changes. They allow you to automate workflows without polling our API.
        </p>
      </div>

      {/* Setup */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Setting Up Webhooks
        </h2>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          1. Create an Endpoint
        </h3>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Create an HTTP endpoint on your server to receive webhook events:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Node.js (Express)
app.post('/webhooks/hedge', express.raw({ type: 'application/json' }), (req, res) => {
  const payload = req.body
  const signature = req.headers['x-hedge-signature']

  // Process the webhook
  console.log('Received webhook:', payload)

  res.status(200).send('OK')
})`}</code>
        </pre>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          2. Register in Dashboard
        </h3>

        <ol className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li><strong>1.</strong> Go to <Link href="/dashboard/developers/webhooks" className="text-[#2C2416] underline">Dashboard → Developers → Webhooks</Link></li>
          <li><strong>2.</strong> Click "Add Endpoint"</li>
          <li><strong>3.</strong> Enter your endpoint URL (e.g., https://yoursite.com/webhooks/hedge)</li>
          <li><strong>4.</strong> Select the events you want to receive</li>
          <li><strong>5.</strong> Copy your webhook signing secret</li>
        </ol>
      </div>

      {/* Verify Signatures */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Verifying Signatures
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Always verify webhook signatures to ensure requests are from Hedge Payments:
        </p>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-6">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>⚠️ Security:</strong> Never process webhooks without verifying the signature. Attackers could send fake events to your endpoint.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`import { HedgePayments } from '@hedgepayments/node'

const hedge = new HedgePayments({
  apiKey: process.env.HEDGE_API_KEY,
  apiSecret: process.env.HEDGE_API_SECRET
})

const webhookSecret = process.env.HEDGE_WEBHOOK_SECRET

app.post('/webhooks/hedge', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-hedge-signature']

  let event
  try {
    event = hedge.webhooks.verify(req.body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send('Invalid signature')
  }

  // Process verified event
  console.log('Verified event:', event.type)

  res.status(200).send('OK')
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`from hedgepayments import HedgePayments
import os

hedge = HedgePayments(
    api_key=os.environ['HEDGE_API_KEY'],
    api_secret=os.environ['HEDGE_API_SECRET']
)

webhook_secret = os.environ['HEDGE_WEBHOOK_SECRET']

@app.route('/webhooks/hedge', methods=['POST'])
def hedge_webhook():
    payload = request.data
    signature = request.headers.get('X-Hedge-Signature')

    try:
        event = hedge.webhooks.verify(payload, signature, webhook_secret)
    except Exception as e:
        return 'Invalid signature', 400

    # Process verified event
    print(f'Verified event: {event.type}')

    return 'OK', 200`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Event Types
        </h2>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Payment Events
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Event</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment.created</td>
                <td className="py-3 pl-4 text-sm">A new payment intent was created</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment.processing</td>
                <td className="py-3 pl-4 text-sm">Payment is being processed</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment.succeeded</td>
                <td className="py-3 pl-4 text-sm">Payment was successful</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">payment.failed</td>
                <td className="py-3 pl-4 text-sm">Payment failed</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">payment.refunded</td>
                <td className="py-3 pl-4 text-sm">Payment was refunded (full or partial)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          ACH Events
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Event</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach.initiated</td>
                <td className="py-3 pl-4 text-sm">ACH debit was initiated</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach.processing</td>
                <td className="py-3 pl-4 text-sm">ACH is being processed by the bank</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach.succeeded</td>
                <td className="py-3 pl-4 text-sm">ACH debit completed successfully</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach.failed</td>
                <td className="py-3 pl-4 text-sm">ACH debit failed</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">ach.returned</td>
                <td className="py-3 pl-4 text-sm">ACH was returned after initial success</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Subscription Events
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Event</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">subscription.created</td>
                <td className="py-3 pl-4 text-sm">New subscription was created</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">subscription.updated</td>
                <td className="py-3 pl-4 text-sm">Subscription was modified</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">subscription.canceled</td>
                <td className="py-3 pl-4 text-sm">Subscription was canceled</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">subscription.payment_failed</td>
                <td className="py-3 pl-4 text-sm">Recurring payment failed</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          Checkout Events
        </h3>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Event</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">checkout.completed</td>
                <td className="py-3 pl-4 text-sm">Checkout session was completed</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">checkout.expired</td>
                <td className="py-3 pl-4 text-sm">Checkout link expired without payment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Payload */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Event Payload
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          All webhook events follow this structure:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "evt_abc123xyz",
  "type": "payment.succeeded",
  "created": "2024-01-15T10:30:00Z",
  "livemode": false,
  "data": {
    "id": "pay_xyz789",
    "amount": 9999,
    "currency": "USD",
    "status": "succeeded",
    "customer_email": "customer@example.com",
    "payment_method": "card",
    "metadata": {
      "orderId": "order_123"
    },
    "created_at": "2024-01-15T10:29:45Z"
  }
}`}</code>
        </pre>
      </div>

      {/* Handle Events */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Handling Events
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Example of handling different event types:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`app.post('/webhooks/hedge', async (req, res) => {
  const event = hedge.webhooks.verify(req.body, req.headers['x-hedge-signature'])

  switch (event.type) {
    case 'payment.succeeded':
      await handlePaymentSuccess(event.data)
      break

    case 'payment.failed':
      await handlePaymentFailure(event.data)
      break

    case 'ach.returned':
      await handleACHReturn(event.data)
      break

    case 'subscription.canceled':
      await handleSubscriptionCanceled(event.data)
      break

    default:
      console.log(\`Unhandled event type: \${event.type}\`)
  }

  // Always return 200 to acknowledge receipt
  res.status(200).send('OK')
})

async function handlePaymentSuccess(payment) {
  // Update order status
  await db.orders.update({
    where: { id: payment.metadata.orderId },
    data: { status: 'paid', paidAt: new Date() }
  })

  // Send confirmation email
  await sendEmail({
    to: payment.customer_email,
    template: 'payment_confirmation',
    data: { amount: payment.amount / 100 }
  })
}

async function handlePaymentFailure(payment) {
  // Notify customer of failed payment
  await sendEmail({
    to: payment.customer_email,
    template: 'payment_failed',
    data: { reason: payment.failure_reason }
  })
}`}</code>
        </pre>
      </div>

      {/* Best Practices */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Best Practices
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>✓ <strong>Always verify signatures</strong> - Never process unverified webhooks</li>
          <li>✓ <strong>Return 200 quickly</strong> - Process events asynchronously if needed</li>
          <li>✓ <strong>Handle duplicates</strong> - Use event IDs to deduplicate (webhooks may be retried)</li>
          <li>✓ <strong>Log all events</strong> - Keep records for debugging and auditing</li>
          <li>✓ <strong>Use idempotent handlers</strong> - Same event processed twice should have same result</li>
          <li>✓ <strong>Monitor failures</strong> - Set up alerts for webhook delivery issues</li>
        </ul>
      </div>

      {/* Retry Policy */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Retry Policy
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          If your endpoint doesn't return a 2xx response, we'll retry with exponential backoff:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Attempt</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Delay</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">1st retry</td>
                <td className="py-3 pl-4">1 minute</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">2nd retry</td>
                <td className="py-3 pl-4">5 minutes</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">3rd retry</td>
                <td className="py-3 pl-4">30 minutes</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">4th retry</td>
                <td className="py-3 pl-4">2 hours</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">5th retry (final)</td>
                <td className="py-3 pl-4">24 hours</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[#6B5D4F] text-base">
          After 5 failed attempts, the webhook is marked as failed and you'll receive an email notification.
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
            href="/docs/testing"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🧪 Test Webhooks
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Test webhook delivery locally
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
              ❌ Error Reference
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
