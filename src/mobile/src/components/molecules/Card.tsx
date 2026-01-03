import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance, useScaledSpacing } from '../../contexts/AppearanceContext';
import { borderRadius, shadows, spacing } from '../../theme/tokens';

/**
 * Card Component - React Native
 * 
 * Container with shadow and rounded corners
 */

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  style?: ViewStyle;
}

// Padding map
const PADDING_MULTIPLIERS: Record<CardPadding, number> = {
  none: 0,
  sm: 0.75,
  md: 1,
  lg: 1.5,
  xl: 2,
};

export const Card = React.memo<CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  style,
}) => {
  const { theme } = useAppearance();
  const basePadding = useScaledSpacing(spacing.md);

  const calculatedPadding = useMemo(() => {
    return basePadding * PADDING_MULTIPLIERS[padding];
  }, [basePadding, padding]);

  const styles = useMemo(() => {
    const variantStyle = {
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      elevated: shadows.md,
      default: shadows.sm,
    }[variant];

    return StyleSheet.create({
      card: {
        backgroundColor: theme.colors.card,
        borderRadius: borderRadius.lg,
        padding: calculatedPadding,
        ...variantStyle,
      },
    });
  }, [theme, variant, calculatedPadding]);

  const handlePress = useCallback(() => {
    if (onPress) onPress();
  }, [onPress]);

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
});

Card.displayName = 'Card';

export default Card;