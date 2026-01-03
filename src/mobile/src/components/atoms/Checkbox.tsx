import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Constants outside component
const SIZES = {
  sm: { box: 16, icon: 12, label: 13, description: 11 },
  md: { box: 20, icon: 14, label: 14, description: 12 },
  lg: { box: 24, icon: 16, label: 16, description: 14 },
} as const;

// Memoized icon component
const CheckboxIcon = React.memo<{
  checked: boolean;
  indeterminate: boolean;
  iconSize: number;
}>(({ checked, indeterminate, iconSize }) => {
  if (indeterminate) {
    return <Minus size={iconSize} color="#FFFFFF" strokeWidth={3} />;
  }
  if (checked) {
    return <Check size={iconSize} color="#FFFFFF" strokeWidth={3} />;
  }
  return null;
});

CheckboxIcon.displayName = 'CheckboxIcon';

export const Checkbox = React.memo<CheckboxProps>(({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  label,
  description,
  error,
  size = 'md',
}) => {
  const { theme, isDarkMode } = useAppearance();

  const handlePress = useCallback(() => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  }, [disabled, onChange, checked]);

  const currentSize = useMemo(() => SIZES[size], [size]);

  const boxStyle = useMemo(() => ({
    width: currentSize.box,
    height: currentSize.box,
    backgroundColor:
      checked || indeterminate
        ? theme.colors.primary
        : isDarkMode
        ? theme.colors.gray[800]
        : '#FFFFFF',
    borderColor:
      checked || indeterminate
        ? theme.colors.primary
        : error
        ? theme.colors.error
        : isDarkMode
        ? theme.colors.border
        : theme.colors.gray[300],
  }), [currentSize.box, checked, indeterminate, theme, isDarkMode, error]);

  const accessibilityState = useMemo(() => ({
    checked: indeterminate ? 'mixed' as const : checked,
    disabled,
  }), [indeterminate, checked, disabled]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, disabled && styles.disabled]}
      accessibilityRole="checkbox"
      accessibilityState={accessibilityState}
    >
      <View style={[styles.box, boxStyle]}>
        <CheckboxIcon checked={checked} indeterminate={indeterminate} iconSize={currentSize.icon} />
      </View>

      {(label || description) && (
        <View style={styles.content}>
          {label && (
            <Text
              style={[
                styles.label,
                {
                  fontSize: currentSize.label,
                  color: disabled
                    ? isDarkMode
                      ? theme.colors.gray[600]
                      : theme.colors.gray[400]
                    : isDarkMode
                    ? theme.colors.text.primary
                    : theme.colors.gray[900],
                },
              ]}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              style={[
                styles.description,
                {
                  fontSize: currentSize.description,
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[600],
                },
              ]}
            >
              {description}
            </Text>
          )}
          {error && (
            <Text
              style={[
                styles.error,
                {
                  fontSize: currentSize.description,
                  color: theme.colors.error,
                },
              ]}
            >
              {error}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

// Checkbox Group
export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
}

export function CheckboxGroup({
  children,
  label,
  description,
  error,
  orientation = 'vertical',
  spacing = 'md',
}: CheckboxGroupProps) {
  const { theme, isDarkMode } = useAppearance();

  const spacings = {
    sm: 8,
    md: 12,
    lg: 16,
  };

  return (
    <View>
      {label && (
        <Text
          style={[
            styles.groupLabel,
            {
              color: isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[900],
            },
          ]}
        >
          {label}
        </Text>
      )}
      {description && (
        <Text
          style={[
            styles.groupDescription,
            {
              color: isDarkMode
                ? theme.colors.text.secondary
                : theme.colors.gray[600],
            },
          ]}
        >
          {description}
        </Text>
      )}
      <View
        style={[
          orientation === 'vertical' ? styles.groupVertical : styles.groupHorizontal,
          { gap: spacings[spacing] },
        ]}
      >
        {children}
      </View>
      {error && (
        <Text style={[styles.groupError, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  label: {
    fontWeight: '500',
  },
  description: {
    marginTop: 4,
  },
  error: {
    marginTop: 4,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  groupVertical: {
    flexDirection: 'column',
  },
  groupHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupError: {
    fontSize: 13,
    marginTop: 8,
  },
});