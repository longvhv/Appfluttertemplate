import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Activity,
  Settings,
  Bell,
  Plus,
  FileText,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import Card from '../components/molecules/Card';
import StatsCard from '../components/molecules/StatsCard';
import Timeline from '../components/molecules/Timeline';
import QuickActions from '../components/molecules/QuickActions';
import Tabs from '../components/molecules/Tabs';
import Avatar from '../components/atoms/Avatar';
import AvatarGroup from '../components/molecules/AvatarGroup';
import Rating from '../components/atoms/Rating';
import { Spinner } from '../components/atoms/Spinner';
import { Skeleton, SkeletonCard } from '../components/atoms/Skeleton';
import { EmptyState } from '../components/molecules/EmptyState';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Tooltip } from '../components/atoms/Tooltip';
import { IconButton } from '../components/atoms/IconButton';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Home Screen - React Native
 * 
 * Complete dashboard redesign with modern components
 * Enhanced with Phase 6-7 components
 */

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { toasts, success, error, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Uncomment to test empty state
      // setHasData(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      id: 1,
      title: 'Total Users',
      value: '12.5K',
      change: '+12%',
      trend: 'up' as const,
      icon: <Users size={24} color="#3B82F6" />,
    },
    {
      id: 2,
      title: 'Revenue',
      value: '$45.2K',
      change: '+23%',
      trend: 'up' as const,
      icon: <TrendingUp size={24} color="#10B981" />,
    },
    {
      id: 3,
      title: 'Messages',
      value: '1,234',
      change: '+8%',
      trend: 'up' as const,
      icon: <MessageSquare size={24} color="#8B5CF6" />,
    },
    {
      id: 4,
      title: 'Active Now',
      value: '892',
      change: '-5%',
      trend: 'down' as const,
      icon: <Activity size={24} color="#F59E0B" />,
    },
  ];

  const timelineItems = [
    {
      id: '1',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: '👤',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Payment received',
      description: '$249.99 from Premium subscription',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: '💰',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Feature request',
      description: 'Dark mode improvement suggestions',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: '💡',
      status: 'in-progress' as const,
    },
    {
      id: '4',
      title: 'Bug fixed',
      description: 'Login issue resolved in v2.1.0',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: '✅',
      status: 'completed' as const,
    },
  ];

  const quickActions = [
    {
      id: '1',
      label: 'New Post',
      icon: <Plus size={20} color="#FFFFFF" />,
      onPress: () => {},
    },
    {
      id: '2',
      label: 'Reports',
      icon: <FileText size={20} color="#FFFFFF" />,
      onPress: () => {},
    },
    {
      id: '3',
      label: 'Settings',
      icon: <Settings size={20} color="#FFFFFF" />,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: '4',
      label: 'Notifications',
      icon: <Bell size={20} color="#FFFFFF" />,
      onPress: () => navigation.navigate('Notifications'),
    },
  ];

  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      imageUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      name: 'Jane Smith',
      imageUrl: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      imageUrl: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: '4',
      name: 'Alice Brown',
      imageUrl: 'https://i.pravatar.cc/150?img=4',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity', label: 'Activity' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomLeftRadius: borderRadius['3xl'],
      borderBottomRightRadius: borderRadius['3xl'],
    },
    headerContent: {
      gap: spacing.md,
    },
    welcomeText: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    userName: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: spacing.xs,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    userDetails: {
      flex: 1,
    },
    userEmail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    statsGrid: {
      gap: spacing.md,
    },
    teamSection: {
      gap: spacing.md,
    },
    teamHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: spacing.lg,
    },
    skeletonHeader: {
      backgroundColor: theme.colors.primary,
      padding: spacing.lg,
      borderRadius: borderRadius['2xl'],
      marginBottom: spacing.lg,
    },
    skeletonStatsGrid: {
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    bannerContainer: {
      padding: spacing.lg,
      paddingTop: spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      {/* Loading State */}
      {loading ? (
        <ScrollView style={styles.loadingContainer} showsVerticalScrollIndicator={false}>
          {/* Header Skeleton */}
          <View style={styles.skeletonHeader}>
            <Skeleton variant="text" width="60%" height={20} style={{ marginBottom: spacing.sm }} />
            <Skeleton variant="text" width="40%" height={32} style={{ marginBottom: spacing.md }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Skeleton variant="circular" width={48} height={48} />
              <View style={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={16} style={{ marginBottom: spacing.xs }} />
                <Skeleton variant="text" width="50%" height={14} />
              </View>
            </View>
          </View>

          {/* Stats Skeleton */}
          <View style={styles.skeletonStatsGrid}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>

          {/* Activity Skeleton */}
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                backgroundColor: theme.colors.card,
                padding: spacing.md,
                borderRadius: borderRadius.xl,
                marginBottom: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <View style={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" style={{ marginBottom: spacing.xs }} />
                <Skeleton variant="text" width="40%" />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : !hasData ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No Data Available"
            description="There's no activity data to display yet. Start using the app to see your statistics here."
            action={{
              label: "Get Started",
              onPress: () => success("Welcome! Let's get started."),
            }}
          />
        </View>
      ) : (
        /* Main Content */
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header with Gradient */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                </View>
                <IconButton
                  icon={Settings}
                  onPress={() => {
                    navigation.navigate('Settings');
                    info('Opening settings');
                  }}
                  variant="ghost"
                  size="md"
                  ariaLabel="Settings"
                  style={{ tintColor: '#FFFFFF' }}
                />
              </View>

              <View style={styles.userInfo}>
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="lg"
                  badge
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <View style={styles.ratingContainer}>
                    <Rating value={4.8} size="sm" readonly />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {/* Quick Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Stats</Text>
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <TouchableOpacity
                    key={stat.id}
                    onPress={() => success(`Viewing ${stat.title}`)}
                    activeOpacity={0.7}
                  >
                    <StatsCard
                      title={stat.title}
                      value={stat.value}
                      change={stat.change}
                      trend={stat.trend}
                      icon={stat.icon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.section}>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </View>

            {/* Team Members */}
            <View style={styles.section}>
              <View style={styles.teamSection}>
                <View style={styles.teamHeader}>
                  <Text style={styles.sectionTitle}>Team Members</Text>
                  <TouchableOpacity onPress={() => success('Viewing all team members')}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                <AvatarGroup avatars={teamMembers} max={5} size="md" />
              </View>
            </View>

            {/* Recent Activity Timeline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Timeline items={timelineItems} />
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <QuickActions actions={quickActions} columns={2} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top" />
    </View>
  );
};

export default HomeScreen;