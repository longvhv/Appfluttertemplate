import React from 'react';
import { X, Info, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface NotificationBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  closable?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const styles = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
    button: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
    button: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
    button: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
    button: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
  },
};

export function NotificationBanner({
  type = 'info',
  title,
  message,
  onClose,
  action,
  closable = true,
  icon,
  className = '',
}: NotificationBannerProps) {
  const Icon = icon ? () => <>{icon}</> : icons[type];
  const style = styles[type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${style.bg} ${style.border}
        ${className}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold mb-1 ${style.text}`}>{title}</p>
        )}
        <p className={`text-sm ${style.text} opacity-90`}>{message}</p>

        {action && (
          <button
            onClick={action.onClick}
            className={`mt-2 text-sm font-medium ${style.button} underline`}
          >
            {action.label}
          </button>
        )}
      </div>

      {closable && onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0 ${style.icon}`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
