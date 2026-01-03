import React from 'react';
import { motion } from 'motion/react';

export interface BadgeProps {
  children?: React.ReactNode;
  content?: string | number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  max?: number;
  showZero?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  invisible?: boolean;
  className?: string;
}

export function Badge({
  children,
  content,
  variant = 'primary',
  size = 'md',
  dot = false,
  max = 99,
  showZero = false,
  position = 'top-right',
  invisible = false,
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    primary: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    success: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  const sizes = {
    sm: dot ? 'w-2 h-2' : 'min-w-[16px] h-4 px-1 text-xs',
    md: dot ? 'w-2.5 h-2.5' : 'min-w-[20px] h-5 px-1.5 text-xs',
    lg: dot ? 'w-3 h-3' : 'min-w-[24px] h-6 px-2 text-sm',
  };

  const positions = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  };

  const displayContent = () => {
    if (dot) return null;
    if (content === undefined) return null;
    if (typeof content === 'number') {
      if (content === 0 && !showZero) return null;
      return content > max ? `${max}+` : content;
    }
    return content;
  };

  const shouldShowBadge = () => {
    if (invisible) return false;
    if (dot) return true;
    const display = displayContent();
    return display !== null && display !== undefined;
  };

  // Standalone badge (no children)
  if (!children) {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`
          inline-flex items-center justify-center
          ${sizes[size]}
          ${variants[variant]}
          ${dot ? 'rounded-full' : 'rounded-full'}
          border font-semibold
          ${className}
        `}
      >
        {displayContent()}
      </motion.span>
    );
  }

  // Badge with children (positioned)
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {shouldShowBadge() && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute
            ${positions[position]}
            inline-flex items-center justify-center
            ${sizes[size]}
            ${variants[variant]}
            rounded-full
            ${dot ? '' : 'border-2 border-white dark:border-gray-900'}
            font-semibold
          `}
        >
          {displayContent()}
        </motion.span>
      )}
    </div>
  );
}

// StatusBadge - for status indicators
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  withLabel?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  withLabel = false,
  className = '',
}: StatusBadgeProps) {
  const statuses = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
    },
    offline: {
      color: 'bg-gray-400',
      label: 'Offline',
    },
    away: {
      color: 'bg-yellow-500',
      label: 'Away',
    },
    busy: {
      color: 'bg-red-500',
      label: 'Busy',
    },
    idle: {
      color: 'bg-orange-500',
      label: 'Idle',
    },
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const config = statuses[status];

  if (withLabel) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`${sizes[size]} ${config.color} rounded-full`} />
        <span className={`${textSizes[size]} text-gray-700 dark:text-gray-300`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`
        ${sizes[size]}
        ${config.color}
        rounded-full
        ${className}
      `}
    />
  );
}
