'use client'

import { useMode } from '../contexts/ModeContext'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import MetricCard from '../components/widgets/MetricCard'

export default function BalancesPage() {
  const { isTestMode } = useMode()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-text-primary">Balances</h1>
          <p className="text-dash-text-secondary mt-1">
            {isTestMode ? 'Test' : 'Live'} balance overview and payouts
          </p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request Payout
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Available Balance"
          value="$8,450.00"
          subtitle="ready for payout"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          }
        />
        <MetricCard
          title="Pending Balance"
          value="$4,000.00"
          subtitle="processing"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Total Payouts"
          value="$45,230.00"
          subtitle="all time"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          }
        />
      </div>

      {/* Payout Schedule */}
      <Card>
        <CardTitle>Payout Schedule</CardTitle>
        <CardDescription>Your funds will be paid out on the following schedule</CardDescription>
        <div className="mt-6 flex items-center gap-8">
          <div>
            <p className="text-dash-text-muted text-sm">Schedule</p>
            <p className="text-dash-text-primary font-medium mt-1">Daily</p>
          </div>
          <div>
            <p className="text-dash-text-muted text-sm">Next Payout</p>
            <p className="text-dash-text-primary font-medium mt-1">Jan 16, 2024</p>
          </div>
          <div>
            <p className="text-dash-text-muted text-sm">Bank Account</p>
            <p className="text-dash-text-primary font-medium mt-1">**** 4242</p>
          </div>
          <div className="flex-1" />
          <Button variant="secondary" size="sm">Change Schedule</Button>
        </div>
      </Card>

      {/* Recent Payouts */}
      <Card padding="none">
        <div className="p-6 border-b border-dash-surface-border flex items-center justify-between">
          <CardTitle>Recent Payouts</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-dash-surface-border">
          {[
            { id: 'po_001', amount: 2500, status: 'paid', date: 'Jan 15, 2024' },
            { id: 'po_002', amount: 1850, status: 'paid', date: 'Jan 14, 2024' },
            { id: 'po_003', amount: 3200, status: 'paid', date: 'Jan 13, 2024' },
            { id: 'po_004', amount: 4100, status: 'in_transit', date: 'Jan 12, 2024' },
          ].map((payout) => (
            <div key={payout.id} className="p-4 flex items-center justify-between hover:bg-dash-surface-hover transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dash-primary-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-dash-text-primary font-medium">${(payout.amount / 100 * 100).toFixed(2)}</p>
                  <p className="text-dash-text-muted text-sm">{payout.date}</p>
                </div>
              </div>
              <Badge variant={payout.status === 'paid' ? 'success' : 'warning'}>
                {payout.status === 'paid' ? 'Paid' : 'In Transit'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
