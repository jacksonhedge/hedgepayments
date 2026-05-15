'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

interface TeamMember {
  id: string
  email: string
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  status: 'active' | 'pending'
  created_at: string
}

export default function TeamSettingsPage() {
  const supabase = createClientComponentClient()
  const [account, setAccount] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'developer' | 'viewer'>('viewer')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: businessAccount } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (businessAccount) {
        setAccount(businessAccount)

        // For now, show the owner as the only team member
        // In a full implementation, you'd fetch from business_team_members table
        setTeamMembers([
          {
            id: user.id,
            email: businessAccount.contact_email,
            role: 'owner',
            status: 'active',
            created_at: businessAccount.created_at
          }
        ])
      }
    }

    fetchData()
  }, [supabase])

  const handleInvite = async () => {
    setInviting(true)
    // Simulate invite - in full implementation, this would send an email
    await new Promise(resolve => setTimeout(resolve, 1000))

    setTeamMembers(prev => [...prev, {
      id: `pending-${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      created_at: new Date().toISOString()
    }])

    setInviteEmail('')
    setShowInviteModal(false)
    setInviting(false)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'info'
      case 'admin': return 'warning'
      case 'developer': return 'success'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">Team Members</h1>
          <p className="text-dash-text-secondary mt-1">
            Manage who has access to your Hedge Payments dashboard
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowInviteModal(true)}>
          Invite Member
        </Button>
      </div>

      {/* Team Members List */}
      <Card>
        <CardTitle>Team</CardTitle>
        <CardDescription>People with access to this account</CardDescription>
        <div className="mt-6 divide-y divide-dash-surface-border">
          {teamMembers.map((member) => (
            <div key={member.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-dash-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {member.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-dash-text-primary">{member.email}</p>
                  <p className="text-sm text-dash-text-muted">
                    Added {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
                {member.status === 'pending' && (
                  <Badge variant="warning">Pending</Badge>
                )}
                {member.role !== 'owner' && (
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardTitle>Role Permissions</CardTitle>
        <CardDescription>What each role can do</CardDescription>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dash-surface-border">
                <th className="text-left py-3 text-sm font-medium text-dash-text-secondary">Permission</th>
                <th className="text-center py-3 text-sm font-medium text-dash-text-secondary">Owner</th>
                <th className="text-center py-3 text-sm font-medium text-dash-text-secondary">Admin</th>
                <th className="text-center py-3 text-sm font-medium text-dash-text-secondary">Developer</th>
                <th className="text-center py-3 text-sm font-medium text-dash-text-secondary">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-surface-border">
              {[
                { name: 'View dashboard & transactions', owner: true, admin: true, developer: true, viewer: true },
                { name: 'Manage API keys', owner: true, admin: true, developer: true, viewer: false },
                { name: 'Configure webhooks', owner: true, admin: true, developer: true, viewer: false },
                { name: 'Manage team members', owner: true, admin: true, developer: false, viewer: false },
                { name: 'Update billing', owner: true, admin: true, developer: false, viewer: false },
                { name: 'Delete account', owner: true, admin: false, developer: false, viewer: false },
              ].map((perm, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm text-dash-text-primary">{perm.name}</td>
                  <td className="py-3 text-center">{perm.owner ? '✓' : '—'}</td>
                  <td className="py-3 text-center">{perm.admin ? '✓' : '—'}</td>
                  <td className="py-3 text-center">{perm.developer ? '✓' : '—'}</td>
                  <td className="py-3 text-center">{perm.viewer ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowInviteModal(false)}>
          <div className="bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-dash-text-primary mb-4">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-3 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-primary focus:outline-none focus:ring-2 focus:ring-dash-primary-500"
                >
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleInvite} loading={inviting}>
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
