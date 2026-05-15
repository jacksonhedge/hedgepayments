'use client';

import { ReactNode } from 'react';

type CalloutVariant = 'info' | 'success' | 'warning' | 'danger';

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantStyles: Record<CalloutVariant, {
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
}> = {
  info: {
    border: 'border-l-[#2563EB]',
    bg: 'bg-[#2563EB]/[0.04]',
    iconBg: 'bg-[#2563EB]/10',
    iconColor: 'text-[#2563EB]',
    titleColor: 'text-[#2563EB]',
  },
  success: {
    border: 'border-l-[#4CAF50]',
    bg: 'bg-[#4CAF50]/[0.04]',
    iconBg: 'bg-[#4CAF50]/10',
    iconColor: 'text-[#4CAF50]',
    titleColor: 'text-[#4CAF50]',
  },
  warning: {
    border: 'border-l-[#F59E0B]',
    bg: 'bg-[#F59E0B]/[0.04]',
    iconBg: 'bg-[#F59E0B]/10',
    iconColor: 'text-[#F59E0B]',
    titleColor: 'text-[#B45309]',
  },
  danger: {
    border: 'border-l-[#EF4444]',
    bg: 'bg-[#EF4444]/[0.04]',
    iconBg: 'bg-[#EF4444]/10',
    iconColor: 'text-[#EF4444]',
    titleColor: 'text-[#EF4444]',
  },
};

const icons: Record<CalloutVariant, ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 10 11 15 8 12" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export default function Callout({ variant, title, children }: CalloutProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} border-l-4 border border-transparent rounded-r-lg px-4 py-3.5 my-4`}
      role={variant === 'danger' || variant === 'warning' ? 'alert' : 'note'}
      aria-label={title || `${variant} callout`}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconColor}`}>
          {icons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold text-sm mb-1 ${styles.titleColor}`} style={{ fontFamily: 'Georgia, serif' }}>
              {title}
            </p>
          )}
          <div className="text-[#6B5D4F] text-sm leading-relaxed [&>p]:mb-1.5 [&>p:last-child]:mb-0" style={{ fontFamily: 'Georgia, serif' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
