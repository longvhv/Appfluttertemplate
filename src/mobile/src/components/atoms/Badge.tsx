import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { typography, borderRadius, spacing } from '../../theme/tokens';

/**
 * Badge Component - React Native
 * 
 * Small count or status indicator
 */

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Memoized color map
const getVariantColor = (variant: BadgeVariant, theme: any): string => {
  const colorMap: Record<BadgeVariant, string> = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.info,
    default: theme.colors.textSecondary,
  };
  return colorMap[variant];
};

// Memoized size configs
const sizeConfig = {
  sm: { fontSize: 10, padding: 2, minWidth: 16, dotSize: 6 },
  md: { fontSize: 12, padding: 4, minWidth: 20, dotSize: 8 },
  lg: { fontSize: 14, padding: 6, minWidth: 24, dotSize: 10 },
};

export const Badge: React.FC<BadgeProps> = React.memo(({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  count,
  maxCount = 99,
  showZero = false,
  style,
  textStyle,
}) => {
  const { theme } = useAppearance();

  const backgroundColor = useMemo(
    () => getVariantColor(variant, theme),
    [variant, theme]
  );

  const config = useMemo(() => sizeConfig[size], [size]);

  const displayCount = useMemo(() => {
    if (count === undefined) return null;
    if (count === 0 && !showZero) return null;
    return count > maxCount ? `${maxCount}+` : String(count);
  }, [count, maxCount, showZero]);

  const styles = useMemo(() => StyleSheet.create({
    badge: {
      backgroundColor,
      borderRadius: dot ? config.dotSize / 2 : borderRadius.full,
      paddingHorizontal: dot ? 0 : config.padding,
      paddingVertical: dot ? 0 : config.padding,
      minWidth: dot ? config.dotSize : config.minWidth,
      height: dot ? config.dotSize : undefined,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: config.fontSize,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  }), [backgroundColor, dot, config]);

  const content = useMemo(() => {
    if (dot) return null;
    if (displayCount !== null) return displayCount;
    return children;
  }, [dot, displayCount, children]);

  // Don't render if no content and not a dot
  if (!dot && !content) return null;

  return (
    <View style={[styles.badge, style]}>
      {!dot && content && (
        <Text style={[styles.text, textStyle]}>{content}</Text>
      )}
    </View>
  );
});

Badge.displayName = 'Badge';

export default Badge;