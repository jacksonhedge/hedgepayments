'use client'

import { useState } from 'react'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'enabled' | 'disabled'
  created_at: string
  last_triggered_at: string | null
}

const mockWebhooks: Webhook[] = [
  {
    id: 'wh_001',
    url: 'https://example.com/webhooks/payments',
    events: ['payment.succeeded', 'payment.failed'],
    status: 'enabled',
    created_at: '2024-01-01T00:00:00Z',
    last_triggered_at: '2024-01-15T10:30:00Z',
  },
]

const AVAILABLE_EVENTS = [
  { category: 'Payments', events: ['payment.created', 'payment.succeeded', 'payment.failed', 'payment.refunded'] },
  { category: 'Customers', events: ['customer.created', 'customer.updated', 'customer.deleted'] },
  { category: 'Webhooks', events: ['webhook.test'] },
]

export default function WebhooksPage() {
  const { isTestMode } = useMode()
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">Webhooks</h1>
          <p className="text-dash-text-secondary mt-1">
            Configure {isTestMode ? 'test' : 'live'} webhook endpoints
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Endpoint
        </Button>
      </div>

      {/* Webhooks List */}
      {webhooks.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-dash-surface-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <CardTitle>No webhooks configured</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2">
            Create a webhook endpoint to receive real-time notifications about events in your account.
          </CardDescription>
          <div className="mt-6">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Add Endpoint</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} padding="none">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <code className="text-dash-text-primary font-medium">{webhook.url}</code>
                      <Badge variant={webhook.status === 'enabled' ? 'success' : 'default'}>
                        {webhook.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-dash-text-muted">
                      <span>Created {formatDate(webhook.created_at)}</span>
                      {webhook.last_triggered_at && (
                        <span>Last triggered {formatDate(webhook.last_triggered_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Test</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-dash-status-error">Delete</Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dash-surface-border">
                  <p className="text-sm text-dash-text-muted mb-2">Listening for:</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="default">{event}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Events Reference */}
      <Card>
        <CardTitle>Available Events</CardTitle>
        <CardDescription>Events you can listen to with webhooks</CardDescription>
        <div className="mt-6 space-y-6">
          {AVAILABLE_EVENTS.map((category) => (
            <div key={category.category}>
              <h4 className="font-medium text-dash-text-primary mb-2">{category.category}</h4>
              <div className="flex flex-wrap gap-2">
                {category.events.map((event) => (
                  <code
                    key={event}
                    className="px-2 py-1 bg-dash-surface-bg border border-dash-surface-border rounded text-sm text-dash-text-secondary"
                  >
                    {event}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div
            className="w-full max-w-lg bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-dash-surface-border">
              <h2 className="text-lg font-semibold text-dash-text-primary">Add Webhook Endpoint</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Events to Listen
                </label>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {AVAILABLE_EVENTS.map((category) => (
                    <div key={category.category}>
                      <h5 className="text-sm font-medium text-dash-text-primary mb-2">{category.category}</h5>
                      <div className="space-y-1">
                        {category.events.map((event) => (
                          <label key={event} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-dash-surface-hover">
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event)}
                              onChange={() => toggleEvent(event)}
                              className="w-4 h-4 rounded border-dash-surface-border text-dash-primary-500"
                            />
                            <code className="text-sm text-dash-text-secondary">{event}</code>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-dash-surface-border flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button variant="primary">Add Endpoint</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
