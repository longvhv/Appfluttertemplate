import React from 'react';
import { X } from 'lucide-react';

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  avatar?: string;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  primary: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
  success: 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300',
  error: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
};

const sizeStyles: Record<ChipSize, { container: string; text: string; icon: string }> = {
  sm: {
    container: 'h-6 px-2 gap-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'h-8 px-3 gap-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'h-10 px-4 gap-2',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
};

export function Chip({
  label,
  variant = 'default',
  size = 'md',
  onRemove,
  icon: Icon,
  avatar,
  clickable = false,
  onClick,
  className = '',
}: ChipProps) {
  const styles = sizeStyles[size];
  const isClickable = clickable || !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`
        inline-flex items-center rounded-full
        ${styles.container} ${styles.text}
        ${variantStyles[variant]}
        ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {avatar && (
        <img
          src={avatar}
          alt=""
          className={`rounded-full ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}`}
        />
      )}
      {Icon && <Icon className={styles.icon} />}
      <span className="font-medium">{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            rounded-full hover:bg-black/10 dark:hover:bg-white/10 
            transition-colors
            ${size === 'sm' ? 'p-0.5' : 'p-1'}
          `}
        >
          <X className={styles.icon} />
        </button>
      )}
    </div>
  );
}

// Chip Group for managing multiple chips
export interface ChipGroupProps {
  chips: Array<{
    id: string | number;
    label: string;
    variant?: ChipVariant;
  }>;
  onRemove?: (id: string | number) => void;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
}

export function ChipGroup({
  chips,
  onRemove,
  variant,
  size = 'md',
  className = '',
}: ChipGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          variant={chip.variant || variant}
          size={size}
          onRemove={onRemove ? () => onRemove(chip.id) : undefined}
        />
      ))}
    </div>
  );
}
