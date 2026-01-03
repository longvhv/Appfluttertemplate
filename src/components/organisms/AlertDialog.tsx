import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

export type AlertDialogVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  variant?: AlertDialogVariant;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
}

const variantConfig = {
  info: {
    icon: Info,
    color: 'bg-blue-100 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    icon: CheckCircle,
    color: 'bg-green-100 dark:bg-green-950/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-yellow-100 dark:bg-yellow-950/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    icon: XCircle,
    color: 'bg-red-100 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
};

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true,
  danger = false,
  children,
}: AlertDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card dark:bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border dark:border-border overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-foreground font-medium mb-2">{title}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                  {children && (
                    <div className="mt-4">
                      {children}
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-muted dark:hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3 justify-end">
              {showCancel && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-muted dark:bg-muted text-foreground rounded-xl hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-6 py-2 text-white rounded-xl transition-colors ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confirmation Dialog shorthand
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      variant={danger ? 'warning' : 'info'}
      confirmText={danger ? 'Delete' : 'Confirm'}
      cancelText="Cancel"
      showCancel={true}
      danger={danger}
    />
  );
}
