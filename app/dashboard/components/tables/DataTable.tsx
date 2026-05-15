'use client'

import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
  loading?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
}

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  loading = false,
  selectable = false,
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const toggleRowSelection = (key: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map(keyExtractor)))
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    if (aVal === bVal) return 0
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : 1
    }
    return aVal > bVal ? -1 : 1
  })

  const getValue = (row: T, key: string) => {
    const keys = key.split('.')
    let value: any = row
    for (const k of keys) {
      value = value?.[k]
    }
    return value
  }

  if (loading) {
    return (
      <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-dash-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-dash-text-muted text-sm mt-4">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dash-surface-border bg-dash-surface-bg">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={toggleAllRows}
                    className="w-4 h-4 rounded border-dash-surface-border text-dash-primary-500 focus:ring-dash-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-dash-text-muted uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-dash-text-secondary select-none' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortColumn === String(column.key) && (
                      sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-surface-border">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-dash-text-muted mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-dash-text-muted">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row) => {
                const rowKey = keyExtractor(row)
                return (
                  <tr
                    key={rowKey}
                    className={`hover:bg-dash-surface-hover transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${selectedRows.has(rowKey) ? 'bg-dash-primary-500/5' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowKey)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleRowSelection(rowKey)
                          }}
                          className="w-4 h-4 rounded border-dash-surface-border text-dash-primary-500 focus:ring-dash-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-sm ${column.className || ''}`}
                      >
                        {column.render
                          ? column.render(row)
                          : getValue(row, String(column.key))}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="px-4 py-3 border-t border-dash-surface-border flex items-center justify-between">
          <p className="text-sm text-dash-text-muted">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
