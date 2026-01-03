import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';
import { Search, Clock, Hash, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: Icon;
  category?: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  recentItems?: CommandItem[];
}

// Memoized command item component
const CommandItemRow = React.memo<{
  item: CommandItem;
  onSelect: (item: CommandItem) => void;
  theme: any;
  isRecent?: boolean;
}>(({ item, onSelect, theme, isRecent }) => {
  const Icon = item.icon || (isRecent ? Clock : Hash);

  const styles = useMemo(() => StyleSheet.create({
    itemButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContent: {
      flex: 1,
    },
    itemLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    itemDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  }), [theme]);

  const handlePress = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.itemButton}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon size={16} color={theme.colors.text} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

CommandItemRow.displayName = 'CommandItemRow';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search commands...',
  recentItems = [],
}) => {
  const { theme } = useAppearance();
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<TextInput>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
    if (!newOpen) {
      setSearch('');
    }
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    if (!search) return items;
    
    const searchLower = search.toLowerCase();
    return items.filter((item) => 
      item.label.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower))
    );
  }, [items, search]);

  // Memoize grouped items
  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, CommandItem[]>);
  }, [filteredItems]);

  const handleSelect = useCallback((item: CommandItem) => {
    item.onSelect();
    handleOpenChange(false);
    Keyboard.dismiss();
  }, [handleOpenChange]);

  const styles = useMemo(() => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingTop: 80,
      paddingHorizontal: 16,
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    list: {
      maxHeight: 400,
    },
    categoryHeader: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.background,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
  }), [theme]);

  const renderItem = useCallback(({ item }: { item: CommandItem }) => (
    <CommandItemRow
      item={item}
      onSelect={handleSelect}
      theme={theme}
    />
  ), [handleSelect, theme]);

  const renderRecentItem = useCallback(({ item }: { item: CommandItem }) => (
    <CommandItemRow
      item={item}
      onSelect={handleSelect}
      theme={theme}
      isRecent
    />
  ), [handleSelect, theme]);

  const keyExtractor = useCallback((item: CommandItem) => item.id, []);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Search size={32} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>No commands found</Text>
    </View>
  ), [styles, theme]);

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => handleOpenChange(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => handleOpenChange(false)}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContent}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                ref={inputRef}
                value={search}
                onChangeText={setSearch}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {/* Recent Items (show when no search) */}
            {!search && recentItems.length > 0 && (
              <>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryText}>Recent</Text>
                </View>
                <FlatList
                  data={recentItems}
                  renderItem={renderRecentItem}
                  keyExtractor={keyExtractor}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews
                  maxToRenderPerBatch={10}
                  windowSize={5}
                />
              </>
            )}

            {/* Filtered Items */}
            {search && (
              <FlatList
                data={Object.entries(groupedItems).flatMap(([category, items]) => [
                  { id: `category-${category}`, isCategory: true, category },
                  ...items,
                ])}
                renderItem={({ item }: any) => {
                  if (item.isCategory) {
                    return (
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                    );
                  }
                  return renderItem({ item });
                }}
                keyExtractor={(item: any) => item.id}
                style={styles.list}
                ListEmptyComponent={ListEmptyComponent}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
