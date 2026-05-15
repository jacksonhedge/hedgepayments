'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const [account, setAccount] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: businessAccount } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (businessAccount) {
        setAccount(businessAccount)
      }
    }

    fetchAccount()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dash-text-primary">Settings</h1>
        <p className="text-dash-text-secondary mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>Your public business information</CardDescription>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Business Name
            </label>
            <input
              type="text"
              defaultValue={account?.business_name || ''}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Business Type
            </label>
            <select
              defaultValue={account?.business_type || 'llc'}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            >
              <option value="sole_proprietor">Sole Proprietor</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Website
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Support Email
            </label>
            <input
              type="email"
              placeholder="support@example.com"
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Primary contact for this account</CardDescription>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue={account?.contact_first_name || ''}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={account?.contact_last_name || ''}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={account?.contact_email || ''}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
        <div className="mt-6 space-y-4">
          {[
            { id: 'payments', label: 'Payment notifications', description: 'Get notified when payments are received or fail' },
            { id: 'payouts', label: 'Payout notifications', description: 'Get notified when payouts are sent to your bank' },
            { id: 'security', label: 'Security alerts', description: 'Get notified about security events and suspicious activity' },
            { id: 'product', label: 'Product updates', description: 'Get notified about new features and improvements' },
          ].map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 bg-dash-surface-bg rounded-lg">
              <div>
                <p className="font-medium text-dash-text-primary">{notification.label}</p>
                <p className="text-sm text-dash-text-muted">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-dash-surface-border peer-focus:ring-2 peer-focus:ring-dash-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dash-primary-500"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-dash-status-error/30">
        <CardTitle className="text-dash-status-error">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-dash-status-error/5 border border-dash-status-error/20 rounded-lg">
            <div>
              <p className="font-medium text-dash-text-primary">Delete Account</p>
              <p className="text-sm text-dash-text-muted">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
