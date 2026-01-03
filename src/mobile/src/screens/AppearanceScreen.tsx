import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Palette,
  Sun,
  Moon,
  Smartphone,
  Type,
  Maximize2,
  Zap,
  Contrast,
} from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import {
  useAppearance,
  ThemeMode,
  FontSize,
  Density,
} from '../contexts/AppearanceContext';
import Card from '../components/molecules/Card';
import ToggleGroup from '../components/molecules/ToggleGroup';
import RadioGroup from '../components/molecules/RadioGroup';
import Slider from '../components/atoms/Slider';
import Button from '../components/atoms/Button';
import Divider from '../components/atoms/Divider';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Tooltip } from '../components/molecules/Tooltip';
import { IconButton } from '../components/atoms/IconButton';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Appearance Screen - React Native
 * 
 * Complete redesign with ToggleGroup, RadioGroup, and Slider
 * Enhanced with Phase 6-7 components
 */

const AppearanceScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const {
    settings,
    theme,
    isDark,
    updateThemeMode,
    updateFontSize,
    updateDensity,
    toggleAnimations,
    toggleHighContrast,
    resetSettings,
  } = useAppearance();
  const { toasts, success, info } = useToast();

  const [fontSizeValue, setFontSizeValue] = useState(1); // 0: small, 1: medium, 2: large, 3: xlarge

  const handleThemeChange = (mode: ThemeMode) => {
    updateThemeMode(mode);
    success(`Theme changed to ${mode}`, 'Theme Updated');
  };

  const handleFontSizeChange = (size: FontSize) => {
    updateFontSize(size);
    success(`Font size changed to ${size}`, 'Font Size Updated');
  };

  const handleDensityChange = (density: Density) => {
    updateDensity(density);
    success(`Density changed to ${density}`, 'Density Updated');
  };

  const handleAnimationsToggle = () => {
    toggleAnimations();
    success(settings.animations ? 'Animations disabled' : 'Animations enabled', 'Animations');
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    success(settings.highContrast ? 'High contrast disabled' : 'High contrast enabled', 'Contrast');
  };

  const handleResetSettings = () => {
    resetSettings();
    info('Settings reset to defaults', 'Reset Complete');
  };

  const themeModeOptions = [
    {
      id: 'light',
      label: 'Light',
      enabled: settings.themeMode === 'light',
      onChange: () => handleThemeChange('light'),
    },
    {
      id: 'dark',
      label: 'Dark',
      enabled: settings.themeMode === 'dark',
      onChange: () => handleThemeChange('dark'),
    },
    {
      id: 'auto',
      label: 'Auto',
      enabled: settings.themeMode === 'auto',
      onChange: () => handleThemeChange('auto'),
    },
  ];

  const densityOptions = [
    {
      id: 'compact',
      label: 'Compact',
      description: 'More content, less spacing',
    },
    {
      id: 'comfortable',
      label: 'Comfortable',
      description: 'Balanced spacing',
    },
    {
      id: 'spacious',
      label: 'Spacious',
      description: 'More spacing, easier reading',
    },
  ];

  const accessibilityOptions = [
    {
      id: 'animations',
      label: 'Animations',
      enabled: settings.enableAnimations,
      onChange: handleAnimationsToggle,
    },
    {
      id: 'highContrast',
      label: 'High Contrast',
      enabled: settings.highContrast,
      onChange: handleHighContrastToggle,
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
    previewCard: {
      padding: spacing.lg,
      alignItems: 'center',
      gap: spacing.md,
    },
    previewIcon: {
      marginBottom: spacing.sm,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    previewText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    sliderContainer: {
      gap: spacing.md,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
    },
    sliderLabel: {
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    resetSection: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Palette size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Appearance</Text>
        <Text style={styles.subtitle}>
          Customize how your app looks and feels
        </Text>
      </View>

      <View style={styles.content}>
        {/* Theme Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Theme</Text>
          <Card variant="elevated" padding="lg">
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                {isDark ? (
                  <Moon size={40} color={theme.colors.primary} />
                ) : (
                  <Sun size={40} color={theme.colors.primary} />
                )}
              </View>
              <Text style={styles.previewTitle}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={styles.previewText}>
                {isDark
                  ? 'Easy on the eyes in low-light environments'
                  : 'Bright and clear for daytime use'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Theme Mode Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Mode</Text>
          <ToggleGroup options={themeModeOptions} mode="single" />
        </View>

        {/* Font Size Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          <Card variant="default" padding="lg">
            <View style={styles.sliderContainer}>
              <Slider
                value={fontSizeValue}
                min={0}
                max={3}
                step={1}
                onChange={(value) => {
                  setFontSizeValue(value);
                  const sizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
                  handleFontSizeChange(sizes[value]);
                }}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Small</Text>
                <Text style={styles.sliderLabel}>Medium</Text>
                <Text style={styles.sliderLabel}>Large</Text>
                <Text style={styles.sliderLabel}>XL</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Density Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Density</Text>
          <RadioGroup
            options={densityOptions}
            selectedId={settings.density}
            onChange={(id) => handleDensityChange(id as Density)}
          />
        </View>

        {/* Accessibility Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <ToggleGroup options={accessibilityOptions} />
        </View>

        {/* Additional Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          <Card variant="default" padding="md">
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: theme.colors.text,
                    }}
                  >
                    Current Settings
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.textSecondary,
                      marginTop: spacing.xs,
                    }}
                  >
                    Theme: {settings.themeMode} • Font: {settings.fontSize} •
                    Density: {settings.density}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Reset Settings */}
        <View style={styles.resetSection}>
          <Button
            variant="secondary"
            onPress={handleResetSettings}
            fullWidth
          >
            Reset to Default
          </Button>
        </View>
      </View>
      <ToastContainer toasts={toasts} />
    </ScrollView>
  );
};

export default AppearanceScreen;