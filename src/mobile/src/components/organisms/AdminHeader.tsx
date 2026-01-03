import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

export interface AdminHeaderProps {
  onMenuPress?: () => void;
  showMenuButton?: boolean;
  notifications?: number;
  onSearch?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuPress,
  showMenuButton = true,
  notifications = 0,
  onSearch,
}) => {
  const { theme, isDark, toggleTheme } = useAppearance();
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    setSearchOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      padding: 8,
      borderRadius: 8,
    },
    iconButtonHover: {
      backgroundColor: theme.colors.surface,
    },
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      padding: 8,
      borderRadius: 8,
    },
    languageText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    badge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#EF4444',
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    modalBody: {
      maxHeight: 400,
    },
    // Search Modal
    searchInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
      margin: 16,
    },
    // User Menu
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuItemText: {
      fontSize: 15,
      color: theme.colors.text,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      margin: 16,
      borderRadius: 12,
      backgroundColor: '#FEE2E2',
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#DC2626',
    },
    // Notifications
    notificationItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    notificationUnread: {
      backgroundColor: theme.colors.primaryLight + '10',
    },
    notificationTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    notificationTime: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      padding: 48,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showMenuButton && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Menu size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSearchOpen(true)}
            activeOpacity={0.7}
          >
            <Search size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {/* Theme Toggle */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {isDark ? (
              <Sun size={20} color={theme.colors.textSecondary} />
            ) : (
              <Moon size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>

          {/* Language Toggle */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Globe size={20} color={theme.colors.textSecondary} />
            <Text style={styles.languageText}>{language}</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNotificationMenuOpen(true)}
            activeOpacity={0.7}
          >
            <Bell size={20} color={theme.colors.textSecondary} />
            {notifications > 0 && <View style={styles.badge} />}
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <HelpCircle size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* User Menu */}
          <TouchableOpacity
            onPress={() => setUserMenuOpen(true)}
            activeOpacity={0.7}
          >
            <Avatar
              src={user?.avatar}
              name={user?.name || 'User'}
              size="sm"
              badge
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSearchOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search</Text>
              <TouchableOpacity onPress={() => setSearchOpen(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder={t('common.search') || 'Search...'}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus
            />
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        visible={userMenuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setUserMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account</Text>
              <TouchableOpacity onPress={() => setUserMenuOpen(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Avatar
                src={user?.avatar}
                name={user?.name || 'User'}
                size="md"
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>

            {/* Menu Items */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <User size={20} color={theme.colors.text} />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Settings size={20} color={theme.colors.text} />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                setUserMenuOpen(false);
                logout();
              }}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        visible={notificationMenuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setNotificationMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotificationMenuOpen(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {notifications > 0 ? (
                <NotificationList count={notifications} theme={theme} />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No new notifications
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Notification List Component
const NotificationList: React.FC<{ count: number; theme: any }> = ({
  count,
  theme,
}) => {
  const notifications = Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    id: i + 1,
    title: 'New notification',
    message: 'You have a new message',
    time: `${i + 1}m ago`,
    unread: i < 2,
  }));

  const styles = StyleSheet.create({
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    unread: {
      backgroundColor: theme.colors.primaryLight + '10',
    },
    title: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[styles.item, notification.unread && styles.unread]}
          activeOpacity={0.7}
        >
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
          <Text style={styles.time}>{notification.time}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};
