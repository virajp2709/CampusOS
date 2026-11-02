import React, { type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-campus-text-muted opacity-50">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-campus-text-primary mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-campus-text-muted max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
