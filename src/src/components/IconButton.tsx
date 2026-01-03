import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel: string;
  tooltip?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      onClick,
      variant = 'default',
      size = 'md',
      disabled = false,
      loading = false,
      className = '',
      ariaLabel,
      tooltip,
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 18,
      lg: 20,
      xl: 24,
    };

    const variantClasses = {
      default: `
      bg-white dark:bg-gray-800 
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-300
      hover:bg-gray-50 dark:hover:bg-gray-700
      active:bg-gray-100 dark:active:bg-gray-600
    `,
      primary: `
      bg-blue-600 dark:bg-blue-500
      text-white
      hover:bg-blue-700 dark:hover:bg-blue-600
      active:bg-blue-800 dark:active:bg-blue-700
      shadow-sm
    `,
      secondary: `
      bg-gray-100 dark:bg-gray-700
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-600
      active:bg-gray-300 dark:active:bg-gray-500
    `,
      ghost: `
      bg-transparent
      text-gray-600 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800
      active:bg-gray-200 dark:active:bg-gray-700
    `,
      danger: `
      bg-red-600 dark:bg-red-500
      text-white
      hover:bg-red-700 dark:hover:bg-red-600
      active:bg-red-800 dark:active:bg-red-700
      shadow-sm
    `,
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
        inline-flex items-center justify-center
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        type="button"
      >
        {loading ? (
          <div className="animate-spin">
            <Icon size={iconSizes[size]} />
          </div>
        ) : (
          <Icon size={iconSizes[size]} />
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Icon Button Group
export interface IconButtonGroupProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconButtonGroup({
  children,
  spacing = 'sm',
  className = '',
}: IconButtonGroupProps) {
  const spacingClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div className={`inline-flex items-center ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
}