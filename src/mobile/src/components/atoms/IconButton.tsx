import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
}

export function IconButton({
  icon: Icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  accessibilityLabel,
}: IconButtonProps) {
  const { theme, isDarkMode } = useAppearance();

  const sizes = {
    xs: { padding: 4, iconSize: 12 },
    sm: { padding: 6, iconSize: 14 },
    md: { padding: 8, iconSize: 18 },
    lg: { padding: 10, iconSize: 20 },
    xl: { padding: 12, iconSize: 24 },
  };

  const variants = {
    default: {
      backgroundColor: isDarkMode ? theme.colors.gray[800] : '#FFFFFF',
      borderColor: isDarkMode ? theme.colors.border : theme.colors.gray[300],
      iconColor: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[700],
      borderWidth: 1,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
      iconColor: '#FFFFFF',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[100],
      borderColor: 'transparent',
      iconColor: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[700],
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      iconColor: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[600],
      borderWidth: 0,
    },
    danger: {
      backgroundColor: theme.colors.error,
      borderColor: 'transparent',
      iconColor: '#FFFFFF',
      borderWidth: 0,
    },
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          padding: currentSize.padding,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: currentVariant.borderWidth,
          opacity: disabled || loading ? 0.5 : 1,
        },
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.iconColor} />
      ) : (
        <Icon size={currentSize.iconSize} color={currentVariant.iconColor} />
      )}
    </TouchableOpacity>
  );
}

// Icon Button Group
export interface IconButtonGroupProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
}

export function IconButtonGroup({
  children,
  spacing = 'sm',
}: IconButtonGroupProps) {
  const spacings = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  };

  return (
    <View style={[styles.group, { gap: spacings[spacing] }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
