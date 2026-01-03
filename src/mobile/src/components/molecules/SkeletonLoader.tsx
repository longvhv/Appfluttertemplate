import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius } from '../../theme/tokens';

/**
 * SkeletonLoader Component - React Native
 * 
 * Animated loading placeholder
 */

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number;
  circle?: boolean;
  animation?: boolean;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height = 16,
  circle = false,
  animation = true,
  style,
}) => {
  const { theme } = useAppearance();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animation, pulseAnim]);

  const opacity = animation
    ? pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
      })
    : 0.3;

  const getHeight = (): number => {
    if (circle) return typeof width === 'number' ? width : 40;
    
    switch (variant) {
      case 'circular':
        return typeof width === 'number' ? width : 40;
      case 'rectangular':
        return height;
      default:
        return height;
    }
  };

  const getBorderRadius = (): number => {
    if (circle || variant === 'circular') return 999;
    if (variant === 'rectangular') return borderRadius.md;
    return borderRadius.sm;
  };

  const styles = StyleSheet.create({
    skeleton: {
      backgroundColor: theme.colors.border,
      width,
      height: getHeight(),
      borderRadius: getBorderRadius(),
    },
  });

  return (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  );
};

// Predefined Skeleton Patterns
export const SkeletonText: React.FC<{ lines?: number; style?: ViewStyle }> = ({
  lines = 3,
  style,
}) => {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="text"
          width={index === lines - 1 ? '80%' : '100%'}
          height={16}
          style={{ marginBottom: 8 }}
        />
      ))}
    </View>
  );
};

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { theme } = useAppearance();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.lg,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <SkeletonLoader
          variant="circular"
          width={40}
          height={40}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <SkeletonLoader width="60%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="40%" height={12} />
        </View>
      </View>
      <SkeletonText lines={3} />
    </View>
  );
};

export const SkeletonList: React.FC<{
  count?: number;
  style?: ViewStyle;
}> = ({ count = 3, style }) => {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} style={{ marginBottom: 12 }} />
      ))}
    </View>
  );
};

export default SkeletonLoader;
