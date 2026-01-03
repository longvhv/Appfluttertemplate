import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Mail, ArrowLeft, Lock, CheckCircle } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import IconButton from '../components/atoms/IconButton';
import Card from '../components/molecules/Card';
import FormField from '../components/molecules/FormField';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import { spacing, typography, borderRadius } from '../theme/tokens';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { forgotPassword } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      error('Please enter a valid email address', 'Invalid Email');
      return;
    }

    setLoading(true);
    info('Sending password reset email...', 'Processing');

    try {
      await forgotPassword(email);
      setEmailSent(true);
      success('Password reset email sent successfully!', 'Email Sent');
    } catch (err) {
      error('Failed to send reset email. Please try again.', 'Error');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    headerTitle: {
      ...typography.h3,
      color: theme.colors.text,
      marginLeft: spacing.md,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h1,
      color: theme.colors.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body1,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    form: {
      marginBottom: spacing.lg,
    },
    backLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    backText: {
      ...typography.body2,
      color: theme.colors.primary,
      marginLeft: spacing.xs,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={20} color={theme.colors.text} />}
          onPress={() => navigation.goBack()}
          variant="ghost"
        />
        <Text style={styles.headerTitle}>{t('auth.forgotPassword')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Mail size={40} color={theme.colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={20} color={theme.colors.textSecondary} />}
            required
            editable={!emailSent}
            error={emailError}
          />

          <Button
            onPress={handleForgotPassword}
            loading={loading}
            disabled={loading || emailSent}
            fullWidth
          >
            Send Reset Instructions
          </Button>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={16} color={theme.colors.primary} />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;