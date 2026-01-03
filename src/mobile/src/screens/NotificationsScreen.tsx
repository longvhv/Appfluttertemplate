import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Check, CheckCircle, X, Settings, Trash2 } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import Card from '../components/molecules/Card';
import SegmentedControl from '../components/molecules/SegmentedControl';
import Timeline from '../components/molecules/Timeline';
import ToggleGroup from '../components/molecules/ToggleGroup';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import Divider from '../components/atoms/Divider';
import { Skeleton, SkeletonCard } from '../components/atoms/Skeleton';
import { EmptyState } from '../components/molecules/EmptyState';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Checkbox } from '../components/atoms/Checkbox';
import { DropdownMenu } from '../components/molecules/DropdownMenu';
import { Pagination } from '../components/molecules/Pagination';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Notifications Screen - React Native
 * 
 * Complete redesign with SegmentedControl, Timeline, and ToggleGroup
 * Enhanced with Phase 6-7 components
 */

const NotificationsScreen: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const [allNotifications, setAllNotifications] = useState([
    {
      id: '1',
      title: 'New order received',
      description: 'Order #1234 has been placed successfully',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: '📦',
      status: 'in-progress' as const,
      unread: true,
    },
    {
      id: '2',
      title: 'Payment processed',
      description: 'Payment for order #1233 completed',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      icon: '💳',
      status: 'completed' as const,
      unread: true,
    },
    {
      id: '3',
      title: 'System update available',
      description: 'App version 2.1.0 is ready to install',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: '🔔',
      status: 'completed' as const,
      unread: false,
    },
    {
      id: '4',
      title: 'New comment on your post',
      description: 'John Doe commented: "Great article!"',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: '💬',
      status: 'completed' as const,
      unread: false,
    },
    {
      id: '5',
      title: 'Security alert',
      description: 'New device login from iPhone 15 Pro',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: '🔒',
      status: 'error' as const,
      unread: false,
    },
    {
      id: '6',
      title: 'New feature released',
      description: 'Check out our latest feature updates!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: '🚀',
      status: 'completed' as const,
      unread: false,
    },
    {
      id: '7',
      title: 'Password changed',
      description: 'Your password was successfully updated.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: '🔑',
      status: 'completed' as const,
      unread: false,
    },
  ]);

  const notificationPreferences = [
    {
      id: 'email',
      label: 'Email',
      enabled: emailNotifications,
      onChange: setEmailNotifications,
    },
    {
      id: 'push',
      label: 'Push',
      enabled: pushNotifications,
      onChange: setPushNotifications,
    },
    {
      id: 'sms',
      label: 'SMS',
      enabled: smsNotifications,
      onChange: setSmsNotifications,
    },
  ];

  const getFilteredNotifications = () => {
    switch (activeCategory) {
      case 'unread':
        return allNotifications.filter((n) => n.unread);
      case 'mentions':
        return allNotifications.filter((n) => n.description.includes('comment'));
      default:
        return allNotifications;
    }
  };

  const unreadCount = allNotifications.filter((n) => n.unread).length;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markAsRead = (id: string) => {
    setAllNotifications(allNotifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
    success('Marked as read', 'Success');
  };

  const markAllAsRead = () => {
    setAllNotifications(allNotifications.map(n => ({ ...n, unread: false })));
    success('All notifications marked as read', 'Success');
  };

  const deleteNotification = (id: string) => {
    setAllNotifications(allNotifications.filter(n => n.id !== id));
    success('Notification deleted', 'Deleted');
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setAllNotifications(allNotifications.filter(n => !selectedIds.includes(n.id)));
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: borderRadius['3xl'],
      borderBottomRightRadius: borderRadius['3xl'],
      padding: spacing.xl,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerIcon: {
      position: 'relative',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingHorizontal: spacing.xs,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    actionText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    emptyContainer: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyIcon: {
      marginBottom: spacing.md,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    selectionBanner: {
      padding: spacing.md,
      backgroundColor: theme.colors.primary + '20',
      borderRadius: borderRadius.xl,
      marginBottom: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectionText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    deleteButton: {
      fontSize: 14,
      color: '#EF4444',
      fontWeight: '500',
    },
    notificationCard: {
      marginBottom: spacing.md,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    notificationContent: {
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    notificationIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationBody: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    notificationTime: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: spacing.sm,
    },
    notificationDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
    },
  });

  const filteredNotifications = getFilteredNotifications();

  return (
    <View style={styles.container}>
      {/* Loading State */}
      {loading ? (
        <ScrollView style={styles.loadingContainer} showsVerticalScrollIndicator={false}>
          {/* Header Skeleton */}
          <View style={{ padding: spacing.lg, backgroundColor: theme.colors.primary, borderRadius: borderRadius['2xl'], marginBottom: spacing.lg }}>
            <Skeleton variant="text" width="50%" height={24} style={{ marginBottom: spacing.sm }} />
            <Skeleton variant="text" width="30%" height={16} />
          </View>

          {/* Notification Skeletons */}
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{
                backgroundColor: theme.colors.card,
                padding: spacing.md,
                borderRadius: borderRadius.xl,
                marginBottom: spacing.md,
                flexDirection: 'row',
                gap: spacing.md,
              }}
            >
              <Skeleton variant="circular" width={48} height={48} />
              <View style={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" style={{ marginBottom: spacing.xs }} />
                <Skeleton variant="text" width="100%" style={{ marginBottom: spacing.xs }} />
                <Skeleton variant="text" width="40%" />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : allNotifications.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No Notifications"
            description="You're all caught up! Check back later for new notifications."
            icon="🔔"
          />
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Bell size={28} color="#FFFFFF" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="error"
                      label={unreadCount.toString()}
                      size="sm"
                      style={{ position: 'absolute', top: -4, right: -4 }}
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.title}>Notifications</Text>
                  <Text style={styles.subtitle}>
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </Text>
                </View>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.actionText}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.content}>
            {/* Selection Banner */}
            {selectedIds.length > 0 && (
              <View style={styles.selectionBanner}>
                <Text style={styles.selectionText}>{selectedIds.length} selected</Text>
                <TouchableOpacity onPress={deleteSelected}>
                  <Text style={styles.deleteButton}>Delete Selected</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bulk Select All */}
            {allNotifications.length > 0 && (
              <View style={{ marginBottom: spacing.md }}>
                <Checkbox
                  checked={selectedIds.length === paginatedNotifications.length && paginatedNotifications.length > 0}
                  onChange={toggleSelectAll}
                  label="Select all"
                />
              </View>
            )}

            {/* Categories */}
            <View style={styles.section}>
              <SegmentedControl
                segments={[
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'mentions', label: 'Mentions' },
                ]}
                activeSegment={activeCategory}
                onSegmentChange={setActiveCategory}
              />
            </View>

            {/* Notifications List */}
            <View style={styles.section}>
              {paginatedNotifications.map((notification) => (
                <View key={notification.id} style={styles.notificationCard}>
                  <TouchableOpacity
                    onPress={() => !notification.unread && markAsRead(notification.id)}
                    style={[
                      styles.notificationContent,
                      {
                        backgroundColor: notification.unread
                          ? theme.colors.primary + '10'
                          : theme.colors.card,
                      },
                    ]}
                  >
                    {/* Checkbox */}
                    <View style={{ paddingTop: spacing.xs }}>
                      <Checkbox
                        checked={selectedIds.includes(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                      />
                    </View>

                    {/* Icon */}
                    <View
                      style={[
                        styles.notificationIcon,
                        {
                          backgroundColor:
                            notification.status === 'error'
                              ? '#FEE2E2'
                              : notification.status === 'in-progress'
                              ? '#DBEAFE'
                              : '#D1FAE5',
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 24 }}>{notification.icon}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.notificationBody}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationTime}>
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <Text style={styles.notificationDescription} numberOfLines={2}>
                        {notification.description}
                      </Text>
                    </View>

                    {/* Actions Menu */}
                    <DropdownMenu
                      trigger={
                        <TouchableOpacity style={{ padding: spacing.xs }}>
                          <Text style={{ fontSize: 20, color: theme.colors.textSecondary }}>⋮</Text>
                        </TouchableOpacity>
                      }
                      items={[
                        {
                          label: notification.unread ? 'Mark as read' : 'Mark as unread',
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
                    {notification.unread && <View style={styles.unreadIndicator} />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={{ marginTop: spacing.lg }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showFirstLast
                />
              </View>
            )}

            {/* Notification Preferences */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Preferences</Text>
              </View>
              <Card>
                <ToggleGroup items={notificationPreferences} />
              </Card>
            </View>

            {/* Recent Activity Timeline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Timeline items={filteredNotifications.slice(0, 3).map(n => ({
                id: n.id,
                title: n.title,
                description: n.description,
                timestamp: n.timestamp,
                icon: n.icon,
                status: n.status,
              }))} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top" />
    </View>
  );
};

export default NotificationsScreen;