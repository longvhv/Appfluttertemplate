import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Smartphone, Monitor, Tablet, Trash2, MapPin, Clock } from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import Timeline from '../components/molecules/Timeline';
import ListItem from '../components/molecules/ListItem';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import Divider from '../components/atoms/Divider';
import { Modal } from '../components/molecules/Modal';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Spinner } from '../components/atoms/Spinner';
import { EmptyState } from '../components/atoms/EmptyState';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Devices Screen - React Native
 * 
 * Complete redesign with Timeline and device management
 * Enhanced with Phase 6-7 components
 */

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const DevicesScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { toasts, success, error, warning } = useToast();

  const [loading, setLoading] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: '2',
      name: 'MacBook Pro M3',
      type: 'desktop',
      location: 'San Francisco, CA',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      location: 'New York, NY',
      lastActive: '1 day ago',
      isCurrent: false,
    },
    {
      id: '4',
      name: 'Windows Desktop',
      type: 'desktop',
      location: 'Los Angeles, CA',
      lastActive: '3 days ago',
      isCurrent: false,
    },
  ]);

  const handleSignOut = async (id: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDevices(devices.filter(d => d.id !== id));
    setLoading(false);
    setShowSignOutModal(false);
    setSelectedDevice(null);
    success('Device signed out successfully', 'Success');
  };

  const handleSignOutAll = async () => {
    Alert.alert(
      'Sign Out All Devices',
      'Are you sure you want to sign out all other devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setDevices(devices.filter(d => d.isCurrent));
            setLoading(false);
            success('All other devices signed out', 'Success');
          },
        },
      ]
    );
  };

  const confirmSignOut = (id: string) => {
    setSelectedDevice(id);
    setShowSignOutModal(true);
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={20} color={theme.colors.primary} />;
      case 'desktop':
        return <Monitor size={20} color={theme.colors.primary} />;
      case 'tablet':
        return <Tablet size={20} color={theme.colors.primary} />;
    }
  };

  // Login history for Timeline
  const loginHistory = [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      description: 'San Francisco, CA • Active now',
      timestamp: new Date(Date.now()),
      icon: '📱',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'MacBook Pro M3',
      description: 'San Francisco, CA • 2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: '💻',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'iPad Air',
      description: 'New York, NY • 1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: '📱',
      status: 'completed' as const,
    },
  ];

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
    infoCard: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    },
    actionSection: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Smartphone size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Logged In Devices</Text>
        <Text style={styles.subtitle}>
          Manage devices with access to your account
        </Text>
      </View>

      <View style={styles.content}>
        {/* Device Count Info */}
        <View style={styles.section}>
          <Card variant="elevated" padding="md">
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Smartphone size={20} color={theme.colors.primary} />
                <Text style={styles.infoText}>
                  {devices.length} device{devices.length !== 1 ? 's' : ''} logged in
                </Text>
                <Badge
                  variant="primary"
                  label={devices.length.toString()}
                  size="sm"
                />
              </View>
              <View style={styles.infoRow}>
                <Clock size={20} color={theme.colors.success} />
                <Text style={styles.infoText}>
                  Last activity: {devices[0]?.lastActive || 'Unknown'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Active Devices List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Devices</Text>
          <Card variant="default" padding="none">
            {devices.map((device, index) => (
              <React.Fragment key={device.id}>
                <ListItem
                  title={device.name}
                  subtitle={
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} color={theme.colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                          {device.location}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={12} color={theme.colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                          {device.lastActive}
                        </Text>
                      </View>
                    </>
                  }
                  leftIcon={getDeviceIcon(device.type)}
                  rightIcon={
                    device.isCurrent ? (
                      <Badge variant="success" label="Current" size="sm" />
                    ) : (
                      <Trash2 size={20} color={theme.colors.error} />
                    )
                  }
                  onPress={() => !device.isCurrent && confirmSignOut(device.id)}
                />
                {index < devices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Login History Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Login History</Text>
          <Timeline items={loginHistory} />
        </View>

        {/* Sign Out All Button */}
        <View style={styles.actionSection}>
          <Button
            variant="secondary"
            onPress={handleSignOutAll}
            fullWidth
            disabled={devices.filter((d) => !d.isCurrent).length === 0}
          >
            Sign Out All Other Devices
          </Button>
        </View>

        {/* Security Info */}
        <View style={styles.section}>
          <Card variant="default" padding="md">
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              🔒 For security, sign out from devices you don't recognize. You'll
              need to log in again on those devices.
            </Text>
          </Card>
        </View>
      </View>

      {/* Sign Out Modal */}
      <Modal
        visible={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        title="Sign Out Device"
        description="Are you sure you want to sign out from this device?"
        actions={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowSignOutModal(false),
          },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: () => selectedDevice && handleSignOut(selectedDevice),
            loading: loading,
          },
        ]}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default DevicesScreen;