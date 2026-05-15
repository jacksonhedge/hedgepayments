'use client'

import { useState } from 'react'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

interface ApiLog {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  status_code: number
  duration_ms: number
  timestamp: string
  ip_address: string
  environment: 'test' | 'live'
}

const mockLogs: ApiLog[] = [
  {
    id: 'log_001',
    method: 'POST',
    endpoint: '/v1/payments',
    status_code: 200,
    duration_ms: 245,
    timestamp: '2024-01-15T10:30:15Z',
    ip_address: '192.168.1.100',
    environment: 'test',
  },
  {
    id: 'log_002',
    method: 'GET',
    endpoint: '/v1/customers/cus_123',
    status_code: 200,
    duration_ms: 52,
    timestamp: '2024-01-15T10:29:45Z',
    ip_address: '192.168.1.100',
    environment: 'test',
  },
  {
    id: 'log_003',
    method: 'POST',
    endpoint: '/v1/webhooks/test',
    status_code: 200,
    duration_ms: 180,
    timestamp: '2024-01-15T10:28:30Z',
    ip_address: '192.168.1.100',
    environment: 'test',
  },
  {
    id: 'log_004',
    method: 'GET',
    endpoint: '/v1/payments/pay_456',
    status_code: 404,
    duration_ms: 35,
    timestamp: '2024-01-15T10:27:15Z',
    ip_address: '192.168.1.100',
    environment: 'test',
  },
  {
    id: 'log_005',
    method: 'POST',
    endpoint: '/v1/payments',
    status_code: 400,
    duration_ms: 88,
    timestamp: '2024-01-15T10:25:00Z',
    ip_address: '192.168.1.100',
    environment: 'test',
  },
]

const methodColors: Record<string, string> = {
  GET: 'text-dash-status-info',
  POST: 'text-dash-status-success',
  PUT: 'text-dash-status-warning',
  DELETE: 'text-dash-status-error',
}

export default function LogsPage() {
  const { mode, isTestMode } = useMode()
  const [logs, setLogs] = useState<ApiLog[]>(mockLogs)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null)

  const filteredLogs = logs.filter((log) => {
    if (log.environment !== mode) return false
    if (statusFilter === 'all') return true
    if (statusFilter === 'success') return log.status_code >= 200 && log.status_code < 300
    if (statusFilter === 'error') return log.status_code >= 400
    return true
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="success">{statusCode}</Badge>
    }
    if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="warning">{statusCode}</Badge>
    }
    if (statusCode >= 500) {
      return <Badge variant="error">{statusCode}</Badge>
    }
    return <Badge variant="default">{statusCode}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">API Logs</h1>
          <p className="text-dash-text-secondary mt-1">
            {isTestMode ? 'Test' : 'Live'} API request logs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-sm text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success (2xx)</option>
            <option value="error">Errors (4xx, 5xx)</option>
          </select>
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Card padding="none">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-dash-surface-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <CardTitle>No logs found</CardTitle>
            <p className="text-dash-text-muted text-sm mt-2">
              API requests will appear here once you start making calls.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-dash-surface-border">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-center justify-between hover:bg-dash-surface-hover transition-colors cursor-pointer"
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm font-medium w-12 ${methodColors[log.method]}`}>
                    {log.method}
                  </span>
                  <code className="text-dash-text-primary text-sm">{log.endpoint}</code>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-dash-text-muted text-sm">{log.duration_ms}ms</span>
                  {getStatusBadge(log.status_code)}
                  <span className="text-dash-text-muted text-sm w-24 text-right">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Log Detail Panel */}
      {selectedLog && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Request Details</CardTitle>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-dash-text-muted hover:text-dash-text-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-dash-text-muted text-sm">Method</p>
              <p className={`font-mono font-medium ${methodColors[selectedLog.method]}`}>{selectedLog.method}</p>
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">Endpoint</p>
              <code className="text-dash-text-primary">{selectedLog.endpoint}</code>
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">Status</p>
              {getStatusBadge(selectedLog.status_code)}
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">Duration</p>
              <p className="text-dash-text-primary">{selectedLog.duration_ms}ms</p>
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">Timestamp</p>
              <p className="text-dash-text-primary">{new Date(selectedLog.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">IP Address</p>
              <p className="text-dash-text-primary font-mono">{selectedLog.ip_address}</p>
            </div>
            <div>
              <p className="text-dash-text-muted text-sm">Environment</p>
              <Badge variant={selectedLog.environment === 'test' ? 'warning' : 'success'}>
                {selectedLog.environment}
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
