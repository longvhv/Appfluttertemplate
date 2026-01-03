import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps {
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: 'bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80',
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-card dark:bg-card text-foreground border-2 border-border dark:border-border hover:bg-muted/50 dark:hover:bg-muted/50',
  ghost: 'text-foreground hover:bg-muted/50 dark:hover:bg-muted/50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeStyles: Record<IconButtonSize, { button: string; icon: number }> = {
  sm: { button: 'w-8 h-8', icon: 16 },
  md: { button: 'w-10 h-10', icon: 20 },
  lg: { button: 'w-12 h-12', icon: 24 },
  xl: { button: 'w-14 h-14', icon: 28 },
};

export function IconButton({
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  tooltip,
  className = '',
}: IconButtonProps) {
  const { button, icon } = sizeStyles[size];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      className={`
        ${button}
        inline-flex items-center justify-center rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
    >
      {loading ? (
        <motion.div
          className="border-2 border-current border-t-transparent rounded-full"
          style={{ width: icon * 0.6, height: icon * 0.6 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <Icon size={icon} />
      )}
    </motion.button>
  );
}
