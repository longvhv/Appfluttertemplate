import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Sparkles, Star } from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import Timeline from '../components/molecules/Timeline';
import Chip from '../components/atoms/Chip';
import Badge from '../components/atoms/Badge';
import Rating from '../components/atoms/Rating';
import Button from '../components/atoms/Button';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * What's New Screen - React Native
 * 
 * Complete redesign with Timeline, Chip, and Rating
 * Enhanced with Phase 6-7 components
 */

const WhatsNewScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();
  const [feedbackRating, setFeedbackRating] = useState(0);

  const handleFeedbackSubmit = () => {
    if (feedbackRating > 0) {
      success(`Thank you for rating ${feedbackRating} stars!`, 'Feedback Received');
    }
  };

  // Version history for Timeline
  const versionHistory = [
    {
      id: '1',
      title: 'Version 2.5.0',
      description: 'Enhanced security, dark mode, and performance improvements',
      timestamp: new Date('2026-01-02'),
      icon: '🚀',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Version 2.4.0',
      description: 'Team collaboration, analytics, and mobile updates',
      timestamp: new Date('2025-12-15'),
      icon: '✨',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Version 2.3.0',
      description: 'Bug fixes, UI improvements, and API updates',
      timestamp: new Date('2025-11-20'),
      icon: '🔧',
      status: 'completed' as const,
    },
    {
      id: '4',
      title: 'Version 2.2.0',
      description: 'New dashboard, export features, and notifications',
      timestamp: new Date('2025-10-10'),
      icon: '📊',
      status: 'completed' as const,
    },
  ];

  // Latest features
  const latestFeatures = [
    {
      id: '1',
      icon: '🔒',
      title: 'Enhanced Security',
      description: '2FA with multiple authentication methods',
      isNew: true,
    },
    {
      id: '2',
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Auto-switching based on system preferences',
      isNew: true,
    },
    {
      id: '3',
      icon: '⚡',
      title: 'Performance',
      description: '30% faster loading and smoother animations',
      isNew: true,
    },
    {
      id: '4',
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Real-time collaboration in shared workspaces',
      isNew: false,
    },
    {
      id: '5',
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Detailed insights with exportable reports',
      isNew: false,
    },
    {
      id: '6',
      icon: '📱',
      title: 'Mobile Redesign',
      description: 'Gesture controls and offline mode',
      isNew: false,
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
    currentVersionCard: {
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.md,
    },
    versionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    versionText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    versionDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    featuresGrid: {
      gap: spacing.md,
    },
    featureCard: {
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    featureIcon: {
      fontSize: 32,
    },
    featureContent: {
      flex: 1,
    },
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    featureDesc: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    feedbackCard: {
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.md,
    },
    feedbackTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    feedbackText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'center',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Sparkles size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>What's New</Text>
        <Text style={styles.subtitle}>
          Discover the latest features and improvements
        </Text>
      </View>

      <View style={styles.content}>
        {/* Current Version */}
        <View style={styles.section}>
          <Card variant="elevated" padding="xl">
            <View style={styles.currentVersionCard}>
              <View style={styles.versionBadge}>
                <Sparkles size={20} color={theme.colors.primary} />
                <Text style={styles.versionText}>v2.5.0</Text>
              </View>
              <Text style={styles.versionDate}>Released: January 2, 2026</Text>
              <View style={styles.chipContainer}>
                <Chip label="Latest" variant="primary" size="sm" />
                <Chip label="Stable" variant="success" size="sm" />
                <Chip label="Recommended" variant="secondary" size="sm" />
              </View>
            </View>
          </Card>
        </View>

        {/* Latest Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Features</Text>
          <View style={styles.featuresGrid}>
            {latestFeatures.map((feature) => (
              <Card key={feature.id} variant="default" padding="none">
                <View style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureContent}>
                    <View style={styles.featureHeader}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      {feature.isNew && (
                        <Badge variant="primary" label="NEW" size="sm" />
                      )}
                    </View>
                    <Text style={styles.featureDesc}>{feature.description}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Version History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version History</Text>
          <Timeline items={versionHistory} />
        </View>

        {/* Rate This Update */}
        <View style={styles.section}>
          <Card variant="elevated" padding="xl">
            <View style={styles.feedbackCard}>
              <Star size={40} color={theme.colors.primary} />
              <Text style={styles.feedbackTitle}>Rate This Update</Text>
              <Text style={styles.feedbackText}>
                How do you like the new features?
              </Text>
              <Rating
                value={feedbackRating}
                onChange={setFeedbackRating}
                size="lg"
              />
              {feedbackRating > 0 && (
                <Button
                  variant="primary"
                  onPress={handleFeedbackSubmit}
                  fullWidth
                >
                  Submit Rating
                </Button>
              )}
            </View>
          </Card>
        </View>

        {/* Release Notes Link */}
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
              📄 View full release notes and changelog on our website
            </Text>
          </Card>
        </View>
      </View>
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default WhatsNewScreen;