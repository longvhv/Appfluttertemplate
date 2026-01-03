import React from 'react';
import { LucideIcon, Inbox, Search, FileX, AlertCircle, Package } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const defaultIcons = {
  default: Inbox,
  search: Search,
  error: AlertCircle,
  custom: Package,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const Icon = icon || defaultIcons[variant];

  const sizeConfig = {
    sm: {
      icon: 32,
      title: 'text-base',
      description: 'text-sm',
      button: 'text-sm px-3 py-1.5',
      spacing: 'gap-2',
    },
    md: {
      icon: 48,
      title: 'text-lg',
      description: 'text-base',
      button: 'text-base px-4 py-2',
      spacing: 'gap-4',
    },
    lg: {
      icon: 64,
      title: 'text-xl',
      description: 'text-lg',
      button: 'text-lg px-6 py-3',
      spacing: 'gap-6',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className={`flex flex-col items-center ${config.spacing}`}>
        {/* Icon */}
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Icon
            size={config.icon}
            className="text-gray-400 dark:text-gray-600"
            strokeWidth={1.5}
          />
        </div>

        {/* Content */}
        <div className={`flex flex-col ${config.spacing === 'gap-2' ? 'gap-1' : 'gap-2'}`}>
          <h3 className={`font-semibold text-gray-900 dark:text-white ${config.title}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-gray-600 dark:text-gray-400 max-w-md ${config.description}`}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {action && (
              <button
                onClick={action.onClick}
                className={`
                  ${config.button}
                  bg-blue-600 hover:bg-blue-700 text-white
                  rounded-lg font-medium
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                `}
              >
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={`
                  ${config.button}
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-300
                  border border-gray-300 dark:border-gray-600
                  rounded-lg font-medium
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                `}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Preset Empty States
export function EmptyInbox({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="default"
      icon={Inbox}
      title="No messages"
      description="Your inbox is empty. Start a conversation to see messages here."
      action={onAction ? { label: 'New Message', onClick: onAction } : undefined}
    />
  );
}

export function EmptySearchResults({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      variant="search"
      icon={Search}
      title="No results found"
      description="We couldn't find anything matching your search. Try different keywords."
      action={onClear ? { label: 'Clear Search', onClick: onClear } : undefined}
    />
  );
}

export function EmptyList({ title, description, onCreate }: {
  title: string;
  description: string;
  onCreate?: () => void;
}) {
  return (
    <EmptyState
      variant="default"
      icon={FileX}
      title={title}
      description={description}
      action={onCreate ? { label: 'Create New', onClick: onCreate } : undefined}
    />
  );
}

export function ErrorState({ title, description, onRetry }: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      icon={AlertCircle}
      title={title || 'Something went wrong'}
      description={description || 'An error occurred while loading this content. Please try again.'}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
}
