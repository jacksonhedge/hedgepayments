'use client'

import { useState } from 'react'
import { useMode } from '../contexts/ModeContext'
import { Card, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import DataTable from '../components/tables/DataTable'
import MetricCard from '../components/widgets/MetricCard'

interface Customer {
  id: string
  email: string
  name: string
  created_at: string
  total_transactions: number
  total_amount_cents: number
  status: 'active' | 'inactive'
}

const mockCustomers: Customer[] = [
  {
    id: 'cus_001',
    email: 'john@example.com',
    name: 'John Doe',
    created_at: '2024-01-01T00:00:00Z',
    total_transactions: 12,
    total_amount_cents: 125000,
    status: 'active',
  },
  {
    id: 'cus_002',
    email: 'jane@example.com',
    name: 'Jane Smith',
    created_at: '2024-01-05T00:00:00Z',
    total_transactions: 8,
    total_amount_cents: 85000,
    status: 'active',
  },
  {
    id: 'cus_003',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    created_at: '2024-01-10T00:00:00Z',
    total_transactions: 3,
    total_amount_cents: 32500,
    status: 'active',
  },
  {
    id: 'cus_004',
    email: 'alice@example.com',
    name: 'Alice Brown',
    created_at: '2024-01-12T00:00:00Z',
    total_transactions: 1,
    total_amount_cents: 15000,
    status: 'inactive',
  },
]

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function CustomersPage() {
  const { isTestMode } = useMode()
  const [customers] = useState<Customer[]>(mockCustomers)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_amount_cents, 0)

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (row: Customer) => (
        <div>
          <p className="text-dash-text-primary font-medium">{row.name}</p>
          <p className="text-dash-text-muted text-sm">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (row: Customer) => (
        <span className="text-dash-text-secondary">{formatDate(row.created_at)}</span>
      ),
    },
    {
      key: 'total_transactions',
      header: 'Transactions',
      sortable: true,
      render: (row: Customer) => (
        <span className="text-dash-text-primary">{row.total_transactions}</span>
      ),
    },
    {
      key: 'total_amount_cents',
      header: 'Total Spent',
      sortable: true,
      render: (row: Customer) => (
        <span className="text-dash-text-primary font-medium">{formatCurrency(row.total_amount_cents)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: Customer) => (
        <Badge variant={row.status === 'active' ? 'success' : 'default'}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">Customers</h1>
          <p className="text-dash-text-secondary mt-1">
            {isTestMode ? 'Test' : 'Live'} customer management
          </p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Customer
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Customers"
          value={totalCustomers.toString()}
          trend={{ value: 12, isPositive: true }}
          subtitle="this month"
        />
        <MetricCard
          title="Active Customers"
          value={activeCustomers.toString()}
          subtitle="with recent activity"
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend={{ value: 8.5, isPositive: true }}
          subtitle="all time"
        />
      </div>

      {/* Search & Filters */}
      <Card padding="sm">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
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
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-1.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <select className="px-3 py-1.5 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <Button variant="secondary" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
        </div>
      </Card>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(row) => row.id}
        emptyMessage="No customers found"
        pagination={{
          page,
          pageSize,
          total: customers.length,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
