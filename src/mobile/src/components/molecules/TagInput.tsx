import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing } from '../../theme/tokens';

/**
 * TagInput Component - React Native
 * 
 * Input for creating and managing tags/chips
 */

export interface Tag {
  id: string | number;
  label: string;
  color?: string;
}

export interface TagInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Type and press enter...',
  maxTags,
  allowDuplicates = false,
  onTagAdd,
  onTagRemove,
  error,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addTag = (label: string) => {
    if (!label.trim()) return;
    if (maxTags && tags.length >= maxTags) return;
    if (!allowDuplicates && tags.some(t => t.label.toLowerCase() === label.toLowerCase())) return;

    const newTag: Tag = {
      id: Date.now(),
      label: label.trim(),
    };

    const newTags = [...tags, newTag];
    onChange(newTags);
    onTagAdd?.(newTag);
    setInputValue('');
  };

  const removeTag = (tagToRemove: Tag) => {
    const newTags = tags.filter(tag => tag.id !== tagToRemove.id);
    onChange(newTags);
    onTagRemove?.(tagToRemove);
  };

  const handleSubmitEditing = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary
        : theme.colors.border,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.colors.background,
      padding: spacing.sm,
      minHeight: 48,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: tags.length > 0 ? spacing.xs : 0,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      backgroundColor: theme.colors.primary + '20',
    },
    tagLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    removeButton: {
      padding: 2,
    },
    input: {
      fontSize: 16,
      color: theme.colors.text,
      minHeight: 32,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={style}>
      <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}>
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagLabel}>{tag.label}</Text>
                <TouchableOpacity
                  onPress={() => removeTag(tag)}
                  disabled={disabled}
                  style={styles.removeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={14} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          editable={!disabled}
          returnKeyType="done"
          blurOnSubmit={false}
          style={styles.input}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TagInput;
