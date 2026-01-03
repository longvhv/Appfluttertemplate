import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface TourStep {
  title: string;
  content: string;
  showControls?: boolean;
}

export interface TourProps {
  steps: TourStep[];
  run?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
  showSkipButton?: boolean;
}

export const Tour: React.FC<TourProps> = ({
  steps,
  run: controlledRun,
  onComplete,
  onSkip,
  showProgress = true,
  showSkipButton = true,
}) => {
  const { theme } = useAppearance();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(controlledRun || false);

  const activeStep = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    setCurrentStep(0);
    if (onSkip) {
      onSkip();
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    setCurrentStep(0);
    if (onComplete) {
      onComplete();
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    tooltipContainer: {
      width: '100%',
      maxWidth: 350,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
      overflow: 'hidden',
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    skipButton: {
      padding: 4,
    },
    progress: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    content: {
      padding: 16,
    },
    contentText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      backgroundColor: 'transparent',
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
    progressDots: {
      flexDirection: 'row',
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
    },
    dotCompleted: {
      backgroundColor: theme.colors.primary + '60',
    },
    dotInactive: {
      backgroundColor: theme.colors.border,
    },
  });

  if (!isRunning || !activeStep) return null;

  return (
    <Modal visible={isRunning} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.tooltipContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>{activeStep.title}</Text>

              {showSkipButton && (
                <TouchableOpacity
                  onPress={handleSkip}
                  style={styles.skipButton}
                  activeOpacity={0.7}
                >
                  <X size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {showProgress && (
              <Text style={styles.progress}>
                Step {currentStep + 1} of {steps.length}
              </Text>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.contentText}>{activeStep.content}</Text>
          </View>

          {/* Footer */}
          {activeStep.showControls !== false && (
            <View style={styles.footer}>
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

                {showProgress && (
                  <View style={styles.progressDots}>
                    {steps.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          index === currentStep
                            ? styles.dotActive
                            : index < currentStep
                            ? styles.dotCompleted
                            : styles.dotInactive,
                        ]}
                      />
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={handleNext}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.buttonText, styles.nextButtonText]}>
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Text>
                  {currentStep < steps.length - 1 && (
                    <ChevronRight size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
