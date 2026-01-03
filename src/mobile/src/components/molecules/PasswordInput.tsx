import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography } from '../../theme/tokens';
import Input from '../atoms/Input';
import IconButton from '../atoms/IconButton';

/**
 * PasswordInput Component - React Native
 * 
 * Password input with show/hide toggle and strength indicator
 */

export interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: string;
  percentage: number;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  label = 'Password',
  placeholder = '••••••••',
  showStrengthMeter = false,
  showRequirements = false,
  required = false,
  error,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: theme.colors.border, percentage: 0 };
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Cap at 5
    score = Math.min(score, 5);

    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = [
      theme.colors.border,
      '#EF4444', // red
      '#F59E0B', // orange
      '#F59E0B', // orange
      '#10B981', // green
      '#10B981', // green
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
      percentage: (score / 5) * 100,
    };
  };

  const strength = getPasswordStrength(value);

  const requirements = [
    { label: 'At least 8 characters', met: value.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(value) },
    { label: 'Contains number', met: /[0-9]/.test(value) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(value) },
  ];

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    strengthContainer: {
      marginTop: spacing.sm,
    },
    strengthBar: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    strengthFill: {
      height: '100%',
      borderRadius: borderRadius.full,
      backgroundColor: strength.color,
    },
    strengthLabel: {
      ...typography.caption,
      color: strength.color,
      marginTop: spacing.xs,
      fontWeight: '600',
    },
    requirements: {
      marginTop: spacing.md,
      backgroundColor: theme.colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
    },
    requirementsTitle: {
      ...typography.caption,
      color: theme.colors.text,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    requirement: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    requirementText: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginLeft: spacing.xs,
      flex: 1,
    },
    requirementMet: {
      color: theme.colors.success,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        required={required}
        error={error}
        disabled={disabled}
        leftIcon={<Lock size={20} color={theme.colors.textSecondary} />}
        rightIcon={
          <IconButton
            icon={
              showPassword ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )
            }
            onPress={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="sm"
          />
        }
      />

      {/* Strength Meter */}
      {showStrengthMeter && value && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                { width: `${strength.percentage}%` },
              ]}
            />
          </View>
          {strength.label && (
            <Text style={styles.strengthLabel}>{strength.label}</Text>
          )}
        </View>
      )}

      {/* Requirements Checklist */}
      {showRequirements && value && (
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirement}>
              {req.met ? (
                <Check size={14} color={theme.colors.success} />
              ) : (
                <X size={14} color={theme.colors.textTertiary} />
              )}
              <Text
                style={[
                  styles.requirementText,
                  req.met && styles.requirementMet,
                ]}
              >
                {req.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PasswordInput;
