import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const { theme, isDarkMode } = useAppearance();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 4,
    md: 8,
    lg: 12,
  };

  const variantColors = {
    default: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.error,
    info: theme.colors.info,
  };

  const height = sizes[size];
  const color = variantColors[variant];

  return (
    <View>
      {/* Label */}
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text
              style={[
                styles.label,
                {
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[700],
                },
              ]}
            >
              {label}
            </Text>
          )}
          {showLabel && (
            <Text
              style={[
                styles.label,
                {
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[700],
                },
              ]}
            >
              {Math.round(percentage)}%
            </Text>
          )}
        </View>
      )}

      {/* Progress Bar */}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: isDarkMode
              ? theme.colors.gray[700]
              : theme.colors.gray[200],
          },
        ]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
        accessibilityLabel={label}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

// Circular Progress
export interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  label?: string;
}

export function CircularProgress({
  value,
  size = 64,
  strokeWidth = 4,
  variant = 'default',
  showLabel = true,
  label,
}: CircularProgressProps) {
  const { theme, isDarkMode } = useAppearance();
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.error,
    info: theme.colors.info,
  };

  const color = variantColors[variant];
  const backgroundColor = isDarkMode
    ? theme.colors.gray[700]
    : theme.colors.gray[200];

  return (
    <View style={styles.circularContainer}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Center label */}
        {showLabel && (
          <View style={styles.circularLabel}>
            <Text
              style={[
                styles.circularLabelText,
                {
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[700],
                },
              ]}
            >
              {Math.round(percentage)}%
            </Text>
          </View>
        )}
      </View>

      {/* Bottom label */}
      {label && (
        <Text
          style={[
            styles.bottomLabel,
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

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  track: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
  circularContainer: {
    alignItems: 'center',
    gap: 8,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  circularLabel: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularLabelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomLabel: {
    fontSize: 13,
  },
});
