import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted dark:bg-muted text-foreground',
  primary: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  warning: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  error: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-muted-foreground',
  primary: 'bg-indigo-500',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
