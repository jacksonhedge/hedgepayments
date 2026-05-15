'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function AccountSettingsPage() {
  const supabase = createClientComponentClient()
  const [account, setAccount] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'llc',
    website: '',
    support_email: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_email: ''
  })

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
        setFormData({
          business_name: businessAccount.business_name || '',
          business_type: businessAccount.business_type || 'llc',
          website: businessAccount.website || '',
          support_email: businessAccount.support_email || '',
          contact_first_name: businessAccount.contact_first_name || '',
          contact_last_name: businessAccount.contact_last_name || '',
          contact_email: businessAccount.contact_email || ''
        })
      }
    }

    fetchAccount()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    if (!account?.id) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('business_accounts')
        .update({
          business_name: formData.business_name,
          business_type: formData.business_type,
          website: formData.website,
          support_email: formData.support_email,
          contact_first_name: formData.contact_first_name,
          contact_last_name: formData.contact_last_name,
          contact_email: formData.contact_email
        })
        .eq('id', account.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Account settings saved successfully' })
    } catch (error: any) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dash-text-primary">Account Settings</h1>
        <p className="text-dash-text-secondary mt-1">
          Manage your business profile and contact information
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-dash-status-success/10 border border-dash-status-success/30 text-dash-status-success'
            : 'bg-dash-status-error/10 border border-dash-status-error/30 text-dash-status-error'
        }`}>
          {message.text}
        </div>
      )}

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
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Business Type
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
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
              name="website"
              value={formData.website}
              onChange={handleChange}
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
              name="support_email"
              value={formData.support_email}
              onChange={handleChange}
              placeholder="support@example.com"
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
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
              name="contact_first_name"
              value={formData.contact_first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="contact_last_name"
              value={formData.contact_last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>

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
