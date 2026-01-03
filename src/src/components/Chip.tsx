import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

export interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Chip({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onDelete,
  onClick,
  disabled = false,
  className = '',
}: ChipProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    primary: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    success: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Component
        onClick={onClick && !disabled ? onClick : undefined}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          ${sizes[size]}
          ${variants[variant]}
          border rounded-full font-medium
          ${onClick && !disabled ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {icon && <span className={`flex-shrink-0 ${iconSizes[size]}`}>{icon}</span>}
        <span className="truncate">{label}</span>
        {onDelete && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`
              flex-shrink-0 ml-1 -mr-1
              hover:bg-black/10 dark:hover:bg-white/10
              rounded-full p-0.5 transition-colors
            `}
          >
            <X className={iconSizes[size]} />
          </button>
        )}
      </Component>
    </motion.div>
  );
}

// ChipGroup
export interface ChipGroupProps {
  children: React.ReactNode;
  max?: number;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChipGroup({
  children,
  max,
  spacing = 'md',
  className = '',
}: ChipGroupProps) {
  const spacings = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const childArray = React.Children.toArray(children);
  const displayChildren = max ? childArray.slice(0, max) : childArray;
  const remainingCount = max ? childArray.length - max : 0;

  return (
    <div className={`flex flex-wrap items-center ${spacings[spacing]} ${className}`}>
      {displayChildren}
      {remainingCount > 0 && (
        <Chip
          label={`+${remainingCount}`}
          variant="default"
          size="sm"
        />
      )}
    </div>
  );
}
