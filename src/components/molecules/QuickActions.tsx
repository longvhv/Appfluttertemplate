import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X } from 'lucide-react';

export interface QuickAction {
  id: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color?: string;
  shortcut?: string;
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  trigger?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  gridColumns?: 2 | 3 | 4;
  className?: string;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export function QuickActions({
  actions,
  trigger,
  position = 'bottom-right',
  gridColumns = 3,
  className = '',
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleActionClick = (action: QuickAction) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            fixed ${positionClasses[position]} z-50
            w-14 h-14 rounded-full
            bg-indigo-600 hover:bg-indigo-700 text-white
            shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all
            ${isOpen ? 'rotate-45' : ''}
            ${className}
          `}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Zap className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Actions Grid */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Actions Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`
                fixed ${position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : positionClasses[position]}
                z-50 bg-card dark:bg-card border border-border dark:border-border
                rounded-2xl p-6 shadow-2xl
                ${position.includes('bottom') ? 'mb-20' : ''}
                ${position.includes('top') ? 'mt-20' : ''}
              `}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>

              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                }}
              >
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleActionClick(action)}
                      disabled={action.disabled}
                      className={`
                        relative group flex flex-col items-center gap-3 p-4
                        rounded-xl border-2 border-border dark:border-border
                        hover:border-indigo-600 dark:hover:border-indigo-600
                        transition-all
                        ${action.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20'
                        }
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          transition-colors
                          ${action.color || 'bg-indigo-100 dark:bg-indigo-950/30'}
                        `}
                      >
                        <Icon
                          className={`
                            w-6 h-6
                            ${action.color
                              ? 'text-white'
                              : 'text-indigo-600 dark:text-indigo-400'
                            }
                          `}
                        />
                      </div>

                      {/* Label */}
                      <span className="text-sm font-medium text-foreground text-center">
                        {action.label}
                      </span>

                      {/* Keyboard Shortcut */}
                      {action.shortcut && (
                        <span className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted dark:bg-muted px-1.5 py-0.5 rounded">
                          {action.shortcut}
                        </span>
                      )}

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Radial Menu variant
export function RadialMenu({
  actions,
  radius = 120,
}: {
  actions: QuickAction[];
  radius?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getPosition = (index: number, total: number) => {
    const angle = (360 / total) * index - 90;
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  };

  return (
    <>
      {/* Center Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all"
      >
        <Zap className="w-6 h-6" />
      </button>

      {/* Radial Actions */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {actions.map((action, index) => {
              const Icon = action.icon;
              const pos = getPosition(index, actions.length);
              
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    delay: index * 0.05,
                  }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  title={action.label}
                >
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
