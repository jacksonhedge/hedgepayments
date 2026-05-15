'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { useMode } from '../../contexts/ModeContext'

interface WebhookEvent {
  id: string
  name: string
  description: string
  enabled: boolean
}

const WEBHOOK_EVENTS: WebhookEvent[] = [
  { id: 'session.created', name: 'session.created', description: 'Triggered when a new checkout session is created', enabled: true },
  { id: 'payment.authorized', name: 'payment.authorized', description: 'Triggered when payment is authorized by a provider', enabled: true },
  { id: 'payment.captured', name: 'payment.captured', description: 'Triggered when payment is captured', enabled: true },
  { id: 'payment.declined', name: 'payment.declined', description: 'Triggered when all providers decline the payment', enabled: true },
  { id: 'payment.refunded', name: 'payment.refunded', description: 'Triggered when a payment is refunded', enabled: true },
  { id: 'session.expired', name: 'session.expired', description: 'Triggered when a session expires without completion', enabled: false },
]

interface WebhookLog {
  id: string
  event: string
  status: 'success' | 'failed' | 'pending'
  statusCode: number | null
  timestamp: string
  responseTime: number
}

// Mock webhook delivery logs
const MOCK_WEBHOOK_LOGS: WebhookLog[] = [
  { id: 'wh_001', event: 'payment.authorized', status: 'success', statusCode: 200, timestamp: '2024-01-21T10:32:15Z', responseTime: 234 },
  { id: 'wh_002', event: 'session.created', status: 'success', statusCode: 200, timestamp: '2024-01-21T10:30:00Z', responseTime: 156 },
  { id: 'wh_003', event: 'payment.declined', status: 'failed', statusCode: 500, timestamp: '2024-01-21T09:45:00Z', responseTime: 1023 },
  { id: 'wh_004', event: 'payment.authorized', status: 'success', statusCode: 200, timestamp: '2024-01-21T09:18:30Z', responseTime: 189 },
  { id: 'wh_005', event: 'session.created', status: 'success', statusCode: 200, timestamp: '2024-01-21T09:15:00Z', responseTime: 145 },
]

export default function CoverPaySettingsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { isTestMode } = useMode()

  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(WEBHOOK_EVENTS)
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(MOCK_WEBHOOK_LOGS)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [publishableKey, setPublishableKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [activeTab, setActiveTab] = useState<'webhooks' | 'api-keys' | 'notifications'>('webhooks')

  // Email notification settings
  const [notifications, setNotifications] = useState({
    paymentApproved: true,
    paymentDeclined: true,
    dailyReport: true,
    weeklyReport: false,
    lowApprovalRate: true,
    providerDown: true,
  })

  const [notificationEmail, setNotificationEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/business-login')
        return
      }

      // Get business account
      const { data: business } = await supabase
        .from('business_accounts')
        .select('id, business_name')
        .eq('auth_user_id', user.id)
        .single()

      if (!business) {
        router.push('/get-started')
        return
      }

      // Set mock API keys based on business ID
      const keyPrefix = isTestMode ? 'pk_test_' : 'pk_live_'
      const secretPrefix = isTestMode ? 'sk_test_' : 'sk_live_'
      setPublishableKey(`${keyPrefix}${business.id.slice(0, 24)}`)
      setSecretKey(`${secretPrefix}${business.id.slice(0, 24)}`)
      setNotificationEmail(user.email || '')
    }

    fetchData()
  }, [router, supabase, isTestMode])

  const toggleWebhookEvent = (eventId: string) => {
    setWebhookEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, enabled: !event.enabled } : event
    ))
  }

  const testWebhook = async () => {
    if (!webhookUrl) return

    setIsTestingWebhook(true)
    // Simulate webhook test
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add test event to logs
    setWebhookLogs(prev => [{
      id: `wh_test_${Date.now()}`,
      event: 'test.webhook',
      status: Math.random() > 0.2 ? 'success' : 'failed',
      statusCode: Math.random() > 0.2 ? 200 : 500,
      timestamp: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 500) + 100,
    }, ...prev])

    setIsTestingWebhook(false)
  }

  const saveSettings = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
  }

  const regenerateKey = async (keyType: 'publishable' | 'secret' | 'webhook') => {
    const confirmed = confirm(`Are you sure you want to regenerate your ${keyType} key? This will invalidate the current key.`)
    if (!confirmed) return

    // Simulate key regeneration
    const newKey = `${keyType === 'publishable' ? (isTestMode ? 'pk_test_' : 'pk_live_') : keyType === 'secret' ? (isTestMode ? 'sk_test_' : 'sk_live_') : 'whsec_'}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`

    if (keyType === 'publishable') {
      setPublishableKey(newKey)
    } else if (keyType === 'secret') {
      setSecretKey(newKey)
    } else {
      setWebhookSecret(newKey)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products/coverpay" className="text-dash-text-muted hover:text-dash-text-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">CoverPay Settings</h1>
            <p className="text-dash-text-secondary">Configure webhooks, API keys, and notifications</p>
          </div>
        </div>
        <Badge variant={isTestMode ? 'warning' : 'success'} size="md">
          {isTestMode ? 'Test Mode' : 'Live Mode'}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dash-surface-bg p-1 rounded-lg w-fit">
        {(['webhooks', 'api-keys', 'notifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-dash-surface-card text-dash-text-primary shadow-sm'
                : 'text-dash-text-secondary hover:text-dash-text-primary'
            }`}
          >
            {tab === 'api-keys' ? 'API Keys' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          {/* Webhook URL Configuration */}
          <Card>
            <CardTitle>Webhook Endpoint</CardTitle>
            <CardDescription>
              Configure the URL where CoverPay will send webhook events for payment notifications.
            </CardDescription>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Webhook URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://yoursite.com/webhooks/coverpay"
                    className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                  />
                  <Button
                    variant="secondary"
                    onClick={testWebhook}
                    loading={isTestingWebhook}
                    disabled={!webhookUrl}
                  >
                    Test Webhook
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Webhook Signing Secret
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type={showWebhookSecret ? 'text' : 'password'}
                      value={webhookSecret}
                      readOnly
                      className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-text-muted hover:text-dash-text-primary"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {showWebhookSecret ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  <Button variant="secondary" onClick={() => copyToClipboard(webhookSecret)}>
                    Copy
                  </Button>
                  <Button variant="secondary" onClick={() => regenerateKey('webhook')}>
                    Regenerate
                  </Button>
                </div>
                <p className="text-dash-text-muted text-sm mt-2">
                  Use this secret to verify webhook signatures and ensure requests are from CoverPay.
                </p>
              </div>
            </div>
          </Card>

          {/* Webhook Events */}
          <Card>
            <CardTitle>Webhook Events</CardTitle>
            <CardDescription>
              Select which events should trigger webhook notifications.
            </CardDescription>

            <div className="mt-6 space-y-3">
              {webhookEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <code className="text-dash-primary-500 text-sm font-mono bg-dash-primary-500/10 px-2 py-1 rounded">
                      {event.name}
                    </code>
                    <span className="text-dash-text-secondary text-sm">{event.description}</span>
                  </div>
                  <button
                    onClick={() => toggleWebhookEvent(event.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      event.enabled ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                        event.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="primary" onClick={saveSettings} loading={isSaving}>
                Save Webhook Settings
              </Button>
            </div>
          </Card>

          {/* Webhook Delivery Logs */}
          <Card padding="none">
            <div className="p-6 border-b border-dash-surface-border">
              <CardTitle>Recent Webhook Deliveries</CardTitle>
              <CardDescription>Monitor the status of recent webhook deliveries.</CardDescription>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dash-surface-border">
                    <th className="px-6 py-3 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dash-text-muted uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-surface-border">
                  {webhookLogs.map(log => (
                    <tr key={log.id} className="hover:bg-dash-surface-bg/50">
                      <td className="px-6 py-4">
                        <code className="text-dash-primary-500 text-sm font-mono">{log.event}</code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={log.status === 'success' ? 'success' : log.status === 'failed' ? 'error' : 'warning'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${log.statusCode === 200 ? 'text-green-500' : 'text-red-500'}`}>
                            {log.statusCode}
                          </span>
                          <span className="text-dash-text-muted text-sm">
                            {log.responseTime}ms
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dash-text-secondary text-sm">
                        {formatDate(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <Card className="bg-dash-primary-500/5 border-dash-primary-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-dash-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-dash-text-primary">Keep your API keys secure</h3>
                <p className="text-dash-text-secondary text-sm mt-1">
                  Your secret key can be used to authenticate requests to the CoverPay API. Never share it publicly or commit it to version control.
                </p>
              </div>
            </div>
          </Card>

          {/* Publishable Key */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-dash-text-primary font-semibold">Publishable Key</h3>
                <p className="text-dash-text-muted text-sm">
                  Use this key in your frontend code. It can be safely exposed in client-side applications.
                </p>
              </div>
              <Badge variant={isTestMode ? 'warning' : 'success'}>
                {isTestMode ? 'Test' : 'Live'}
              </Badge>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg font-mono text-sm text-dash-text-primary overflow-x-auto">
                {publishableKey}
              </div>
              <Button variant="secondary" onClick={() => copyToClipboard(publishableKey)}>
                Copy
              </Button>
            </div>
          </Card>

          {/* Secret Key */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-dash-text-primary font-semibold">Secret Key</h3>
                <p className="text-dash-text-muted text-sm">
                  Use this key for server-side API calls. Keep it secure and never expose it in client-side code.
                </p>
              </div>
              <Badge variant="error">Secret</Badge>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKey}
                  readOnly
                  className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg font-mono text-sm text-dash-text-primary"
                />
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-text-muted hover:text-dash-text-primary"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showSecretKey ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              <Button variant="secondary" onClick={() => copyToClipboard(secretKey)}>
                Copy
              </Button>
              <Button variant="secondary" onClick={() => regenerateKey('secret')}>
                Regenerate
              </Button>
            </div>
          </Card>

          {/* API Usage Example */}
          <Card>
            <CardTitle>API Usage Example</CardTitle>
            <CardDescription>Example of creating a checkout session using the API.</CardDescription>
            <pre className="mt-4 p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm">
              <code className="text-dash-status-success">{`curl -X POST https://api.hedgepayments.com/coverpay/sessions \\
  -H "Authorization: Bearer ${secretKey.slice(0, 20)}..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 249.99,
    "currency": "USD",
    "orderId": "order_123",
    "customer": {
      "email": "customer@example.com",
      "name": "John Doe"
    },
    "successUrl": "https://yoursite.com/success",
    "cancelUrl": "https://yoursite.com/cancel"
  }'`}</code>
            </pre>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure email alerts for important payment events.</CardDescription>

            <div className="mt-6">
              <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                Notification Email
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full max-w-md px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
              />
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-dash-text-primary font-medium">Payment Events</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Payment Approved</p>
                    <p className="text-dash-text-muted text-sm">Get notified when a payment is approved</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, paymentApproved: !prev.paymentApproved }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.paymentApproved ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.paymentApproved ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Payment Declined</p>
                    <p className="text-dash-text-muted text-sm">Get notified when all providers decline a payment</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, paymentDeclined: !prev.paymentDeclined }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.paymentDeclined ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.paymentDeclined ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-dash-text-primary font-medium">Reports</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Daily Report</p>
                    <p className="text-dash-text-muted text-sm">Receive a daily summary of CoverPay activity</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, dailyReport: !prev.dailyReport }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.dailyReport ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.dailyReport ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Weekly Report</p>
                    <p className="text-dash-text-muted text-sm">Receive a weekly summary with provider performance insights</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, weeklyReport: !prev.weeklyReport }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.weeklyReport ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.weeklyReport ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-dash-text-primary font-medium">Alerts</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Low Approval Rate Alert</p>
                    <p className="text-dash-text-muted text-sm">Get alerted when approval rate drops below 70%</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, lowApprovalRate: !prev.lowApprovalRate }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.lowApprovalRate ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.lowApprovalRate ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg cursor-pointer">
                  <div>
                    <p className="text-dash-text-primary font-medium">Provider Downtime Alert</p>
                    <p className="text-dash-text-muted text-sm">Get alerted when a provider becomes unavailable</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, providerDown: !prev.providerDown }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications.providerDown ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      notifications.providerDown ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="primary" onClick={saveSettings} loading={isSaving}>
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
