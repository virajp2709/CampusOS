import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightAction?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      helperText,
      leftIcon,
      rightIcon,
      rightAction,
      inputSize = 'md',
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-campus-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-campus-text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-field w-full rounded-xl border border-white/[0.08] bg-white/[0.04]',
              'text-campus-text-primary placeholder:text-campus-text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:border-campus-primary/50 focus:ring-2 focus:ring-campus-primary/20 focus:bg-white/[0.06]',
              'hover:border-white/[0.12] hover:bg-white/[0.05]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeStyles[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || rightAction) && 'pr-10',
              error &&
                'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {(rightIcon || rightAction) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-campus-text-muted">
              {rightAction || rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-400 flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {(hint || helperText) && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-campus-text-muted"
          >
            {hint || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
