import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Globe, Search } from 'lucide-react-native';
import { useAppearance } from '../contexts/AppearanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/molecules/Card';
import RadioGroup from '../components/molecules/RadioGroup';
import SearchBar from '../components/atoms/SearchBar';
import Badge from '../components/atoms/Badge';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Language Screen - React Native
 * 
 * Complete redesign with RadioGroup and SearchBar
 * Enhanced with Phase 6-7 components
 */

const LanguageScreen: React.FC = () => {
  const { theme } = useAppearance();
  const { t, setLanguage, currentLanguage } = useLanguage();
  const { toasts, success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId as 'en' | 'vi');
    const langName = langId === 'en' ? 'English' : langId === 'vi' ? 'Tiếng Việt' : langId;
    success(`Language changed to ${langName}`, 'Language Updated');
  };

  const languages = [
    {
      id: 'en',
      label: 'English',
      description: 'United States',
      flag: '🇺🇸',
      popular: true,
    },
    {
      id: 'vi',
      label: 'Tiếng Việt',
      description: 'Vietnam',
      flag: '🇻🇳',
      popular: true,
    },
    {
      id: 'es',
      label: 'Español',
      description: 'Spain',
      flag: '🇪🇸',
      popular: true,
    },
    {
      id: 'fr',
      label: 'Français',
      description: 'France',
      flag: '🇫🇷',
      popular: false,
    },
    {
      id: 'de',
      label: 'Deutsch',
      description: 'Germany',
      flag: '🇩🇪',
      popular: false,
    },
    {
      id: 'ja',
      label: '日本語',
      description: 'Japan',
      flag: '🇯🇵',
      popular: false,
    },
    {
      id: 'ko',
      label: '한국어',
      description: 'South Korea',
      flag: '🇰🇷',
      popular: false,
    },
    {
      id: 'zh',
      label: '中文',
      description: 'China',
      flag: '🇨🇳',
      popular: false,
    },
  ];

  const filteredLanguages = languages.filter((lang) =>
    lang.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLanguages = filteredLanguages.filter((lang) => lang.popular);
  const otherLanguages = filteredLanguages.filter((lang) => !lang.popular);

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
    infoCard: {
      padding: spacing.lg,
      alignItems: 'center',
      gap: spacing.sm,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    flagText: {
      fontSize: 24,
    },
    languageLabel: {
      flex: 1,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const renderLanguageOption = (lang: typeof languages[0]) => (
    <View style={styles.languageOption}>
      <Text style={styles.flagText}>{lang.flag}</Text>
      <View style={styles.languageLabel}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.text }}>
          {lang.label}
        </Text>
        <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
          {lang.description}
        </Text>
      </View>
      {lang.popular && <Badge variant="primary" label="Popular" size="sm" />}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Globe size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Language</Text>
        <Text style={styles.subtitle}>
          Choose your preferred language
        </Text>
      </View>

      <View style={styles.content}>
        {/* Current Language Info */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.infoCard}>
              <Text style={styles.flagText}>
                {currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸'}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.text,
                }}
              >
                Current: {currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}
              </Text>
              <Text style={styles.infoText}>
                The app interface and content will be displayed in this language
              </Text>
            </View>
          </Card>
        </View>

        {/* Search Bar */}
        <View style={styles.section}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search languages..."
          />
        </View>

        {/* Popular Languages */}
        {popularLanguages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Languages</Text>
              <Badge
                variant="primary"
                label={popularLanguages.length.toString()}
                size="sm"
              />
            </View>
            <RadioGroup
              options={popularLanguages.map((lang) => ({
                id: lang.id,
                label: lang.label,
                description: lang.description,
                customLabel: renderLanguageOption(lang),
              }))}
              selectedId={currentLanguage}
              onChange={handleLanguageChange}
            />
          </View>
        )}

        {/* Other Languages */}
        {otherLanguages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Languages</Text>
              <Badge
                variant="secondary"
                label={otherLanguages.length.toString()}
                size="sm"
              />
            </View>
            <RadioGroup
              options={otherLanguages.map((lang) => ({
                id: lang.id,
                label: lang.label,
                description: lang.description,
                customLabel: renderLanguageOption(lang),
              }))}
              selectedId={currentLanguage}
              onChange={handleLanguageChange}
            />
          </View>
        )}

        {/* Empty State */}
        {filteredLanguages.length === 0 && (
          <Card variant="default" padding="xl">
            <View style={styles.emptyContainer}>
              <Search size={48} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>
                No languages found matching "{searchQuery}"
              </Text>
            </View>
          </Card>
        )}

        {/* Info Note */}
        <View style={styles.section}>
          <Card variant="default" padding="md">
            <Text style={styles.infoText}>
              💡 Only English and Vietnamese are fully supported. Other languages
              will be available in future updates.
            </Text>
          </Card>
        </View>
      </View>
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default LanguageScreen;