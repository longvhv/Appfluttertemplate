import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  label?: string;
}

export function Spinner({ size = 'md', color = 'primary', label }: SpinnerProps) {
  const { theme, isDarkMode } = useAppearance();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizes = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const colors = {
    primary: theme.colors.primary,
    secondary: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[600],
    white: '#FFFFFF',
    current: isDarkMode ? theme.colors.text.primary : theme.colors.gray[900],
  };

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label || 'Loading'}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader2 size={sizes[size]} color={colors[color]} />
      </Animated.View>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isDarkMode
                ? theme.colors.text.secondary
                : theme.colors.gray[600],
            },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

// Full page spinner overlay
export function SpinnerOverlay({ label = 'Loading...' }: { label?: string }) {
  const { theme, isDarkMode } = useAppearance();

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: isDarkMode
            ? 'rgba(17, 24, 39, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        },
      ]}
    >
      <View style={styles.overlayContent}>
        <Spinner size="xl" color="primary" />
        <Text
          style={[
            styles.overlayLabel,
            {
              color: isDarkMode
                ? theme.colors.text.secondary
                : theme.colors.gray[600],
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

// Inline container spinner
export function SpinnerContainer({
  label = 'Loading...',
  minHeight = 200,
}: {
  label?: string;
  minHeight?: number;
}) {
  return (
    <View style={[styles.spinnerContainer, { minHeight }]}>
      <Spinner size="lg" color="primary" label={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    alignItems: 'center',
    gap: 16,
  },
  overlayLabel: {
    fontSize: 13,
  },
  spinnerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
