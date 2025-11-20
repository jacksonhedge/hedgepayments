'use client'

export default function AuthenticationPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Authentication
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Secure your API requests with JWT-based authentication
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
          Hedge Payments uses API keys and JWT tokens to authenticate requests. Your API keys carry many privileges, so be sure to keep them secure and never share them in publicly accessible areas.
        </p>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mb-8">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>⚠️ Security Warning:</strong><br />
            Do not commit API keys to version control or expose them in client-side code. Always use environment variables and keep keys on the server side.
          </p>
        </div>
      </div>

      {/* API Keys */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          API Keys
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          API keys are the primary method of authentication for Hedge Payments. You can find your API keys in the Dashboard under Settings → API Keys.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Types of API Keys
        </h3>

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🧪 Test Mode Keys
            </h4>
            <p className="text-[#2C2416] text-base mb-2">
              Start with <code className="bg-[#FAF8F5] px-2 py-1 rounded">test_</code>
            </p>
            <p className="text-[#6B5D4F] text-base mb-0">
              Use these keys during development. Test mode transactions don't process real payments and won't affect your balance.
            </p>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🚀 Live Mode Keys
            </h4>
            <p className="text-[#2C2416] text-base mb-2">
              Start with <code className="bg-[#FAF8F5] px-2 py-1 rounded">live_</code>
            </p>
            <p className="text-[#6B5D4F] text-base mb-0">
              Use these keys in production. Live mode transactions process real payments and affect your account balance.
            </p>
          </div>
        </div>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Using API Keys
        </h3>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Include your API key in the <code className="bg-[#FAF8F5] px-2 py-1 rounded">Authorization</code> header with every request:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`curl -X POST https://api.hedgepayments.com/api/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "customerEmail": "user@example.com"
  }'`}</code>
        </pre>
      </div>

      {/* JWT Tokens */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          JWT Tokens
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          For added security in client-side applications, you can generate short-lived JWT tokens from your server using your API key. These tokens can be safely used in frontend code.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Generating a JWT Token
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`const token = await hedge.auth.createToken({
  expiresIn: '1h', // Token expires in 1 hour
  scope: ['payments:read', 'payments:create']
})

// Send token to client
res.json({ token: token.jwt })`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Python</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`token = hedge.auth.create_token(
    expires_in='1h',  # Token expires in 1 hour
    scope=['payments:read', 'payments:create']
)

# Send token to client
return {'token': token.jwt}`}</code>
            </pre>
          </div>
        </div>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Using JWT Tokens
        </h3>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Use JWT tokens the same way as API keys, in the Authorization header:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`// Client-side code (safe to use)
const response = await fetch('https://api.hedgepayments.com/api/payments', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${jwtToken}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100.00,
    currency: 'USD',
    customerEmail: 'user@example.com'
  })
})`}</code>
        </pre>
      </div>

      {/* Scopes and Permissions */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Scopes and Permissions
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Control access to your API resources using scopes. Each scope grants specific permissions:
        </p>

        <div className="bg-white border border-[#D4C5B0] overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-[#FAF8F5] border-b border-[#D4C5B0]">
              <tr>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Scope
                </th>
                <th className="text-left p-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">payments:read</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">View payment information</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">payments:create</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Create new payments</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">payments:refund</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Process payment refunds</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]">
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">balance:read</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">View account balance</td>
              </tr>
              <tr>
                <td className="p-4">
                  <code className="bg-[#FAF8F5] px-2 py-1 rounded text-sm">payouts:create</code>
                </td>
                <td className="p-4 text-[#6B5D4F]">Create payout requests</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Security Best Practices
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-4 mb-8">
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔒 Use environment variables:</strong><br />
            <span className="text-[#6B5D4F]">Store API keys in environment variables, never hard-code them in your application.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>⏱️ Set appropriate expiration times:</strong><br />
            <span className="text-[#6B5D4F]">JWT tokens should have short expiration times (1-24 hours) to minimize security risks.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🎯 Use minimal scopes:</strong><br />
            <span className="text-[#6B5D4F]">Only grant the permissions necessary for each token's intended use.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔄 Rotate keys regularly:</strong><br />
            <span className="text-[#6B5D4F]">Periodically regenerate your API keys, especially if you suspect they may have been compromised.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🚫 Never expose keys client-side:</strong><br />
            <span className="text-[#6B5D4F]">API keys should only be used on your backend servers. Use JWT tokens for client-side operations.</span>
          </li>
        </ul>
      </div>

      {/* Error Handling */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Error Handling
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          When authentication fails, Hedge Payments returns a 401 Unauthorized status code:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired API key",
    "type": "authentication_error"
  }
}`}</code>
        </pre>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Common authentication errors:
        </p>

        <ul className="text-[#2C2416] text-base leading-relaxed space-y-3 mb-8">
          <li><code className="bg-[#FAF8F5] px-2 py-1 rounded">invalid_api_key</code> - The provided API key is invalid</li>
          <li><code className="bg-[#FAF8F5] px-2 py-1 rounded">expired_token</code> - The JWT token has expired</li>
          <li><code className="bg-[#FAF8F5] px-2 py-1 rounded">insufficient_permissions</code> - The token doesn't have the required scope</li>
          <li><code className="bg-[#FAF8F5] px-2 py-1 rounded">missing_authorization</code> - No Authorization header was provided</li>
        </ul>
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
            href="/docs/payments/create"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              💳 Create Payment
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Start accepting payments with your authenticated API
            </p>
          </a>

          <a
            href="/docs/reference/errors"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🐛 Error Reference
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Learn about error codes and how to handle them
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
