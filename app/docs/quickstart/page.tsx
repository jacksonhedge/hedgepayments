'use client'

export default function QuickStartPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Quick Start
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Get up and running with Hedge Payments in 5 minutes
        </p>
      </div>

      {/* AI Integration Note */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>🤖 Using AI Tools?</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Hedge Payments works seamlessly with <strong>Claude</strong>, <strong>Claude Code</strong>, <strong>ChatGPT</strong>, <strong>Codex</strong>, and other AI platforms. Check out our <a href="/docs/guides/ai-integration" className="text-[#2C2416] underline">AI Integration Guide</a> for AI-specific setup instructions.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-8">
        <h3 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
          📋 Before you begin
        </h3>
        <ul className="text-[#2C2416] text-base space-y-2 mb-0">
          <li>Create a Hedge Payments account at <a href="https://hedgepayments.com/signup" className="text-[#2C2416] underline">hedgepayments.com/signup</a></li>
          <li>Obtain your API credentials from the dashboard</li>
          <li>Have Node.js 16+ or Python 3.8+ installed</li>
        </ul>
      </div>

      {/* Step 1 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 1: Install the SDK
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Install the Hedge Payments SDK for your preferred language:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`npm install @hedgepayments/sdk`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`pip install hedgepayments`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 2: Initialize the Client
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Create a new instance of the Hedge Payments client with your API credentials:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`import { HedgePayments } from '@hedgepayments/sdk'

const hedge = new HedgePayments({
  apiKey: 'your_api_key_here',
  environment: 'sandbox' // or 'production'
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`from hedgepayments import HedgePayments

hedge = HedgePayments(
    api_key='your_api_key_here',
    environment='sandbox'  # or 'production'
)`}</code>
            </pre>
          </div>
        </div>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔐 Keep your API key secure:</strong><br />
            Never commit API keys to version control. Use environment variables instead.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 3: Create Your First Payment
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Create a payment request to accept crypto or fiat:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`const payment = await hedge.payments.create({
  amount: 100.00,
  currency: 'USD',
  customerEmail: 'user@example.com',
  description: 'Premium subscription',
  metadata: {
    orderId: 'order_123'
  }
})

console.log('Payment URL:', payment.url)
console.log('Payment ID:', payment.id)`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`payment = hedge.payments.create(
    amount=100.00,
    currency='USD',
    customer_email='user@example.com',
    description='Premium subscription',
    metadata={
        'order_id': 'order_123'
    }
)

print('Payment URL:', payment.url)
print('Payment ID:', payment.id)`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 4: Redirect to Payment Page
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Redirect your customer to the payment URL returned in the response. Hedge Payments will handle the entire payment flow, including:
        </p>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>✓ Currency selection (crypto or fiat)</li>
          <li>✓ Secure payment processing</li>
          <li>✓ Transaction confirmations</li>
          <li>✓ Automatic redirect back to your app</li>
        </ul>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Redirect user to payment page
window.location.href = payment.url`}</code>
        </pre>
      </div>

      {/* Step 5 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 5: Handle Payment Confirmation
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Set up a webhook endpoint to receive payment confirmation notifications:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js (Express)</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`app.post('/webhooks/hedge', async (req, res) => {
  const signature = req.headers['x-hedge-signature']
  const event = hedge.webhooks.verify(req.body, signature)

  if (event.type === 'payment.completed') {
    const payment = event.data
    console.log('Payment completed:', payment.id)

    // Update your database, send confirmation email, etc.
  }

  res.status(200).send('OK')
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python (Flask)</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`@app.route('/webhooks/hedge', methods=['POST'])
def hedge_webhook():
    signature = request.headers.get('X-Hedge-Signature')
    event = hedge.webhooks.verify(request.data, signature)

    if event.type == 'payment.completed':
        payment = event.data
        print(f'Payment completed: {payment.id}')

        # Update your database, send confirmation email, etc.

    return 'OK', 200`}</code>
            </pre>
          </div>
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
          <a
            href="/docs/authentication"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔐 Authentication
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Learn about API keys, JWT tokens, and security best practices
            </p>
          </a>

          <a
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
              Set up real-time payment notifications and event handling
            </p>
          </a>

          <a
            href="/docs/guides/ai-integration"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🤖 AI Integration
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Integrate payment capabilities with Claude, ChatGPT, and AI agents
            </p>
          </a>

          <a
            href="/docs/reference/endpoints"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              📚 API Reference
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Explore the complete API documentation and endpoint reference
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
