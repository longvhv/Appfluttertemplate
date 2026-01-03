import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  Keyboard,
} from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography } from '../../theme/tokens';

/**
 * OTPInput Component - React Native
 * 
 * One-Time Password input with multiple boxes
 */

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  secure?: boolean;
  style?: ViewStyle;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  label,
  error,
  disabled = false,
  autoFocus = false,
  secure = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [focused, setFocused] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(
    value.split('').concat(Array(length).fill('')).slice(0, length)
  );

  useEffect(() => {
    const newOtp = value.split('').concat(Array(length).fill('')).slice(0, length);
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    const sanitized = text.replace(/[^0-9]/g, '');
    
    if (sanitized.length === 0) {
      // Handle backspace
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      onChange(newOtp.join(''));

      // Move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (sanitized.length === 1) {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = sanitized;
      setOtp(newOtp);
      onChange(newOtp.join(''));

      // Auto-focus next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last digit entered
        Keyboard.dismiss();
        const completeOtp = newOtp.join('');
        if (completeOtp.length === length) {
          onComplete?.(completeOtp);
        }
      }
    } else if (sanitized.length === length) {
      // Paste full OTP
      const newOtp = sanitized.split('');
      setOtp(newOtp);
      onChange(sanitized);
      Keyboard.dismiss();
      onComplete?.(sanitized);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // If current box is empty and backspace pressed, go to previous
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocused(true);
    // Select text in the input when focused
    inputRefs.current[index]?.setNativeProps({
      selection: { start: 0, end: 1 },
    });
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.caption,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    required: {
      color: theme.colors.error,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      height: 56,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.md,
      ...typography.h2,
      color: theme.colors.text,
      textAlign: 'center',
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.card,
    },
    inputFilled: {
      borderColor: theme.colors.primary,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    inputDisabled: {
      opacity: 0.5,
      backgroundColor: theme.colors.disabled,
    },
    errorText: {
      ...typography.caption,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
    helperText: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              focused && styles.inputFocused,
              otp[index] && styles.inputFilled,
              error && styles.inputError,
              disabled && styles.inputDisabled,
            ]}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            secureTextEntry={secure && !!otp[index]}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {!error && (
        <Text style={styles.helperText}>
          Enter the {length}-digit code sent to your device
        </Text>
      )}
    </View>
  );
};

export default OTPInput;
