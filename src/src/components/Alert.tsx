import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  LucideIcon,
} from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode | false;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  description,
  children,
  icon,
  onClose,
  action,
  className = '',
}: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-200',
      description: 'text-blue-700 dark:text-blue-300',
      defaultIcon: Info,
    },
    success: {
      container: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-200',
      description: 'text-green-700 dark:text-green-300',
      defaultIcon: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-900 dark:text-yellow-200',
      description: 'text-yellow-700 dark:text-yellow-300',
      defaultIcon: AlertTriangle,
    },
    error: {
      container: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-200',
      description: 'text-red-700 dark:text-red-300',
      defaultIcon: AlertCircle,
    },
  };

  const config = variants[variant];
  const IconComponent = config.defaultIcon;

  const renderIcon = () => {
    if (icon === false) return null;
    if (icon) return <div className={`flex-shrink-0 ${config.icon}`}>{icon}</div>;
    return (
      <div className={`flex-shrink-0 ${config.icon}`}>
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        p-4 rounded-lg border
        ${config.container}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {renderIcon()}

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold ${config.title} mb-1`}>{title}</h3>
          )}
          {description && (
            <p className={`text-sm ${config.description}`}>{description}</p>
          )}
          {children && (
            <div className={`text-sm ${config.description} mt-2`}>{children}</div>
          )}
        </div>

        <div className="flex items-start gap-2 flex-shrink-0">
          {action && <div>{action}</div>}
          {onClose && (
            <button
              onClick={onClose}
              className={`
                p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10
                transition-colors
                ${config.icon}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// AlertTitle - for custom layouts
export interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertTitle({ children, className = '' }: AlertTitleProps) {
  return (
    <h3 className={`font-semibold mb-1 ${className}`}>{children}</h3>
  );
}

// AlertDescription - for custom layouts
export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return (
    <p className={`text-sm ${className}`}>{children}</p>
  );
}
