import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import Card from '../components/molecules/Card';
import FormField from '../components/molecules/FormField';
import PasswordStrengthIndicator from '../components/molecules/PasswordStrengthIndicator';
import Button from '../components/atoms/Button';
import Divider from '../components/atoms/Divider';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { Spinner } from '../components/atoms/Spinner';
import { ProgressBar } from '../components/atoms/ProgressBar';
import { Tooltip } from '../components/molecules/Tooltip';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Change Password Screen - React Native
 * 
 * Complete redesign with FormField and PasswordStrengthIndicator
 * Enhanced with Phase 6-7 components
 */

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error, warning } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      error('Please fix all errors', 'Validation Error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success('Password changed successfully!', 'Success');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      error('Failed to change password', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const securityTips = [
    {
      icon: '✅',
      text: 'Use at least 8 characters',
    },
    {
      icon: '✅',
      text: 'Mix uppercase and lowercase letters',
    },
    {
      icon: '✅',
      text: 'Include numbers and symbols',
    },
    {
      icon: '✅',
      text: 'Avoid common words and patterns',
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
    formCard: {
      gap: spacing.lg,
    },
    tipsCard: {
      gap: spacing.sm,
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    tipIcon: {
      fontSize: 16,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    buttonSection: {
      gap: spacing.md,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Lock size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Keep your account secure with a strong password
          </Text>
        </View>

        <View style={styles.content}>
          {/* Password Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Password</Text>
            <Card variant="default" padding="lg">
              <View style={styles.formCard}>
                <FormField
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry
                  error={errors.currentPassword}
                  leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
                />

                <Divider />

                <FormField
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                  error={errors.newPassword}
                  leftIcon={<Shield size={20} color={theme.colors.primary} />}
                />

                {newPassword.length > 0 && (
                  <PasswordStrengthIndicator password={newPassword} />
                )}

                <FormField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  secureTextEntry
                  error={errors.confirmPassword}
                  leftIcon={<CheckCircle size={20} color={theme.colors.success} />}
                />
              </View>
            </Card>
          </View>

          {/* Security Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Tips</Text>
            <Card variant="elevated" padding="lg">
              <View style={styles.tipsCard}>
                {securityTips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <Text style={styles.tipText}>{tip.text}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <View style={styles.buttonSection}>
              <Button
                onPress={handleChangePassword}
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Change Password
              </Button>
              <Button
                variant="secondary"
                onPress={() => navigation.goBack()}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.section}>
            <Card variant="default" padding="md">
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <AlertCircle size={20} color={theme.colors.warning} />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  After changing your password, you'll be logged out from all other
                  devices for security.
                </Text>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      <ToastContainer toasts={toasts} />
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;