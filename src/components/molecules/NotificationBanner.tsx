import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';
export type BannerPosition = 'top' | 'bottom';

export interface NotificationBannerProps {
  message: string;
  variant?: BannerVariant;
  position?: BannerPosition;
  isOpen: boolean;
  onClose?: () => void;
  closeable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: number; // milliseconds
  className?: string;
}

const variantConfig = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
    text: 'text-blue-900 dark:text-blue-100',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
    text: 'text-green-900 dark:text-green-100',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900',
    text: 'text-yellow-900 dark:text-yellow-100',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
    text: 'text-red-900 dark:text-red-100',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
};

export function NotificationBanner({
  message,
  variant = 'info',
  position = 'top',
  isOpen,
  onClose,
  closeable = true,
  action,
  autoClose,
  className = '',
}: NotificationBannerProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50
            ${className}
          `}
        >
          <div className={`border-b ${config.bg}`}>
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
                  <p className={`text-sm font-medium ${config.text}`}>{message}</p>
                </div>

                <div className="flex items-center gap-3">
                  {action && (
                    <button
                      onClick={action.onClick}
                      className={`text-sm font-medium underline ${config.text} hover:opacity-80 transition-opacity`}
                    >
                      {action.label}
                    </button>
                  )}

                  {closeable && onClose && (
                    <button
                      onClick={onClose}
                      className={`p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${config.iconColor}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Cookie Banner
export interface CookieBannerProps {
  onAccept: () => void;
  onDecline?: () => void;
  message?: string;
  acceptLabel?: string;
  declineLabel?: string;
}

export function CookieBanner({
  onAccept,
  onDecline,
  message = 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    if (onDecline) {
      onDecline();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card dark:bg-card border-t border-border dark:border-border shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-sm text-foreground flex-1">{message}</p>
              <div className="flex gap-3">
                {onDecline && (
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm bg-muted dark:bg-muted text-foreground rounded-lg hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors"
                  >
                    {declineLabel}
                  </button>
                )}
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {acceptLabel}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Update Banner (for app updates)
export interface UpdateBannerProps {
  version: string;
  onUpdate: () => void;
  onDismiss?: () => void;
  releaseNotes?: string;
}

export function UpdateBanner({
  version,
  onUpdate,
  onDismiss,
  releaseNotes,
}: UpdateBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleUpdate = () => {
    setIsVisible(false);
    onUpdate();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    New version {version} available!
                  </p>
                  {releaseNotes && (
                    <p className="text-xs text-white/80">{releaseNotes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm bg-white text-indigo-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
                >
                  Update Now
                </button>
                {onDismiss && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
