import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing } from '../../theme/tokens';

/**
 * StepIndicator Component - React Native
 * 
 * Simple step indicator for multi-step processes (visual only)
 * For full wizard with content, use Stepper from organisms
 */

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  allowClickable?: boolean;
  style?: ViewStyle;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onChange,
  orientation = 'horizontal',
  allowClickable = false,
  style,
}) => {
  const { theme } = useAppearance();

  const handleStepPress = (index: number) => {
    if (allowClickable && onChange && index <= currentStep) {
      onChange(index);
    }
  };

  const styles = StyleSheet.create({
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    verticalContainer: {
      flexDirection: 'column',
    },
    horizontalStep: {
      flex: 1,
      alignItems: 'center',
    },
    verticalStep: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    stepButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      fontSize: 16,
      fontWeight: '500',
    },
    horizontalLine: {
      flex: 1,
      height: 2,
      marginHorizontal: 8,
    },
    verticalLine: {
      width: 2,
      height: 48,
      marginVertical: 4,
      marginLeft: 19, // Center under the circle
    },
    stepContent: {
      flex: 1,
      paddingBottom: spacing.lg,
    },
    stepLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginTop: spacing.xs,
      textAlign: orientation === 'horizontal' ? 'center' : 'left',
    },
    stepDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
      textAlign: orientation === 'horizontal' ? 'center' : 'left',
    },
  });

  if (orientation === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = allowClickable && index <= currentStep;

          return (
            <View key={index} style={styles.verticalStep}>
              {/* Left side - Icon */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleStepPress(index)}
                  disabled={!isClickable}
                  style={[
                    styles.stepButton,
                    {
                      backgroundColor: isCompleted || isCurrent
                        ? theme.colors.primary
                        : theme.colors.surface,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  {isCompleted ? (
                    <Check size={20} color="#FFFFFF" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        {
                          color: isCurrent
                            ? '#FFFFFF'
                            : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </TouchableOpacity>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.verticalLine,
                      {
                        backgroundColor: isCompleted
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  />
                )}
              </View>

              {/* Right side - Content */}
              <View style={styles.stepContent}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                {step.description && (
                  <Text style={styles.stepDescription}>{step.description}</Text>
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
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = allowClickable && index <= currentStep;

        return (
          <React.Fragment key={index}>
            <View style={styles.horizontalStep}>
              <TouchableOpacity
                onPress={() => handleStepPress(index)}
                disabled={!isClickable}
                style={[
                  styles.stepButton,
                  {
                    backgroundColor: isCompleted || isCurrent
                      ? theme.colors.primary
                      : theme.colors.surface,
                  },
                ]}
                activeOpacity={0.7}
              >
                {isCompleted ? (
                  <Check size={20} color="#FFFFFF" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color: isCurrent
                          ? '#FFFFFF'
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.horizontalLine,
                  {
                    backgroundColor: isCompleted
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default StepIndicator;
