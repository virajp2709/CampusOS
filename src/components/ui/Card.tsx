import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: {
    title: string;
    action?: ReactNode;
  };
  footer?: ReactNode;
  padding?: CardPadding;
  hoverable?: boolean;
  glow?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

const headerPaddingStyles: Record<CardPadding, string> = {
  none: 'px-0 pt-0',
  sm: 'px-3 pt-3',
  md: 'px-5 pt-5',
  lg: 'px-7 pt-7',
};

const footerPaddingStyles: Record<CardPadding, string> = {
  none: 'px-0 pb-0',
  sm: 'px-3 pb-3',
  md: 'px-5 pb-5',
  lg: 'px-7 pb-7',
};

export const Card: React.FC<CardProps> = ({
  header,
  footer,
  padding = 'md',
  hoverable = false,
  glow = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl border border-white/[0.06] transition-all duration-300',
        'bg-campus-bg-card/80 backdrop-blur-xl',
        hoverable && [
          'hover:border-white/10 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20',
          'cursor-pointer',
        ],
        glow && 'hover:shadow-campus-primary/10 hover:border-campus-primary/20',
        className
      )}
      {...props}
    >
      {header && (
        <div
          className={cn(
            'flex items-center justify-between',
            headerPaddingStyles[padding],
            'pb-0'
          )}
        >
          <h3 className="text-base font-semibold text-campus-text-primary">
            {header.title}
          </h3>
          {header.action && <div className="shrink-0">{header.action}</div>}
        </div>
      )}

      <div className={cn(paddingStyles[padding])}>{children}</div>

      {footer && (
        <div
          className={cn(
            'border-t border-white/[0.06]',
            footerPaddingStyles[padding],
            'pt-3'
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

Card.displayName = 'Card';
