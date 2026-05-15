'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function BillingSettingsPage() {
  const supabase = createClientComponentClient()
  const [account, setAccount] = useState<any>(null)

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

  // Demo invoice data
  const invoices = [
    { id: 'INV-001', date: '2024-01-01', amount: 0, status: 'paid', description: 'January 2024 - Free Tier' },
    { id: 'INV-002', date: '2024-02-01', amount: 0, status: 'paid', description: 'February 2024 - Free Tier' },
    { id: 'INV-003', date: '2024-03-01', amount: 0, status: 'paid', description: 'March 2024 - Free Tier' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dash-text-primary">Billing</h1>
        <p className="text-dash-text-secondary mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You're currently on the free tier</CardDescription>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="mt-6 p-4 bg-dash-surface-bg rounded-lg border border-dash-surface-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dash-text-primary">Free Tier</h3>
              <p className="text-sm text-dash-text-secondary mt-1">
                Perfect for getting started with Hedge Payments
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-dash-text-primary">$0</p>
              <p className="text-sm text-dash-text-muted">/ month</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-dash-text-secondary">
              <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Up to $10,000/mo volume
            </div>
            <div className="flex items-center gap-2 text-dash-text-secondary">
              <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              2.9% + $0.30 per transaction
            </div>
            <div className="flex items-center gap-2 text-dash-text-secondary">
              <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Standard support
            </div>
            <div className="flex items-center gap-2 text-dash-text-secondary">
              <svg className="w-4 h-4 text-dash-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Basic analytics
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary">Upgrade Plan</Button>
        </div>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>Choose the plan that fits your business</CardDescription>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Starter',
              price: 49,
              features: ['Up to $50,000/mo', '2.5% + $0.25/txn', 'Priority support', 'Advanced analytics'],
              current: false
            },
            {
              name: 'Growth',
              price: 199,
              features: ['Up to $250,000/mo', '2.2% + $0.20/txn', 'Dedicated support', 'Custom reports'],
              current: false,
              popular: true
            },
            {
              name: 'Enterprise',
              price: null,
              features: ['Unlimited volume', 'Custom pricing', '24/7 support', 'Custom integrations'],
              current: false
            }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-4 rounded-lg border ${
                plan.popular
                  ? 'border-dash-primary-500 bg-dash-primary-500/5'
                  : 'border-dash-surface-border bg-dash-surface-bg'
              }`}
            >
              {plan.popular && (
                <Badge variant="success" className="mb-2">Most Popular</Badge>
              )}
              <h3 className="text-lg font-semibold text-dash-text-primary">{plan.name}</h3>
              <div className="mt-2">
                {plan.price ? (
                  <p className="text-2xl font-bold text-dash-text-primary">
                    ${plan.price}<span className="text-sm font-normal text-dash-text-muted">/mo</span>
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-dash-text-primary">Custom</p>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-dash-text-secondary">
                    <svg className="w-4 h-4 text-dash-status-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                className="w-full mt-4"
              >
                {plan.price ? 'Upgrade' : 'Contact Sales'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Manage your payment method for subscription billing</CardDescription>
        <div className="mt-6">
          <div className="p-4 bg-dash-surface-bg rounded-lg border border-dash-surface-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-dash-text-primary">•••• •••• •••• 4242</p>
                <p className="text-sm text-dash-text-muted">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost">Update</Button>
          </div>
          <p className="text-sm text-dash-text-muted mt-3">
            No payment method required for the free tier. Add one when you upgrade.
          </p>
        </div>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>Download past invoices and receipts</CardDescription>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dash-surface-border">
                <th className="text-left py-3 text-sm font-medium text-dash-text-secondary">Invoice</th>
                <th className="text-left py-3 text-sm font-medium text-dash-text-secondary">Date</th>
                <th className="text-left py-3 text-sm font-medium text-dash-text-secondary">Amount</th>
                <th className="text-left py-3 text-sm font-medium text-dash-text-secondary">Status</th>
                <th className="text-right py-3 text-sm font-medium text-dash-text-secondary"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-surface-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="py-3">
                    <p className="font-medium text-dash-text-primary">{invoice.id}</p>
                    <p className="text-sm text-dash-text-muted">{invoice.description}</p>
                  </td>
                  <td className="py-3 text-dash-text-secondary">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-dash-text-primary font-medium">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <Badge variant="success">Paid</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
