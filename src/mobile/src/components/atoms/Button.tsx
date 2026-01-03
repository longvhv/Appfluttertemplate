import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppearance, useScaledFontSize, useScaledSpacing } from '../../contexts/AppearanceContext';
import { typography, borderRadius } from '../../theme/tokens';

/**
 * Button Component - React Native
 * 
 * Enhanced with gradient variant to match web
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { theme, isDark } = useAppearance();
  const scaledFontSize = useScaledFontSize(typography.button.fontSize);
  const baseSpacing = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const scaledSpacing = useScaledSpacing(baseSpacing);

  const getBackgroundColor = (): string => {
    if (disabled) return theme.colors.disabled;
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.surface;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.colors.error;
      case 'gradient':
        return 'transparent'; // Gradient handled separately
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.colors.textTertiary;
    
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'gradient':
        return '#FFFFFF';
      case 'secondary':
        return theme.colors.text;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = (): string | undefined => {
    if (variant === 'outline') {
      return disabled ? theme.colors.disabled : theme.colors.primary;
    }
    return undefined;
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variant === 'gradient' ? 'transparent' : getBackgroundColor(),
      paddingVertical: scaledSpacing,
      paddingHorizontal: scaledSpacing * 1.5,
      borderRadius: size === 'sm' ? borderRadius.md : borderRadius.lg,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: getBorderColor(),
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    gradientButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaledSpacing,
      paddingHorizontal: scaledSpacing * 1.5,
      borderRadius: size === 'sm' ? borderRadius.md : borderRadius.lg,
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    text: {
      fontSize: scaledFontSize,
      fontWeight: '600',
      color: getTextColor(),
    },
    iconLeft: {
      marginRight: 8,
    },
    iconRight: {
      marginLeft: 8,
    },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={getTextColor()}
          size="small"
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <Text style={[styles.text, textStyle]}>{children}</Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </>
    );
  };

  // Gradient button
  if (variant === 'gradient' && !disabled && !loading) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={style}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular button
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;