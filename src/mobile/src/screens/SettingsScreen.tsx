import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  User,
  Lock,
  Smartphone,
  Shield,
  Globe,
  HelpCircle,
  MessageSquare,
  Sparkles,
  LogOut,
  Palette,
  Bell,
  ChevronRight,
  Activity,
  Clock,
  Star,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import Avatar from '../components/atoms/Avatar';
import Card from '../components/molecules/Card';
import ListItem from '../components/molecules/ListItem';
import Divider from '../components/atoms/Divider';
import StatsCard from '../components/molecules/StatsCard';
import SegmentedControl from '../components/molecules/SegmentedControl';
import Timeline from '../components/molecules/Timeline';
import Badge from '../components/atoms/Badge';
import { Modal } from '../components/molecules/Modal';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Spinner } from '../components/atoms/Spinner';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Settings Screen - React Native
 * 
 * Complete redesign with SegmentedControl, StatsCard, and Timeline
 * Enhanced with Phase 6-7 components
 */

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error } = useToast();
  const [activeCategory, setActiveCategory] = useState('general');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
  ];

  const quickStats = [
    {
      id: 1,
      title: 'Profile',
      value: '85%',
      change: '+5%',
      trend: 'up' as const,
      icon: <User size={20} color="#3B82F6" />,
    },
    {
      id: 2,
      title: 'Security',
      value: '90%',
      change: '+10%',
      trend: 'up' as const,
      icon: <Shield size={20} color="#10B981" />,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      title: 'Password changed',
      description: 'Security settings updated',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: '🔒',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'New device logged in',
      description: 'iPhone 15 Pro',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: '📱',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Profile updated',
      description: 'Avatar and bio changed',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: '👤',
      status: 'completed' as const,
    },
  ];

  const generalSettings = [
    {
      id: 'profile',
      icon: User,
      label: t('settings.profile'),
      desc: t('settings.profileDesc'),
      screen: 'Profile' as keyof RootStackParamList,
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      desc: 'Manage notification preferences',
      screen: 'Notifications' as keyof RootStackParamList,
      badge: '3',
    },
    {
      id: 'language',
      icon: Globe,
      label: t('settings.language'),
      desc: t('settings.languageDesc'),
      screen: 'Language' as keyof RootStackParamList,
    },
    {
      id: 'appearance',
      icon: Palette,
      label: t('settings.appearance'),
      desc: t('settings.appearanceDesc'),
      screen: 'Appearance' as keyof RootStackParamList,
    },
  ];

  const securitySettings = [
    {
      id: 'change-password',
      icon: Lock,
      label: t('settings.changePassword'),
      desc: t('settings.changePasswordDesc'),
      screen: 'ChangePassword' as keyof RootStackParamList,
    },
    {
      id: 'devices',
      icon: Smartphone,
      label: t('settings.devices'),
      desc: t('settings.devicesDesc'),
      screen: 'Devices' as keyof RootStackParamList,
    },
    {
      id: 'privacy',
      icon: Shield,
      label: t('settings.privacy'),
      desc: t('settings.privacyDesc'),
      screen: 'PrivacySecurity' as keyof RootStackParamList,
    },
  ];

  const supportSettings = [
    {
      id: 'help-center',
      icon: HelpCircle,
      label: t('settings.helpCenter'),
      desc: t('settings.helpCenterDesc'),
      screen: 'Help' as keyof RootStackParamList,
    },
    {
      id: 'faq',
      icon: MessageSquare,
      label: t('settings.faq'),
      desc: t('settings.faqDesc'),
      screen: 'FAQ' as keyof RootStackParamList,
    },
    {
      id: 'whats-new',
      icon: Sparkles,
      label: t('settings.whatsNew'),
      desc: t('settings.whatsNewDesc'),
      screen: 'WhatsNew' as keyof RootStackParamList,
      badge: 'NEW',
    },
  ];

  const handleLogout = () => {
    setLoggingOut(true);
    logout().then(() => {
      setLoggingOut(false);
      success(t('auth.logoutSuccess'));
    }).catch((err) => {
      setLoggingOut(false);
      error(t('auth.logoutError'));
    });
  };

  const getCurrentSettings = () => {
    switch (activeCategory) {
      case 'general':
        return generalSettings;
      case 'security':
        return securitySettings;
      case 'preferences':
        return supportSettings;
      default:
        return generalSettings;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    profileCard: {
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: borderRadius['3xl'],
      borderBottomRightRadius: borderRadius['3xl'],
      padding: spacing.lg,
    },
    profileContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    profileDetails: {
      flex: 1,
    },
    profileName: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: spacing.xs,
    },
    profileEmail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
    },
    logoutSection: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.profileContent}>
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size="xl"
            badge
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            {quickStats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Category Tabs */}
        <View style={styles.section}>
          <SegmentedControl
            options={categories}
            value={activeCategory}
            onChange={setActiveCategory}
          />
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Card variant="default" padding="none">
            {getCurrentSettings().map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  title={item.label}
                  subtitle={item.desc}
                  leftIcon={<item.icon size={20} color={theme.colors.primary} />}
                  rightIcon={
                    item.badge ? (
                      <Badge variant="primary" label={item.badge} size="sm" />
                    ) : (
                      <ChevronRight size={20} color={theme.colors.textTertiary} />
                    )
                  }
                  onPress={() => navigation.navigate(item.screen)}
                />
                {index < getCurrentSettings().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Timeline items={recentActivity} />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Card variant="default" padding="none">
            <ListItem
              title={t('auth.logout')}
              leftIcon={<LogOut size={20} color={theme.colors.error} />}
              onPress={() => setShowLogoutModal(true)}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card>
        </View>
      </View>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t('auth.logout')}
        description="Are you sure you want to logout?"
        actions={[
          {
            label: t('common.cancel'),
            onPress: () => setShowLogoutModal(false),
            style: 'cancel',
          },
          {
            label: t('auth.logout'),
            onPress: handleLogout,
            style: 'destructive',
            icon: loggingOut ? <Spinner size={20} color={theme.colors.error} /> : undefined,
          },
        ]}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default SettingsScreen;