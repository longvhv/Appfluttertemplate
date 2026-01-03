import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';

export interface FABAction {
  id: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color?: string;
}

export interface FloatingActionButtonProps {
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
  className?: string;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const sizeClasses = {
  sm: {
    button: 'w-12 h-12',
    icon: 'w-5 h-5',
    actionButton: 'w-10 h-10',
    actionIcon: 'w-4 h-4',
  },
  md: {
    button: 'w-14 h-14',
    icon: 'w-6 h-6',
    actionButton: 'w-12 h-12',
    actionIcon: 'w-5 h-5',
  },
  lg: {
    button: 'w-16 h-16',
    icon: 'w-7 h-7',
    actionButton: 'w-14 h-14',
    actionIcon: 'w-6 h-6',
  },
};

export function FloatingActionButton({
  icon: Icon = Plus,
  onClick,
  actions,
  position = 'bottom-right',
  size = 'md',
  color = 'bg-indigo-600 hover:bg-indigo-700',
  label,
  className = '',
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = sizeClasses[size];
  const hasActions = actions && actions.length > 0;

  const handleMainClick = () => {
    if (hasActions) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && hasActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
        {/* Speed Dial Actions */}
        <AnimatePresence>
          {isOpen && hasActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-full mb-4 right-0 flex flex-col gap-3"
            >
              {actions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    {/* Label */}
                    <span className="bg-card dark:bg-card px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-foreground whitespace-nowrap">
                      {action.label}
                    </span>

                    {/* Action Button */}
                    <button
                      onClick={() => handleActionClick(action)}
                      className={`
                        ${styles.actionButton} rounded-full
                        ${action.color || 'bg-white dark:bg-gray-800'}
                        shadow-lg
                        flex items-center justify-center
                        hover:scale-110 transition-transform
                      `}
                    >
                      <ActionIcon className={`${styles.actionIcon} text-gray-700 dark:text-gray-200`} />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={handleMainClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            ${styles.button} rounded-full ${color} text-white
            shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2
            transition-all
            ${label ? 'px-6 w-auto' : ''}
          `}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {hasActions && isOpen ? (
              <X className={styles.icon} />
            ) : (
              <Icon className={styles.icon} />
            )}
          </motion.div>
          {label && <span className="font-medium">{label}</span>}
        </motion.button>
      </div>
    </>
  );
}

// Simple FAB without speed dial
export function SimpleFAB({
  icon: Icon = Plus,
  onClick,
  position = 'bottom-right',
  size = 'md',
  color = 'bg-indigo-600 hover:bg-indigo-700',
  tooltip,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  tooltip?: string;
}) {
  const styles = sizeClasses[size];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={tooltip}
      className={`
        fixed ${positionClasses[position]} z-50
        ${styles.button} rounded-full ${color} text-white
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-shadow
      `}
    >
      <Icon className={styles.icon} />
    </motion.button>
  );
}

// Extended FAB with label
export function ExtendedFAB({
  icon: Icon,
  label,
  onClick,
  position = 'bottom-right',
  color = 'bg-indigo-600 hover:bg-indigo-700',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        fixed ${positionClasses[position]} z-50
        h-14 px-6 rounded-full ${color} text-white
        shadow-lg hover:shadow-xl
        flex items-center gap-3
        transition-shadow
      `}
    >
      <Icon className="w-6 h-6" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}
