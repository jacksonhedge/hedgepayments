'use client'

import Link from 'next/link'
import { CodeBlock, Callout, StepList, NavCards } from '../../components'

export default function SideBetQuickstartPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/sidebet" className="hover:text-[#2C2416]">SideBet</Link>
          <span>/</span>
          <span>Quickstart</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Quickstart
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Go from zero to your first round-up in under 10 minutes
        </p>
      </div>

      {/* Prerequisites */}
      <Callout variant="warning" title="Prerequisites">
        <ul className="text-[#2C2416] text-base space-y-2 mb-0 list-disc pl-4">
          <li>A Hedge Payments account (sign up at <strong>dashboard.hedgepayments.com</strong>)</li>
          <li>Node.js 18+ (for the examples below)</li>
        </ul>
      </Callout>

      {/* Step Overview */}
      <div className="mb-10 mt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Overview
        </h2>
        <StepList
          steps={[
            { title: 'Get API Keys', description: 'Grab your secret key and webhook secret from the dashboard.' },
            { title: 'Configure Round-Up Strategy', description: 'Set how round-ups are calculated for your consumers.' },
            { title: 'Link Consumer Bank Account', description: 'Connect a bank account via CoinFlow for ACH debits.' },
            { title: 'Initiate Round-Ups on Bet Events', description: 'Send transactions to SideBet when bets are placed.' },
            { title: 'Handle Webhooks', description: 'Receive real-time updates as ACH payments settle.' },
          ]}
        />
      </div>

      {/* Step 1 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 1: Get API Keys
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Log in to the Hedge Payments dashboard and navigate to <strong>Settings &rarr; API Keys</strong>. You will need two keys:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-white border border-[#D4C5B0] rounded-lg">
            <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>API Key (Secret)</p>
            <p className="text-sm text-[#6B5D4F] mb-0" style={{ fontFamily: 'Georgia, serif' }}>
              Used for server-to-server requests. Prefix: <code>sk_live_</code> or <code>sk_test_</code>. Never expose this in client-side code.
            </p>
          </div>
          <div className="p-4 bg-white border border-[#D4C5B0] rounded-lg">
            <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Webhook Secret</p>
            <p className="text-sm text-[#6B5D4F] mb-0" style={{ fontFamily: 'Georgia, serif' }}>
              Used to validate incoming webhook signatures. Prefix: <code>whsec_</code>. Found under Settings &rarr; Webhooks.
            </p>
          </div>
        </div>

        <CodeBlock
          language="bash"
          title="Environment Variables"
          code={`# Store these in your environment
export HEDGE_API_KEY="sk_test_your_api_key_here"
export HEDGE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"`}
        />
      </div>

      {/* Step 2 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 2: Configure Round-Up Strategy
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Set your merchant&apos;s round-up strategy via the configuration endpoint. This determines how round-ups are calculated for all your consumers:
        </p>

        <CodeBlock
          language="bash"
          title="Configure Strategy"
          code={`curl -X POST https://api.hedgepayments.com/api/roundup/configure \\
  -H "Authorization: Bearer sk_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantId": "merch_xyz789",
    "strategy": "nearest-dollar",
    "perTransactionMaxCents": 1000,
    "dailyMaxCents": 5000
  }'`}
        />

        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "merchantId": "merch_xyz789",
  "strategy": "nearest-dollar",
  "perTransactionMaxCents": 1000,
  "dailyMaxCents": 5000,
  "settlementType": "USD",
  "updated": true
}`}
        />

        <Callout variant="info" title="Available strategies">
          <p>
            <code>nearest-dollar</code>, <code>nearest-5</code>, <code>percentage</code>, <code>fixed-amount</code>, <code>dynamic</code>. For <code>percentage</code>, <code>fixed-amount</code>, and <code>dynamic</code>, include a <code>strategyValue</code> field (e.g., <code>{'"strategyValue": 5'}</code> for 5% or 5x multiplier).
          </p>
        </Callout>
      </div>

      {/* Step 3 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 3: Link Consumer Bank Account
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Before initiating round-ups, consumers must link their bank account via CoinFlow. All fields are required for ACH compliance (NACHA rules):
        </p>

        <CodeBlock
          language="bash"
          title="Link Bank Account"
          code={`curl -X POST https://api.hedgepayments.com/api/customer/v2/bankAccount \\
  -H "Authorization: Bearer sk_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "routingNumber": "021000021",
    "account_number": "123456789",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  }'`}
        />

        <CodeBlock
          language="json"
          title="Response"
          code={`{
  "customerId": "cust_j4k5l6m7",
  "bankAccountId": "ba_n8o9p0q1",
  "status": "LINKED",
  "last4": "6789"
}`}
        />

        <Callout variant="warning" title="Important">
          <p>
            The field names follow CoinFlow&apos;s conventions. Note <code>account_number</code> uses snake_case while other fields use camelCase.
          </p>
        </Callout>
      </div>

      {/* Step 4 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 4: Initiate Round-Ups on Bet Events
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          When a consumer places a bet, send the transaction to SideBet. The round-up is calculated server-side based on your configured strategy:
        </p>

        <CodeBlock
          language="bash"
          title="Initiate Round-Up"
          code={`curl -X POST https://api.hedgepayments.com/api/roundup/initiate \\
  -H "Authorization: Bearer sk_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "betAmount": 2347,
    "consumerId": "cust_j4k5l6m7",
    "strategy": "nearest-dollar",
    "merchantId": "merch_xyz789"
  }'`}
        />

        <CodeBlock
          language="json"
          title="Response — $23.47 bet, $0.53 round-up (nearest-dollar)"
          code={`{
  "id": "roundup_9f8e7d6c",
  "roundUpCents": 53,
  "betAmountCents": 2347,
  "status": "pending",
  "skipped": false,
  "consumerId": "cust_j4k5l6m7",
  "merchantId": "merch_xyz789"
}`}
        />
      </div>

      {/* Step 5 */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Step 5: Handle Webhooks
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          SideBet sends webhook events as each ACH payment progresses. Set up an endpoint to receive them:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Event</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>When</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Action</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">roundup.initiated</td>
                <td className="py-3 px-4">ACH debit submitted to bank</td>
                <td className="py-3 pl-4">Update status to processing</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50 bg-[#E8F5E9]/30">
                <td className="py-3 pr-4 font-mono text-sm font-semibold text-[#2C2416]">roundup.completed</td>
                <td className="py-3 px-4">Funds received and settled</td>
                <td className="py-3 pl-4 font-semibold text-[#4CAF50]">Credit consumer&apos;s balance</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm text-[#F44336]">roundup.failed</td>
                <td className="py-3 px-4">Payment could not be processed</td>
                <td className="py-3 pl-4">Log error, notify consumer</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm text-[#F44336]">roundup.returned</td>
                <td className="py-3 px-4">Bank returned the debit</td>
                <td className="py-3 pl-4">Reverse the credit, notify consumer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Working Example */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Full Working Example
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Here&apos;s a complete Node.js integration that ties all five steps together -- configure strategy, link a bank account, initiate round-ups on bet events, and handle webhooks:
        </p>

        <CodeBlock
          language="javascript"
          title="Full Integration — server.js"
          code={`import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const API_BASE = 'https://api-sandbox.hedgepayments.com';
const API_KEY = process.env.HEDGE_API_KEY;
const WEBHOOK_SECRET = process.env.HEDGE_WEBHOOK_SECRET;
const MERCHANT_ID = 'merch_xyz789';

const headers = {
  'Authorization': \`Bearer \${API_KEY}\`,
  'Content-Type': 'application/json',
};

// Step 2: Configure round-up strategy (run once)
async function configureStrategy() {
  const res = await fetch(\`\${API_BASE}/api/roundup/configure\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      merchantId: MERCHANT_ID,
      strategy: 'nearest-dollar',
      perTransactionMaxCents: 1000,
      dailyMaxCents: 5000,
    }),
  });
  return res.json();
}

// Step 3: Link a consumer's bank account
app.post('/link-bank', async (req, res) => {
  const response = await fetch(\`\${API_BASE}/api/customer/v2/bankAccount\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      routingNumber: req.body.routingNumber,
      account_number: req.body.accountNumber,
      address1: req.body.address1,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    }),
  });

  const data = await response.json();
  res.json(data);
});

// Step 4: Initiate a round-up when a bet is placed
app.post('/place-bet', async (req, res) => {
  const { consumerId, betAmountCents } = req.body;

  // Place the bet in your system first...
  // Then initiate the round-up:
  const response = await fetch(\`\${API_BASE}/api/roundup/initiate\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      betAmount: betAmountCents,
      consumerId,
      strategy: 'nearest-dollar',
      merchantId: MERCHANT_ID,
    }),
  });

  const roundUp = await response.json();

  res.json({
    betPlaced: true,
    roundUp: {
      id: roundUp.id,
      roundUpCents: roundUp.roundUpCents,
      skipped: roundUp.skipped,
    },
  });
});

// Step 5: Handle webhooks with signature validation
app.post('/webhooks/sidebet', (req, res) => {
  // Validate HMAC-SHA256 signature
  const signature = req.headers['x-hedge-signature'];
  const payload = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }

  // Respond 200 immediately
  res.status(200).send('OK');

  // Process the event
  const { event, data } = req.body;

  switch (event) {
    case 'roundup.initiated':
      console.log(\`Round-up initiated: \${data.roundupId}\`);
      break;
    case 'roundup.completed':
      console.log(\`Round-up settled: \${data.roundupId} — $\${data.amount}\`);
      // Credit the consumer's balance
      break;
    case 'roundup.failed':
      console.log(\`Round-up failed: \${data.roundupId}\`);
      break;
    case 'roundup.returned':
      console.log(\`Round-up returned: \${data.roundupId}\`);
      // Reverse any credit
      break;
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));`}
        />
      </div>

      {/* Sandbox Testing */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Sandbox Testing
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Use the sandbox environment to test your integration without moving real money:
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            <div>
              <p className="text-[#8B7E6E] mb-1">Sandbox Base URL</p>
              <code className="text-[#2C2416]">https://api-sandbox.hedgepayments.com</code>
            </div>
            <div>
              <p className="text-[#8B7E6E] mb-1">CoinFlow Sandbox</p>
              <code className="text-[#2C2416]">api-sandbox.coinflow.cash</code>
            </div>
          </div>
        </div>

        <Callout variant="success" title="Sandbox bank accounts">
          <p>
            Any routing number and account number will work in the sandbox environment. No real bank verification occurs. ACH webhooks are simulated and fire within seconds instead of days.
          </p>
        </Callout>
      </div>

      {/* What's Next */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Next Steps
        </h2>

        <div className="not-prose">
          <NavCards
            cards={[
              {
                title: 'API Reference',
                description: 'Full endpoint docs, request/response schemas, and error codes',
                href: '/docs/sidebet/api-reference',
              },
              {
                title: 'Webhooks',
                description: 'Payload structures, signature validation, retry policy, and deduplication',
                href: '/docs/sidebet/webhooks',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
