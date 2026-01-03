import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  Video,
  FileText,
  Search,
} from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import Accordion from '../components/molecules/Accordion';
import QuickActions from '../components/molecules/QuickActions';
import Tabs from '../components/molecules/Tabs';
import SearchBar from '../components/atoms/SearchBar';
import Badge from '../components/atoms/Badge';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Modal } from '../components/molecules/Modal';
import { EmptyState } from '../components/atoms/EmptyState';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Help Screen - React Native
 * 
 * Complete redesign with Accordion, QuickActions, Tabs, and SearchBar
 * Enhanced with Phase 6-7 components
 */

const HelpScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();
  
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const handleContactMethod = (method: string) => {
    if (method === 'chat') {
      info('Opening live chat...', 'Chat');
    } else if (method === 'email') {
      success('Opening email client...', 'Email');
      Linking.openURL('mailto:support@example.com');
    } else if (method === 'phone') {
      success('Calling support...', 'Phone');
      Linking.openURL('tel:+15551234567');
    }
  };

  const tabs = [
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
    { id: 'resources', label: 'Resources' },
  ];

  const contactActions = [
    {
      id: 'chat',
      icon: <MessageCircle size={24} color="#FFFFFF" />,
      label: 'Live Chat',
      color: '#3B82F6',
      onPress: () => handleContactMethod('chat'),
    },
    {
      id: 'email',
      icon: <Mail size={24} color="#FFFFFF" />,
      label: 'Email',
      color: '#10B981',
      onPress: () => handleContactMethod('email'),
    },
    {
      id: 'phone',
      icon: <Phone size={24} color="#FFFFFF" />,
      label: 'Phone',
      color: '#F59E0B',
      onPress: () => handleContactMethod('phone'),
    },
  ];

  const resourceActions = [
    {
      id: 'docs',
      icon: <BookOpen size={24} color="#FFFFFF" />,
      label: 'Documentation',
      color: '#8B5CF6',
      onPress: () => console.log('Open docs'),
    },
    {
      id: 'videos',
      icon: <Video size={24} color="#FFFFFF" />,
      label: 'Video Tutorials',
      color: '#EC4899',
      onPress: () => console.log('Open videos'),
    },
    {
      id: 'guide',
      icon: <FileText size={24} color="#FFFFFF" />,
      label: 'User Guide',
      color: '#06B6D4',
      onPress: () => console.log('Download guide'),
    },
  ];

  const allFaqs = [
    {
      id: '1',
      title: 'How do I reset my password?',
      content:
        'Go to Settings > Security > Change Password. Enter your current password and then your new password twice. Make sure your new password is at least 8 characters long.',
    },
    {
      id: '2',
      title: 'How can I delete my account?',
      content:
        'Go to Settings > Account Management > Delete Account. You will be asked to confirm this action. Please note that deleting your account is permanent and cannot be undone.',
    },
    {
      id: '3',
      title: 'How do I change my email address?',
      content:
        'Navigate to Profile > Edit Profile > Email. Enter your new email address and verify it by clicking the link sent to your new email.',
    },
    {
      id: '4',
      title: 'How do I enable two-factor authentication?',
      content:
        'Go to Settings > Security > Two-Factor Authentication. Follow the on-screen instructions to set up 2FA using an authenticator app or SMS.',
    },
    {
      id: '5',
      title: 'How can I export my data?',
      content:
        'Go to Settings > Privacy & Security > Data & Storage > Export Data. Select the data you want to export and choose your preferred format (JSON or CSV).',
    },
    {
      id: '6',
      title: 'How do I change the app language?',
      content:
        'Go to Settings > Language and select your preferred language from the list. The app will automatically update to display content in the selected language.',
    },
    {
      id: '7',
      title: 'How do I enable dark mode?',
      content:
        'Navigate to Settings > Appearance and select Dark mode. You can also choose Auto mode to automatically switch based on your system settings.',
    },
    {
      id: '8',
      title: 'What are the system requirements?',
      content:
        'For iOS: iOS 13.0 or later. For Android: Android 8.0 or later. For best performance, we recommend using the latest version of your operating system.',
    },
  ];

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    contactCard: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactInfo: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    contactDesc: {
      fontSize: 14,
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
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <HelpCircle size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>We're here to help you 24/7</Text>
      </View>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.section}>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <>
            {/* Search FAQs */}
            <View style={styles.section}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search frequently asked questions..."
              />
            </View>

            {/* FAQ Count */}
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.sectionTitle}>
                  {searchQuery ? 'Search Results' : 'All Questions'}
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
                    No FAQs found matching "{searchQuery}"
                  </Text>
                </View>
              </Card>
            )}
          </>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Get In Touch</Text>
              <QuickActions actions={contactActions} columns={3} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <Card variant="default" padding="lg">
                <View style={styles.contactCard}>
                  <View style={styles.contactItem}>
                    <View
                      style={[
                        styles.contactIcon,
                        { backgroundColor: '#3B82F6' + '20' },
                      ]}
                    >
                      <MessageCircle size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactTitle}>Live Chat</Text>
                      <Text style={styles.contactDesc}>
                        Available 24/7 • Avg. response: 2 min
                      </Text>
                    </View>
                  </View>

                  <View style={styles.contactItem}>
                    <View
                      style={[
                        styles.contactIcon,
                        { backgroundColor: '#10B981' + '20' },
                      ]}
                    >
                      <Mail size={20} color="#10B981" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactTitle}>Email Support</Text>
                      <Text style={styles.contactDesc}>
                        support@example.com • 24h response
                      </Text>
                    </View>
                  </View>

                  <View style={styles.contactItem}>
                    <View
                      style={[
                        styles.contactIcon,
                        { backgroundColor: '#F59E0B' + '20' },
                      ]}
                    >
                      <Phone size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactTitle}>Phone Support</Text>
                      <Text style={styles.contactDesc}>
                        +1 (555) 123-4567 • Mon-Fri 9AM-5PM
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learning Resources</Text>
              <QuickActions actions={resourceActions} columns={3} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Articles</Text>
              <Accordion
                items={[
                  {
                    id: '1',
                    title: 'Getting Started Guide',
                    content:
                      'Learn the basics of using the app, including navigation, settings, and key features. Perfect for new users.',
                  },
                  {
                    id: '2',
                    title: 'Account Security Best Practices',
                    content:
                      'Tips for keeping your account secure, including strong passwords, 2FA, and device management.',
                  },
                  {
                    id: '3',
                    title: 'Privacy Settings Explained',
                    content:
                      'Understand how to control your privacy settings, manage data sharing, and protect your information.',
                  },
                ]}
              />
            </View>
          </>
        )}
      </View>
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default HelpScreen;