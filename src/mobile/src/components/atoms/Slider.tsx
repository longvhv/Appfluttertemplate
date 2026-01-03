import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing } from '../../theme/tokens';

/**
 * Slider Component - React Native
 * 
 * Range slider for numeric input
 * Note: Uses @react-native-community/slider
 */

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: SliderSize;
  showValue?: boolean;
  showMinMax?: boolean;
  color?: string;
  formatValue?: (value: number) => string;
  style?: ViewStyle;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  showValue = false,
  showMinMax = false,
  color = '#6366F1',
  formatValue = (v) => v.toString(),
  style,
}) => {
  const { theme } = useAppearance();

  const getThumbSize = () => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 20;
      default:
        return 16;
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    valueText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },
    minMaxText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {showValue && (
        <View style={styles.header}>
          <Text style={styles.valueText}>{formatValue(value)}</Text>
        </View>
      )}

      <RNSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={color}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={disabled ? theme.colors.disabled : color}
        style={{ opacity: disabled ? 0.5 : 1 }}
      />

      {showMinMax && (
        <View style={styles.footer}>
          <Text style={styles.minMaxText}>{formatValue(min)}</Text>
          <Text style={styles.minMaxText}>{formatValue(max)}</Text>
        </View>
      )}
    </View>
  );
};

// Range Slider (two thumbs)
export interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  onValuesChange: (min: number, max: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValues?: boolean;
  color?: string;
  formatValue?: (value: number) => string;
  style?: ViewStyle;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  minValue,
  maxValue,
  onValuesChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValues = false,
  color = '#6366F1',
  formatValue = (v) => v.toString(),
  style,
}) => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    valueText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    sliderContainer: {
      gap: spacing.xs,
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {showValues && (
        <View style={styles.header}>
          <Text style={styles.valueText}>{formatValue(minValue)}</Text>
          <Text style={styles.valueText}>{formatValue(maxValue)}</Text>
        </View>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Min</Text>
        <RNSlider
          value={minValue}
          onValueChange={(val) => onValuesChange(val, maxValue)}
          minimumValue={min}
          maximumValue={maxValue}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={color}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={disabled ? theme.colors.disabled : color}
        />

        <Text style={styles.label}>Max</Text>
        <RNSlider
          value={maxValue}
          onValueChange={(val) => onValuesChange(minValue, val)}
          minimumValue={minValue}
          maximumValue={max}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={color}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={disabled ? theme.colors.disabled : color}
        />
      </View>
    </View>
  );
};

export default Slider;
