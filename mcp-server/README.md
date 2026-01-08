# HedgePayments MCP Server

AI-native payment processing via Model Context Protocol (MCP) for Claude and ChatGPT.

## 🚀 Quick Start

### Installation for Claude Desktop

1. **Install the MCP server**:
```bash
cd mcp-server
npm install
npm run build
```

2. **Configure Claude Desktop**:

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hedge-payments": {
      "command": "node",
      "args": ["/path/to/hedgepayments-website/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "your_supabase_url",
        "SUPABASE_SERVICE_KEY": "your_service_key",
        "STRIPE_SECRET_KEY": "your_stripe_key"
      }
    }
  }
}
```

3. **Restart Claude Desktop**

### Installation for ChatGPT (via Actions)

1. **Deploy MCP server to a public endpoint** (e.g., Vercel, Railway)

2. **Create Custom GPT Action**:

```yaml
openapi: 3.0.0
info:
  title: HedgePayments MCP
  version: 1.0.0
servers:
  - url: https://your-mcp-server.com
paths:
  /tools/process_payment:
    post:
      operationId: processPayment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
                recipient:
                  type: string
                method:
                  type: string
      responses:
        '200':
          description: Payment processed
```

## 🛠️ Available Tools

### Payment Processing
```javascript
// Process a payment
await callTool('process_payment', {
  amount: 50.00,
  currency: 'USD',
  recipient: 'wallet_123',
  method: 'card',
  description: 'Payment for services'
})
```

### Wallet Management
```javascript
// Create a wallet
await callTool('create_wallet', {
  userId: 'user_123',
  currency: 'USD'
})

// Get wallet balance
await callTool('get_balance', {
  walletId: 'wallet_123'
})
```

### Fund Transfers
```javascript
// Transfer between wallets
await callTool('transfer_funds', {
  fromWalletId: 'wallet_123',
  toWalletId: 'wallet_456',
  amount: 100.00
})
```

### Refunds
```javascript
// Process refund
await callTool('refund_payment', {
  transactionId: 'tx_123',
  amount: 25.00,
  reason: 'Customer request'
})
```

### Transaction History
```javascript
// Get transactions
await callTool('get_transactions', {
  walletId: 'wallet_123',
  limit: 10,
  status: 'completed'
})
```

## 📚 Resources

The MCP server also provides these resources:

- `hedge://wallet-guide` - Complete wallet integration guide
- `hedge://api-reference` - Full API documentation

Access them in Claude:
```
Show me the hedge://wallet-guide resource
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Dwolla (ACH)
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret

# Plaid (Bank Connections)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

## 🧪 Testing

Test the MCP server locally:

```bash
# Start the server
npm run dev

# In another terminal, test with MCP client
npx @modelcontextprotocol/cli client stdio npm run start

# List available tools
> list-tools

# Call a tool
> call-tool process_payment {"amount": 10, "recipient": "test", "method": "card"}
```

## 🔐 Security

- All payment data is tokenized
- PCI DSS compliant
- Webhook signature verification
- Rate limiting enabled
- Idempotency keys for safe retries

## 🤖 AI Agent Examples

### Example 1: Process Customer Payment
```
User: "Charge customer $50 for their subscription"
Claude: I'll process that payment for you.
[Calls process_payment tool]
Payment processed successfully! Transaction ID: tx_abc123
```

### Example 2: Check Balance
```
User: "What's the balance of wallet_456?"
Claude: Let me check that wallet balance.
[Calls get_balance tool]
The wallet has $1,234.56 available.
```

### Example 3: Issue Refund
```
User: "Refund transaction tx_789 because the item was damaged"
Claude: I'll process that refund right away.
[Calls refund_payment tool]
Refund processed. $25.00 has been returned to the customer.
```

## 📈 Integration Analytics

Track MCP usage in your dashboard:
- Tool call frequency
- Transaction volumes
- Error rates
- Response times

## 🆘 Support

- Documentation: https://docs.hedgepayments.com/mcp
- Email: support@hedgepayments.com
- Discord: https://discord.gg/hedgepayments

## 📄 License

MIT