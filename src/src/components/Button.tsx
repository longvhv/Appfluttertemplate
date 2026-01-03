import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'link' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: `
      bg-indigo-600 hover:bg-indigo-700 
      dark:bg-indigo-500 dark:hover:bg-indigo-600
      text-white border-transparent
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-600 hover:bg-gray-700
      dark:bg-gray-500 dark:hover:bg-gray-600
      text-white border-transparent
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent hover:bg-gray-50
      dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-300
      border-gray-300 dark:border-gray-600
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-300
      border-transparent
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      dark:bg-red-500 dark:hover:bg-red-600
      text-white border-transparent
      shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 hover:bg-green-700
      dark:bg-green-500 dark:hover:bg-green-600
      text-white border-transparent
      shadow-sm hover:shadow-md
    `,
    link: `
      bg-transparent hover:bg-transparent
      text-indigo-600 dark:text-indigo-400
      border-transparent
      underline-offset-4 hover:underline
      p-0
    `,
    gradient: `
      bg-gradient-to-r from-indigo-600 to-purple-600
      hover:from-indigo-700 hover:to-purple-700
      dark:from-indigo-500 dark:to-purple-500
      dark:hover:from-indigo-600 dark:hover:to-purple-600
      text-white border-transparent
      shadow-md hover:shadow-lg
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-5 py-3 text-lg gap-2.5',
    xl: 'px-6 py-4 text-xl gap-3',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={`
        inline-flex items-center justify-center
        ${variant !== 'link' ? sizes[size] : ''}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        border
        rounded-lg
        font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-indigo-500 dark:focus:ring-offset-gray-900
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      )}
      {!loading && leftIcon && (
        <span className={iconSizes[size]}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </motion.button>
  );
}

// ButtonGroup - for grouping buttons
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  attached?: boolean;
  className?: string;
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  attached = false,
  className = '',
}: ButtonGroupProps) {
  const spacings = {
    none: '',
    sm: orientation === 'horizontal' ? 'gap-1' : 'gap-1',
    md: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
    lg: orientation === 'horizontal' ? 'gap-4' : 'gap-4',
  };

  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  if (attached) {
    return (
      <div
        className={`
          inline-flex
          ${orientationStyles[orientation]}
          [&>button]:rounded-none
          [&>button:first-child]:rounded-l-lg
          [&>button:last-child]:rounded-r-lg
          [&>button:not(:first-child)]:border-l-0
          ${className}
        `}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`
        inline-flex
        ${orientationStyles[orientation]}
        ${spacings[spacing]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
