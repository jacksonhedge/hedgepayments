'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { ModeProvider } from './contexts/ModeContext'
import { Sidebar, Header } from './components/layout'

interface BusinessAccount {
  id: string
  business_name: string
  contact_first_name: string
  contact_last_name: string
  contact_email: string
  branding?: {
    logo_url?: string
    primary_color?: string
    secondary_color?: string
  }
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [account, setAccount] = useState<BusinessAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/business-login')
        return
      }

      const { data: businessAccount, error } = await supabase
        .from('business_accounts')
        .select('id, business_name, contact_first_name, contact_last_name, contact_email, branding')
        .eq('auth_user_id', user.id)
        .single()

      if (error || !businessAccount) {
        router.push('/get-started')
        return
      }

      setAccount(businessAccount)
      setIsLoading(false)
    }

    fetchAccount()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/business-login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  // Listen for sidebar collapse state from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem('sidebar-collapsed') === 'true'
      setSidebarCollapsed(collapsed)
    }

    window.addEventListener('storage', handleStorageChange)
    handleStorageChange()

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dash-surface-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-dash-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dash-text-secondary text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dash-surface-bg">
      {/* Sidebar */}
      <Sidebar
        businessLogo={account?.branding?.logo_url}
        businessName={account?.business_name}
      />

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Header */}
        <Header
          businessName={account?.business_name}
          userEmail={account?.contact_email}
          businessLogo={account?.branding?.logo_url}
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-dash-surface-bg flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-dash-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </Suspense>
    </ModeProvider>
  )
}
