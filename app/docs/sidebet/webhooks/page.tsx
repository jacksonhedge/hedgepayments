'use client'

import Link from 'next/link'
import { CodeBlock, Callout, FlowDiagram, NavCards } from '../../components'

export default function SideBetWebhooksPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/sidebet" className="hover:text-[#2C2416]">SideBet</Link>
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
          Receive real-time notifications as ACH payments move through the pipeline
        </p>
      </div>

      {/* Payload Structure */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Payload Structure
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Every webhook POST body follows this structure:
        </p>

        <CodeBlock
          language="json"
          title="Webhook Payload"
          code={`{
  "id": "evt_a1b2c3d4e5f6",
  "event": "roundup.completed",
  "data": {
    "roundupId": "roundup_9f8e7d6c",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.52,
    "fees": 0.01,
    "status": "completed"
  },
  "timestamp": "2026-03-24T18:30:00Z",
  "signature": "sha256=a1b2c3d4..."
}`}
        />

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
                <td className="py-3 px-4">string</td>
                <td className="py-3 pl-4">Unique event ID (prefix: <code>evt_</code>). Use for idempotency/deduplication.</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">event</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 pl-4">The event name (e.g., <code>roundup.completed</code>, <code>roundup.failed</code>)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">data</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 pl-4">Event-specific payload containing round-up details</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">timestamp</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 pl-4">ISO 8601 timestamp of when the event occurred</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">signature</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 pl-4">HMAC-SHA256 signature for validation (also sent in <code>X-Hedge-Signature</code> header)</td>
              </tr>
            </tbody>
          </table>
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

        {/* roundup.initiated */}
        <div className="mb-8">
          <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            roundup.initiated
          </h3>
          <p className="text-[#6B5D4F] text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Fired when the ACH debit is submitted to the consumer&apos;s bank. This is the first event after calling <code>/api/roundup/initiate</code>.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_init_abc123",
  "event": "roundup.initiated",
  "data": {
    "roundupId": "roundup_9f8e7d6c",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.53,
    "fees": 0.00,
    "status": "initiated"
  },
  "timestamp": "2026-03-24T14:30:05Z",
  "signature": "sha256=..."
}`}
          />
        </div>

        {/* roundup.ach_batched */}
        <div className="mb-8">
          <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            roundup.ach_batched
          </h3>
          <p className="text-[#6B5D4F] text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Fired when the payment is grouped into an ACH batch for processing by the Federal Reserve. Typically occurs within hours of initiation.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_batch_def456",
  "event": "roundup.ach_batched",
  "data": {
    "roundupId": "roundup_9f8e7d6c",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.53,
    "fees": 0.00,
    "batchId": "batch_20260324_001",
    "status": "processing"
  },
  "timestamp": "2026-03-24T20:00:00Z",
  "signature": "sha256=..."
}`}
          />
        </div>

        {/* roundup.completed */}
        <div className="mb-8">
          <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            roundup.completed
          </h3>
          <p className="text-[#6B5D4F] text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Fired when funds have been received and settled to the merchant. This is the terminal success state.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_comp_ghi789",
  "event": "roundup.completed",
  "data": {
    "roundupId": "roundup_9f8e7d6c",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.52,
    "fees": 0.01,
    "status": "completed"
  },
  "timestamp": "2026-03-27T09:15:00Z",
  "signature": "sha256=..."
}`}
          />
        </div>

        {/* roundup.failed */}
        <div className="mb-8">
          <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            roundup.failed
          </h3>
          <p className="text-[#6B5D4F] text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Fired when the payment could not be processed at all. Typically caused by invalid bank account details or system errors.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_fail_jkl012",
  "event": "roundup.failed",
  "data": {
    "roundupId": "roundup_xyz789ghi",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.00,
    "fees": 0.00,
    "reason": "Invalid account number",
    "status": "failed"
  },
  "timestamp": "2026-03-24T14:31:00Z",
  "signature": "sha256=..."
}`}
          />
        </div>

        {/* roundup.returned */}
        <div className="mb-8">
          <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            roundup.returned
          </h3>
          <p className="text-[#6B5D4F] text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Fired when the consumer&apos;s bank returns the ACH debit. Common reasons: insufficient funds, account closed, or authorization revoked. Can occur up to 60 days after initiation.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "id": "evt_ret_mno345",
  "event": "roundup.returned",
  "data": {
    "roundupId": "roundup_9f8e7d6c",
    "consumerId": "cust_j4k5l6m7",
    "merchantId": "merch_xyz789",
    "betAmountCents": 2347,
    "roundUpCents": 53,
    "amount": 0.00,
    "fees": 0.00,
    "returnCode": "R01",
    "reason": "Insufficient Funds",
    "status": "returned"
  },
  "timestamp": "2026-03-26T11:00:00Z",
  "signature": "sha256=..."
}`}
          />
        </div>
      </div>

      {/* HMAC-SHA256 Signature Validation */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Signature Validation
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Every webhook request includes an <code>X-Hedge-Signature</code> header containing an HMAC-SHA256 signature. Validate it using your webhook secret to ensure the request is authentic:
        </p>

        <CodeBlock
          language="javascript"
          title="Signature Verification"
          code={`import crypto from 'crypto';

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  const expectedSig = \`sha256=\${expected}\`;

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

// Usage
const isValid = verifyWebhookSignature(
  req.body,
  req.headers['x-hedge-signature'],
  process.env.HEDGE_WEBHOOK_SECRET
);

if (!isValid) {
  return res.status(401).send('Invalid signature');
}`}
        />

        <Callout variant="warning" title="Security">
          <p>
            Your webhook secret (<code>whsec_</code>) is separate from your API key. Find it in the Hedge Payments dashboard under Settings &rarr; Webhooks. Always validate the HMAC-SHA256 signature to prevent spoofed webhooks.
          </p>
        </Callout>
      </div>

      {/* Retry Policy */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Retry Policy
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          SideBet retries failed webhook deliveries with exponential backoff:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-white border border-[#D4C5B0] rounded-lg">
            <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>3 retries with exponential backoff</p>
            <p className="text-sm text-[#6B5D4F] mb-0" style={{ fontFamily: 'Georgia, serif' }}>
              Retry 1 after <strong>1 minute</strong>, retry 2 after <strong>10 minutes</strong>, retry 3 after <strong>1 hour</strong>. After 3 failed attempts, the event is marked as undeliverable.
            </p>
          </div>
          <div className="p-4 bg-white border border-[#D4C5B0] rounded-lg">
            <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Success condition</p>
            <p className="text-sm text-[#6B5D4F] mb-0" style={{ fontFamily: 'Georgia, serif' }}>
              Your endpoint must return HTTP <code>200 OK</code>. Any other status code (including 3xx redirects) is treated as a failure.
            </p>
          </div>
          <div className="p-4 bg-white border border-[#D4C5B0] rounded-lg">
            <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Timeout</p>
            <p className="text-sm text-[#6B5D4F] mb-0" style={{ fontFamily: 'Georgia, serif' }}>
              5-second timeout per delivery attempt. If your endpoint does not respond within 5 seconds, the attempt is marked as failed and the retry schedule begins.
            </p>
          </div>
        </div>

        <Callout variant="success" title="Best practice">
          <p>
            Respond <code>200 OK</code> immediately, then process the event asynchronously. This avoids timeouts on slow database writes or downstream API calls.
          </p>
        </Callout>
      </div>

      {/* Idempotency */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Idempotency
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Use the event <code>id</code> field as a deduplication key. Due to retries and at-least-once delivery, your endpoint may receive the same event more than once. Store processed event IDs and skip duplicates:
        </p>

        <CodeBlock
          language="javascript"
          title="Idempotency via Event ID"
          code={`// Idempotency via event ID
const processedEvents = new Set(); // Use Redis or DB in production

function handleWebhook(payload) {
  const eventId = payload.id; // e.g., "evt_a1b2c3d4e5f6"

  if (processedEvents.has(eventId)) {
    console.log('Duplicate event, skipping:', eventId);
    return;
  }

  processedEvents.add(eventId);
  // Process the event...
}`}
        />

        <Callout variant="warning" title="Important">
          <p>
            Always use <code>id</code> (the event ID) for deduplication, not <code>data.roundupId</code>. A single round-up generates multiple events (initiated, batched, completed), each with a unique event ID.
          </p>
        </Callout>
      </div>

      {/* ACH State Machine */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          ACH State Machine
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Each round-up transaction follows this state machine. Terminal states are shown in red:
        </p>

        <FlowDiagram />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { status: 'PENDING', event: 'API response', terminal: false, color: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#B45309]' },
            { status: 'INITIATED', event: 'roundup.initiated', terminal: false, color: 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' },
            { status: 'PROCESSING', event: 'roundup.ach_batched', terminal: false, color: 'bg-[#1E40AF]/10 border-[#1E40AF]/30 text-[#1E40AF]' },
            { status: 'COMPLETED', event: 'roundup.completed', terminal: true, color: 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#2E7D32]' },
            { status: 'FAILED', event: 'roundup.failed', terminal: true, color: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' },
            { status: 'RETURNED', event: 'roundup.returned', terminal: true, color: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' },
          ].map((item) => (
            <div
              key={item.status}
              className={`rounded-lg border p-3 ${item.color}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold tracking-wide">{item.status}</span>
                {item.terminal && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70">Terminal</span>
                )}
              </div>
              <p className="text-[11px] font-mono opacity-80 mb-0">{item.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Handler Example */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Node.js Webhook Handler
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          A production-ready webhook handler with HMAC-SHA256 validation, idempotency, and async processing:
        </p>

        <CodeBlock
          language="javascript"
          title="Node.js Webhook Handler"
          code={`import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.HEDGE_WEBHOOK_SECRET; // whsec_...

// Use Redis or your database in production
const processedEvents = new Set();

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  const expectedSig = \`sha256=\${expected}\`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    );
  } catch {
    return false;
  }
}

app.post('/webhooks/sidebet', async (req, res) => {
  // 1. Validate HMAC-SHA256 signature
  const signature = req.headers['x-hedge-signature'];
  if (!signature || !verifySignature(req.body, signature, WEBHOOK_SECRET)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Unauthorized');
  }

  // 2. Respond 200 immediately to avoid timeout
  res.status(200).send('OK');

  // 3. Deduplicate via event ID
  const { id, event, data, timestamp } = req.body;

  if (processedEvents.has(id)) {
    console.log('Duplicate event, skipping:', id);
    return;
  }
  processedEvents.add(id);

  // 4. Handle each event type
  try {
    switch (event) {
      case 'roundup.initiated':
        console.log(\`[\${timestamp}] Round-up initiated: \${data.roundupId}\`);
        await updateTransactionStatus(data.roundupId, 'initiated');
        break;

      case 'roundup.ach_batched':
        console.log(\`[\${timestamp}] Round-up batched: \${data.roundupId}\`);
        await updateTransactionStatus(data.roundupId, 'processing');
        break;

      case 'roundup.completed':
        console.log(\`[\${timestamp}] Round-up completed: \${data.roundupId} — $\${data.amount}\`);
        await updateTransactionStatus(data.roundupId, 'completed');
        await creditConsumerBalance(data.consumerId, data.amount);
        break;

      case 'roundup.failed':
        console.log(\`[\${timestamp}] Round-up failed: \${data.roundupId} — \${data.reason}\`);
        await updateTransactionStatus(data.roundupId, 'failed');
        await notifyConsumer(data.consumerId, 'Your round-up could not be processed.');
        break;

      case 'roundup.returned':
        console.log(\`[\${timestamp}] Round-up returned: \${data.roundupId} — \${data.returnCode}: \${data.reason}\`);
        await updateTransactionStatus(data.roundupId, 'returned');
        await reverseConsumerCredit(data.consumerId, data.roundupId);
        await notifyConsumer(data.consumerId, \`Your round-up was returned: \${data.reason}\`);
        break;

      default:
        console.log('Unknown event type:', event);
    }
  } catch (err) {
    console.error('Error processing webhook:', err);
    // The 200 was already sent — log and handle via your error monitoring
  }
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));`}
        />
      </div>

      {/* Navigation */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Related
        </h2>

        <div className="not-prose">
          <NavCards
            cards={[
              {
                title: 'API Reference',
                description: 'Full endpoint documentation and error codes',
                href: '/docs/sidebet/api-reference',
              },
              {
                title: 'Quickstart',
                description: 'Step-by-step integration guide with working code',
                href: '/docs/sidebet/quickstart',
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
