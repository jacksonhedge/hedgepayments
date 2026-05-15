'use client'

import Link from 'next/link'
import { CodeBlock, EndpointHeader, ParamTable, Callout, NavCards } from '../../components'

export default function SideBetAPIReferencePage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/sidebet" className="hover:text-[#2C2416]">SideBet</Link>
          <span>/</span>
          <span>API Reference</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          API Reference
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Complete endpoint documentation for the SideBet round-up API
        </p>
      </div>

      {/* Authentication */}
      <Callout variant="info" title="Authentication">
        <p>
          All requests require a Bearer token in the <code className="text-[13px] font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded">Authorization</code> header.
          Obtain your API key from the Hedge Payments dashboard under <strong>Settings &rarr; API Keys</strong>.
        </p>
      </Callout>

      <CodeBlock
        language="bash"
        title="Authorization Header"
        code={`curl -X POST https://api.hedgepayments.com/api/roundup/initiate \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ ... }'`}
      />

      {/* Base URLs */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Base URLs
        </h2>

        <div className="border border-[#D4C5B0] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Environment
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  URL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#D4C5B0]/50 bg-white hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3 text-[#2C2416] font-medium" style={{ fontFamily: 'Georgia, serif' }}>Sandbox</td>
                <td className="px-4 py-3 font-mono text-[13px] text-[#6B5D4F]">https://api-sandbox.hedgepayments.com</td>
              </tr>
              <tr className="bg-[#FAF8F5] hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3 text-[#2C2416] font-medium" style={{ fontFamily: 'Georgia, serif' }}>Production</td>
                <td className="px-4 py-3 font-mono text-[13px] text-[#6B5D4F]">https://api.hedgepayments.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          ENDPOINT 1: POST /api/roundup/initiate
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <EndpointHeader
          method="POST"
          path="/api/roundup/initiate"
          description="Calculate and initiate a round-up ACH debit for a consumer bet. The round-up amount is determined by the provided strategy (or the merchant's default), subject to per-transaction and daily caps."
        />

        <h3 className="text-lg text-[#2C2416] mb-3 mt-8" style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          Request Body
        </h3>

        <ParamTable
          params={[
            { name: 'betAmount', type: 'integer', required: true, description: 'Bet amount in cents (e.g., 2347 for $23.47)' },
            { name: 'consumerId', type: 'string', required: true, description: "The consumer's unique ID from bank linking" },
            { name: 'strategy', type: 'string', required: true, description: 'Round-up strategy: nearest-dollar, nearest-5, percentage, fixed-amount, or dynamic' },
            { name: 'merchantId', type: 'string', required: true, description: 'Your merchant ID' },
            { name: 'strategyValue', type: 'number', required: false, description: 'Required for percentage (1-10), fixed-amount (cents), and dynamic (multiplier)' },
          ]}
        />

        <CodeBlock
          language="json"
          title="Request"
          code={`{
  "betAmount": 2347,
  "consumerId": "cust_j4k5l6m7",
  "strategy": "nearest-dollar",
  "merchantId": "merch_xyz789"
}`}
        />

        <CodeBlock
          language="json"
          title="Response — 200 OK"
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

        <CodeBlock
          language="json"
          title="Response — daily cap reached"
          code={`{
  "id": null,
  "roundUpCents": 0,
  "betAmountCents": 2347,
  "status": "skipped",
  "skipped": true,
  "consumerId": "cust_j4k5l6m7",
  "merchantId": "merch_xyz789"
}`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          ENDPOINT 2: GET /api/roundup/consumer/:consumerId
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <EndpointHeader
          method="GET"
          path="/api/roundup/consumer/:consumerId"
          description="Retrieve a consumer's round-up transaction history and current daily total. Useful for displaying round-up activity in your UI."
        />

        <h3 className="text-lg text-[#2C2416] mb-3 mt-8" style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          Path Parameters
        </h3>

        <ParamTable
          params={[
            { name: 'consumerId', type: 'string', required: true, description: "The consumer's unique ID" },
          ]}
        />

        <CodeBlock
          language="json"
          title="Response — 200 OK"
          code={`{
  "consumerId": "cust_j4k5l6m7",
  "dailyTotalCents": 247,
  "dailyMaxCents": 5000,
  "transactions": [
    {
      "id": "roundup_9f8e7d6c",
      "roundUpCents": 53,
      "betAmountCents": 2347,
      "status": "completed",
      "createdAt": "2026-03-24T14:30:00Z"
    },
    {
      "id": "roundup_a1b2c3d4",
      "roundUpCents": 94,
      "betAmountCents": 1506,
      "status": "initiated",
      "createdAt": "2026-03-24T15:12:00Z"
    },
    {
      "id": "roundup_e5f6g7h8",
      "roundUpCents": 100,
      "betAmountCents": 5000,
      "status": "pending",
      "createdAt": "2026-03-24T16:45:00Z"
    }
  ]
}`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          ENDPOINT 3: POST /api/roundup/configure
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <EndpointHeader
          method="POST"
          path="/api/roundup/configure"
          description="Configure or update the round-up strategy for a merchant. Sets the default strategy, transaction caps, and settlement preferences."
        />

        <h3 className="text-lg text-[#2C2416] mb-3 mt-8" style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          Request Body
        </h3>

        <ParamTable
          params={[
            { name: 'merchantId', type: 'string', required: true, description: 'Your merchant ID' },
            { name: 'strategy', type: 'string', required: true, description: 'nearest-dollar, nearest-5, percentage, fixed-amount, or dynamic' },
            { name: 'strategyValue', type: 'number', required: false, description: 'Value for percentage (1-10), fixed-amount (cents), dynamic (multiplier)' },
            { name: 'perTransactionMaxCents', type: 'integer', required: false, description: 'Per-transaction ceiling in cents. Default: 1000 ($10)' },
            { name: 'dailyMaxCents', type: 'integer', required: false, description: 'Daily cap per consumer in cents. Default: 5000 ($50)' },
            { name: 'settlementType', type: 'string', required: false, description: 'USDC (instant) or USD (3 business days). Default: USD' },
          ]}
        />

        <CodeBlock
          language="json"
          title="Request"
          code={`{
  "merchantId": "merch_xyz789",
  "strategy": "percentage",
  "strategyValue": 5,
  "perTransactionMaxCents": 1000,
  "dailyMaxCents": 5000,
  "settlementType": "USDC"
}`}
        />

        <CodeBlock
          language="json"
          title="Response — 200 OK"
          code={`{
  "merchantId": "merch_xyz789",
  "strategy": "percentage",
  "strategyValue": 5,
  "perTransactionMaxCents": 1000,
  "dailyMaxCents": 5000,
  "settlementType": "USDC",
  "updated": true
}`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          ENDPOINT 4: GET /api/roundup/merchant/:merchantId/summary
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <EndpointHeader
          method="GET"
          path="/api/roundup/merchant/:merchantId/summary"
          description="Retrieve aggregate round-up statistics for a merchant. Includes total volume, active consumers, and current strategy configuration."
        />

        <h3 className="text-lg text-[#2C2416] mb-3 mt-8" style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          Path Parameters
        </h3>

        <ParamTable
          params={[
            { name: 'merchantId', type: 'string', required: true, description: 'Your merchant ID' },
          ]}
        />

        <CodeBlock
          language="json"
          title="Response — 200 OK"
          code={`{
  "merchantId": "merch_xyz789",
  "strategy": "nearest-dollar",
  "perTransactionMaxCents": 1000,
  "dailyMaxCents": 5000,
  "settlementType": "USDC",
  "stats": {
    "totalRoundUpsCents": 458320,
    "totalTransactions": 12847,
    "activeConsumers": 1923,
    "completedCount": 12105,
    "failedCount": 42,
    "returnedCount": 18,
    "pendingCount": 682,
    "avgRoundUpCents": 36
  }
}`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          Webhook Events
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Webhook Events
        </h2>

        <p
          className="text-[#6B5D4F] text-base leading-relaxed mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          SideBet sends webhook events as ACH payments progress through the pipeline.
          See the <Link href="/docs/sidebet/webhooks" className="text-[#4CAF50] hover:underline font-medium">Webhooks</Link> page
          for full payload structures, signature validation, and retry policy.
        </p>

        <div className="border border-[#D4C5B0] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Event
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Description
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: 'Georgia, serif' }}>
                  Payload Key Fields
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#D4C5B0]/50 bg-white hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <code className="font-mono text-[13px] text-[#2C2416]">roundup.initiated</code>
                </td>
                <td className="px-4 py-3 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  ACH debit submitted to consumer&apos;s bank
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#6B5D4F] hidden md:table-cell">
                  data.roundupId, data.amount, data.consumerId
                </td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50 bg-[#FAF8F5] hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <code className="font-mono text-[13px] text-[#4CAF50] font-semibold">roundup.completed</code>
                </td>
                <td className="px-4 py-3 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  Funds received and settled to merchant
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#6B5D4F] hidden md:table-cell">
                  data.roundupId, data.amount, data.fees
                </td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50 bg-white hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <code className="font-mono text-[13px] text-[#EF4444]">roundup.failed</code>
                </td>
                <td className="px-4 py-3 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  Payment could not be processed
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#6B5D4F] hidden md:table-cell">
                  data.roundupId, data.reason
                </td>
              </tr>
              <tr className="bg-[#FAF8F5] hover:bg-[#F5F0E8]/50 transition-colors duration-150">
                <td className="px-4 py-3">
                  <code className="font-mono text-[13px] text-[#EF4444]">roundup.returned</code>
                </td>
                <td className="px-4 py-3 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  Bank returned the debit (e.g., insufficient funds)
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#6B5D4F] hidden md:table-cell">
                  data.roundupId, data.returnCode, data.reason
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          Error Codes
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Codes
        </h2>

        <p
          className="text-[#6B5D4F] text-base leading-relaxed mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          All error responses follow a consistent envelope. The <code className="text-[13px] font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded">field</code> property
          is included when the error relates to a specific request parameter.
        </p>

        <div className="border border-[#D4C5B0] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Code
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Meaning
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ fontFamily: 'Georgia, serif' }}>
                  Common Causes
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: '400', meaning: 'Bad Request', causes: 'Missing required fields, invalid JSON body' },
                { code: '401', meaning: 'Unauthorized', causes: 'Missing or invalid API key in Authorization header' },
                { code: '404', meaning: 'Not Found', causes: 'Consumer or merchant ID does not exist, no linked bank account' },
                { code: '409', meaning: 'Conflict', causes: 'Duplicate round-up for the same bet event (idempotency)' },
                { code: '422', meaning: 'Unprocessable Entity', causes: 'Bet amount is zero or negative, invalid strategy, percentage out of range' },
                { code: '429', meaning: 'Too Many Requests', causes: 'Rate limit exceeded — see Rate Limits below' },
                { code: '500', meaning: 'Internal Server Error', causes: 'Unexpected server error — contact support if persistent' },
              ].map((row, index) => (
                <tr
                  key={row.code}
                  className={`border-b border-[#D4C5B0]/50 last:border-b-0 ${
                    index % 2 === 1 ? 'bg-[#FAF8F5]' : 'bg-white'
                  } hover:bg-[#F5F0E8]/50 transition-colors duration-150`}
                >
                  <td className="px-4 py-3">
                    <code className="font-mono text-[13px] text-[#2C2416] font-medium">{row.code}</code>
                  </td>
                  <td className="px-4 py-3 text-[#2C2416] font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                    {row.meaning}
                  </td>
                  <td className="px-4 py-3 text-[#6B5D4F] text-[13px] leading-relaxed hidden sm:table-cell" style={{ fontFamily: 'Georgia, serif' }}>
                    {row.causes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          language="json"
          title="Error Response Format"
          code={`{
  "error": {
    "code": 422,
    "message": "betAmount must be a positive integer",
    "field": "betAmount"
  }
}`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          Rate Limits
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10 mb-12">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Rate Limits
        </h2>

        <p
          className="text-[#6B5D4F] text-base leading-relaxed mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Rate limits are enforced per merchant API key. All limits use a sliding window.
        </p>

        <div className="border border-[#D4C5B0] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Endpoint
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Limit
                </th>
                <th className="text-left px-4 py-2.5 text-[#6B5D4F] font-semibold text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                  Window
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { endpoint: 'POST /api/roundup/initiate', limit: '100 requests', window: 'per minute per merchant' },
                { endpoint: 'GET /api/roundup/consumer/:id', limit: '300 requests', window: 'per minute per merchant' },
                { endpoint: 'POST /api/roundup/configure', limit: '10 requests', window: 'per minute per merchant' },
                { endpoint: 'GET /api/roundup/merchant/:id/summary', limit: '60 requests', window: 'per minute per merchant' },
              ].map((row, index) => (
                <tr
                  key={row.endpoint}
                  className={`border-b border-[#D4C5B0]/50 last:border-b-0 ${
                    index % 2 === 1 ? 'bg-[#FAF8F5]' : 'bg-white'
                  } hover:bg-[#F5F0E8]/50 transition-colors duration-150`}
                >
                  <td className="px-4 py-3">
                    <code className="font-mono text-[13px] text-[#2C2416]">{row.endpoint}</code>
                  </td>
                  <td className="px-4 py-3 text-[#2C2416] font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                    {row.limit}
                  </td>
                  <td className="px-4 py-3 text-[#6B5D4F] text-[13px]" style={{ fontFamily: 'Georgia, serif' }}>
                    {row.window}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="warning" title="Rate limit headers">
          <p>
            Responses include <code className="text-[13px] font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded">X-RateLimit-Limit</code>,{' '}
            <code className="text-[13px] font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded">X-RateLimit-Remaining</code>, and{' '}
            <code className="text-[13px] font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded">X-RateLimit-Reset</code> headers.
            When you receive a <strong>429</strong>, wait until the reset timestamp before retrying.
          </p>
        </Callout>
      </div>

      {/* ─────────────────────────────────────────────────────────
          Related Pages
         ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[#D4C5B0] pt-10">
        <h2
          className="text-3xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Related
        </h2>

        <NavCards
          cards={[
            {
              title: 'Quickstart',
              description: 'Step-by-step integration guide with working code',
              href: '/docs/sidebet/quickstart',
            },
            {
              title: 'Webhooks',
              description: 'Full payload structures, signature validation, and retry policy',
              href: '/docs/sidebet/webhooks',
            },
          ]}
        />
      </div>
    </div>
  )
}
