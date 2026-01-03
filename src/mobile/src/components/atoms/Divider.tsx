import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

/**
 * Divider Component - React Native
 * 
 * Enhanced with label support to match web (for "or continue with")
 */

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  label,
  style,
}) => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    divider: {
      backgroundColor: color || theme.colors.divider,
      ...(orientation === 'horizontal'
        ? { height: thickness, flex: 1 }
        : { width: thickness, height: '100%' }),
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginHorizontal: 12,
    },
  });

  // With label (horizontal only)
  if (label && orientation === 'horizontal') {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.divider} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.divider} />
      </View>
    );
  }

  // Simple divider
  return <View style={[styles.divider, style]} />;
};

export default Divider;