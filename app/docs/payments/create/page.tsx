'use client'

export default function CreatePaymentPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Create Payment
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Accept crypto and fiat payments from your customers
        </p>
      </div>

      {/* Overview */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Overview
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          The Create Payment endpoint generates a payment request that redirects your customer to a hosted payment page. Hedge Payments handles the entire payment flow, including currency selection, payment processing, and confirmations.
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-8">
          <div className="space-y-2">
            <p className="text-sm text-[#8B7E6E] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Endpoint</p>
            <code className="text-[#2C2416] bg-[#FAF8F5] px-3 py-1 rounded text-base">
              POST /api/payments
            </code>
          </div>
        </div>
      </div>

      {/* Request Parameters */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Request Parameters
        </h2>

        <div className="bg-white border border-[#D4C5B0] overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-[#FAF8F5] border-b border-[#D4C5B0]">
              <tr>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Parameter
                </th>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Type
                </th>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Required
                </th>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-[#2C2416]">
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">amount</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">number</td>
                <td className="p-4">
                  <span className="text-[#2C2416]">✓</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">Payment amount in the specified currency</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">currency</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#2C2416]">✓</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">Three-letter ISO currency code (e.g., USD, EUR, GBP)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">customerEmail</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#2C2416]">✓</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">Customer's email address for receipts</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">description</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#8B7E6E]">-</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">Description of the payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">metadata</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">object</td>
                <td className="p-4">
                  <span className="text-[#8B7E6E]">-</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">Custom key-value pairs for your reference</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">successUrl</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#8B7E6E]">-</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">URL to redirect after successful payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">cancelUrl</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#8B7E6E]">-</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">URL to redirect if payment is cancelled</td>
              </tr>
              <tr>
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">webhookUrl</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">string</td>
                <td className="p-4">
                  <span className="text-[#8B7E6E]">-</span>
                </td>
                <td className="p-4 text-[#6B5D4F]">URL to receive payment status updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Request */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Example Request
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X POST https://api.hedgepayments.com/api/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "description": "Premium subscription - Monthly",
    "metadata": {
      "orderId": "order_12345",
      "customerId": "cust_67890"
    },
    "successUrl": "https://yourapp.com/success",
    "cancelUrl": "https://yourapp.com/cancel",
    "webhookUrl": "https://yourapp.com/webhooks/hedge"
  }'`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`const payment = await hedge.payments.create({
  amount: 100.00,
  currency: 'USD',
  customerEmail: 'customer@example.com',
  description: 'Premium subscription - Monthly',
  metadata: {
    orderId: 'order_12345',
    customerId: 'cust_67890'
  },
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cancel',
  webhookUrl: 'https://yourapp.com/webhooks/hedge'
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`payment = hedge.payments.create(
    amount=100.00,
    currency='USD',
    customer_email='customer@example.com',
    description='Premium subscription - Monthly',
    metadata={
        'order_id': 'order_12345',
        'customer_id': 'cust_67890'
    },
    success_url='https://yourapp.com/success',
    cancel_url='https://yourapp.com/cancel',
    webhook_url='https://yourapp.com/webhooks/hedge'
)`}</code>
            </pre>
          </div>
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
          A successful request returns a payment object with a unique ID and hosted payment page URL:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "id": "pay_1234567890abcdef",
  "object": "payment",
  "amount": 100.00,
  "currency": "USD",
  "status": "pending",
  "customerEmail": "customer@example.com",
  "description": "Premium subscription - Monthly",
  "url": "https://pay.hedgepayments.com/pay_1234567890abcdef",
  "metadata": {
    "orderId": "order_12345",
    "customerId": "cust_67890"
  },
  "successUrl": "https://yourapp.com/success",
  "cancelUrl": "https://yourapp.com/cancel",
  "webhookUrl": "https://yourapp.com/webhooks/hedge",
  "createdAt": "2025-01-10T12:00:00Z",
  "expiresAt": "2025-01-10T13:00:00Z"
}`}</code>
        </pre>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Response Fields
        </h3>

        <div className="bg-white border border-[#D4C5B0] overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-[#FAF8F5] border-b border-[#D4C5B0]">
              <tr>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Field
                </th>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-[#2C2416]">
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">id</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Unique identifier for the payment</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">url</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Hosted payment page URL - redirect your customer here</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">status</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Payment status: pending, processing, completed, failed, or cancelled</td>
              </tr>
              <tr>
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">expiresAt</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Payment link expiration time (1 hour from creation)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Currencies */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Supported Currencies
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Hedge Payments supports 50+ cryptocurrencies and all major fiat currencies:
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🪙 Cryptocurrencies
            </h4>
            <ul className="text-[#6B5D4F] text-base space-y-2">
              <li>Bitcoin (BTC)</li>
              <li>Ethereum (ETH)</li>
              <li>USDC, USDT (Stablecoins)</li>
              <li>Solana (SOL)</li>
              <li>Polygon (MATIC)</li>
              <li>And 45+ more...</li>
            </ul>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              💵 Fiat Currencies
            </h4>
            <ul className="text-[#6B5D4F] text-base space-y-2">
              <li>USD - US Dollar</li>
              <li>EUR - Euro</li>
              <li>GBP - British Pound</li>
              <li>JPY - Japanese Yen</li>
              <li>CAD - Canadian Dollar</li>
              <li>And 180+ more...</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Flow */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Payment Flow
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C2416] text-[#FAF8F5] rounded-full flex items-center justify-center mr-4 mt-1">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>1</span>
            </div>
            <div>
              <h4 className="text-lg text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                Create Payment
              </h4>
              <p className="text-[#6B5D4F] text-base">
                Your server creates a payment using the Hedge Payments API
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C2416] text-[#FAF8F5] rounded-full flex items-center justify-center mr-4 mt-1">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>2</span>
            </div>
            <div>
              <h4 className="text-lg text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                Redirect Customer
              </h4>
              <p className="text-[#6B5D4F] text-base">
                Redirect your customer to the hosted payment page URL
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C2416] text-[#FAF8F5] rounded-full flex items-center justify-center mr-4 mt-1">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>3</span>
            </div>
            <div>
              <h4 className="text-lg text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                Customer Pays
              </h4>
              <p className="text-[#6B5D4F] text-base">
                Customer selects payment method and completes transaction
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C2416] text-[#FAF8F5] rounded-full flex items-center justify-center mr-4 mt-1">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>4</span>
            </div>
            <div>
              <h4 className="text-lg text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                Webhook Notification
              </h4>
              <p className="text-[#6B5D4F] text-base">
                Hedge sends a webhook to your server with payment status
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-[#2C2416] text-[#FAF8F5] rounded-full flex items-center justify-center mr-4 mt-1">
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>5</span>
            </div>
            <div>
              <h4 className="text-lg text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                Customer Returns
              </h4>
              <p className="text-[#6B5D4F] text-base">
                Customer is redirected back to your successUrl or cancelUrl
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>💡 Best Practice:</strong><br />
            Always rely on webhook notifications to confirm payment status. Don't trust the redirect alone, as customers may not complete the redirect flow.
          </p>
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
            href="/docs/payments/get"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔍 Get Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Retrieve payment details and check status
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
              Set up webhooks to receive payment notifications
            </p>
          </a>

          <a
            href="/docs/payments/refund"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              💸 Refund Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Process full or partial refunds for completed payments
            </p>
          </a>

          <a
            href="/docs/guides/crypto"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🪙 Crypto Payments
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Learn about accepting cryptocurrency payments
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
