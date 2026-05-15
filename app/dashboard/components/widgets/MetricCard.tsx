'use client'

import { Card } from '../ui/Card'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

const TrendIcon = ({ isPositive }: { isPositive: boolean }) => (
  <svg
    className={`w-3 h-3 ${isPositive ? 'text-dash-status-success' : 'text-dash-status-error'}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {isPositive ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    )}
  </svg>
)

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dash-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-dash-text-primary mt-2">{value}</p>

          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  trend.isPositive ? 'text-dash-status-success' : 'text-dash-status-error'
                }`}
              >
                <TrendIcon isPositive={trend.isPositive} />
                {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-dash-text-muted">{subtitle}</span>
            )}
          </div>
        </div>

        {icon && (
          <div className="w-10 h-10 rounded-lg bg-dash-primary-500/10 flex items-center justify-center text-dash-primary-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
