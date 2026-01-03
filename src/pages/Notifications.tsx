import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { Spinner } from '../src/components/Spinner';
import { Skeleton } from '../src/components/Skeleton';
import { EmptyState } from '../src/components/EmptyState';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Checkbox } from '../src/components/Checkbox';
import { DropdownMenu } from '../src/components/DropdownMenu';
import { Pagination } from '../src/components/Pagination';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color: string;
}

export function Notifications() {
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to our platform!',
      message: 'Thank you for joining us. Get started by exploring the features.',
      time: '5m',
      isRead: false,
      icon: '👋',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: '2',
      title: 'New message received',
      message: 'You have a new message from the support team.',
      time: '15m',
      isRead: false,
      icon: '💬',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: '3',
      title: 'Account security update',
      message: 'We\'ve enhanced our security features to keep your account safe.',
      time: '1h',
      isRead: false,
      icon: '🔒',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '4',
      title: 'Weekly summary available',
      message: 'Check out your activity summary for this week.',
      time: '2h',
      isRead: true,
      icon: '📊',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      id: '5',
      title: 'System maintenance scheduled',
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM UTC.',
      time: '3h',
      isRead: true,
      icon: '⚙️',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: '6',
      title: 'New feature released',
      message: 'Check out our latest feature updates!',
      time: '4h',
      isRead: true,
      icon: '🚀',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: '7',
      title: 'Password changed',
      message: 'Your password was successfully updated.',
      time: '5h',
      isRead: true,
      icon: '🔑',
      color: 'from-cyan-500 to-blue-500',
    },
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
    success('Marked as read', 'Success');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    success('All notifications marked as read', 'Success');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    success('Notification deleted', 'Deleted');
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    success(`${selectedIds.length} notification(s) deleted`, 'Deleted');
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedNotifications.map(n => n.id));
    }
  };

  return (
    <div className="pb-20 bg-background">
      <PageHeader
        title={t('notifications.title')}
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : t('notifications.youreAllCaughtUp')}
        rightAction={
          unreadCount > 0 && !loading && (
            <button
              onClick={markAllAsRead}
              className="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {t('notifications.markAllRead')}
            </button>
          )
        }
      />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive">
        {/* Selection Actions */}
        {selectedIds.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-between"
          >
            <span className="text-sm text-foreground">
              {selectedIds.length} selected
            </span>
            <button
              onClick={deleteSelected}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Delete Selected
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 flex gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                  <Skeleton variant="text" width="70%" className="mb-2" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="40%" className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <EmptyState
            title="No Notifications"
            description="You're all caught up! Check back later for new notifications."
            icon="🔔"
          />
        ) : (
          <>
            {/* Bulk Actions */}
            {notifications.length > 0 && (
              <div className="mb-3 flex items-center gap-3">
                <Checkbox
                  checked={selectedIds.length === paginatedNotifications.length && paginatedNotifications.length > 0}
                  onChange={toggleSelectAll}
                  label="Select all"
                />
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
              <AnimatePresence>
                {paginatedNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl transition-all ${
                      notification.isRead
                        ? 'bg-card dark:bg-card border border-border dark:border-border'
                        : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <div className="card-padding flex gap-adaptive items-start">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <Checkbox
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => toggleSelection(notification.id)}
                        />
                      </div>

                      {/* Icon */}
                      <div
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                        className="cursor-pointer flex-1 flex gap-3"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${notification.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <span className="text-2xl">{notification.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-foreground">{notification.title}</p>
                            <span className="text-xs text-muted-foreground ml-2">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu
                        trigger={
                          <button className="p-2 hover:bg-muted rounded-lg">
                            <span className="text-lg">⋮</span>
                          </button>
                        }
                        items={[
                          {
                            label: notification.isRead ? 'Mark as unread' : 'Mark as read',
                            onClick: () => markAsRead(notification.id),
                          },
                          {
                            label: 'Delete',
                            onClick: () => deleteNotification(notification.id),
                            destructive: true,
                          },
                        ]}
                      />

                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showFirstLast
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />
    </div>
  );
}