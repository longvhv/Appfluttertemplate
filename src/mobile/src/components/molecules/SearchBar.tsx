import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Keyboard,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography } from '../../theme/tokens';

/**
 * SearchBar Component - React Native
 * 
 * Search input with clear button
 */

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showCancelButton?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  autoFocus = false,
  showCancelButton = false,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    onSearch?.('');
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSearch?.(value);
  };

  const handleCancel = () => {
    handleClear();
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: isFocused ? theme.colors.primary : theme.colors.border,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    searchContainerDisabled: {
      opacity: 0.5,
      backgroundColor: theme.colors.disabled,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: theme.colors.text,
      paddingVertical: spacing.xs,
    },
    clearButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
    },
    cancelButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    cancelButtonText: {
      ...typography.body1,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.searchContainer, disabled && styles.searchContainerDisabled]}>
        <Search
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          autoFocus={autoFocus}
          editable={!disabled}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {value.length > 0 && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showCancelButton && isFocused && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
