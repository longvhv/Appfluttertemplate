import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius } from '../../theme/tokens';

/**
 * Radio Component - React Native
 * 
 * Radio button with label and description
 */

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: RadioSize;
  value?: string;
  style?: ViewStyle;
}

// Size constants
const SIZES = {
  sm: { outer: 16, inner: 8, text: 14, description: 12 },
  md: { outer: 20, inner: 10, text: 16, description: 14 },
  lg: { outer: 24, inner: 12, text: 18, description: 16 },
} as const;

export const Radio = React.memo<RadioProps>(({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  value,
  style,
}) => {
  const { theme } = useAppearance();
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  }, [checked, scaleAnim]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onChange(true);
    }
  }, [disabled, onChange]);

  const sizes = useMemo(() => SIZES[size], [size]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      opacity: disabled ? 0.5 : 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    radioButton: {
      width: sizes.outer,
      height: sizes.outer,
      borderRadius: borderRadius.full,
      borderWidth: 2,
      borderColor: checked ? theme.colors.primary : theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: sizes.inner,
      height: sizes.inner,
      borderRadius: borderRadius.full,
      backgroundColor: theme.colors.primary,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      fontSize: sizes.text,
      color: theme.colors.text,
    },
    description: {
      fontSize: sizes.description,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  }), [theme, sizes, disabled]);

  const radioButton = (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={styles.radioButton}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.radioInner,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </TouchableOpacity>
  );

  if (!label && !description) {
    return <View style={[styles.container, style]}>{radioButton}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {radioButton}
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled}
          style={styles.textContainer}
          activeOpacity={0.7}
        >
          {label && <Text style={styles.label}>{label}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Radio;