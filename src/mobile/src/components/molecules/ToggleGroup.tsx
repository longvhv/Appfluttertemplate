import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing } from '../../theme/tokens';

/**
 * ToggleGroup Component - React Native
 * 
 * Button group with single or multiple selection
 */

export interface ToggleGroupOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  type = 'single',
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  label,
  style,
}) => {
  const { theme } = useAppearance();
  const [selected, setSelected] = useState<string | string[]>(
    value || (type === 'multiple' ? [] : '')
  );

  const isSelected = (optionValue: string) => {
    if (type === 'multiple' && Array.isArray(selected)) {
      return selected.includes(optionValue);
    }
    return selected === optionValue;
  };

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    let newValue: string | string[];

    if (type === 'multiple') {
      const currentArray = Array.isArray(selected) ? selected : [];
      if (currentArray.includes(optionValue)) {
        newValue = currentArray.filter((v) => v !== optionValue);
      } else {
        newValue = [...currentArray, optionValue];
      }
    } else {
      newValue = selected === optionValue ? '' : optionValue;
    }

    setSelected(newValue);
    onChange?.(newValue);
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { px: 12, py: 6, fontSize: 12 };
      case 'lg':
        return { px: 24, py: 12, fontSize: 16 };
      default:
        return { px: 16, py: 10, fontSize: 14 };
    }
  };

  const getButtonStyle = (option: ToggleGroupOption) => {
    const selectedState = isSelected(option.value);
    const sizes = getSizes();

    const baseStyle = {
      paddingHorizontal: sizes.px,
      paddingVertical: sizes.py,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: selectedState
        ? theme.colors.primary
        : theme.colors.border,
    };

    if (variant === 'solid') {
      return {
        ...baseStyle,
        backgroundColor: selectedState
          ? theme.colors.primary
          : theme.colors.surface,
      };
    }

    if (variant === 'outline') {
      return {
        ...baseStyle,
        backgroundColor: selectedState
          ? theme.colors.primary + '20'
          : 'transparent',
      };
    }

    // default variant
    return {
      ...baseStyle,
      backgroundColor: selectedState
        ? theme.colors.primary + '20'
        : theme.colors.surface,
    };
  };

  const sizes = getSizes();

  const styles = StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    group: {
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      gap: spacing.xs,
      flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderRadius: borderRadius.lg,
    },
    buttonText: {
      fontSize: sizes.fontSize,
      fontWeight: '500',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.group}>
        {options.map((option) => {
          const selectedState = isSelected(option.value);
          const isDisabled = option.disabled || disabled;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleToggle(option.value)}
              disabled={isDisabled}
              style={[
                styles.button,
                getButtonStyle(option),
                { opacity: isDisabled ? 0.5 : 1 },
              ]}
              activeOpacity={0.7}
            >
              {option.icon}
              
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      variant === 'solid' && selectedState
                        ? '#FFFFFF'
                        : selectedState
                        ? theme.colors.primary
                        : theme.colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>

              {type === 'multiple' && selectedState && (
                <Check
                  size={16}
                  color={
                    variant === 'solid'
                      ? '#FFFFFF'
                      : theme.colors.primary
                  }
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ToggleGroup;
