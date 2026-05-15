'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { useMode } from '../../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const EyeSlashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)

function generateRandomKey(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

type ModalAction = 'all' | 'publishable' | 'secret' | 'webhook'

export default function ApiKeysPage() {
  const { mode, isTestMode } = useMode()
  const supabase = createClientComponentClient()

  const [showKeys, setShowKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [account, setAccount] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [modalAction, setModalAction] = useState<ModalAction>('all')

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

  const copyToClipboard = async (text: string, keyType: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(keyType)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getPublishableKey = () => isTestMode ? account?.api_key_test : account?.api_key_live
  const getSecretKey = () => isTestMode ? account?.api_secret_test : account?.api_secret_live

  const openConfirmModal = (action: ModalAction) => {
    setModalAction(action)
    setShowConfirmModal(true)
  }

  const getModalTitle = () => {
    switch (modalAction) {
      case 'all': return 'Generate New API Keys'
      case 'publishable': return 'Roll Publishable Key'
      case 'secret': return 'Roll Secret Key'
      case 'webhook': return 'Regenerate Webhook Secret'
    }
  }

  const getModalDescription = () => {
    switch (modalAction) {
      case 'all':
        return 'This will generate new publishable and secret keys. Your existing keys will stop working immediately. Any integrations using the old keys will need to be updated.'
      case 'publishable':
        return 'This will generate a new publishable key. Your existing publishable key will stop working immediately. Update your frontend integrations with the new key.'
      case 'secret':
        return 'This will generate a new secret key. Your existing secret key will stop working immediately. Update your backend integrations with the new key.'
      case 'webhook':
        return 'This will generate a new webhook signing secret. You will need to update your webhook verification logic with the new secret.'
    }
  }

  const handleConfirmedAction = async () => {
    setIsGenerating(true)
    try {
      const modeStr = isTestMode ? 'test' : 'live'
      const updates: Record<string, string> = {}

      if (modalAction === 'all' || modalAction === 'publishable') {
        const newPk = `pk_${modeStr}_${generateRandomKey(48)}`
        updates[isTestMode ? 'api_key_test' : 'api_key_live'] = newPk
      }

      if (modalAction === 'all' || modalAction === 'secret') {
        const newSk = `sk_${modeStr}_${generateRandomKey(48)}`
        updates[isTestMode ? 'api_secret_test' : 'api_secret_live'] = newSk
      }

      if (modalAction === 'webhook') {
        updates.webhook_secret = `whsec_${generateRandomKey(48)}`
      }

      const { error } = await supabase
        .from('business_accounts')
        .update(updates)
        .eq('id', account.id)

      if (error) throw error

      setAccount((prev: any) => ({ ...prev, ...updates }))
      setShowKeys(true)
    } catch (err) {
      console.error('Failed to generate keys:', err)
    } finally {
      setIsGenerating(false)
      setShowConfirmModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">API Keys</h1>
          <p className="text-dash-text-secondary mt-1">
            Manage your {isTestMode ? 'test' : 'live'} API keys
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowKeys(!showKeys)}>
            {showKeys ? <EyeSlashIcon /> : <EyeIcon />}
            <span className="ml-2">{showKeys ? 'Hide Keys' : 'Reveal Keys'}</span>
          </Button>
          <Button variant="primary" onClick={() => openConfirmModal('all')}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New Key
          </Button>
        </div>
      </div>

      {/* Mode Warning */}
      {isTestMode && (
        <Card className="bg-dash-mode-test/5 border-dash-mode-test/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dash-mode-test/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-dash-mode-test" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-dash-mode-test">Test Mode</p>
              <p className="text-dash-text-secondary text-sm">
                You are viewing test API keys. Use these for development and testing only.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* API Keys */}
      <Card padding="none">
        <div className="p-6 border-b border-dash-surface-border">
          <CardTitle>Standard Keys</CardTitle>
          <CardDescription>
            These keys will allow you to authenticate API requests.
          </CardDescription>
        </div>

        <div className="divide-y divide-dash-surface-border">
          {/* Publishable Key */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-dash-text-primary">Publishable key</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openConfirmModal('publishable')}>
                <RefreshIcon />
                <span className="ml-1.5">Roll Key</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg font-mono text-sm overflow-x-auto">
                {showKeys ? (
                  <span className="text-dash-status-success">{getPublishableKey() || 'No key available'}</span>
                ) : (
                  <span className="text-dash-text-muted">{(isTestMode ? 'pk_test_' : 'pk_live_') + '••••••••••••••••'}</span>
                )}
              </code>
              <button
                onClick={() => copyToClipboard(getPublishableKey() || '', 'pk')}
                className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                {copiedKey === 'pk' ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="text-dash-text-muted text-xs mt-2">
              This key can be safely shared in your frontend code.
            </p>
          </div>

          {/* Secret Key */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-dash-text-primary">Secret key</h3>
                <Badge variant="error">Sensitive</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openConfirmModal('secret')}>
                <RefreshIcon />
                <span className="ml-1.5">Roll Key</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg font-mono text-sm overflow-x-auto">
                {showKeys ? (
                  <span className="text-dash-status-error">{getSecretKey() || 'No key available'}</span>
                ) : (
                  <span className="text-dash-text-muted">{(isTestMode ? 'sk_test_' : 'sk_live_') + '••••••••••••••••'}</span>
                )}
              </code>
              <button
                onClick={() => copyToClipboard(getSecretKey() || '', 'sk')}
                className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                {copiedKey === 'sk' ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="text-dash-status-error text-xs mt-2">
              Keep this key secret! Never share it in client-side code.
            </p>
          </div>

          {/* Webhook Secret */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-dash-text-primary">Webhook signing secret</h3>
                <Badge variant="warning">Webhook</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openConfirmModal('webhook')}>
                <RefreshIcon />
                <span className="ml-1.5">Regenerate</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg font-mono text-sm overflow-x-auto">
                {showKeys ? (
                  <span className="text-dash-status-warning">{account?.webhook_secret || 'No webhook secret'}</span>
                ) : (
                  <span className="text-dash-text-muted">whsec_••••••••••••••••</span>
                )}
              </code>
              <button
                onClick={() => copyToClipboard(account?.webhook_secret || '', 'whsec')}
                className="p-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg hover:bg-dash-surface-hover transition-colors"
              >
                {copiedKey === 'whsec' ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="text-dash-text-muted text-xs mt-2">
              Use this to verify webhook signatures.
            </p>
          </div>
        </div>
      </Card>

      {/* Restricted Keys */}
      <Card>
        <CardTitle>Restricted Keys</CardTitle>
        <CardDescription>
          Create keys with limited permissions for specific use cases.
        </CardDescription>
        <div className="mt-6 text-center py-8 border border-dashed border-dash-surface-border rounded-lg">
          <p className="text-dash-text-muted text-sm">No restricted keys created yet</p>
          <Button variant="secondary" size="sm" className="mt-4">
            Create Restricted Key
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isGenerating && setShowConfirmModal(false)}
          />
          <div className="relative bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold text-dash-text-primary">
              {getModalTitle()}
            </h2>
            <p className="text-dash-text-secondary text-sm mt-3">
              {getModalDescription()}
            </p>
            <div className="bg-dash-status-error/10 border border-dash-status-error/20 rounded-lg p-3 mt-4">
              <p className="text-dash-status-error text-xs font-medium">
                This action cannot be undone. Make sure you are ready to update your integrations.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmedAction}
                loading={isGenerating}
              >
                {modalAction === 'webhook' ? 'Regenerate Secret' : 'Generate New Key'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
