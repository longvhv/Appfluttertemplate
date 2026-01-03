import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { typography } from '../../theme/tokens';

/**
 * Text Component - React Native
 * 
 * Typography component matching web variants
 */

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'label';
export type TextColor = 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
export type TextAlign = 'left' | 'center' | 'right';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: TextWeight;
  numberOfLines?: number;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'default',
  align = 'left',
  weight = 'normal',
  numberOfLines,
  style,
}) => {
  const { theme } = useAppearance();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return typography.h1;
      case 'h2':
        return typography.h2;
      case 'h3':
        return typography.h3;
      case 'h4':
        return typography.h4;
      case 'body2':
        return typography.body2;
      case 'caption':
        return typography.caption;
      case 'label':
        return typography.caption;
      default:
        return typography.body1;
    }
  };

  const getColorStyle = (): string => {
    switch (color) {
      case 'muted':
        return theme.colors.textSecondary;
      case 'primary':
        return '#6366F1'; // indigo-600
      case 'secondary':
        return '#8B5CF6'; // purple-600
      case 'success':
        return '#22C55E'; // green-600
      case 'error':
        return '#DC2626'; // red-600
      case 'warning':
        return '#F97316'; // orange-600
      default:
        return theme.colors.text;
    }
  };

  const getWeightStyle = (): TextStyle => {
    switch (weight) {
      case 'medium':
        return { fontWeight: '500' };
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      default:
        return { fontWeight: '400' };
    }
  };

  const styles = StyleSheet.create({
    text: {
      ...getVariantStyle(),
      ...getWeightStyle(),
      color: getColorStyle(),
      textAlign: align,
    },
  });

  return (
    <RNText
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

export default Text;
