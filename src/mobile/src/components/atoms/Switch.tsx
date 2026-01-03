import React, { useMemo, useCallback } from 'react';
import { View, Text, Switch as RNSwitch, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing } from '../../theme/tokens';

/**
 * Switch Component - React Native
 * 
 * Toggle switch with label
 */

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Switch = React.memo<SwitchProps>(({
  value = false,
  onValueChange,
  label,
  description,
  disabled = false,
  style,
  labelStyle,
}) => {
  const { theme, isDarkMode } = useAppearance();

  const handleValueChange = useCallback((newValue: boolean) => {
    if (!disabled && onValueChange) {
      onValueChange(newValue);
    }
  }, [disabled, onValueChange]);

  const trackColor = useMemo(() => ({
    false: theme.colors.border,
    true: theme.colors.primary,
  }), [theme.colors.border, theme.colors.primary]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      opacity: disabled ? 0.5 : 1,
    },
    content: {
      flex: 1,
      marginRight: spacing.md,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    description: {
      fontSize: 14,
      color: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[600],
      marginTop: 4,
    },
  }), [theme, isDarkMode, disabled]);

  return (
    <View style={[styles.container, style]}>
      {(label || description) && (
        <View style={styles.content}>
          {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
      <RNSwitch
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        trackColor={trackColor}
        thumbColor="#FFFFFF"
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
});

Switch.displayName = 'Switch';

export default Switch;