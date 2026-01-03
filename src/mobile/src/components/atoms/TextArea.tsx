import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface TextAreaProps {
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  numberOfLines?: number;
  maxLength?: number;
  showCount?: boolean;
  autoFocus?: boolean;
}

export function TextArea({
  value = '',
  onChangeText,
  placeholder,
  disabled = false,
  error,
  label,
  helperText,
  numberOfLines = 4,
  maxLength,
  showCount = false,
  autoFocus = false,
}: TextAreaProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    if (maxLength && text.length > maxLength) {
      return;
    }
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View>
      {/* Label */}
      {label && (
        <Text
          style={[
            styles.label,
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

      {/* TextArea */}
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={
          isDarkMode ? theme.colors.text.secondary : theme.colors.gray[500]
        }
        editable={!disabled}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        autoFocus={autoFocus}
        textAlignVertical="top"
        style={[
          styles.input,
          {
            backgroundColor: disabled
              ? isDarkMode
                ? theme.colors.gray[900]
                : theme.colors.gray[50]
              : isDarkMode
              ? theme.colors.gray[800]
              : '#FFFFFF',
            borderColor: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : isDarkMode
              ? theme.colors.border
              : theme.colors.gray[300],
            borderWidth: isFocused ? 2 : 1,
            color: isDarkMode ? theme.colors.text.primary : theme.colors.gray[900],
            opacity: disabled ? 0.5 : 1,
            minHeight: numberOfLines * 20 + 24, // Approximate line height + padding
          },
        ]}
      />

      {/* Helper Text / Error / Character Count */}
      <View style={styles.footer}>
        <View style={styles.helperTextContainer}>
          {error && (
            <Text style={[styles.helperText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}
          {!error && helperText && (
            <Text
              style={[
                styles.helperText,
                {
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[600],
                },
              ]}
            >
              {helperText}
            </Text>
          )}
        </View>

        {showCount && maxLength && (
          <Text
            style={[
              styles.count,
              {
                color:
                  value.length >= maxLength
                    ? theme.colors.error
                    : isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[500],
              },
            ]}
          >
            {value.length} / {maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 8,
  },
  helperTextContainer: {
    flex: 1,
  },
  helperText: {
    fontSize: 13,
  },
  count: {
    fontSize: 13,
  },
});
