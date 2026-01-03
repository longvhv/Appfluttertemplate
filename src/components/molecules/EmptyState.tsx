import React from 'react';
import { motion } from 'motion/react';
import { Inbox, Search, FileX, Users, AlertCircle, type LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

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
  variant?: 'default' | 'search' | 'error' | 'minimal';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: CustomIcon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className = '',
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return Search;
      case 'error':
        return AlertCircle;
      default:
        return Inbox;
    }
  };

  const Icon = CustomIcon || getDefaultIcon();

  const getIconColor = () => {
    switch (variant) {
      case 'error':
        return 'text-red-400';
      case 'search':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col items-center justify-center text-center p-12
        ${className}
      `}
    >
      {/* Icon */}
      {variant !== 'minimal' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-6
            ${variant === 'error'
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}
        >
          <Icon className={`w-10 h-10 ${getIconColor()}`} />
        </motion.div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              variant="primary"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Pre-built variants
export const EmptySearchState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState {...props} variant="search" />
);

export const EmptyErrorState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState {...props} variant="error" />
);

export const EmptyInboxState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState {...props} icon={Inbox} />
);

export const EmptyUsersState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState {...props} icon={Users} />
);

export const EmptyFilesState: React.FC<Omit<EmptyStateProps, 'variant' | 'icon'>> = (props) => (
  <EmptyState {...props} icon={FileX} />
);
