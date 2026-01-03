import React, { useState } from 'react';
import { Bell, Check, Trash2, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../atoms/Badge';

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  avatar?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string | number) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string | number) => void;
  onClearAll?: () => void;
  maxHeight?: string;
}

export function NotificationCenter({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  maxHeight = '600px',
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getTypeColor = (type: Notification['type']) => {
    const colors = {
      info: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
      success: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
      warning: 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
      error: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
    };
    return colors[type];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted dark:hover:bg-muted rounded-xl transition-colors"
      >
        <Bell className="w-6 h-6 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-96 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-2xl z-50"
              style={{ maxHeight }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border dark:border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`
                      flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${filter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80'
                      }
                    `}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`
                      flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${filter === 'unread'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80'
                      }
                    `}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(600px - 180px)' }}>
                {filteredNotifications.length > 0 ? (
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`
                          relative p-4 border-b border-border dark:border-border
                          hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors
                          ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''}
                        `}
                      >
                        <div className="flex gap-3">
                          {/* Avatar/Icon */}
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <img
                                src={notification.avatar}
                                alt=""
                                className="w-10 h-10 rounded-full"
                              />
                            ) : notification.icon ? (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                                <notification.icon className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                                <Bell className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              onNotificationClick?.(notification);
                              if (!notification.read) {
                                onMarkAsRead?.(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-foreground text-sm">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>

                            {/* Action Button */}
                            {notification.actionLabel && notification.onAction && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.onAction?.();
                                }}
                                className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                {notification.actionLabel}
                              </button>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead?.(notification.id)}
                                className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-muted-foreground" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(notification.id)}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="p-3 border-t border-border dark:border-border flex gap-2">
                  {unreadCount > 0 && onMarkAllAsRead && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                  {onClearAll && (
                    <button
                      onClick={onClearAll}
                      className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
