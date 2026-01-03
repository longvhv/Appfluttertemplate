import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useAppearance, useScaledFontSize, useScaledSpacing } from '../../contexts/AppearanceContext';
import { typography, borderRadius, spacing } from '../../theme/tokens';

/**
 * Input Component - React Native
 * 
 * Enhanced with icon click support to match web
 */

export interface InputComponentProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

// Memoized icon wrapper
const IconWrapper = React.memo<{
  icon: React.ReactNode;
  onPress?: () => void;
  position: 'left' | 'right';
}>(({ icon, onPress, position }) => {
  if (!icon) return null;

  const content = <View style={{ marginRight: position === 'left' ? 8 : 0, marginLeft: position === 'right' ? 8 : 0 }}>{icon}</View>;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

IconWrapper.displayName = 'IconWrapper';

export const Input = React.memo<InputComponentProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  containerStyle,
  inputStyle,
  required,
  ...textInputProps
}) => {
  const { theme } = useAppearance();
  const [isFocused, setIsFocused] = useState(false);
  const scaledFontSize = useScaledFontSize(typography.body1.fontSize);
  const scaledSpacing = useScaledSpacing(spacing.md);

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    textInputProps.onFocus?.(e);
  }, [textInputProps]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    textInputProps.onBlur?.(e);
  }, [textInputProps]);

  const borderColor = useMemo(() => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  }, [error, isFocused, theme.colors]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: scaledSpacing,
    },
    labelContainer: {
      flexDirection: 'row',
      marginBottom: spacing.xs,
    },
    label: {
      fontSize: scaledFontSize * 0.875,
      fontWeight: '500',
      color: theme.colors.text,
    },
    required: {
      color: theme.colors.error,
      marginLeft: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor,
      borderRadius: borderRadius.md,
      backgroundColor: theme.colors.background,
      paddingHorizontal: scaledSpacing * 0.75,
    },
    input: {
      flex: 1,
      fontSize: scaledFontSize,
      color: theme.colors.text,
      paddingVertical: scaledSpacing * 0.75,
    },
    helperText: {
      fontSize: scaledFontSize * 0.75,
      color: error ? theme.colors.error : theme.colors.textSecondary,
      marginTop: spacing.xs,
    },
  }), [scaledFontSize, scaledSpacing, theme, borderColor, error]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View style={styles.inputContainer}>
        <IconWrapper icon={leftIcon} onPress={onLeftIconClick} position="left" />

        <TextInput
          {...textInputProps}
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.colors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <IconWrapper icon={rightIcon} onPress={onRightIconClick} position="right" />
      </View>

      {(error || helperText) && (
        <Text style={styles.helperText}>{error || helperText}</Text>
      )}
    </View>
  );
});

export default Input;