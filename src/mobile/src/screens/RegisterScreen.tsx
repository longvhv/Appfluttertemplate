import React, { useState, useEffect } from 'react';
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
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Check, X } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/molecules/Card';
import FormField from '../components/molecules/FormField';
import Divider from '../components/atoms/Divider';
import IconButton from '../components/atoms/IconButton';
import PasswordStrengthIndicator from '../components/molecules/PasswordStrengthIndicator';
import { useToast, ToastContainer } from '../components/molecules/Toast';
import Checkbox from '../components/atoms/Checkbox';
import ProgressBar from '../components/atoms/ProgressBar';
import { spacing, borderRadius } from '../theme/tokens';

/**
 * Register Screen - React Native
 * 
 * Redesigned with password strength indicator and modern UI
 * Enhanced with Phase 6-7 components
 */

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const { t } = useLanguage();
  const { theme } = useAppearance();
  const { toasts, success, error, info } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Validate password strength
    const checks = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordChecks(checks);

    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    // Validate form fields
    const newErrors: ValidationErrors = {};

    if (name && name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (password && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [name, email, password, confirmPassword]);

  const handleRegister = async () => {
    // Validate
    if (!name || !email || !password || !confirmPassword) {
      error('Please fill in all fields', 'Validation Error');
      return;
    }

    if (Object.keys(errors).length > 0) {
      error('Please fix the errors in the form', 'Validation Error');
      return;
    }

    if (!agreeToTerms) {
      error('You must agree to the Terms and Conditions', 'Agreement Required');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      success('Account created successfully! Please verify your email.', 'Success');
      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (err) {
      error('Registration failed. Please try again.', 'Error');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    info(`Connecting to ${provider}...`, 'Social Register');
    console.log(`Register with ${provider}`);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return theme.colors.error;
    if (passwordStrength <= 2) return '#F59E0B'; // orange
    if (passwordStrength <= 3) return '#EAB308'; // yellow
    if (passwordStrength === 4) return '#10B981'; // green
    return '#059669'; // emerald
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
    return 'Very Strong';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    passwordRequirements: {
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    requirementText: {
      fontSize: 12,
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
            <Text style={styles.logo}>🎉</Text>
          </View>
          <Text style={styles.title}>{t('register.title')}</Text>
          <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" padding="xl">
          <View style={styles.cardContent}>
            {/* Name Field */}
            <FormField label={t('register.name')} error={errors.name} required>
              <Input
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="John Doe"
                autoCapitalize="words"
                leftIcon={<UserIcon size={20} color={theme.colors.textSecondary} />}
              />
            </FormField>

            {/* Email Field */}
            <FormField label={t('register.email')} error={errors.email} required>
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
            <FormField label={t('register.password')} error={errors.password} required>
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <PasswordStrengthIndicator password={password} />
            )}

            {/* Password Requirements */}
            {password.length > 0 && (
              <View style={styles.passwordRequirements}>
                <View style={styles.requirementRow}>
                  {passwordChecks.minLength ? (
                    <Check size={14} color={theme.colors.success} />
                  ) : (
                    <X size={14} color={theme.colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color: passwordChecks.minLength
                          ? theme.colors.success
                          : theme.colors.textTertiary,
                      },
                    ]}
                  >
                    At least 8 characters
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  {passwordChecks.uppercase ? (
                    <Check size={14} color={theme.colors.success} />
                  ) : (
                    <X size={14} color={theme.colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color: passwordChecks.uppercase
                          ? theme.colors.success
                          : theme.colors.textTertiary,
                      },
                    ]}
                  >
                    One uppercase letter
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  {passwordChecks.lowercase ? (
                    <Check size={14} color={theme.colors.success} />
                  ) : (
                    <X size={14} color={theme.colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color: passwordChecks.lowercase
                          ? theme.colors.success
                          : theme.colors.textTertiary,
                      },
                    ]}
                  >
                    One lowercase letter
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  {passwordChecks.number ? (
                    <Check size={14} color={theme.colors.success} />
                  ) : (
                    <X size={14} color={theme.colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color: passwordChecks.number
                          ? theme.colors.success
                          : theme.colors.textTertiary,
                      },
                    ]}
                  >
                    One number
                  </Text>
                </View>

                <View style={styles.requirementRow}>
                  {passwordChecks.special ? (
                    <Check size={14} color={theme.colors.success} />
                  ) : (
                    <X size={14} color={theme.colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color: passwordChecks.special
                          ? theme.colors.success
                          : theme.colors.textTertiary,
                      },
                    ]}
                  >
                    One special character
                  </Text>
                </View>
              </View>
            )}

            {/* Confirm Password Field */}
            <FormField
              label={t('register.confirmPassword')}
              error={errors.confirmPassword}
              required
            >
              <Input
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )
                }
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </FormField>

            {/* Terms and Conditions Checkbox */}
            <Checkbox
              label="I agree to the Terms and Conditions"
              checked={agreeToTerms}
              onChange={setAgreeToTerms}
              color={theme.colors.primary}
            />

            {/* Register Button */}
            <Button
              onPress={handleRegister}
              loading={loading}
              disabled={loading || Object.keys(errors).length > 0}
              variant="gradient"
              size="lg"
              fullWidth
            >
              {t('register.signUp')}
            </Button>

            {/* Divider */}
            <Divider label={t('register.orContinueWith')} />

            {/* Social Register */}
            <View style={styles.socialButtons}>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialRegister('Google')}
                />
              </View>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialRegister('Facebook')}
                />
              </View>
              <View style={styles.socialButton}>
                <IconButton
                  icon={<Mail size={20} color={theme.colors.text} />}
                  variant="secondary"
                  size="lg"
                  onPress={() => handleSocialRegister('Zalo')}
                />
              </View>
            </View>

            {/* Sign In Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('register.hasAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>{t('register.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScrollView>
      <ToastContainer toasts={toasts} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;