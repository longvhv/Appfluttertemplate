import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing } from '../../theme/tokens';

/**
 * Timeline Component - React Native
 * 
 * Vertical timeline for activity feeds
 */

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'detailed';
  style?: ViewStyle;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'default',
  style,
}) => {
  const { theme, isDark } = useAppearance();

  const getColorStyles = (color: TimelineItem['color'] = 'default') => {
    switch (color) {
      case 'primary':
        return {
          iconBg: isDark ? 'rgba(99, 102, 241, 0.2)' : '#E0E7FF',
          iconColor: isDark ? '#A5B4FC' : '#4F46E5',
          lineColor: isDark ? 'rgba(99, 102, 241, 0.3)' : '#C7D2FE',
        };
      case 'success':
        return {
          iconBg: isDark ? 'rgba(34, 197, 94, 0.2)' : '#D1FAE5',
          iconColor: isDark ? '#86EFAC' : '#059669',
          lineColor: isDark ? 'rgba(34, 197, 94, 0.3)' : '#A7F3D0',
        };
      case 'warning':
        return {
          iconBg: isDark ? 'rgba(234, 179, 8, 0.2)' : '#FEF3C7',
          iconColor: isDark ? '#FDE047' : '#D97706',
          lineColor: isDark ? 'rgba(234, 179, 8, 0.3)' : '#FDE68A',
        };
      case 'error':
        return {
          iconBg: isDark ? 'rgba(220, 38, 38, 0.2)' : '#FEE2E2',
          iconColor: isDark ? '#FCA5A5' : '#DC2626',
          lineColor: isDark ? 'rgba(220, 38, 38, 0.3)' : '#FECACA',
        };
      default:
        return {
          iconBg: isDark ? '#1F2937' : '#F3F4F6',
          iconColor: isDark ? '#9CA3AF' : '#6B7280',
          lineColor: isDark ? '#374151' : '#E5E7EB',
        };
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    leftColumn: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconDot: {
      width: 8,
      height: 8,
      borderRadius: borderRadius.full,
    },
    line: {
      width: 2,
      flex: 1,
      marginTop: spacing.xs,
      minHeight: 40,
    },
    contentContainer: {
      flex: 1,
      paddingBottom: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    detailContent: {
      marginTop: spacing.sm,
      padding: spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.lg,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => {
        const colors = getColorStyles(item.color);
        const isLast = index === items.length - 1;

        return (
          <View key={item.id} style={styles.itemContainer}>
            {/* Left side - Icon and Line */}
            <View style={styles.leftColumn}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.iconBg },
                ]}
              >
                {item.icon || (
                  <View
                    style={[
                      styles.iconDot,
                      { backgroundColor: colors.iconColor },
                    ]}
                  />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: colors.lineColor },
                  ]}
                />
              )}
            </View>

            {/* Right side - Content */}
            <View style={styles.contentContainer}>
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>

              {item.content && variant === 'detailed' && (
                <View style={styles.detailContent}>{item.content}</View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Timeline;
