import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle, LayoutChangeEvent } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, shadows } from '../../theme/tokens';

/**
 * SegmentedControl Component - React Native
 * 
 * iOS-style segmented control with animated indicator
 */

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [layouts, setLayouts] = useState<Map<string, { width: number; x: number }>>(new Map());
  const indicatorAnim = useState(new Animated.Value(0))[0];
  const indicatorWidth = useState(new Animated.Value(0))[0];

  const selectedIndex = options.findIndex((opt) => opt.value === value);

  useEffect(() => {
    const layout = layouts.get(value);
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorAnim, {
          toValue: layout.x,
          useNativeDriver: false,
          tension: 100,
          friction: 10,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 100,
          friction: 10,
        }),
      ]).start();
    }
  }, [value, layouts, indicatorAnim, indicatorWidth]);

  const handleLayout = (optionValue: string, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    setLayouts((prev) => new Map(prev).set(optionValue, { width, x }));
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { height: 32, fontSize: 12, padding: 12, iconSize: 12 };
      case 'lg':
        return { height: 48, fontSize: 16, padding: 24, iconSize: 20 };
      default:
        return { height: 40, fontSize: 14, padding: 16, iconSize: 16 };
    }
  };

  const sizes = getSizes();

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.xl,
      padding: 4,
      width: fullWidth ? '100%' : 'auto',
    },
    indicator: {
      position: 'absolute',
      top: 4,
      height: sizes.height,
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      ...shadows.sm,
    },
    option: {
      flex: fullWidth ? 1 : 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: sizes.height,
      paddingHorizontal: sizes.padding,
      gap: 8,
      zIndex: 10,
    },
    optionText: {
      fontSize: sizes.fontSize,
      fontWeight: '500',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Animated indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            left: indicatorAnim,
            width: indicatorWidth,
          },
        ]}
      />

      {/* Options */}
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => !option.disabled && onChange(option.value)}
            onLayout={(event) => handleLayout(option.value, event)}
            disabled={option.disabled}
            style={styles.option}
            activeOpacity={0.7}
          >
            {option.icon}
            <Text
              style={[
                styles.optionText,
                {
                  color: isSelected
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                  opacity: option.disabled ? 0.5 : 1,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
