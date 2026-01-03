import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  animation?: 'pulse' | 'wave' | 'none';
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius,
  animation = 'pulse',
  variant = 'rectangular',
}) => {
  const { theme } = useAppearance();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true, // Opacity can use native driver
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true, // Opacity can use native driver
          }),
        ])
      ).start();
    }
  }, [animation, animatedValue]);

  const getVariantStyles = useMemo(() => {
    switch (variant) {
      case 'circular':
        return { borderRadius: 1000 };
      case 'rounded':
        return { borderRadius: 8 };
      case 'rectangular':
        return { borderRadius: 0 };
      case 'text':
      default:
        return { borderRadius: 4 };
    }
  }, [variant]);

  const getDefaultSize = () => {
    switch (variant) {
      case 'circular':
        return { width: 40, height: 40 };
      case 'text':
        return { width: '100%', height: 16 };
      default:
        return { width: '100%', height: 100 };
    }
  };

  const defaultSize = getDefaultSize();
  const finalWidth = width || defaultSize.width;
  const finalHeight = height || defaultSize.height;

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const styles = StyleSheet.create({
    skeleton: {
      backgroundColor: theme.colors.border,
      ...getVariantStyles(),
    },
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: finalWidth,
          height: finalHeight,
          opacity: animation === 'pulse' ? opacity : 1,
        },
      ]}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  const styles = StyleSheet.create({
    container: {
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </View>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

export const SkeletonCard: React.FC = () => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    card: {
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      gap: 12,
    },
    content: {
      gap: 12,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SkeletonAvatar size={48} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </View>
      </View>
      <Skeleton width="100%" height={80} variant="rounded" />
    </View>
  );
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => {
  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    content: {
      flex: 1,
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={styles.item}>
          <SkeletonAvatar size={40} />
          <View style={styles.content}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
};

export const SkeletonGrid: React.FC<{ items?: number }> = ({ items = 4 }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    item: {
      width: '48%',
      gap: 12,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={styles.item}>
          <Skeleton height={150} variant="rounded" />
          <Skeleton width="80%" height={20} />
          <Skeleton width="60%" height={16} />
        </View>
      ))}
    </View>
  );
};