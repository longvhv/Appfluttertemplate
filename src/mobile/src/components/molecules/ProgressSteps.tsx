import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Check, Circle, AlertCircle } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing } from '../../theme/tokens';

/**
 * ProgressSteps Component - React Native
 * 
 * Progress indicator for multi-step workflows with status
 */

export interface ProgressStep {
  id: string | number;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'simple' | 'numbered';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  style,
}) => {
  const { theme } = useAppearance();

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { circle: 24, icon: 12, label: 12, description: 10, line: 2 };
      case 'lg':
        return { circle: 40, icon: 20, label: 16, description: 14, line: 4 };
      default:
        return { circle: 32, icon: 16, label: 14, description: 12, line: 2 };
    }
  };

  const getStatusColors = (status: ProgressStep['status']) => {
    switch (status) {
      case 'completed':
        return {
          bg: '#22C55E',
          text: theme.colors.text,
          line: '#22C55E',
        };
      case 'current':
        return {
          bg: theme.colors.primary,
          text: theme.colors.text,
          line: theme.colors.border,
        };
      case 'error':
        return {
          bg: theme.colors.error,
          text: theme.colors.text,
          line: theme.colors.border,
        };
      default:
        return {
          bg: theme.colors.surface,
          text: theme.colors.textSecondary,
          line: theme.colors.border,
        };
    }
  };

  const renderIndicator = (step: ProgressStep, index: number) => {
    const sizes = getSizes();
    const colors = getStatusColors(step.status);

    const indicatorStyle = {
      width: sizes.circle,
      height: sizes.circle,
      borderRadius: sizes.circle / 2,
      backgroundColor: colors.bg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    if (variant === 'numbered' && step.status === 'upcoming') {
      return (
        <View style={indicatorStyle}>
          <Text style={{ color: '#FFFFFF', fontSize: sizes.label, fontWeight: '600' }}>
            {index + 1}
          </Text>
        </View>
      );
    }

    if (step.status === 'completed') {
      return (
        <View style={indicatorStyle}>
          <Check size={sizes.icon} color="#FFFFFF" />
        </View>
      );
    }

    if (step.status === 'error') {
      return (
        <View style={indicatorStyle}>
          <AlertCircle size={sizes.icon} color="#FFFFFF" />
        </View>
      );
    }

    if (step.status === 'current') {
      return (
        <View style={indicatorStyle}>
          <Circle size={sizes.icon} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      );
    }

    return (
      <View style={indicatorStyle}>
        <Circle size={sizes.icon} color={theme.colors.textTertiary} />
      </View>
    );
  };

  const sizes = getSizes();

  const styles = StyleSheet.create({
    verticalContainer: {
      gap: spacing.md,
    },
    verticalStep: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    indicatorColumn: {
      alignItems: 'center',
    },
    verticalLine: {
      width: sizes.line,
      flex: 1,
      marginTop: spacing.xs,
    },
    stepContent: {
      flex: 1,
      paddingBottom: spacing.lg,
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    horizontalStep: {
      flex: 1,
      alignItems: 'center',
    },
    horizontalLine: {
      flex: 1,
      height: sizes.line,
      marginHorizontal: spacing.xs,
    },
    label: {
      fontSize: sizes.label,
      fontWeight: '500',
      marginTop: spacing.xs,
    },
    description: {
      fontSize: sizes.description,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  if (orientation === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]}>
        {steps.map((step, index) => {
          const colors = getStatusColors(step.status);

          return (
            <View key={step.id} style={styles.verticalStep}>
              {/* Indicator */}
              <View style={styles.indicatorColumn}>
                {renderIndicator(step, index)}
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.verticalLine,
                      { backgroundColor: colors.line },
                    ]}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.stepContent}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {step.label}
                </Text>
                {step.description && (
                  <Text style={styles.description}>{step.description}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // Horizontal orientation
  return (
    <View style={[styles.horizontalContainer, style]}>
      {steps.map((step, index) => {
        const colors = getStatusColors(step.status);

        return (
          <React.Fragment key={step.id}>
            <View style={styles.horizontalStep}>
              {renderIndicator(step, index)}
              <Text
                style={[
                  styles.label,
                  { color: colors.text, textAlign: 'center' },
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.horizontalLine,
                  { backgroundColor: colors.line },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default ProgressSteps;
