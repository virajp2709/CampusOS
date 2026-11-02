import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/helpers';

/* ----------------------------- Types ----------------------------- */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

/* ----------------------------- Context ----------------------------- */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

/* ----------------------------- Provider ----------------------------- */

let toastCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastItem = {
      id,
      variant: options.variant || 'info',
      title: options.title,
      description: options.description,
      duration: options.duration ?? 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((t) => (
            <ToastNotification key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

/* ----------------------------- Toast Component ----------------------------- */

const variantConfig: Record<
  ToastVariant,
  { icon: ReactNode; bgClass: string; borderClass: string; iconColor: string }
> = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/20',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
};

interface ToastNotificationProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  item,
  onDismiss,
}) => {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = variantConfig[item.variant];

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(item.id), 200);
  }, [item.id, onDismiss]);

  useEffect(() => {
    if (item.duration && item.duration > 0) {
      timerRef.current = setTimeout(handleDismiss, item.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.duration, handleDismiss]);

  return (
    <div
      className={cn(
        'pointer-events-auto w-full rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/30',
        'flex items-start gap-3 px-4 py-3',
        'bg-campus-bg-card/90',
        config.borderClass,
        'transition-all duration-200',
        exiting
          ? 'opacity-0 translate-x-8 scale-95'
          : 'animate-in slide-in-from-right-5 fade-in duration-300'
      )}
      role="alert"
    >
      <span className={cn('shrink-0 mt-0.5', config.iconColor)}>
        {config.icon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-campus-text-primary">
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-campus-text-muted mt-0.5 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className={cn(
          'shrink-0 rounded-md p-1 text-campus-text-muted',
          'hover:text-campus-text-primary hover:bg-white/10',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-campus-primary/50'
        )}
        aria-label="Dismiss notification"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

ToastNotification.displayName = 'ToastNotification';
