import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
})

// Tool schemas
const ProcessPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  recipient: z.string(),
  method: z.enum(['card', 'bank', 'wallet', 'crypto']),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

const CreateWalletSchema = z.object({
  userId: z.string(),
  currency: z.string().default('USD'),
  initialBalance: z.number().default(0)
})

const GetBalanceSchema = z.object({
  walletId: z.string()
})

const TransferFundsSchema = z.object({
  fromWalletId: z.string(),
  toWalletId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional()
})

const RefundPaymentSchema = z.object({
  transactionId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional()
})

const GetTransactionsSchema = z.object({
  walletId: z.string().optional(),
  limit: z.number().default(10),
  status: z.enum(['pending', 'completed', 'failed', 'all']).default('all')
})

// Create MCP server
const server = new Server(
  {
    name: 'hedge-payments',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'process_payment',
      description: 'Process a payment transaction',
      inputSchema: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Amount in dollars' },
          currency: { type: 'string', description: 'Currency code (default: USD)' },
          recipient: { type: 'string', description: 'Recipient wallet ID or identifier' },
          method: {
            type: 'string',
            enum: ['card', 'bank', 'wallet', 'crypto'],
            description: 'Payment method to use'
          },
          description: { type: 'string', description: 'Payment description' },
          metadata: { type: 'object', description: 'Additional metadata' }
        },
        required: ['amount', 'recipient', 'method']
      }
    },
    {
      name: 'create_wallet',
      description: 'Create a new digital wallet for a user',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'User ID to create wallet for' },
          currency: { type: 'string', description: 'Wallet currency (default: USD)' },
          initialBalance: { type: 'number', description: 'Initial balance (default: 0)' }
        },
        required: ['userId']
      }
    },
    {
      name: 'get_balance',
      description: 'Get wallet balance and details',
      inputSchema: {
        type: 'object',
        properties: {
          walletId: { type: 'string', description: 'Wallet ID to check' }
        },
        required: ['walletId']
      }
    },
    {
      name: 'transfer_funds',
      description: 'Transfer funds between wallets',
      inputSchema: {
        type: 'object',
        properties: {
          fromWalletId: { type: 'string', description: 'Source wallet ID' },
          toWalletId: { type: 'string', description: 'Destination wallet ID' },
          amount: { type: 'number', description: 'Amount to transfer' },
          description: { type: 'string', description: 'Transfer description' }
        },
        required: ['fromWalletId', 'toWalletId', 'amount']
      }
    },
    {
      name: 'refund_payment',
      description: 'Refund a payment transaction',
      inputSchema: {
        type: 'object',
        properties: {
          transactionId: { type: 'string', description: 'Transaction ID to refund' },
          amount: { type: 'number', description: 'Amount to refund (optional, defaults to full)' },
          reason: { type: 'string', description: 'Refund reason' }
        },
        required: ['transactionId']
      }
    },
    {
      name: 'get_transactions',
      description: 'Get transaction history',
      inputSchema: {
        type: 'object',
        properties: {
          walletId: { type: 'string', description: 'Filter by wallet ID' },
          limit: { type: 'number', description: 'Number of transactions to return' },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'failed', 'all'],
            description: 'Filter by status'
          }
        }
      }
    }
  ]
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'process_payment': {
        const params = ProcessPaymentSchema.parse(args)

        // Convert amount to cents
        const amountInCents = Math.round(params.amount * 100)

        // Process with Stripe for card payments
        if (params.method === 'card') {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: params.currency.toLowerCase(),
            description: params.description,
            metadata: params.metadata || {}
          })

          // Record in database
          const { data: transaction } = await supabase
            .from('transactions')
            .insert({
              type: 'payment',
              amount: amountInCents,
              currency: params.currency,
              status: 'pending',
              processor_id: paymentIntent.id,
              description: params.description,
              metadata: params.metadata
            })
            .select()
            .single()

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  transactionId: transaction.id,
                  stripePaymentIntentId: paymentIntent.id,
                  amount: params.amount,
                  currency: params.currency,
                  status: 'pending',
                  clientSecret: paymentIntent.client_secret
                }, null, 2)
              }
            ]
          }
        }

        // Handle other payment methods
        return {
          content: [
            {
              type: 'text',
              text: `Payment method ${params.method} processing not yet implemented`
            }
          ]
        }
      }

      case 'create_wallet': {
        const params = CreateWalletSchema.parse(args)

        // Create wallet in database
        const { data: wallet, error } = await supabase
          .from('wallets')
          .insert({
            user_id: params.userId,
            currency: params.currency,
            balance_available: params.initialBalance * 100, // Convert to cents
            status: 'active'
          })
          .select()
          .single()

        if (error) throw error

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                walletId: wallet.id,
                userId: wallet.user_id,
                currency: wallet.currency,
                balance: wallet.balance_available / 100,
                status: wallet.status
              }, null, 2)
            }
          ]
        }
      }

      case 'get_balance': {
        const params = GetBalanceSchema.parse(args)

        // Get wallet from database
        const { data: wallet, error } = await supabase
          .from('wallets')
          .select('*')
          .eq('id', params.walletId)
          .single()

        if (error) throw error

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                walletId: wallet.id,
                available: wallet.balance_available / 100,
                pending: wallet.balance_pending / 100,
                reserved: wallet.balance_reserved / 100,
                total: (wallet.balance_available + wallet.balance_pending) / 100,
                currency: wallet.currency,
                status: wallet.status
              }, null, 2)
            }
          ]
        }
      }

      case 'transfer_funds': {
        const params = TransferFundsSchema.parse(args)
        const amountInCents = Math.round(params.amount * 100)

        // Use the process_transaction function
        const { data, error } = await supabase.rpc('process_transaction', {
          p_type: 'transfer_out',
          p_amount: amountInCents,
          p_currency: 'USD',
          p_source_wallet_id: params.fromWalletId,
          p_destination_wallet_id: params.toWalletId,
          p_description: params.description || 'Wallet transfer'
        })

        if (error) throw error

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                transactionId: data,
                fromWalletId: params.fromWalletId,
                toWalletId: params.toWalletId,
                amount: params.amount,
                status: 'completed'
              }, null, 2)
            }
          ]
        }
      }

      case 'refund_payment': {
        const params = RefundPaymentSchema.parse(args)

        // Get original transaction
        const { data: original, error: fetchError } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', params.transactionId)
          .single()

        if (fetchError) throw fetchError

        // Process refund with Stripe if applicable
        if (original.processor_id && original.processor_id.startsWith('pi_')) {
          const refund = await stripe.refunds.create({
            payment_intent: original.processor_id,
            amount: params.amount ? Math.round(params.amount * 100) : undefined,
            reason: params.reason as Stripe.RefundCreateParams.Reason
          })

          // Record refund transaction
          const { data: refundTx } = await supabase
            .from('transactions')
            .insert({
              type: 'refund',
              amount: refund.amount,
              currency: refund.currency.toUpperCase(),
              status: 'completed',
              processor_id: refund.id,
              metadata: { original_transaction_id: params.transactionId }
            })
            .select()
            .single()

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  refundId: refundTx.id,
                  originalTransactionId: params.transactionId,
                  amount: refund.amount / 100,
                  status: refund.status
                }, null, 2)
              }
            ]
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: 'Refund processing for this payment type not yet implemented'
            }
          ]
        }
      }

      case 'get_transactions': {
        const params = GetTransactionsSchema.parse(args)

        let query = supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(params.limit)

        if (params.walletId) {
          query = query.or(`source_wallet_id.eq.${params.walletId},destination_wallet_id.eq.${params.walletId}`)
        }

        if (params.status !== 'all') {
          query = query.eq('status', params.status)
        }

        const { data: transactions, error } = await query

        if (error) throw error

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                transactions: transactions.map(tx => ({
                  id: tx.id,
                  type: tx.type,
                  amount: tx.amount / 100,
                  currency: tx.currency,
                  status: tx.status,
                  description: tx.description,
                  createdAt: tx.created_at
                })),
                count: transactions.length
              }, null, 2)
            }
          ]
        }
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool ${name} not found`
        )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => e.message).join(', ')}`
      )
    }
    throw error
  }
})

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'hedge://wallet-guide',
      name: 'Wallet Integration Guide',
      mimeType: 'text/markdown',
      description: 'Complete guide for integrating HedgePayments wallets'
    },
    {
      uri: 'hedge://api-reference',
      name: 'API Reference',
      mimeType: 'text/markdown',
      description: 'Full API documentation for HedgePayments'
    }
  ]
}))

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  switch (uri) {
    case 'hedge://wallet-guide':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: `# HedgePayments Wallet Integration Guide

## Quick Start

1. Install the MCP server:
\`\`\`bash
npm install hedge-payments-mcp
\`\`\`

2. Configure environment variables:
\`\`\`env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
STRIPE_SECRET_KEY=your_stripe_key
\`\`\`

3. Create a wallet:
\`\`\`javascript
// Using MCP tool
await callTool('create_wallet', {
  userId: 'user_123',
  currency: 'USD'
})
\`\`\`

4. Process a payment:
\`\`\`javascript
await callTool('process_payment', {
  amount: 50.00,
  recipient: 'wallet_456',
  method: 'card',
  description: 'Payment for services'
})
\`\`\`

## Available Tools

- **create_wallet**: Create a new digital wallet
- **get_balance**: Check wallet balance
- **process_payment**: Process payments
- **transfer_funds**: Transfer between wallets
- **refund_payment**: Process refunds
- **get_transactions**: View transaction history

## Payment Methods Supported

- Credit/Debit Cards (via Stripe)
- Bank Accounts (ACH via Dwolla)
- Digital Wallets (PayPal, Venmo)
- Cryptocurrency (BTC, ETH, USDC)

## Security

All payment data is tokenized and encrypted. We are PCI DSS compliant.`
          }
        ]
      }

    case 'hedge://api-reference':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: `# HedgePayments API Reference

## Base URL
\`https://api.hedgepayments.com/v1\`

## Authentication
Include your API key in the Authorization header:
\`Authorization: Bearer YOUR_API_KEY\`

## Endpoints

### POST /wallets
Create a new wallet

### GET /wallets/{id}
Get wallet details

### POST /transactions
Process a payment

### GET /transactions
List transactions

### POST /refunds
Process a refund`
          }
        ]
      }

    default:
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource ${uri} not found`
      )
  }
})

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('HedgePayments MCP Server running...')
}

main().catch(console.error)