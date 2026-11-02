import React, { useCallback, type HTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

export interface ToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const trackSizes = {
  sm: 'w-8 h-[18px]',
  md: 'w-11 h-6',
};

const thumbSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
};

const thumbTranslate = {
  sm: 'translate-x-[14px]',
  md: 'translate-x-5',
};

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
  id,
  ...props
}) => {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <button
        id={toggleId}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-campus-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          trackSizes[size],
          checked ? 'bg-campus-primary' : 'bg-white/15'
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg',
            'transform transition-transform duration-200 ease-in-out',
            thumbSizes[size],
            checked ? thumbTranslate[size] : 'translate-x-0'
          )}
          aria-hidden="true"
        />
      </button>

      {label && (
        <label
          htmlFor={toggleId}
          className={cn(
            'text-sm text-campus-text-secondary cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Toggle.displayName = 'Toggle';
