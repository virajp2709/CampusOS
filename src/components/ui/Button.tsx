import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-campus-primary text-white hover:bg-campus-primary/90 active:bg-campus-primary/80 shadow-lg shadow-campus-primary/25 hover:shadow-campus-primary/40',
  secondary:
    'bg-white/10 text-campus-text-primary border border-white/10 hover:bg-white/15 active:bg-white/20 hover:border-white/20',
  ghost:
    'bg-transparent text-campus-text-secondary hover:text-campus-text-primary hover:bg-white/5 active:bg-white/10',
  danger:
    'bg-red-500/90 text-white hover:bg-red-500 active:bg-red-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

const iconSizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isBtnLoading = isLoading ?? loading;
    const isDisabled = disabled || isBtnLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-campus-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isBtnLoading && (
          <Spinner size={iconSizeMap[size]} className="absolute" />
        )}
        <span
          className={cn(
            'inline-flex items-center justify-center gap-inherit',
            isBtnLoading && 'invisible'
          )}
          style={{ gap: 'inherit' }}
        >
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
