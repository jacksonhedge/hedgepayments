'use client'

import Link from 'next/link'

export default function ErrorCodesPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Docs</Link>
          <span>/</span>
          <Link href="/docs/reference" className="hover:text-[#2C2416]">Reference</Link>
          <span>/</span>
          <span>Error Codes</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Error Codes
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Complete reference of error codes and how to handle them
        </p>
      </div>

      {/* Error Response Format */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Response Format
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          All API errors follow a consistent JSON structure:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "error": {
    "code": "invalid_amount",
    "message": "Amount must be a positive integer in cents.",
    "details": {
      "field": "amount",
      "provided": -500,
      "expected": "positive integer"
    }
  }
}`}</code>
        </pre>

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
                <td className="py-3 pr-4 font-mono text-sm">error.code</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Machine-readable error code</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">error.message</td>
                <td className="py-3 px-4 text-sm">string</td>
                <td className="py-3 pl-4 text-sm">Human-readable error description</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">error.details</td>
                <td className="py-3 px-4 text-sm">object?</td>
                <td className="py-3 pl-4 text-sm">Optional additional context about the error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HTTP Status Codes */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          HTTP Status Codes
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416] w-20" style={{ fontFamily: 'Georgia, serif' }}>Code</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Status</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">400</td>
                <td className="py-3 px-4 text-sm">Bad Request</td>
                <td className="py-3 pl-4 text-sm">The request body is malformed or missing required fields</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">401</td>
                <td className="py-3 px-4 text-sm">Unauthorized</td>
                <td className="py-3 pl-4 text-sm">Missing or invalid API key / JWT token</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">403</td>
                <td className="py-3 px-4 text-sm">Forbidden</td>
                <td className="py-3 pl-4 text-sm">API key lacks permission for this action</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">404</td>
                <td className="py-3 px-4 text-sm">Not Found</td>
                <td className="py-3 pl-4 text-sm">The requested resource does not exist</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">409</td>
                <td className="py-3 px-4 text-sm">Conflict</td>
                <td className="py-3 pl-4 text-sm">Resource already exists or state conflict (e.g., duplicate idempotency key)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">412</td>
                <td className="py-3 px-4 text-sm">Precondition Failed</td>
                <td className="py-3 pl-4 text-sm">Payment cannot transition to the requested state</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">422</td>
                <td className="py-3 px-4 text-sm">Unprocessable Entity</td>
                <td className="py-3 pl-4 text-sm">Request is well-formed but contains invalid values</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">423</td>
                <td className="py-3 px-4 text-sm">Locked</td>
                <td className="py-3 pl-4 text-sm">Customer account is blocked (CoinFlow fraud detection)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">428</td>
                <td className="py-3 px-4 text-sm">Precondition Required</td>
                <td className="py-3 pl-4 text-sm">Customer must re-verify identity (CoinFlow re-verification)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">429</td>
                <td className="py-3 px-4 text-sm">Too Many Requests</td>
                <td className="py-3 pl-4 text-sm">Rate limit exceeded (100 requests/minute per API key)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">451</td>
                <td className="py-3 px-4 text-sm">Unavailable For Legal Reasons</td>
                <td className="py-3 pl-4 text-sm">KYC/KYB verification required before processing</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono font-semibold">500</td>
                <td className="py-3 px-4 text-sm">Internal Server Error</td>
                <td className="py-3 pl-4 text-sm">Unexpected error on our end. Contact support if it persists</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono font-semibold">502</td>
                <td className="py-3 px-4 text-sm">Bad Gateway</td>
                <td className="py-3 pl-4 text-sm">Upstream payment processor is temporarily unavailable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ACH-Specific Error Codes */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          ACH-Specific Error Codes
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          These errors are returned when ACH transactions fail or are returned by the banking network:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Code</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>ACH Return</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach_insufficient_funds</td>
                <td className="py-3 px-4 text-sm">R01</td>
                <td className="py-3 pl-4 text-sm">Customer account has insufficient funds to cover the debit</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach_account_closed</td>
                <td className="py-3 px-4 text-sm">R02</td>
                <td className="py-3 pl-4 text-sm">The bank account has been closed</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-mono text-sm">ach_unauthorized_debit</td>
                <td className="py-3 px-4 text-sm">R07 / R10</td>
                <td className="py-3 pl-4 text-sm">Customer claims the debit was not authorized</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-sm">ach_account_frozen</td>
                <td className="py-3 px-4 text-sm">R16</td>
                <td className="py-3 pl-4 text-sm">The bank account has been frozen by the bank or a legal authority</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>ACH returns can arrive up to 60 days after the original transaction.</strong> Always listen for <code>ach.returned</code> webhook events to handle late returns and reverse any fulfilled orders.
          </p>
        </div>
      </div>

      {/* CoinFlow-Specific Errors */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          CoinFlow-Specific Errors
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          These errors originate from the CoinFlow payment processor and require specific handling:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <div className="flex items-start gap-4">
              <code className="text-[#F44336] font-bold text-lg">423</code>
              <div>
                <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Customer Blocked</p>
                <p className="text-[#6B5D4F] text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  CoinFlow's fraud detection has flagged and blocked this customer. The customer cannot make further purchases until the block is resolved.
                </p>
                <p className="text-[#8B7E6E] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong>Action:</strong> Direct the customer to contact support. Do not retry automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <div className="flex items-start gap-4">
              <code className="text-[#F59E0B] font-bold text-lg">428</code>
              <div>
                <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Re-verification Required</p>
                <p className="text-[#6B5D4F] text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  The customer must complete additional identity verification before continuing. This is triggered by changes in transaction patterns or risk signals.
                </p>
                <p className="text-[#8B7E6E] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong>Action:</strong> Redirect the customer to the CoinFlow verification flow using the <code>verification_url</code> in the error details.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <div className="flex items-start gap-4">
              <code className="text-[#9C27B0] font-bold text-lg">451</code>
              <div>
                <p className="font-semibold text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>KYC Required</p>
                <p className="text-[#6B5D4F] text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Know Your Customer verification is required before processing this transaction. New customers or high-value transactions may trigger this requirement.
                </p>
                <p className="text-[#8B7E6E] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong>Action:</strong> Redirect the customer to complete KYC using the <code>kyc_url</code> in the error details. The payment can be retried after verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Handling Best Practices */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Handling Best Practices
        </h2>

        <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-6">
          <p className="text-[#2C2416] text-base mb-2">
            <strong style={{ fontFamily: 'Georgia, serif' }}>Recommended Pattern</strong>
          </p>
          <p className="text-[#6B5D4F] text-base mb-0">
            Use the <code>error.code</code> field for programmatic error handling, and display the <code>error.message</code> field to users. The <code>error.details</code> object provides additional context for debugging.
          </p>
        </div>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>&#10003; <strong>Use error codes, not status codes:</strong> Multiple error types can share the same HTTP status code. Always check <code>error.code</code> for specific handling</li>
          <li>&#10003; <strong>Retry with backoff for 5xx errors:</strong> Server errors are usually transient. Retry with exponential backoff (1s, 2s, 4s, 8s, max 3 retries)</li>
          <li>&#10003; <strong>Never retry 4xx errors blindly:</strong> Client errors require fixing the request before retrying (except 429, which should be retried after the rate limit resets)</li>
          <li>&#10003; <strong>Log the full error response:</strong> Always log the complete error object including <code>details</code> for debugging</li>
          <li>&#10003; <strong>Handle 423, 428, 451 gracefully:</strong> These CoinFlow-specific errors require user action, not automatic retries</li>
          <li>&#10003; <strong>Use idempotency keys:</strong> For POST requests, include an <code>Idempotency-Key</code> header to safely retry failed requests without creating duplicates</li>
        </ul>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`try {
  const payment = await hedge.payments.create({
    amount: 5000,
    currency: 'USD',
    customer_email: 'customer@example.com'
  })
} catch (err) {
  switch (err.code) {
    case 'invalid_amount':
      // Fix the request parameters
      console.error('Invalid amount:', err.details)
      break

    case 'rate_limit_exceeded':
      // Wait and retry
      const retryAfter = err.details?.retry_after || 60
      await sleep(retryAfter * 1000)
      break

    case 'customer_blocked':
      // Direct user to support
      showMessage('Please contact support for assistance.')
      break

    case 'kyc_required':
      // Redirect to KYC flow
      window.location.href = err.details.kyc_url
      break

    default:
      // Log and show generic error
      console.error('Payment error:', err)
      showMessage('Something went wrong. Please try again.')
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
            href="/docs/reference"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              API Reference
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Full endpoint listing and authentication details
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
              Webhooks Guide
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Handle payment events and error notifications
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
