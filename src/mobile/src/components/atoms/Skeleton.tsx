import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const { theme, isDarkMode } = useAppearance();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [animation]);

  const variantStyles = {
    text: { height: height || 16, borderRadius: 4 },
    circular: {
      width: width || 40,
      height: height || width || 40,
      borderRadius: 9999,
    },
    rectangular: {},
    rounded: { borderRadius: 8 },
  };

  const baseStyle = {
    backgroundColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
    width: width || (variant === 'text' ? '100%' : width),
    height: height || variantStyles[variant].height,
    ...variantStyles[variant],
  };

  return (
    <Animated.View
      style={[
        baseStyle,
        animation === 'pulse' && { opacity },
      ]}
      accessibilityRole="none"
      accessibilityLabel="Loading"
    />
  );
}

// Skeleton Group Presets
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

export function SkeletonCard() {
  const { theme, isDarkMode } = useAppearance();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: isDarkMode ? theme.colors.border : theme.colors.gray[200],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <SkeletonAvatar size={48} />
        <View style={styles.cardHeaderText}>
          <Skeleton variant="text" width="60%" height={16} />
          <View style={{ height: 8 }} />
          <Skeleton variant="text" width="40%" height={14} />
        </View>
      </View>
      <View style={{ height: 16 }} />
      <SkeletonText lines={3} />
    </View>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <SkeletonAvatar size={40} />
          <View style={styles.listItemText}>
            <Skeleton variant="text" width="70%" height={16} />
            <View style={{ height: 4 }} />
            <Skeleton variant="text" width="50%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  const { theme, isDarkMode } = useAppearance();

  return (
    <View style={styles.table}>
      {/* Header */}
      <View
        style={[
          styles.tableHeader,
          {
            backgroundColor: isDarkMode
              ? theme.colors.gray[800]
              : theme.colors.gray[50],
          },
        ]}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={`${100 / cols}%`}
            height={16}
          />
        ))}
      </View>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / cols}%`}
              height={16}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    gap: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listItemText: {
    flex: 1,
  },
  table: {
    gap: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    gap: 16,
    padding: 12,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 16,
    padding: 12,
  },
});
