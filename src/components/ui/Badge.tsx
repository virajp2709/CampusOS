import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'default';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-campus-primary/15 text-campus-primary border-campus-primary/20',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  default: 'bg-white/10 text-campus-text-secondary border-white/10',
};

const dotStyles: Record<BadgeVariant, string> = {
  primary: 'bg-campus-primary',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  default: 'bg-campus-text-muted',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  onClose,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-xs font-medium transition-colors duration-150',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])}
          aria-hidden="true"
        />
      )}

      {children}

      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            'ml-0.5 -mr-1 rounded-full p-0.5',
            'hover:bg-white/10 transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current'
          )}
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';
