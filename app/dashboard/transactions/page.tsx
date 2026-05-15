'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { useMode } from '../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/tables/DataTable'
import MetricCard from '../components/widgets/MetricCard'

interface Transaction {
  id: string
  amount_cents: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  customer_email: string
  customer_name: string
  description: string
  product: string
  environment: 'test' | 'live'
  created_at: string
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 'txn_1234567890',
    amount_cents: 12500,
    currency: 'usd',
    status: 'succeeded',
    customer_email: 'john@example.com',
    customer_name: 'John Doe',
    description: 'Subscription payment',
    product: 'CoverPay',
    environment: 'test',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'txn_0987654321',
    amount_cents: 5000,
    currency: 'usd',
    status: 'succeeded',
    customer_email: 'jane@example.com',
    customer_name: 'Jane Smith',
    description: 'One-time payment',
    product: 'Gateway',
    environment: 'test',
    created_at: '2024-01-15T09:15:00Z',
  },
  {
    id: 'txn_1122334455',
    amount_cents: 7500,
    currency: 'usd',
    status: 'pending',
    customer_email: 'bob@example.com',
    customer_name: 'Bob Wilson',
    description: 'Round-up deposit',
    product: 'SideBet',
    environment: 'test',
    created_at: '2024-01-15T08:45:00Z',
  },
  {
    id: 'txn_5544332211',
    amount_cents: 3250,
    currency: 'usd',
    status: 'failed',
    customer_email: 'alice@example.com',
    customer_name: 'Alice Brown',
    description: 'BNPL payment',
    product: 'CoverPay',
    environment: 'test',
    created_at: '2024-01-14T16:20:00Z',
  },
  {
    id: 'txn_6677889900',
    amount_cents: 15000,
    currency: 'usd',
    status: 'refunded',
    customer_email: 'charlie@example.com',
    customer_name: 'Charlie Davis',
    description: 'Product purchase',
    product: 'Gateway',
    environment: 'test',
    created_at: '2024-01-14T14:10:00Z',
  },
]

const formatCurrency = (cents: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const variants: Record<Transaction['status'], 'success' | 'warning' | 'error' | 'default'> = {
    succeeded: 'success',
    pending: 'warning',
    failed: 'error',
    refunded: 'default',
  }

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function TransactionsPage() {
  const router = useRouter()
  const { mode, isTestMode } = useMode()
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [productFilter, setProductFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Filter transactions based on mode and filters
  const filteredTransactions = transactions.filter((txn) => {
    if (txn.environment !== mode) return false
    if (statusFilter !== 'all' && txn.status !== statusFilter) return false
    if (productFilter !== 'all' && txn.product !== productFilter) return false
    return true
  })

  // Calculate metrics
  const totalVolume = filteredTransactions
    .filter((t) => t.status === 'succeeded')
    .reduce((sum, t) => sum + t.amount_cents, 0)
  const successfulTxns = filteredTransactions.filter((t) => t.status === 'succeeded').length
  const pendingTxns = filteredTransactions.filter((t) => t.status === 'pending').length
  const failedTxns = filteredTransactions.filter((t) => t.status === 'failed').length

  const columns = [
    {
      key: 'id',
      header: 'Transaction',
      sortable: true,
      render: (row: Transaction) => (
        <div>
          <p className="font-mono text-dash-text-primary text-sm">{row.id}</p>
          <p className="text-dash-text-muted text-xs">{formatDate(row.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'amount_cents',
      header: 'Amount',
      sortable: true,
      render: (row: Transaction) => (
        <span className="font-medium text-dash-text-primary">
          {formatCurrency(row.amount_cents, row.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: Transaction) => <StatusBadge status={row.status} />,
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (row: Transaction) => (
        <div>
          <p className="text-dash-text-primary">{row.customer_name}</p>
          <p className="text-dash-text-muted text-xs">{row.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      render: (row: Transaction) => (
        <Badge variant="default">{row.product}</Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row: Transaction) => (
        <span className="text-dash-text-secondary">{row.description}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">Transactions</h1>
          <p className="text-dash-text-secondary mt-1">
            {isTestMode ? 'Test' : 'Live'} transaction history and details
          </p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume"
          value={formatCurrency(totalVolume, 'usd')}
          subtitle="successful payments"
        />
        <MetricCard
          title="Successful"
          value={successfulTxns.toString()}
          subtitle="transactions"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Pending"
          value={pendingTxns.toString()}
          subtitle="transactions"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Failed"
          value={failedTxns.toString()}
          subtitle="transactions"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-dash-text-secondary">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            >
              <option value="all">All Status</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-dash-text-secondary">Product:</label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-3 py-1.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            >
              <option value="all">All Products</option>
              <option value="CoverPay">CoverPay</option>
              <option value="Gateway">Gateway</option>
              <option value="SideBet">SideBet</option>
            </select>
          </div>
          <div className="flex-1" />
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-1.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500 w-64"
            />
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        keyExtractor={(row) => row.id}
        loading={loading}
        emptyMessage="No transactions found"
        onRowClick={(row) => router.push(`/dashboard/transactions/${row.id}`)}
        pagination={{
          page,
          pageSize,
          total: filteredTransactions.length,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
