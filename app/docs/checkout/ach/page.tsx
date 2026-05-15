'use client'

import Link from 'next/link'
import { CodeBlock, Callout, StepList, ParamTable, NavCards } from '../../components'

export default function ACHCheckoutPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs/checkout" className="hover:text-[#2C2416]">Checkout</Link>
          <span>/</span>
          <span>ACH Payments</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          ACH Payments
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Accept bank transfers with lower fees via CoinFlow&apos;s ACH infrastructure
        </p>
      </div>

      {/* Overview */}
      <Callout variant="success" title="Why ACH?">
        <p>
          ACH payments have significantly lower fees than card payments (typically 0.8% vs 2.9%), making them ideal for high-value transactions, round-up micro-payments, and recurring billing. Hedge Payments uses CoinFlow as the underlying ACH provider with optional USDC instant settlement.
        </p>
      </Callout>

      {/* Fee Comparison */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Fee Comparison
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Payment Method</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Fee</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Settlement</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Credit/Debit Cards</td>
                <td className="py-3 px-4">2.9% + $0.30</td>
                <td className="py-3 pl-4">Instant</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50 bg-[#E8F5E9]/30">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">ACH + USDC Settlement</td>
                <td className="py-3 px-4 font-semibold text-[#4CAF50]">0.8% (max $5)</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50]">Instant (on Solana)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">ACH + USD Settlement</td>
                <td className="py-3 px-4">0.8% (max $5)</td>
                <td className="py-3 pl-4">3 business days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ACH Flow Overview */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          How ACH Works with Hedge
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          The ACH flow has two phases: a one-time bank account linking step, and then per-transaction ACH debits.
        </p>

        <div className="not-prose">
          <StepList
            steps={[
              {
                title: 'Create Customer',
                description: 'POST /api/customer -- Register the consumer with CoinFlow',
              },
              {
                title: 'Get Session Key',
                description: 'GET /api/auth/session-key -- Generate a 24-hour scoped token',
              },
              {
                title: 'Link Bank Account',
                description: 'POST /api/customer/v2/bankAccount -- Tokenize the consumer\'s bank (one-time)',
              },
              {
                title: 'Submit ACH Checkout',
                description: 'POST /api/checkout/ach/{merchantId} -- Debit the consumer\'s bank account',
                highlight: true,
              },
              {
                title: 'Handle Webhooks',
                description: 'ACH Initiated > ACH Batched > Settled (or ACH Returned / ACH Failed)',
              },
            ]}
          />
        </div>
      </div>

      {/* Step 1: Get Session Key */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 1: Get a Session Key
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Generate a session key scoped to a specific consumer. Session keys are valid for 24 hours.
        </p>

        <CodeBlock
          language="bash"
          title="Get Session Key"
          code={`curl -X GET https://api-sandbox.coinflow.cash/api/auth/session-key \\
  -H "Authorization: YOUR_COINFLOW_API_KEY" \\
  -H "x-coinflow-auth-user-id: consumer-123" \\
  -H "Content-Type: application/json"`}
        />

        <p className="text-sm text-[#8B7E6E] mb-2 mt-6" style={{ fontFamily: 'Georgia, serif' }}>
          Response:
        </p>

        <CodeBlock
          language="json"
          title="Session Key Response"
          code={`{
  "key": "eyJhbGciOiJIUzI1NiIs..."  // Note: field is "key", not "sessionKey"
}`}
        />

        <Callout variant="warning" title="Important">
          <p>
            The response field is <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">key</code>, not <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">sessionKey</code>. Session keys expire after 24 hours and must be regenerated.
          </p>
        </Callout>
      </div>

      {/* Step 2: Link Bank Account */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 2: Link Bank Account
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Link a consumer&apos;s bank account for ACH debits. This is a one-time step per consumer. All fields including name and address are required by the CoinFlow API.
        </p>

        <CodeBlock
          language="bash"
          title="Link Bank Account"
          code={`curl -X POST https://api-sandbox.coinflow.cash/api/customer/v2/bankAccount \\
  -H "x-coinflow-auth-wallet: consumer-123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "checking",
    "email": "user@example.com",
    "alias": "My Checking",
    "firstName": "Jane",
    "lastName": "Doe",
    "routingNumber": "110000000",
    "account_number": "000123456789",
    "address1": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701"
  }'`}
        />

        <p className="text-sm text-[#8B7E6E] mb-6 mt-4" style={{ fontFamily: 'Georgia, serif' }}>
          Response: <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">204 No Content</code> on success.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Required Fields
        </h3>

        <div className="not-prose">
          <ParamTable
            params={[
              { name: 'type', type: 'string', required: true, description: '"checking" or "savings"' },
              { name: 'email', type: 'string', required: true, description: "Consumer's email address" },
              { name: 'firstName', type: 'string', required: true, description: 'Account holder first name' },
              { name: 'lastName', type: 'string', required: true, description: 'Account holder last name' },
              { name: 'routingNumber', type: 'string', required: true, description: '9-digit ABA routing number' },
              { name: 'account_number', type: 'string', required: true, description: 'Bank account number' },
              { name: 'address1', type: 'string', required: true, description: 'Street address' },
              { name: 'city', type: 'string', required: true, description: 'City' },
              { name: 'state', type: 'string', required: true, description: '2-letter state code' },
              { name: 'zip', type: 'string', required: true, description: '5-digit ZIP code' },
            ]}
          />
        </div>

        <Callout variant="warning" title="Header note">
          <p>
            Bank account linking uses <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">x-coinflow-auth-wallet</code> as the auth header (not <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">Authorization</code>). This is the consumer&apos;s external ID.
          </p>
        </Callout>
      </div>

      {/* Step 3: ACH Checkout */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 3: Submit ACH Checkout
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Once a bank account is linked, submit an ACH debit to pull funds from the consumer&apos;s bank account.
        </p>

        <CodeBlock
          language="bash"
          title="ACH Checkout Request"
          code={`curl -X POST https://api-sandbox.coinflow.cash/api/checkout/ach/{merchantId} \\
  -H "x-coinflow-auth-session-key: SESSION_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subtotal": { "cents": 63 },
    "token": "BANK_ACCOUNT_TOKEN",
    "settlementType": "USDC",
    "webhookInfo": {
      "roundUpId": "txn_abc123",
      "merchantId": "your-merchant-id"
    }
  }'`}
        />

        <p className="text-sm text-[#8B7E6E] mb-2 mt-6" style={{ fontFamily: 'Georgia, serif' }}>
          Response:
        </p>

        <CodeBlock
          language="json"
          title="ACH Checkout Response"
          code={`{
  "paymentId": "pay_xyz789"  // Note: field is "paymentId", not "id"
}`}
        />

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Checkout Fields
        </h3>

        <div className="not-prose">
          <ParamTable
            params={[
              { name: 'subtotal', type: 'object', required: true, description: 'Object with "cents" (integer) and optional "currency"' },
              { name: 'token', type: 'string', required: true, description: 'Bank account token from the linking step' },
              { name: 'settlementType', type: 'string', required: false, description: '"USDC" (instant) or "Credits" or "Bank" (3 business days)' },
              { name: 'webhookInfo', type: 'object', required: false, description: 'Arbitrary JSON passed through to webhook payloads' },
              { name: 'jwtToken', type: 'string', required: false, description: 'Server-signed JWT to prevent client-side amount tampering' },
            ]}
          />
        </div>
      </div>

      {/* ACH Status Flow */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          ACH Payment Status Flow
        </h2>

        <div className="not-prose">
          <StepList
            steps={[
              {
                title: 'ACH Initiated',
                description: 'Payment submitted to bank -- immediate',
              },
              {
                title: 'ACH Batched',
                description: 'Bank accepted and processing -- same day or next business day',
              },
              {
                title: 'Settled',
                description: 'Funds delivered to merchant -- instant (USDC) or 1-3 business days (USD)',
                highlight: true,
              },
            ]}
          />
        </div>

        <Callout variant="danger" title="Failure states">
          <p>
            <strong>ACH Returned</strong> -- Bank returned the funds (2-5 business days after batch). Reasons: insufficient funds, account closed, unauthorized debit.
          </p>
          <p>
            <strong>ACH Failed</strong> -- Bank rejected the debit (1-2 business days). Invalid account or routing number.
          </p>
        </Callout>
      </div>

      {/* Webhooks */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Handle ACH Webhooks
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          CoinFlow sends webhook events as the ACH payment progresses. Validate the <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">Authorization</code> header against your Webhook Validation Key.
        </p>

        <CodeBlock
          language="json"
          title="Webhook Payload"
          code={`{
  "eventType": "ACH Batched",
  "category": "ach",
  "created": "2026-03-24T14:30:00Z",
  "data": {
    "id": "pay_xyz789",
    "webhookInfo": { "roundUpId": "txn_abc123" },
    "subtotal": { "cents": 63, "currency": "USD" },
    "fees": { "cents": 0, "currency": "USD" },
    "total": { "cents": 63, "currency": "USD" },
    "merchantId": "your-merchant-id",
    "customerId": "consumer-123"
  }
}`}
        />

        <CodeBlock
          language="javascript"
          title="Node.js Webhook Handler"
          code={`app.post('/webhooks/coinflow', async (req, res) => {
  // Validate webhook authenticity
  const webhookKey = req.headers['authorization']
  if (webhookKey !== process.env.COINFLOW_WEBHOOK_KEY) {
    return res.status(401).send('Unauthorized')
  }

  // Deduplicate (CoinFlow may send duplicates)
  const eventId = req.body.data?.id
  if (await isAlreadyProcessed(eventId)) {
    return res.status(200).json({ status: 'duplicate' })
  }

  const { eventType, data } = req.body

  switch (eventType) {
    case 'ACH Initiated':
      await updateTransaction(data.webhookInfo.roundUpId, 'INITIATED')
      break

    case 'ACH Batched':
      await updateTransaction(data.webhookInfo.roundUpId, 'PROCESSING')
      break

    case 'Settled':
      await updateTransaction(data.webhookInfo.roundUpId, 'SETTLED')
      break

    case 'ACH Returned':
      await handleReturn(data)
      break

    case 'ACH Failed':
      await handleFailure(data)
      break
  }

  // Must respond within 5 seconds
  res.status(200).json({ status: 'accepted' })
})`}
        />

        <div className="bg-white border border-[#D4C5B0] rounded-lg p-6 mt-6 mb-6">
          <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            Webhook Retry Policy
          </h4>
          <ul className="text-[#6B5D4F] text-base space-y-2 mb-0" style={{ fontFamily: 'Georgia, serif' }}>
            <li>CoinFlow retries until your server returns <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">200 OK</code>, or 36 hours elapse</li>
            <li>Your server must respond within <strong>5 seconds</strong> or the request times out</li>
            <li>Webhooks are <strong>not exactly-once</strong> -- always deduplicate on <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">data.id</code></li>
          </ul>
        </div>
      </div>

      {/* Merchant-Initiated Transactions */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Merchant-Initiated Transactions (Recurring)
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          After a consumer&apos;s first ACH checkout, subsequent debits can be initiated server-side using the original <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">paymentId</code>. This is ideal for recurring round-ups where the consumer doesn&apos;t need to re-authenticate each time.
        </p>

        <CodeBlock
          language="bash"
          title="Merchant-Initiated Transaction"
          code={`curl -X POST https://api-sandbox.coinflow.cash/api/checkout/merchant-initiated-transaction \\
  -H "x-coinflow-auth-user-id: consumer-123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subtotal": { "cents": 47, "currency": "USD" },
    "originalPaymentId": "pay_xyz789",
    "settlementType": "USDC"
  }'`}
        />

        <Callout variant="warning" title="Rate limit">
          <p>
            5 transactions per <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">originalPaymentId</code> per 90-second window. Exceeding this returns <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">429 Too Many Requests</code>.
          </p>
        </Callout>
      </div>

      {/* Test Bank Accounts */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Sandbox Testing
        </h2>

        <Callout variant="info" title="Sandbox base URL">
          <p>
            <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#2C2416] text-xs font-mono">https://api-sandbox.coinflow.cash</code>
          </p>
        </Callout>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          In sandbox mode, CoinFlow accepts any valid-format routing and account numbers. No real bank verification occurs.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Scenario</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Routing Number</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Account Number</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Result</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Success</td>
                <td className="py-3 px-4 font-mono text-sm">110000000</td>
                <td className="py-3 px-4 font-mono text-sm">000123456789</td>
                <td className="py-3 pl-4 text-[#4CAF50]">ACH Settled</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Any valid format</td>
                <td className="py-3 px-4 font-mono text-sm">Any 9 digits</td>
                <td className="py-3 px-4 font-mono text-sm">Any digits</td>
                <td className="py-3 pl-4 text-[#4CAF50]">Works in sandbox</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-[#D4C5B0] rounded-lg p-6">
          <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            Plaid Sandbox (if using SDK)
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            <div>
              <p className="text-[#8B7E6E] mb-1">Username</p>
              <code className="text-[#2C2416] font-mono">user_good</code>
            </div>
            <div>
              <p className="text-[#8B7E6E] mb-1">Password</p>
              <code className="text-[#2C2416] font-mono">pass_good</code>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Handling
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>HTTP Code</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Meaning</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Action</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50"><td className="py-3 pr-4 font-mono">423</td><td className="py-3 px-4">Customer blocked</td><td className="py-3 pl-4">5 failed attempts -- contact support</td></tr>
              <tr className="border-b border-[#D4C5B0]/50"><td className="py-3 pr-4 font-mono">428</td><td className="py-3 px-4">Re-verification required</td><td className="py-3 pl-4">Consumer must re-verify bank account</td></tr>
              <tr className="border-b border-[#D4C5B0]/50"><td className="py-3 pr-4 font-mono">429</td><td className="py-3 px-4">Rate limited</td><td className="py-3 pl-4">MIT: max 5 per originalPaymentId per 90s</td></tr>
              <tr><td className="py-3 pr-4 font-mono">451</td><td className="py-3 px-4">KYC verification required</td><td className="py-3 pl-4">Consumer must complete identity verification</td></tr>
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
          What&apos;s Next?
        </h2>

        <div className="not-prose">
          <NavCards
            cards={[
              {
                title: 'SideBet Round-Ups',
                description: 'Integrate automated round-ups for sportsbook transactions',
                href: '/docs/sidebet',
              },
              {
                title: 'Webhooks Guide',
                description: 'Handle ACH events in real-time',
                href: '/docs/guides/webhooks',
              },
              {
                title: 'Settlement Options',
                description: 'USDC instant vs USD standard settlement',
                href: '/docs/guides/settlement',
              },
              {
                title: 'SideBet API Reference',
                description: 'Complete endpoint documentation for round-ups',
                href: '/docs/sidebet/api-reference',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
