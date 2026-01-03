import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Modal } from './Modal';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  searchable?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error,
  label,
  size = 'md',
  clearable = false,
  searchable = false,
}: SelectProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions =
    searchable && searchQuery
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  const sizes = {
    sm: { padding: 8, fontSize: 13 },
    md: { padding: 12, fontSize: 14 },
    lg: { padding: 16, fontSize: 16 },
  };

  const currentSize = sizes[size];

  return (
    <View>
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

      {/* Select Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          styles.button,
          {
            padding: currentSize.padding,
            backgroundColor: disabled
              ? isDarkMode
                ? theme.colors.gray[900]
                : theme.colors.gray[50]
              : isDarkMode
              ? theme.colors.gray[800]
              : '#FFFFFF',
            borderColor: error
              ? theme.colors.error
              : isDarkMode
              ? theme.colors.border
              : theme.colors.gray[300],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            {
              fontSize: currentSize.fontSize,
              color: selectedOption
                ? isDarkMode
                  ? theme.colors.text.primary
                  : theme.colors.gray[900]
                : isDarkMode
                ? theme.colors.text.secondary
                : theme.colors.gray[500],
            },
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <View style={styles.buttonIcons}>
          {clearable && value && !disabled && (
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X
                size={16}
                color={
                  isDarkMode ? theme.colors.text.secondary : theme.colors.gray[400]
                }
              />
            </TouchableOpacity>
          )}
          <ChevronDown
            size={20}
            color={
              isDarkMode ? theme.colors.text.secondary : theme.colors.gray[400]
            }
          />
        </View>
      </TouchableOpacity>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      {/* Dropdown Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
        title={label || 'Select Option'}
        size="md"
      >
        {/* Search Input */}
        {searchable && (
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
            placeholderTextColor={
              isDarkMode ? theme.colors.text.secondary : theme.colors.gray[500]
            }
            style={[
              styles.searchInput,
              {
                backgroundColor: isDarkMode
                  ? theme.colors.gray[900]
                  : theme.colors.gray[50],
                borderColor: isDarkMode
                  ? theme.colors.border
                  : theme.colors.gray[300],
                color: isDarkMode
                  ? theme.colors.text.primary
                  : theme.colors.gray[900],
              },
            ]}
          />
        )}

        {/* Options List */}
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => !item.disabled && handleSelect(item.value)}
              disabled={item.disabled}
              style={[
                styles.option,
                {
                  backgroundColor:
                    item.value === value
                      ? isDarkMode
                        ? 'rgba(59, 130, 246, 0.15)'
                        : '#EFF6FF'
                      : 'transparent',
                  opacity: item.disabled ? 0.5 : 1,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    fontSize: currentSize.fontSize,
                    color:
                      item.value === value
                        ? theme.colors.primary
                        : isDarkMode
                        ? theme.colors.text.primary
                        : theme.colors.gray[900],
                  },
                ]}
              >
                {item.label}
              </Text>
              {item.value === value && (
                <Check size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                {
                  fontSize: currentSize.fontSize,
                  color: isDarkMode
                    ? theme.colors.text.secondary
                    : theme.colors.gray[500],
                },
              ]}
            >
              No options found
            </Text>
          }
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    flex: 1,
  },
  buttonIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  error: {
    fontSize: 13,
    marginTop: 4,
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionText: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
  },
});
