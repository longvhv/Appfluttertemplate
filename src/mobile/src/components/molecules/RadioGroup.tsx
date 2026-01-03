import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radio, RadioProps } from '../atoms/Radio';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing } from '../../theme/tokens';

/**
 * RadioGroup Component - React Native
 * 
 * Group of radio buttons for single selection
 */

export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
  label?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  size?: RadioProps['size'];
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  label,
  error,
  orientation = 'vertical',
  size = 'md',
  style,
}) => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: spacing.sm,
    },
    optionsContainer: {
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
      gap: spacing.md,
    },
    error: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={() => !option.disabled && onChange(option.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default RadioGroup;
