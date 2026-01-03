import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { HelpCircle, Search, ThumbsUp } from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import Accordion from '../components/molecules/Accordion';
import SegmentedControl from '../components/molecules/SegmentedControl';
import SearchBar from '../components/atoms/SearchBar';
import Badge from '../components/atoms/Badge';
import Rating from '../components/atoms/Rating';
import Button from '../components/atoms/Button';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { EmptyState } from '../components/atoms/EmptyState';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * FAQ Screen - React Native
 * 
 * Complete redesign with Accordion, SegmentedControl, and Rating
 * Enhanced with Phase 6-7 components
 */

const FAQScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [helpfulRating, setHelpfulRating] = useState(0);

  const handleRatingChange = (rating: number) => {
    setHelpfulRating(rating);
    success(`Thank you for rating ${rating} stars!`, 'Feedback Received');
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'account', label: 'Account' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'features', label: 'Features' },
  ];

  const allFaqs = [
    // Getting Started
    {
      id: '1',
      title: 'How do I create an account?',
      content:
        'Tap the "Sign Up" button on the login screen, fill in your details including email and password, then verify your email address.',
      category: 'account',
    },
    {
      id: '2',
      title: 'How do I reset my password?',
      content:
        'On the login screen, tap "Forgot Password", enter your email address, and follow the instructions sent to your email.',
      category: 'account',
    },
    // Account & Security
    {
      id: '3',
      title: 'How do I enable two-factor authentication?',
      content:
        'Go to Settings > Privacy & Security > Two-Factor Authentication. Follow the setup wizard to enable 2FA using an authenticator app or SMS.',
      category: 'account',
    },
    {
      id: '4',
      title: 'How can I delete my account?',
      content:
        'Navigate to Settings > Account Management > Delete Account. This action is permanent and cannot be undone.',
      category: 'account',
    },
    // Privacy
    {
      id: '5',
      title: 'What data do you collect?',
      content:
        'We collect minimal data necessary for app functionality: email, profile information, and app usage data. We never sell your data to third parties.',
      category: 'privacy',
    },
    {
      id: '6',
      title: 'How do I export my data?',
      content:
        'Go to Settings > Privacy & Security > Export Data. Choose your preferred format (JSON or CSV) and download your data.',
      category: 'privacy',
    },
    {
      id: '7',
      title: 'Can I control who sees my profile?',
      content:
        'Yes! Go to Settings > Privacy & Security > Profile Visibility. Choose from Public, Friends Only, or Private.',
      category: 'privacy',
    },
    // Features
    {
      id: '8',
      title: 'How do I change the app language?',
      content:
        'Go to Settings > Language and select your preferred language from the list. The app will automatically update to display content in the selected language.',
      category: 'features',
    },
    {
      id: '9',
      title: 'How do I enable dark mode?',
      content:
        'Navigate to Settings > Appearance and select Dark mode. You can also choose Auto mode to automatically switch based on your system settings.',
      category: 'features',
    },
    {
      id: '10',
      title: 'Can I customize the app layout?',
      content:
        'Yes! In Settings > Appearance, you can adjust font size, display density, and enable/disable animations to customize your experience.',
      category: 'features',
    },
    {
      id: '11',
      title: 'How do notifications work?',
      content:
        'Configure notifications in Settings > Notifications. Choose which channels to enable (email, push, SMS) and customize what notifications you receive.',
      category: 'features',
    },
    {
      id: '12',
      title: 'What are the system requirements?',
      content:
        'For iOS: iOS 13.0 or later. For Android: Android 8.0 or later. For best performance, we recommend using the latest version of your operating system.',
      category: 'features',
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesSearch =
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCount = (catId: string) => {
    if (catId === 'all') return allFaqs.length;
    return allFaqs.filter((faq) => faq.category === catId).length;
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
    statsCard: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    feedbackCard: {
      padding: spacing.lg,
      gap: spacing.md,
      alignItems: 'center',
    },
    feedbackTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    feedbackText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <HelpCircle size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>
          Find quick answers to common questions
        </Text>
      </View>

      <View style={styles.content}>
        {/* Stats Card */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{allFaqs.length}</Text>
                  <Text style={styles.statLabel}>Total FAQs</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Categories</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>98%</Text>
                  <Text style={styles.statLabel}>Helpful</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search FAQs..."
          />
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <SegmentedControl
            options={categories}
            value={activeCategory}
            onChange={setActiveCategory}
          />
        </View>

        {/* Results Count */}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.sectionTitle}>
              {searchQuery
                ? 'Search Results'
                : activeCategory === 'all'
                ? 'All Questions'
                : `${activeCategory} Questions`}
            </Text>
            <Badge
              variant="primary"
              label={filteredFaqs.length.toString()}
              size="sm"
            />
          </View>
        </View>

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <View style={styles.section}>
            <Accordion items={filteredFaqs} />
          </View>
        ) : (
          <Card variant="default" padding="xl">
            <View style={styles.emptyContainer}>
              <Search size={48} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>
                No FAQs found
                {searchQuery && ` matching "${searchQuery}"`}
              </Text>
            </View>
          </Card>
        )}

        {/* Was This Helpful? */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.feedbackCard}>
              <ThumbsUp size={32} color={theme.colors.primary} />
              <Text style={styles.feedbackTitle}>Was this helpful?</Text>
              <Text style={styles.feedbackText}>
                Rate your experience to help us improve
              </Text>
              <Rating
                value={helpfulRating}
                onChange={handleRatingChange}
                size="lg"
              />
              {helpfulRating > 0 && (
                <Button variant="primary" onPress={() => console.log('Submit')}>
                  Submit Feedback
                </Button>
              )}
            </View>
          </Card>
        </View>

        {/* Still Need Help? */}
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
              💡 Still need help? Contact our support team 24/7
            </Text>
          </Card>
        </View>
      </View>
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default FAQScreen;