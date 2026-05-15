'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import Image from 'next/image'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

interface Branding {
  logo_url?: string
  primary_color?: string
  secondary_color?: string
}

export default function BrandingSettingsPage() {
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [branding, setBranding] = useState<Branding>({
    logo_url: '',
    primary_color: '#10B981',
    secondary_color: '#059669'
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: businessAccount } = await supabase
        .from('business_accounts')
        .select('id, branding')
        .eq('auth_user_id', user.id)
        .single()

      if (businessAccount) {
        setAccountId(businessAccount.id)
        if (businessAccount.branding) {
          setBranding({
            logo_url: businessAccount.branding.logo_url || '',
            primary_color: businessAccount.branding.primary_color || '#10B981',
            secondary_color: businessAccount.branding.secondary_color || '#059669'
          })
        }
      }
    }

    fetchAccount()
  }, [supabase])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !accountId) return

    setUploading(true)
    setMessage(null)

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${accountId}/logo-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        throw error
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName)

      setBranding(prev => ({ ...prev, logo_url: publicUrl }))
      setMessage({ type: 'success', text: 'Logo uploaded successfully' })
    } catch (error: any) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to upload logo' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!accountId) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('business_accounts')
        .update({ branding })
        .eq('id', accountId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Branding settings saved successfully' })
    } catch (error: any) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save branding settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLogo = () => {
    setBranding(prev => ({ ...prev, logo_url: '' }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dash-text-primary">Company Branding</h1>
        <p className="text-dash-text-secondary mt-1">
          Customize your company logo and brand colors
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

      {/* Company Logo */}
      <Card>
        <CardTitle>Company Logo</CardTitle>
        <CardDescription>
          Upload your company logo. It will appear in the dashboard header and on customer-facing pages.
        </CardDescription>
        <div className="mt-6">
          <div className="flex items-start gap-6">
            {/* Logo Preview */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-dash-surface-border bg-dash-surface-bg flex items-center justify-center overflow-hidden">
                {branding.logo_url ? (
                  <Image
                    src={branding.logo_url}
                    alt="Company Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-10 h-10 text-dash-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-dash-text-secondary mb-2">
                  Recommended: Square image, at least 256x256 pixels. PNG or JPG format.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    loading={uploading}
                  >
                    {uploading ? 'Uploading...' : branding.logo_url ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  {branding.logo_url && (
                    <Button variant="ghost" onClick={handleRemoveLogo}>
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Brand Colors */}
      <Card>
        <CardTitle>Brand Colors</CardTitle>
        <CardDescription>
          Customize the colors used throughout your dashboard and customer experiences.
        </CardDescription>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => setBranding(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-dash-surface-border"
                />
              </div>
              <input
                type="text"
                value={branding.primary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, primary_color: e.target.value }))}
                className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
              />
            </div>
            <p className="mt-2 text-xs text-dash-text-muted">Used for buttons, links, and accents</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={branding.secondary_color}
                  onChange={(e) => setBranding(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-dash-surface-border"
                />
              </div>
              <input
                type="text"
                value={branding.secondary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
              />
            </div>
            <p className="mt-2 text-xs text-dash-text-muted">Used for hover states and secondary elements</p>
          </div>
        </div>

        {/* Color Preview */}
        <div className="mt-6 p-4 bg-dash-surface-bg rounded-lg">
          <p className="text-sm font-medium text-dash-text-secondary mb-3">Preview</p>
          <div className="flex items-center gap-4">
            <button
              style={{ backgroundColor: branding.primary_color }}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            >
              Primary Button
            </button>
            <button
              style={{ backgroundColor: branding.secondary_color }}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            >
              Secondary Button
            </button>
            <span style={{ color: branding.primary_color }} className="text-sm font-medium">
              Link Text
            </span>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save Branding Settings
        </Button>
      </div>
    </div>
  )
}
