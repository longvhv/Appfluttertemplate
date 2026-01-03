import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography, shadows } from '../../theme/tokens';
import Card from './Card';

/**
 * StatsCard Component - React Native
 * 
 * Statistics display card for dashboards
 */

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: TrendDirection;
    value: string | number;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  loading = false,
  onPress,
  style,
}) => {
  const { theme } = useAppearance();

  const getVariantColor = (): string => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTrendColor = (): string => {
    if (!trend) return theme.colors.textSecondary;
    
    switch (trend.direction) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    card: {
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.xs,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: variant !== 'default' ? getVariantColor() + '20' : theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    valueContainer: {
      marginBottom: spacing.sm,
    },
    value: {
      ...typography.h1,
      color: theme.colors.text,
      fontWeight: '700',
    },
    subtitle: {
      ...typography.body2,
      color: theme.colors.textSecondary,
      marginTop: spacing.xs,
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    trendIcon: {
      marginRight: spacing.xs,
    },
    trendValue: {
      ...typography.body2,
      fontWeight: '600',
      color: getTrendColor(),
      marginRight: spacing.xs,
    },
    trendLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
    },
    skeleton: {
      backgroundColor: theme.colors.border,
      borderRadius: borderRadius.sm,
    },
  });

  if (loading) {
    return (
      <Card variant="elevated" style={[styles.card, style]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.skeleton, { width: 100, height: 12, marginBottom: spacing.xs }]} />
          </View>
          <View style={[styles.skeleton, { width: 48, height: 48, borderRadius: borderRadius.md }]} />
        </View>
        <View style={[styles.skeleton, { width: 120, height: 32, marginBottom: spacing.sm }]} />
        <View style={[styles.skeleton, { width: 80, height: 12 }]} />
      </Card>
    );
  }

  return (
    <Card variant="elevated" onPress={onPress} style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {trend && (
        <View style={styles.trendContainer}>
          {trend.direction !== 'neutral' && (
            <View style={styles.trendIcon}>
              {trend.direction === 'up' ? (
                <TrendingUp size={16} color={getTrendColor()} />
              ) : (
                <TrendingDown size={16} color={getTrendColor()} />
              )}
            </View>
          )}

          <Text style={styles.trendValue}>
            {trend.direction === 'up' && '+'}
            {trend.value}
          </Text>

          {trend.label && (
            <Text style={styles.trendLabel}>{trend.label}</Text>
          )}
        </View>
      )}
    </Card>
  );
};

// Grid layout for stats cards
export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  style?: ViewStyle;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  columns = 2,
  style,
}) => {
  const styles = StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -spacing.xs,
    },
    column: {
      width: columns === 2 ? '50%' : '100%',
      padding: spacing.xs,
    },
  });

  const childrenArray = React.Children.toArray(children);

  return (
    <View style={[styles.grid, style]}>
      {childrenArray.map((child, index) => (
        <View key={index} style={styles.column}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default StatsCard;
