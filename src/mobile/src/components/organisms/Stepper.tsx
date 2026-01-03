import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, ChevronLeft, ChevronRight, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: Icon;
  optional?: boolean;
  content?: React.ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  variant?: 'default' | 'numbered' | 'dots';
  onComplete?: () => void;
  allowStepClick?: boolean;
}

// Memoized step indicator component
const StepIndicator = React.memo<{
  step: StepItem;
  index: number;
  currentStep: number;
  variant: 'default' | 'numbered' | 'dots';
  onPress?: () => void;
  theme: any;
}>(({ step, index, currentStep, variant, onPress, theme }) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;
  const Icon = step.icon;

  const styles = useMemo(() => StyleSheet.create({
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    stepCircle: {
      width: variant === 'dots' ? 12 : 40,
      height: variant === 'dots' ? 12 : 40,
      borderRadius: variant === 'dots' ? 6 : 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isCompleted || isActive
        ? theme.colors.primary
        : theme.colors.border,
      borderWidth: isActive ? 3 : 0,
      borderColor: isActive ? theme.colors.primary + '20' : 'transparent',
    },
    stepNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    stepLabel: {
      marginLeft: 12,
      flex: 1,
    },
    stepLabelText: {
      fontSize: 14,
      fontWeight: isActive ? '600' : '500',
      color: isActive ? theme.colors.primary : theme.colors.text,
    },
    stepDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    optionalBadge: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontStyle: 'italic',
    },
  }), [variant, isCompleted, isActive, theme]);

  const stepContent = useMemo(() => {
    if (variant === 'dots') {
      return null;
    }
    if (isCompleted) {
      return <Check size={20} color="#FFFFFF" />;
    }
    if (Icon) {
      return <Icon size={20} color={isActive ? '#FFFFFF' : theme.colors.textSecondary} />;
    }
    if (variant === 'numbered') {
      return <Text style={styles.stepNumber}>{index + 1}</Text>;
    }
    return null;
  }, [variant, isCompleted, Icon, isActive, index, theme, styles]);

  return (
    <TouchableOpacity
      style={styles.stepRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.stepCircle}>
        {stepContent}
      </View>
      {variant !== 'dots' && (
        <View style={styles.stepLabel}>
          <Text style={styles.stepLabelText}>{step.label}</Text>
          {step.description && (
            <Text style={styles.stepDescription}>{step.description}</Text>
          )}
          {step.optional && (
            <Text style={styles.optionalBadge}>Optional</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

StepIndicator.displayName = 'StepIndicator';

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep: controlledStep,
  onStepChange,
  variant = 'default',
  onComplete,
  allowStepClick = false,
}) => {
  const { theme } = useAppearance();
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const handleStepChange = useCallback((step: number) => {
    if (step < 0 || step >= steps.length) return;
    
    if (onStepChange) {
      onStepChange(step);
    } else {
      setInternalStep(step);
    }
  }, [steps.length, onStepChange]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentStep, steps.length, handleStepChange, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);

  const activeStepData = useMemo(
    () => steps[currentStep],
    [steps, currentStep]
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    stepsHeader: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    connector: {
      width: 2,
      height: 40,
      marginLeft: variant === 'dots' ? 5 : 19,
      marginVertical: -4,
    },
    completedConnector: {
      backgroundColor: theme.colors.primary,
    },
    inactiveConnector: {
      backgroundColor: theme.colors.border,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 200,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      gap: 4,
    },
    backButton: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    backButtonText: {
      color: theme.colors.text,
    },
    nextButtonText: {
      color: '#FFFFFF',
    },
    stepInfo: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Steps Header */}
      <View style={styles.stepsHeader}>
        {steps.map((step, index) => {
          return (
            <View key={step.id}>
              <StepIndicator
                step={step}
                index={index}
                currentStep={currentStep}
                variant={variant}
                onPress={() => allowStepClick && index < currentStep && handleStepChange(index)}
                theme={theme}
              />

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    index < currentStep ? styles.completedConnector : styles.inactiveConnector,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Step Content */}
      {activeStepData?.content && (
        <View style={styles.content}>
          {activeStepData.content}
        </View>
      )}

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton]}
          onPress={handleBack}
          disabled={currentStep === 0}
          activeOpacity={0.7}
        >
          <ChevronLeft size={16} color={theme.colors.text} />
          <Text style={[styles.buttonText, styles.backButtonText]}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.stepInfo}>
          Step {currentStep + 1} of {steps.length}
        </Text>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.nextButtonText]}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Text>
          {currentStep < steps.length - 1 && (
            <ChevronRight size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};