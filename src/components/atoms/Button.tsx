import React, { useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700',
  secondary: 'bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80',
  outline: 'border-2 border-border dark:border-border text-foreground bg-transparent hover:bg-muted/50 dark:hover:bg-muted/50',
  ghost: 'text-foreground hover:bg-muted/50 dark:hover:bg-muted/50',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
  gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-adaptive-sm text-sm',
  lg: 'px-6 py-adaptive text-base',
  xl: 'px-8 py-adaptive-lg text-lg',
};

const iconSizeMap: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

// Memoized spinner component
const Spinner = React.memo(() => (
  <motion.div
    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
));

Spinner.displayName = 'Spinner';

export const Button = React.memo<ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const combinedClassName = useMemo(() => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;
  }, [variant, size, fullWidth, className]);

  const animationProps = useMemo(() => ({
    whileTap: !disabled && !loading ? { scale: 0.98 } : undefined,
    whileHover: !disabled && !loading ? { scale: 1.02 } : undefined,
  }), [disabled, loading]);

  const iconSize = useMemo(() => iconSizeMap[size], [size]);

  const handleClick = useCallback(() => {
    if (onClick && !disabled && !loading) {
      onClick();
    }
  }, [onClick, disabled, loading]);

  const renderIcon = useCallback((position: 'left' | 'right') => {
    if (!Icon || iconPosition !== position || loading) return null;
    return <Icon size={iconSize} />;
  }, [Icon, iconPosition, loading, iconSize]);

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...animationProps}
    >
      {loading && <Spinner />}
      {renderIcon('left')}
      {children}
      {renderIcon('right')}
    </motion.button>
  );
});

Button.displayName = 'Button';