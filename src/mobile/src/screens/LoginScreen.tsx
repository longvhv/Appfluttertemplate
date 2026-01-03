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
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/molecules/Card';
import Divider from '../components/atoms/Divider';
import IconButton from '../components/atoms/IconButton';
import FormField from '../components/molecules/FormField';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import Checkbox from '../components/atoms/Checkbox';
import { spacing, typography, borderRadius } from '../theme/tokens';

/**
 * Login Screen - React Native
 * 
 * Redesigned to match web version with gradient background and modern UI
 * Enhanced with Phase 6-7 components
 */

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      error('Please fix the errors in the form', 'Validation Error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      success('Login successful! Welcome back.', 'Success');
    } catch (err) {
      error('Invalid email or password. Please try again.', 'Login Failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    info(`Connecting to ${provider}...`, 'Social Login');
    console.log(`Login with ${provider}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      opacity: 0.1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    header: {
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: borderRadius['3xl'],
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    logo: {
      fontSize: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    cardContent: {
      gap: spacing.md,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
    },
    forgotPasswordText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    socialButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    socialButton: {
      flex: 1,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🚀</Text>
          </View>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" padding="xl">
          <View style={styles.cardContent}>
            {/* Email Field */}
            <FormField
              label={t('login.email')}
              error={errors.email}
              required
            >
              <Input
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<Mail size={20} color={theme.colors.textSecondary} />}
              />
            </FormField>

            {/* Password Field */}
            <FormField
              label={t('login.password')}
              error={errors.password}
              required
            >
              <Input
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
                rightIcon={
                  showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </FormField>

            {/* Remember Me Checkbox */}
            <Checkbox
              label={t('login.rememberMe')}
              value={rememberMe}
              onValueChange={setRememberMe}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                {t('login.forgotPassword')}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              variant="gradient"
              size="lg"
              fullWidth
            >
              {t('login.signIn')}
            </Button>

            {/* Divider */}
            <Divider label={t('login.orContinueWith')} />

            {/* Social Login */}
            <View style={styles.socialButtons}>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialLogin('Google')}
                />
              </View>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialLogin('Facebook')}
                />
              </View>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialLogin('Zalo')}
                />
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('login.noAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>{t('login.signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScrollView>
      <ToastContainer toasts={toasts} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;