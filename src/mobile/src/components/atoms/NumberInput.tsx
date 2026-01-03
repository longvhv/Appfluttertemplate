import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing, typography } from '../../theme/tokens';

/**
 * NumberInput Component - React Native
 * 
 * Numeric input with increment/decrement buttons
 */

export interface NumberInputProps {
  label?: string;
  error?: string;
  hint?: string;
  value: number;
  onChangeValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showButtons?: boolean;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  error,
  hint,
  value,
  onChangeValue,
  min,
  max,
  step = 1,
  precision = 0,
  showButtons = true,
  prefix,
  suffix,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [isFocused, setIsFocused] = useState(false);

  const clampValue = (num: number): number => {
    let clamped = num;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return Number(clamped.toFixed(precision));
  };

  const increment = () => {
    const newValue = clampValue(value + step);
    onChangeValue(newValue);
  };

  const decrement = () => {
    const newValue = clampValue(value - step);
    onChangeValue(newValue);
  };

  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      onChangeValue(clampValue(num));
    } else if (cleaned === '' || cleaned === '-') {
      onChangeValue(0);
    }
  };

  const canDecrement = min === undefined || value > min;
  const canIncrement = max === undefined || value < max;

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    button: {
      width: 40,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
    },
    prefix: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginRight: 4,
    },
    suffix: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: theme.colors.text,
      textAlign: 'center',
      height: 48,
    },
    footer: {
      marginTop: spacing.xs,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
    },
    hintText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        {showButtons && (
          <TouchableOpacity
            onPress={decrement}
            disabled={disabled || !canDecrement}
            style={styles.button}
          >
            <Minus
              size={20}
              color={
                disabled || !canDecrement
                  ? theme.colors.disabled
                  : theme.colors.text
              }
            />
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          {prefix && <Text style={styles.prefix}>{prefix}</Text>}
          
          <TextInput
            value={value.toFixed(precision)}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="numeric"
            editable={!disabled}
            style={[styles.input, { opacity: disabled ? 0.5 : 1 }]}
            placeholderTextColor={theme.colors.placeholder}
          />
          
          {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>

        {showButtons && (
          <TouchableOpacity
            onPress={increment}
            disabled={disabled || !canIncrement}
            style={styles.button}
          >
            <Plus
              size={20}
              color={
                disabled || !canIncrement
                  ? theme.colors.disabled
                  : theme.colors.text
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || hint) && (
        <View style={styles.footer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!error && hint && <Text style={styles.hintText}>{hint}</Text>}
        </View>
      )}
    </View>
  );
};

export default NumberInput;
