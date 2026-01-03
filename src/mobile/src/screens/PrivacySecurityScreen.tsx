import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Shield,
  Lock,
  Eye,
  Smartphone,
  Key,
  Database,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import StatsCard from '../components/molecules/StatsCard';
import Timeline from '../components/molecules/Timeline';
import ToggleGroup from '../components/molecules/ToggleGroup';
import Stepper from '../components/molecules/Stepper';
import ListItem from '../components/molecules/ListItem';
import Divider from '../components/atoms/Divider';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import { Modal } from '../components/molecules/Modal';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Checkbox } from '../components/atoms/Checkbox';
import { Tooltip } from '../components/molecules/Tooltip';
import { IconButton } from '../components/atoms/IconButton';
import { Spinner } from '../components/atoms/Spinner';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Privacy & Security Screen - React Native
 * 
 * Complete redesign with ToggleGroup, Stepper, Timeline, and StatsCard
 * Enhanced with Phase 6-7 components
 */

const PrivacySecurityScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { toasts, success, error, warning } = useToast();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [activityStatus, setActivityStatus] = useState('everyone');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownloadData = async () => {
    setDownloading(true);
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDownloading(false);
    setShowDownloadModal(false);
    success('Data download started!', 'Success');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDeleting(false);
    setShowDeleteModal(false);
    error('Account deleted', 'Account Deleted');
  };

  // Security Score
  const securityStats = [
    {
      id: 1,
      title: 'Security Score',
      value: '85%',
      change: '+5%',
      trend: 'up' as const,
      icon: <Shield size={20} color="#10B981" />,
    },
    {
      id: 2,
      title: 'Active Sessions',
      value: '3',
      change: '+1',
      trend: 'up' as const,
      icon: <Smartphone size={20} color="#3B82F6" />,
    },
  ];

  // Security Events Timeline
  const securityEvents = [
    {
      id: '1',
      title: 'Password changed',
      description: 'Your password was updated successfully',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: '🔒',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'New device login',
      description: 'iPhone 15 Pro - San Francisco, CA',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: '📱',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Failed login attempt',
      description: 'Unknown device from New York',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      icon: '⚠️',
      status: 'error' as const,
    },
  ];

  // 2FA Setup Steps
  const twoFactorSteps = [
    {
      id: '1',
      title: 'Download App',
      description: 'Install an authenticator app',
      status: twoFactorEnabled ? ('completed' as const) : ('current' as const),
    },
    {
      id: '2',
      title: 'Scan QR Code',
      description: 'Scan the code with your app',
      status: twoFactorEnabled ? ('completed' as const) : ('upcoming' as const),
    },
    {
      id: '3',
      title: 'Verify Code',
      description: 'Enter the 6-digit code',
      status: twoFactorEnabled ? ('completed' as const) : ('upcoming' as const),
    },
  ];

  // Privacy Options
  const privacyOptions = [
    {
      id: 'twoFactor',
      label: '2FA',
      enabled: twoFactorEnabled,
      onChange: setTwoFactorEnabled,
    },
    {
      id: 'biometric',
      label: 'Biometric',
      enabled: biometricEnabled,
      onChange: setBiometricEnabled,
    },
    {
      id: 'alerts',
      label: 'Login Alerts',
      enabled: loginAlerts,
      onChange: setLoginAlerts,
    },
  ];

  const profileVisibilityOptions = [
    { id: 'public', label: 'Public' },
    { id: 'friends', label: 'Friends' },
    { id: 'private', label: 'Private' },
  ];

  const activityStatusOptions = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'nobody', label: 'Nobody' },
  ];

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Download your account data in JSON format?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete account'),
        },
      ]
    );
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
      alignItems: 'center',
    },
    headerIcon: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
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
    dangerSection: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Shield size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Privacy & Security</Text>
        <Text style={styles.subtitle}>
          Manage your privacy and security settings
        </Text>
      </View>

      <View style={styles.content}>
        {/* Security Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Overview</Text>
          <View style={styles.statsContainer}>
            {securityStats.map((stat) => (
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

        {/* Quick Privacy Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          <ToggleGroup options={privacyOptions} />
        </View>

        {/* 2FA Setup Stepper */}
        {!twoFactorEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enable Two-Factor Auth</Text>
            <Stepper steps={twoFactorSteps} />
          </View>
        )}

        {/* Profile Visibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          <Card variant="default" padding="md">
            <ToggleGroup
              options={profileVisibilityOptions.map((opt) => ({
                id: opt.id,
                label: opt.label,
                enabled: profileVisibility === opt.id,
                onChange: () => setProfileVisibility(opt.id),
              }))}
              mode="single"
            />
          </Card>
        </View>

        {/* Activity Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Activity Status To</Text>
          <Card variant="default" padding="md">
            <ToggleGroup
              options={activityStatusOptions.map((opt) => ({
                id: opt.id,
                label: opt.label,
                enabled: activityStatus === opt.id,
                onChange: () => setActivityStatus(opt.id),
              }))}
              mode="single"
            />
          </Card>
        </View>

        {/* Recent Security Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Timeline items={securityEvents} />
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <Card variant="default" padding="none">
            <ListItem
              title="Export Data"
              subtitle="Download your account data"
              leftIcon={<Download size={20} color={theme.colors.primary} />}
              rightIcon={<Badge variant="secondary" label="JSON" size="sm" />}
              onPress={handleExportData}
            />
            <Divider />
            <ListItem
              title="Storage Used"
              subtitle="156 MB of 2 GB"
              leftIcon={<Database size={20} color={theme.colors.primary} />}
              rightIcon={<Badge variant="primary" label="8%" size="sm" />}
            />
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Card variant="default" padding="none">
            <ListItem
              title="Delete Account"
              subtitle="Permanently delete your account and data"
              leftIcon={<Trash2 size={20} color={theme.colors.error} />}
              onPress={handleDeleteAccount}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

export default PrivacySecurityScreen;