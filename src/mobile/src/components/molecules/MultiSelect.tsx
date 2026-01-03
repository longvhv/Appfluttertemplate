import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Modal } from './Modal';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  searchable?: boolean;
  maxSelected?: number;
  showSelectAll?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  error,
  label,
  searchable = false,
  maxSelected,
  showSelectAll = true,
}: MultiSelectProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchable && searchQuery
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleToggle = (optionValue: string) => {
    if (!onChange) return;

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    if (!onChange) return;
    const allValues = options.filter((opt) => !opt.disabled).map((opt) => opt.value);
    onChange(value.length === allValues.length ? [] : allValues);
  };

  const handleRemove = (optionValue: string) => {
    if (onChange) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const isAllSelected = options.filter((opt) => !opt.disabled).every((opt) => value.includes(opt.value));

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: isDarkMode ? theme.colors.text.primary : theme.colors.gray[900] }]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          styles.trigger,
          {
            backgroundColor: disabled
              ? isDarkMode ? theme.colors.gray[900] : theme.colors.gray[50]
              : isDarkMode ? theme.colors.gray[800] : '#FFFFFF',
            borderColor: error ? theme.colors.error : isDarkMode ? theme.colors.border : theme.colors.gray[300],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.selectedContainer}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <View key={opt.value} style={[styles.chip, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE' }]}>
                <Text style={[styles.chipText, { color: theme.colors.primary }]}>{opt.label}</Text>
                <TouchableOpacity onPress={() => handleRemove(opt.value)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={12} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={[styles.placeholder, { color: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[500] }]}>
              {placeholder}
            </Text>
          )}
        </View>
        <ChevronDown size={20} color={isDarkMode ? theme.colors.text.secondary : theme.colors.gray[400]} />
      </TouchableOpacity>

      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
      {maxSelected && (
        <Text style={[styles.count, { color: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[600] }]}>
          {value.length} / {maxSelected} selected
        </Text>
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setSearchQuery(''); }} title={label || 'Select Options'} size="md">
        {searchable && (
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
            placeholderTextColor={isDarkMode ? theme.colors.text.secondary : theme.colors.gray[500]}
            style={[
              styles.searchInput,
              {
                backgroundColor: isDarkMode ? theme.colors.gray[900] : theme.colors.gray[50],
                borderColor: isDarkMode ? theme.colors.border : theme.colors.gray[300],
                color: isDarkMode ? theme.colors.text.primary : theme.colors.gray[900],
              },
            ]}
          />
        )}

        {showSelectAll && (
          <TouchableOpacity
            onPress={handleSelectAll}
            style={[
              styles.selectAllButton,
              {
                borderBottomColor: isDarkMode ? theme.colors.border : theme.colors.gray[200],
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.selectAllText, { color: isDarkMode ? theme.colors.text.primary : theme.colors.gray[900] }]}>
              Select All
            </Text>
            {isAllSelected && <Check size={20} color={theme.colors.primary} />}
          </TouchableOpacity>
        )}

        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isSelected = value.includes(item.value);
            const isDisabled = item.disabled || (maxSelected && !isSelected && value.length >= maxSelected);

            return (
              <TouchableOpacity
                onPress={() => !isDisabled && handleToggle(item.value)}
                disabled={isDisabled}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? (isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF') : 'transparent',
                    opacity: isDisabled ? 0.5 : 1,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isSelected ? theme.colors.primary : isDarkMode ? theme.colors.text.primary : theme.colors.gray[900],
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && <Check size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDarkMode ? theme.colors.text.secondary : theme.colors.gray[500] }]}>
              No options found
            </Text>
          }
          style={styles.list}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  trigger: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 8, minHeight: 48 },
  selectedContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  chipText: { fontSize: 12 },
  placeholder: { fontSize: 14 },
  error: { fontSize: 13, marginTop: 4 },
  count: { fontSize: 13, marginTop: 4 },
  searchInput: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  selectAllButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  selectAllText: { fontWeight: '600' },
  list: { maxHeight: 300 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 4 },
  optionText: { fontSize: 14, flex: 1 },
  emptyText: { textAlign: 'center', padding: 20, fontSize: 14 },
});
