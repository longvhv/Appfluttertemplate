import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, typography, borderRadius } from '../../theme/tokens';

/**
 * PasswordStrengthIndicator Component - React Native
 * 
 * Matches web password strength indicator with 5 levels
 */

export interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordChecks {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const { theme } = useAppearance();
  const [strength, setStrength] = useState(0);
  const [checks, setChecks] = useState<PasswordChecks>({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Validate password strength
    const newChecks: PasswordChecks = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setChecks(newChecks);

    const newStrength = Object.values(newChecks).filter(Boolean).length;
    setStrength(newStrength);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: newStrength / 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [password, progressAnim]);

  const getStrengthColor = (): string => {
    if (strength <= 1) return '#EF4444'; // red-500
    if (strength <= 2) return '#F97316'; // orange-500
    if (strength <= 3) return '#EAB308'; // yellow-500
    if (strength === 4) return '#22C55E'; // green-500
    return '#10B981'; // emerald-500
  };

  const getStrengthText = (): string => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };

  const requirements = [
    { key: 'minLength', label: 'At least 8 characters', checked: checks.minLength },
    { key: 'uppercase', label: 'One uppercase letter', checked: checks.uppercase },
    { key: 'lowercase', label: 'One lowercase letter', checked: checks.lowercase },
    { key: 'number', label: 'One number', checked: checks.number },
    { key: 'special', label: 'One special character', checked: checks.special },
  ];

  const styles = StyleSheet.create({
    container: {
      marginTop: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    strengthText: {
      fontSize: 12,
      fontWeight: '600',
      color: getStrengthColor(),
    },
    progressContainer: {
      height: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: getStrengthColor(),
    },
    requirementsContainer: {
      marginTop: spacing.md,
    },
    requirementsTitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: spacing.xs,
    },
    requirement: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    requirementText: {
      fontSize: 12,
      marginLeft: spacing.xs,
    },
  });

  if (!password) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Strength Header */}
      <View style={styles.header}>
        <Text style={styles.label}>Password Strength</Text>
        <Text style={styles.strengthText}>{getStrengthText()}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth }
          ]} 
        />
      </View>

      {/* Requirements Checklist */}
      {showRequirements && (
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Requirements:</Text>
          {requirements.map((req) => (
            <View key={req.key} style={styles.requirement}>
              {req.checked ? (
                <Check size={16} color="#10B981" />
              ) : (
                <X size={16} color={theme.colors.textTertiary} />
              )}
              <Text 
                style={[
                  styles.requirementText,
                  { color: req.checked ? theme.colors.text : theme.colors.textTertiary }
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

export default PasswordStrengthIndicator;
