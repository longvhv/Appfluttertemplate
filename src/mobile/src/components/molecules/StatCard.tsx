import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { LinearGradient } from 'expo-linear-gradient';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: Icon;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  change?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  change,
  variant = 'default',
  onPress,
}) => {
  const { theme } = useAppearance();

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus;
    }
    
    return trend.isPositive ? TrendingUp : TrendingDown;
  };

  const TrendIcon = getTrendIcon();

  const getTrendColor = () => {
    if (!trend) return theme.colors.textSecondary;
    if (trend.isPositive !== false && trend.value > 0) return '#10B981';
    if (trend.isPositive === false || trend.value < 0) return '#EF4444';
    return theme.colors.textSecondary;
  };

  const styles = StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: 16,
      backgroundColor: variant === 'gradient' ? 'transparent' : theme.colors.card,
      borderWidth: variant === 'minimal' ? 0 : 1,
      borderColor: theme.colors.border,
      borderLeftWidth: variant === 'minimal' ? 4 : 1,
      borderLeftColor: variant === 'minimal' ? theme.colors.primary : theme.colors.border,
      shadowColor: variant === 'gradient' ? '#000' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: variant === 'gradient' ? 0.15 : 0,
      shadowRadius: 8,
      elevation: variant === 'gradient' ? 4 : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 13,
      color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 28,
      fontWeight: '700',
      color: variant === 'gradient' ? '#FFFFFF' : theme.colors.text,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variant === 'gradient'
        ? 'rgba(255, 255, 255, 0.2)'
        : theme.colors.background,
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    trendValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    trendText: {
      fontSize: 13,
      fontWeight: '600',
    },
    trendLabel: {
      fontSize: 13,
      color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary,
    },
  });

  const gradientColors = [
    ['#3B82F6', '#8B5CF6'],
    ['#10B981', '#059669'],
    ['#F59E0B', '#EF4444'],
    ['#EC4899', '#F43F5E'],
  ][Math.floor(Math.random() * 4)];

  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>

        {Icon && (
          <View style={styles.iconContainer}>
            <Icon
              size={24}
              color={variant === 'gradient' ? '#FFFFFF' : theme.colors.primary}
            />
          </View>
        )}
      </View>

      {(trend || change) && (
        <View style={styles.trendContainer}>
          {trend && TrendIcon && (
            <View style={styles.trendValue}>
              <TrendIcon size={16} color={variant === 'gradient' ? '#FFFFFF' : getTrendColor()} />
              <Text
                style={[
                  styles.trendText,
                  { color: variant === 'gradient' ? '#FFFFFF' : getTrendColor() },
                ]}
              >
                {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
          
          {trend?.label && (
            <Text style={styles.trendLabel}>{trend.label}</Text>
          )}
          
          {change && (
            <Text style={styles.trendLabel}>{change}</Text>
          )}
        </View>
      )}
    </>
  );

  if (variant === 'gradient') {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
      <Wrapper onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {content}
        </LinearGradient>
      </Wrapper>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};
