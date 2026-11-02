import React from 'react';
import { cn } from '@/utils/helpers';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const labelSizes: Record<SpinnerSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label,
  className,
}) => {
  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center gap-2', className)}
      role="status"
      aria-label={label || 'Loading'}
    >
      <div
        className={cn(
          'rounded-full border-campus-primary/30 border-t-campus-primary animate-spin',
          sizeStyles[size]
        )}
      />
      {label && (
        <span className={cn('text-campus-text-muted', labelSizes[size])}>
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';
