'use client'

import { Card, CardHeader, CardTitle } from '../ui/Card'
import Badge from '../ui/Badge'

interface Activity {
  id: string
  type: 'payment' | 'webhook' | 'customer' | 'api'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'pending' | 'failed'
}

interface ActivityFeedProps {
  activities: Activity[]
  title?: string
  showViewAll?: boolean
  onViewAll?: () => void
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  const icons = {
    payment: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    webhook: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    customer: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    api: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  }

  return icons[type]
}

export default function ActivityFeed({
  activities,
  title = 'Recent Activity',
  showViewAll = true,
  onViewAll,
}: ActivityFeedProps) {
  const getStatusVariant = (status?: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card padding="none">
      <div className="p-6 pb-4 flex items-center justify-between border-b border-dash-surface-border">
        <CardTitle>{title}</CardTitle>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-dash-primary-500 hover:text-dash-primary-600 font-medium"
          >
            View all
          </button>
        )}
      </div>

      <div className="divide-y divide-dash-surface-border">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-dash-text-muted text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-dash-surface-hover transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-dash-surface-bg flex items-center justify-center text-dash-text-secondary flex-shrink-0">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-dash-text-primary truncate">
                      {activity.title}
                    </p>
                    {activity.status && (
                      <Badge variant={getStatusVariant(activity.status)} size="sm">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-dash-text-secondary mt-0.5 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-dash-text-muted flex-shrink-0">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
