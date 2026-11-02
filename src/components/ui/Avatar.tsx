import React, { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'offline' | 'busy';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  ring?: boolean;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const statusSizeStyles: Record<AvatarSize, string> = {
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-4 h-4 border-2',
};

const statusColorStyles: Record<AvatarStatus, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-gray-400',
  busy: 'bg-red-400',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  alt,
  size = 'md',
  status,
  ring = false,
  className,
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const initials = name ? getInitials(name) : '?';
  const label = alt || name || 'User avatar';

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          'bg-campus-primary/20 text-campus-primary font-semibold',
          sizeStyles[size],
          ring && 'ring-2 ring-campus-primary/40 ring-offset-2 ring-offset-campus-bg-primary'
        )}
        role="img"
        aria-label={label}
      >
        {showImage ? (
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            {...props}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-campus-bg-primary',
            statusSizeStyles[size],
            statusColorStyles[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
