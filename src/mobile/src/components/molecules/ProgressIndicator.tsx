import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface ProgressIndicatorProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular' | 'steps';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
  status?: 'default' | 'success' | 'error' | 'warning';
  indeterminate?: boolean;
  steps?: number;
  currentStep?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  showPercentage = true,
  label,
  status = 'default',
  indeterminate = false,
  steps,
  currentStep,
}) => {
  const { theme } = useAppearance();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const percentage = useMemo(
    () => Math.min(Math.max((value / max) * 100, 0), 100),
    [value, max]
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false, // Width animation requires false
    }).start();
  }, [percentage, animatedValue]);

  const getStatusColor = useCallback(() => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return theme.colors.primary;
    }
  }, [status, theme]);

  const getHeight = useCallback(() => {
    switch (size) {
      case 'sm':
        return 4;
      case 'lg':
        return 12;
      default:
        return 8;
    }
  }, [size]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    percentage: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    linearContainer: {
      width: '100%',
      height: getHeight(),
      backgroundColor: theme.colors.border,
      borderRadius: getHeight() / 2,
      overflow: 'hidden',
    },
    linearProgress: {
      height: '100%',
      backgroundColor: getStatusColor(),
      borderRadius: getHeight() / 2,
    },
    stepsContainer: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    step: {
      flex: 1,
      height: getHeight(),
      backgroundColor: theme.colors.border,
      borderRadius: getHeight() / 2,
    },
    stepActive: {
      backgroundColor: getStatusColor(),
    },
    stepDivider: {
      width: 8,
      height: 2,
      backgroundColor: theme.colors.border,
    },
    circularContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    circularProgress: {
      width: size === 'sm' ? 48 : size === 'lg' ? 96 : 64,
      height: size === 'sm' ? 48 : size === 'lg' ? 96 : 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circularText: {
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 20 : 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    stepInfo: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  }), [theme, getStatusColor, getHeight, size]);

  if (variant === 'circular') {
    // Simplified circular progress for React Native
    return (
      <View style={styles.circularContainer}>
        <View style={styles.circularProgress}>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: (size === 'sm' ? 48 : size === 'lg' ? 96 : 64) / 2,
              borderWidth: size === 'sm' ? 4 : size === 'lg' ? 8 : 6,
              borderColor: theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!indeterminate && (
              <>
                {status === 'success' && percentage === 100 ? (
                  <Check size={size === 'sm' ? 20 : size === 'lg' ? 32 : 24} color="#10B981" />
                ) : showPercentage ? (
                  <Text style={styles.circularText}>{Math.round(percentage)}%</Text>
                ) : null}
              </>
            )}
          </View>
        </View>
        {label && (
          <Text style={[styles.label, { marginTop: 12 }]}>{label}</Text>
        )}
      </View>
    );
  }

  if (variant === 'steps' && steps) {
    const activeStep = currentStep !== undefined ? currentStep : Math.ceil((percentage / 100) * steps);

    return (
      <View style={styles.container}>
        {label && (
          <View style={styles.header}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.stepInfo}>
              Step {activeStep} of {steps}
            </Text>
          </View>
        )}

        <View style={styles.stepsContainer}>
          {Array.from({ length: steps }).map((_, index) => (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.step,
                  index < activeStep && styles.stepActive,
                ]}
              />
              {index < steps - 1 && <View style={styles.stepDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  }

  // Linear variant (default)
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && !indeterminate && (
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          )}
        </View>
      )}

      <View style={styles.linearContainer}>
        <Animated.View
          style={[
            styles.linearProgress,
            { width: indeterminate ? '30%' : progressWidth },
          ]}
        />
      </View>
    </View>
  );
};