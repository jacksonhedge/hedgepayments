'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-dash-surface-bg text-dash-text-secondary border border-dash-surface-border',
      success: 'bg-dash-status-success/10 text-dash-status-success border border-dash-status-success/20',
      warning: 'bg-dash-status-warning/10 text-dash-status-warning border border-dash-status-warning/20',
      error: 'bg-dash-status-error/10 text-dash-status-error border border-dash-status-error/20',
      info: 'bg-dash-status-info/10 text-dash-status-info border border-dash-status-info/20',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
