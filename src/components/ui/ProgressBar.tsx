import React from 'react';
import { cn } from '@/utils/helpers';

export type ProgressBarColor = 'primary' | 'success' | 'warning' | 'danger';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: ProgressBarColor;
  variant?: ProgressBarColor | string;
  size?: ProgressBarSize;
  animated?: boolean;
  className?: string;
}

const colorStyles: Record<ProgressBarColor, string> = {
  primary: 'bg-campus-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const trackColorStyles: Record<ProgressBarColor, string> = {
  primary: 'bg-campus-primary/15',
  success: 'bg-emerald-500/15',
  warning: 'bg-amber-500/15',
  danger: 'bg-red-500/15',
};

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'primary',
  variant,
  size = 'md',
  animated = true,
  className,
}) => {
  const activeColor: ProgressBarColor = (variant as ProgressBarColor) || color || 'primary';
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-campus-text-secondary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-xs font-medium text-campus-text-muted tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          trackColorStyles[activeColor],
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full',
            colorStyles[activeColor],
            animated && 'transition-all duration-500 ease-out',
            size === 'lg' && 'relative overflow-hidden'
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect for large size */}
          {animated && size === 'lg' && percentage > 0 && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
