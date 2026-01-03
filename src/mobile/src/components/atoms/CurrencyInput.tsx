import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing, typography } from '../../theme/tokens';

/**
 * CurrencyInput Component - React Native
 * 
 * Currency input with formatting
 */

export interface CurrencyInputProps {
  value?: number;
  onChangeValue?: (value: number) => void;
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChangeValue,
  currency = 'USD',
  locale = 'en-US',
  min,
  max,
  disabled = false,
  placeholder = '0.00',
  error = false,
  label,
  style,
}) => {
  const { theme } = useAppearance();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(formatCurrency(value));

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    VND: '₫',
  };

  const symbol = currencySymbols[currency] || currency;

  function formatCurrency(num: number): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(num);
  }

  function parseCurrency(str: string): number {
    const cleaned = str.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned) || 0;
    return num;
  }

  const handleChangeText = (text: string) => {
    setInputValue(text);
    
    const numValue = parseCurrency(text);
    
    if (min !== undefined && numValue < min) return;
    if (max !== undefined && numValue > max) return;
    
    onChangeValue?.(numValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseCurrency(inputValue);
    setInputValue(formatCurrency(numValue));
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number on focus for easier editing
    setInputValue(value.toString());
  };

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
      paddingHorizontal: spacing.md,
    },
    symbol: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      marginRight: spacing.xs,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: theme.colors.text,
      height: 48,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, { opacity: disabled ? 0.5 : 1 }]}>
        <Text style={styles.symbol}>{symbol}</Text>
        
        <TextInput
          value={inputValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="decimal-pad"
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default CurrencyInput;
