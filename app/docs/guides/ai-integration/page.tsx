'use client'

export default function AIIntegrationPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          AI Agent Integration
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Enable AI agents to process payments autonomously
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
          Hedge Payments is purpose-built for the AI economy. Our API is designed from the ground up to work seamlessly with AI agents, chatbots, and autonomous systems, enabling them to handle payment transactions on behalf of users with minimal friction.
        </p>

        <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-6">
          <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            ✅ Fully Compatible & Tested With
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-[#2C2416] font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Anthropic</p>
              <ul className="text-[#6B5D4F] text-base space-y-1 mb-0">
                <li>• Claude 3.5 Sonnet</li>
                <li>• Claude Code</li>
                <li>• Claude API</li>
                <li>• MCP (Model Context Protocol)</li>
              </ul>
            </div>
            <div>
              <p className="text-[#2C2416] font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>OpenAI</p>
              <ul className="text-[#6B5D4F] text-base space-y-1 mb-0">
                <li>• ChatGPT (GPT-4, GPT-4 Turbo)</li>
                <li>• Custom GPTs & GPT Actions</li>
                <li>• OpenAI Codex</li>
                <li>• Function Calling API</li>
              </ul>
            </div>
            <div>
              <p className="text-[#2C2416] font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Google</p>
              <ul className="text-[#6B5D4F] text-base space-y-1 mb-0">
                <li>• Gemini Pro</li>
                <li>• Gemini Ultra</li>
                <li>• Function Calling API</li>
              </ul>
            </div>
            <div>
              <p className="text-[#2C2416] font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Other Platforms</p>
              <ul className="text-[#6B5D4F] text-base space-y-1 mb-0">
                <li>• Custom AI agents</li>
                <li>• LangChain integrations</li>
                <li>• AutoGPT & AgentGPT</li>
                <li>• Any REST API-compatible system</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Whether you're building with Claude Code for development automation, using ChatGPT for customer service, or deploying autonomous agents with Codex, Hedge Payments provides the payment infrastructure you need.
        </p>
      </div>

      {/* Claude Integration */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Claude & Claude Code Integration
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Hedge Payments works seamlessly with both Claude Desktop and Claude Code (the CLI for developers). Using the Model Context Protocol (MCP), Claude can create and manage payments directly, making it perfect for AI-assisted development and autonomous payment workflows.
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-6">
          <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            Why Claude Code + Hedge Payments?
          </h4>
          <ul className="text-[#6B5D4F] text-base space-y-2 mb-0">
            <li>💻 <strong>Development Automation:</strong> Let Claude Code handle payment integrations while you focus on features</li>
            <li>⚡ <strong>Instant Testing:</strong> Create test payments and verify integrations without leaving your terminal</li>
            <li>🔄 <strong>Rapid Iteration:</strong> Modify payment flows and test changes in seconds</li>
            <li>📚 <strong>Context Awareness:</strong> Claude Code understands your entire codebase and payment requirements</li>
          </ul>
        </div>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Installation
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`# Install the Hedge Payments MCP server
npm install -g @hedgepayments/mcp-server

# Configure in your Claude Desktop config
# Location: ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "hedge-payments": {
      "command": "hedge-mcp",
      "args": ["--api-key", "YOUR_API_KEY"]
    }
  }
}`}</code>
        </pre>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Example Usage
        </h3>

        <p className="text-[#2C2416] text-base leading-relaxed mb-4">
          Once configured, you can ask Claude to create payments naturally:
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-6">
          <p className="text-[#6B5D4F] text-base mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            User: "Create a payment request for $50 from john@example.com for a premium subscription"
          </p>
          <p className="text-[#2C2416] text-base mb-0">
            Claude: "I'll create that payment for you."<br />
            <span className="text-[#6B5D4F]">[Creates payment using Hedge Payments MCP tool]</span><br />
            "I've created a payment request for $50. Here's the payment link: https://pay.hedgepayments.com/pay_abc123..."
          </p>
        </div>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Available MCP Tools
        </h3>

        <div className="space-y-3 mb-6">
          <div className="bg-white border border-[#D4C5B0] p-4 rounded">
            <code className="text-[#2C2416] text-sm">create_payment</code>
            <p className="text-[#6B5D4F] text-sm mt-1 mb-0">Create a new payment request</p>
          </div>
          <div className="bg-white border border-[#D4C5B0] p-4 rounded">
            <code className="text-[#2C2416] text-sm">get_payment</code>
            <p className="text-[#6B5D4F] text-sm mt-1 mb-0">Retrieve payment details and status</p>
          </div>
          <div className="bg-white border border-[#D4C5B0] p-4 rounded">
            <code className="text-[#2C2416] text-sm">cancel_payment</code>
            <p className="text-[#6B5D4F] text-sm mt-1 mb-0">Cancel a pending payment</p>
          </div>
          <div className="bg-white border border-[#D4C5B0] p-4 rounded">
            <code className="text-[#2C2416] text-sm">refund_payment</code>
            <p className="text-[#6B5D4F] text-sm mt-1 mb-0">Process a full or partial refund</p>
          </div>
          <div className="bg-white border border-[#D4C5B0] p-4 rounded">
            <code className="text-[#2C2416] text-sm">check_balance</code>
            <p className="text-[#6B5D4F] text-sm mt-1 mb-0">View current account balance</p>
          </div>
        </div>
      </div>

      {/* ChatGPT Integration */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          ChatGPT Integration (Function Calling)
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Enable ChatGPT to process payments using OpenAI's function calling feature.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Function Definition
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`const functions = [
  {
    name: "create_payment",
    description: "Create a payment request for a customer",
    parameters: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "Payment amount"
        },
        currency: {
          type: "string",
          description: "Three-letter currency code (e.g., USD, EUR)"
        },
        customerEmail: {
          type: "string",
          description: "Customer's email address"
        },
        description: {
          type: "string",
          description: "Payment description"
        }
      },
      required: ["amount", "currency", "customerEmail"]
    }
  }
]

// Use in chat completion
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: messages,
  functions: functions,
  function_call: "auto"
})`}</code>
        </pre>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Handling Function Calls
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`if (response.choices[0].message.function_call) {
  const functionCall = response.choices[0].message.function_call
  const args = JSON.parse(functionCall.arguments)

  if (functionCall.name === "create_payment") {
    // Call Hedge Payments API
    const payment = await hedge.payments.create({
      amount: args.amount,
      currency: args.currency,
      customerEmail: args.customerEmail,
      description: args.description
    })

    // Return result to ChatGPT
    messages.push({
      role: "function",
      name: "create_payment",
      content: JSON.stringify({
        success: true,
        paymentId: payment.id,
        paymentUrl: payment.url
      })
    })

    // Continue conversation with function result
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages
    })
  }
}`}</code>
        </pre>
      </div>

      {/* OpenAI Codex Integration */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          OpenAI Codex Integration
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          OpenAI Codex can interact with the Hedge Payments API just like any other REST API. The straightforward design of our API makes it perfect for code generation and automation with Codex.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Using Codex for Payment Integration
        </h3>

        <p className="text-[#2C2416] text-base leading-relaxed mb-4">
          Simply provide Codex with your payment requirements and it will generate the integration code:
        </p>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-6">
          <p className="text-[#6B5D4F] text-base mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Prompt: "Write a function to create a payment using the Hedge Payments API for $50 USD"
          </p>
          <pre className="bg-[#2C2416] text-[#FAF8F5] p-4 rounded overflow-x-auto text-sm">
            <code>{`async function createPayment() {
  const response = await fetch('https://api.hedgepayments.com/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.HEDGE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 50.00,
      currency: 'USD',
      customerEmail: 'user@example.com',
      description: 'Payment for service'
    })
  })
  return await response.json()
}`}</code>
          </pre>
        </div>

        <div className="bg-white border border-[#D4C5B0] p-6 rounded mb-6">
          <h4 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
            Why Codex + Hedge Payments Works Well
          </h4>
          <ul className="text-[#6B5D4F] text-base space-y-2 mb-0">
            <li>🎯 <strong>Simple API Design:</strong> Clean REST endpoints that Codex understands instantly</li>
            <li>📝 <strong>Standard HTTP Methods:</strong> POST, GET, DELETE - no special protocols</li>
            <li>🔑 <strong>Bearer Token Auth:</strong> Industry-standard authentication pattern</li>
            <li>📊 <strong>JSON Responses:</strong> Predictable, well-structured response format</li>
            <li>⚡ <strong>Quick Prototyping:</strong> Get payment flows working in minutes</li>
          </ul>
        </div>
      </div>

      {/* GPT Actions */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          ChatGPT Actions (Custom GPTs)
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Create a Custom GPT with Hedge Payments actions to build payment-enabled chatbots.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-8 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          OpenAPI Schema
        </h3>

        <p className="text-[#2C2416] text-base leading-relaxed mb-4">
          Import this OpenAPI schema in your Custom GPT configuration:
        </p>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-6">
          <code>{`openapi: 3.0.0
info:
  title: Hedge Payments API
  version: 1.0.0
servers:
  - url: https://api.hedgepayments.com
paths:
  /api/payments:
    post:
      operationId: createPayment
      summary: Create a payment request
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
                - currency
                - customerEmail
              properties:
                amount:
                  type: number
                currency:
                  type: string
                customerEmail:
                  type: string
                description:
                  type: string
      responses:
        '200':
          description: Payment created successfully
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer`}</code>
        </pre>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔐 Authentication:</strong><br />
            In the Custom GPT authentication settings, select "API Key" and use Bearer authentication with your Hedge Payments API key.
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          AI Agent Use Cases
        </h2>

        <div className="space-y-6 mb-8">
          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              💼 Autonomous Sales Agent
            </h4>
            <p className="text-[#6B5D4F] text-base mb-3">
              An AI agent that handles customer inquiries, recommends products, and processes payments autonomously.
            </p>
            <p className="text-[#8B7E6E] text-sm mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Example: "I'd like to buy the premium plan" → Agent creates payment → Customer completes purchase
            </p>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🎮 Gaming Assistant
            </h4>
            <p className="text-[#6B5D4F] text-base mb-3">
              An AI-powered gaming bot that can process in-game purchases and subscriptions.
            </p>
            <p className="text-[#8B7E6E] text-sm mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Example: "Buy 1000 gold coins" → Agent creates $9.99 payment → Purchase confirmed
            </p>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              📧 Email Assistant
            </h4>
            <p className="text-[#6B5D4F] text-base mb-3">
              An AI that monitors email for payment requests and automatically generates payment links.
            </p>
            <p className="text-[#8B7E6E] text-sm mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Example: Customer emails "Send me an invoice for $500" → Agent creates payment link and replies
            </p>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🏦 Financial Advisor Bot
            </h4>
            <p className="text-[#6B5D4F] text-base mb-3">
              An AI that helps users manage subscriptions, process refunds, and track payment history.
            </p>
            <p className="text-[#8B7E6E] text-sm mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Example: "Cancel my subscription and refund last month" → Agent processes refund automatically
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Best Practices for AI Integration
        </h2>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-4 mb-8">
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔒 Secure API Keys:</strong><br />
            <span className="text-[#6B5D4F]">Never expose API keys in client-side code. Use server-side proxies or JWT tokens.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>✅ User Confirmation:</strong><br />
            <span className="text-[#6B5D4F]">Always confirm payment details with the user before processing transactions.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>💬 Clear Communication:</strong><br />
            <span className="text-[#6B5D4F]">Provide clear payment summaries including amount, currency, and description before creating payments.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔔 Error Handling:</strong><br />
            <span className="text-[#6B5D4F]">Gracefully handle API errors and provide helpful messages to users.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>📊 Logging:</strong><br />
            <span className="text-[#6B5D4F]">Log all payment transactions with metadata for auditing and troubleshooting.</span>
          </li>
          <li>
            <strong style={{ fontFamily: 'Georgia, serif' }}>🔄 Webhook Integration:</strong><br />
            <span className="text-[#6B5D4F]">Use webhooks to receive real-time payment status updates and keep your AI agent in sync.</span>
          </li>
        </ul>
      </div>

      {/* Example Conversation Flow */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Example Conversation Flow
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Here's how a typical payment conversation might flow with an AI agent:
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-[#FAF8F5] border-l-4 border-[#6B5D4F] p-4">
            <p className="text-[#6B5D4F] text-base mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              User: "I'd like to purchase the premium subscription"
            </p>
          </div>

          <div className="bg-white border-l-4 border-[#2C2416] p-4">
            <p className="text-[#2C2416] text-base mb-0">
              Agent: "Great! The premium subscription is $29.99/month. This includes unlimited access, priority support, and advanced features. Would you like to proceed with this purchase?"
            </p>
          </div>

          <div className="bg-[#FAF8F5] border-l-4 border-[#6B5D4F] p-4">
            <p className="text-[#6B5D4F] text-base mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              User: "Yes, please"
            </p>
          </div>

          <div className="bg-white border-l-4 border-[#2C2416] p-4">
            <p className="text-[#2C2416] text-base mb-3">
              Agent: "Perfect! I've created a payment link for you. The payment details are:"
            </p>
            <ul className="text-[#6B5D4F] text-sm space-y-1 mb-3 ml-4">
              <li>Amount: $29.99 USD</li>
              <li>Description: Premium Subscription - Monthly</li>
              <li>Payment methods: Crypto or Credit Card</li>
            </ul>
            <p className="text-[#2C2416] text-base mb-0">
              Click here to complete your payment: <span className="text-[#6B5D4F] underline">pay.hedgepayments.com/pay_abc123</span>
            </p>
          </div>

          <div className="bg-[#FAF8F5] border-l-4 border-[#6B5D4F] p-4">
            <p className="text-[#6B5D4F] text-base mb-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              [User completes payment]
            </p>
          </div>

          <div className="bg-white border-l-4 border-[#2C2416] p-4">
            <p className="text-[#2C2416] text-base mb-0">
              Agent: "Thank you! Your payment has been received successfully. Your premium subscription is now active. You'll receive a confirmation email shortly. Is there anything else I can help you with?"
            </p>
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
            href="/docs/quickstart"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🚀 Quick Start
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Get started with the Hedge Payments API
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
              Receive real-time payment notifications
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
              Explore all available API endpoints
            </p>
          </a>

          <a
            href="/contact"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              💬 Get Help
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Contact us for AI integration support
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
