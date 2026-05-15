'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useMode } from '../../contexts/ModeContext'

interface Transaction {
  id: string
  sessionToken: string
  amount: number
  currency: string
  status: 'approved' | 'declined' | 'pending' | 'refunded' | 'expired'
  provider: string | null
  providerTxnId: string | null
  planType: string | null
  customer: {
    email: string
    name: string
  }
  orderId: string
  providersAttempted: string[]
  createdAt: string
  completedAt: string | null
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    sessionToken: 'cps_abc123xyz',
    amount: 249.99,
    currency: 'USD',
    status: 'approved',
    provider: 'klarna',
    providerTxnId: 'KL_98765432',
    planType: 'Pay in 4',
    customer: { email: 'john.doe@example.com', name: 'John Doe' },
    orderId: 'ORD-2024-001',
    providersAttempted: ['klarna'],
    createdAt: '2024-01-21T10:30:00Z',
    completedAt: '2024-01-21T10:32:15Z'
  },
  {
    id: 'txn_002',
    sessionToken: 'cps_def456uvw',
    amount: 599.00,
    currency: 'USD',
    status: 'approved',
    provider: 'affirm',
    providerTxnId: 'AFF_12345678',
    planType: '6 Monthly Payments',
    customer: { email: 'jane.smith@example.com', name: 'Jane Smith' },
    orderId: 'ORD-2024-002',
    providersAttempted: ['klarna', 'affirm'],
    createdAt: '2024-01-21T09:15:00Z',
    completedAt: '2024-01-21T09:18:30Z'
  },
  {
    id: 'txn_003',
    sessionToken: 'cps_ghi789rst',
    amount: 1299.99,
    currency: 'USD',
    status: 'declined',
    provider: null,
    providerTxnId: null,
    planType: null,
    customer: { email: 'bob.wilson@example.com', name: 'Bob Wilson' },
    orderId: 'ORD-2024-003',
    providersAttempted: ['klarna', 'affirm', 'afterpay'],
    createdAt: '2024-01-21T08:45:00Z',
    completedAt: '2024-01-21T08:47:00Z'
  },
  {
    id: 'txn_004',
    sessionToken: 'cps_jkl012mno',
    amount: 89.99,
    currency: 'USD',
    status: 'approved',
    provider: 'klarna',
    providerTxnId: 'KL_11223344',
    planType: 'Pay in 4',
    customer: { email: 'alice.johnson@example.com', name: 'Alice Johnson' },
    orderId: 'ORD-2024-004',
    providersAttempted: ['klarna'],
    createdAt: '2024-01-20T16:20:00Z',
    completedAt: '2024-01-20T16:21:30Z'
  },
  {
    id: 'txn_005',
    sessionToken: 'cps_pqr345stu',
    amount: 349.00,
    currency: 'USD',
    status: 'pending',
    provider: 'affirm',
    providerTxnId: null,
    planType: 'Pay in 4',
    customer: { email: 'mike.brown@example.com', name: 'Mike Brown' },
    orderId: 'ORD-2024-005',
    providersAttempted: ['klarna', 'affirm'],
    createdAt: '2024-01-21T11:00:00Z',
    completedAt: null
  },
  {
    id: 'txn_006',
    sessionToken: 'cps_vwx678yza',
    amount: 199.99,
    currency: 'USD',
    status: 'refunded',
    provider: 'klarna',
    providerTxnId: 'KL_55667788',
    planType: 'Pay in 4',
    customer: { email: 'sarah.davis@example.com', name: 'Sarah Davis' },
    orderId: 'ORD-2024-006',
    providersAttempted: ['klarna'],
    createdAt: '2024-01-19T14:30:00Z',
    completedAt: '2024-01-19T14:32:00Z'
  },
  {
    id: 'txn_007',
    sessionToken: 'cps_bcd901efg',
    amount: 449.99,
    currency: 'USD',
    status: 'expired',
    provider: null,
    providerTxnId: null,
    planType: null,
    customer: { email: 'chris.lee@example.com', name: 'Chris Lee' },
    orderId: 'ORD-2024-007',
    providersAttempted: [],
    createdAt: '2024-01-18T10:00:00Z',
    completedAt: null
  },
  {
    id: 'txn_008',
    sessionToken: 'cps_hij234klm',
    amount: 179.00,
    currency: 'USD',
    status: 'approved',
    provider: 'afterpay',
    providerTxnId: 'AP_99887766',
    planType: 'Pay in 4',
    customer: { email: 'emily.white@example.com', name: 'Emily White' },
    orderId: 'ORD-2024-008',
    providersAttempted: ['klarna', 'affirm', 'afterpay'],
    createdAt: '2024-01-20T12:15:00Z',
    completedAt: '2024-01-20T12:18:45Z'
  },
]

const PROVIDER_COLORS: Record<string, string> = {
  klarna: '#FFB3C7',
  affirm: '#0FA0EA',
  afterpay: '#B2FCE4',
  sezzle: '#382757',
}

function getStatusBadge(status: Transaction['status']) {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>
    case 'declined':
      return <Badge variant="error">Declined</Badge>
    case 'pending':
      return <Badge variant="warning">Pending</Badge>
    case 'refunded':
      return <Badge variant="info">Refunded</Badge>
    case 'expired':
      return <Badge variant="default">Expired</Badge>
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export default function TransactionsPage() {
  const { isTestMode } = useMode()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter(txn => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !txn.sessionToken.toLowerCase().includes(query) &&
        !txn.orderId.toLowerCase().includes(query) &&
        !txn.customer.email.toLowerCase().includes(query) &&
        !txn.customer.name.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Status filter
    if (statusFilter !== 'all' && txn.status !== statusFilter) {
      return false
    }

    // Provider filter
    if (providerFilter !== 'all' && txn.provider !== providerFilter) {
      return false
    }

    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = {
    total: filteredTransactions.length,
    approved: filteredTransactions.filter(t => t.status === 'approved').length,
    declined: filteredTransactions.filter(t => t.status === 'declined').length,
    pending: filteredTransactions.filter(t => t.status === 'pending').length,
    totalVolume: filteredTransactions
      .filter(t => t.status === 'approved')
      .reduce((acc, t) => acc + t.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products/coverpay" className="text-dash-text-muted hover:text-dash-text-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">CoverPay Transactions</h1>
            <p className="text-dash-text-secondary">View and manage BNPL checkout sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
            {isTestMode ? 'Test Mode' : 'Live Mode'}
          </Badge>
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-dash-surface-card/50">
          <p className="text-dash-text-muted text-sm">Total Sessions</p>
          <p className="text-2xl font-bold text-dash-text-primary">{stats.total}</p>
        </Card>
        <Card className="bg-dash-surface-card/50">
          <p className="text-dash-text-muted text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
        </Card>
        <Card className="bg-dash-surface-card/50">
          <p className="text-dash-text-muted text-sm">Declined</p>
          <p className="text-2xl font-bold text-red-500">{stats.declined}</p>
        </Card>
        <Card className="bg-dash-surface-card/50">
          <p className="text-dash-text-muted text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </Card>
        <Card className="bg-dash-surface-card/50">
          <p className="text-dash-text-muted text-sm">Total Volume</p>
          <p className="text-2xl font-bold text-dash-text-primary">${stats.totalVolume.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by session ID, order ID, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="expired">Expired</option>
          </select>

          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-4 py-2.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
          >
            <option value="all">All Providers</option>
            <option value="klarna">Klarna</option>
            <option value="affirm">Affirm</option>
            <option value="afterpay">Afterpay</option>
            <option value="sezzle">Sezzle</option>
          </select>

          {/* Date Range */}
          <div className="flex gap-1 bg-dash-surface-bg p-1 rounded-lg">
            {(['7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-dash-surface-card text-dash-text-primary shadow-sm'
                    : 'text-dash-text-secondary hover:text-dash-text-primary'
                }`}
              >
                {range === 'all' ? 'All Time' : range}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dash-surface-border">
                <th className="px-6 py-4 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-dash-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-surface-border">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-dash-text-muted">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-dash-surface-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-dash-text-primary font-mono text-sm">{txn.sessionToken}</p>
                        <p className="text-dash-text-muted text-xs">Order: {txn.orderId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-dash-text-primary text-sm">{txn.customer.name}</p>
                        <p className="text-dash-text-muted text-xs">{txn.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-dash-text-primary font-semibold">${txn.amount.toFixed(2)}</p>
                      <p className="text-dash-text-muted text-xs">{txn.currency}</p>
                    </td>
                    <td className="px-6 py-4">
                      {txn.provider ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: PROVIDER_COLORS[txn.provider] + '40', color: PROVIDER_COLORS[txn.provider] }}
                          >
                            {txn.provider.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-dash-text-primary text-sm capitalize">{txn.provider}</p>
                            {txn.planType && <p className="text-dash-text-muted text-xs">{txn.planType}</p>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-dash-text-muted text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dash-text-primary text-sm">{formatTimeAgo(txn.createdAt)}</p>
                      <p className="text-dash-text-muted text-xs">{formatDate(txn.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedTransaction(txn)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-dash-surface-border flex items-center justify-between">
            <p className="text-dash-text-muted text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-dash-primary-500 text-white'
                      : 'text-dash-text-muted hover:text-dash-text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dash-surface-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-dash-surface-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-dash-text-primary">Transaction Details</h2>
                <p className="text-dash-text-muted text-sm font-mono">{selectedTransaction.sessionToken}</p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-dash-surface-bg rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and Amount */}
              <div className="flex items-center justify-between">
                <div>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-dash-text-primary">
                    ${selectedTransaction.amount.toFixed(2)}
                  </p>
                  <p className="text-dash-text-muted">{selectedTransaction.currency}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-dash-surface-bg rounded-xl p-4">
                <h3 className="text-sm font-medium text-dash-text-muted mb-3">Customer</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-dash-text-secondary">Name</span>
                    <span className="text-dash-text-primary">{selectedTransaction.customer.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dash-text-secondary">Email</span>
                    <span className="text-dash-text-primary">{selectedTransaction.customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dash-text-secondary">Order ID</span>
                    <span className="text-dash-text-primary font-mono">{selectedTransaction.orderId}</span>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              {selectedTransaction.provider && (
                <div className="bg-dash-surface-bg rounded-xl p-4">
                  <h3 className="text-sm font-medium text-dash-text-muted mb-3">Provider</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-dash-text-secondary">Provider</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: PROVIDER_COLORS[selectedTransaction.provider] + '40',
                            color: PROVIDER_COLORS[selectedTransaction.provider]
                          }}
                        >
                          {selectedTransaction.provider.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-dash-text-primary capitalize">{selectedTransaction.provider}</span>
                      </div>
                    </div>
                    {selectedTransaction.planType && (
                      <div className="flex items-center justify-between">
                        <span className="text-dash-text-secondary">Plan</span>
                        <span className="text-dash-text-primary">{selectedTransaction.planType}</span>
                      </div>
                    )}
                    {selectedTransaction.providerTxnId && (
                      <div className="flex items-center justify-between">
                        <span className="text-dash-text-secondary">Provider Transaction ID</span>
                        <span className="text-dash-text-primary font-mono text-sm">{selectedTransaction.providerTxnId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Waterfall Attempts */}
              {selectedTransaction.providersAttempted.length > 0 && (
                <div className="bg-dash-surface-bg rounded-xl p-4">
                  <h3 className="text-sm font-medium text-dash-text-muted mb-3">Waterfall Routing</h3>
                  <div className="flex items-center gap-2">
                    {selectedTransaction.providersAttempted.map((provider, index) => (
                      <div key={provider} className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            provider === selectedTransaction.provider
                              ? 'ring-2 ring-green-500'
                              : ''
                          }`}
                          style={{
                            backgroundColor: PROVIDER_COLORS[provider] + '40',
                            color: PROVIDER_COLORS[provider]
                          }}
                        >
                          {provider.charAt(0).toUpperCase()}
                        </div>
                        {index < selectedTransaction.providersAttempted.length - 1 && (
                          <svg className="w-4 h-4 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-dash-text-muted text-xs mt-2">
                    {selectedTransaction.providersAttempted.length} provider{selectedTransaction.providersAttempted.length > 1 ? 's' : ''} attempted
                    {selectedTransaction.provider && (
                      <span className="text-green-500"> • Approved by {selectedTransaction.provider}</span>
                    )}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-dash-surface-bg rounded-xl p-4">
                <h3 className="text-sm font-medium text-dash-text-muted mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-dash-text-secondary">Created</span>
                    <span className="text-dash-text-primary">{formatDate(selectedTransaction.createdAt)}</span>
                  </div>
                  {selectedTransaction.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-dash-text-secondary">Completed</span>
                      <span className="text-dash-text-primary">{formatDate(selectedTransaction.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-dash-surface-border flex items-center justify-between">
              <Button variant="secondary" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
              <div className="flex items-center gap-3">
                {selectedTransaction.status === 'approved' && (
                  <Button variant="danger">Refund</Button>
                )}
                <Button variant="primary">View in Provider</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
