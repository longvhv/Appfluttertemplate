import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface TabItem {
  id: string;
  label: string;
  icon?: Icon;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

// Memoized tab button component
const TabButton = React.memo<{
  item: TabItem;
  isActive: boolean;
  variant: 'default' | 'pills' | 'underline';
  theme: any;
  onPress: () => void;
}>(({ item, isActive, variant, theme, onPress }) => {
  const Icon = item.icon;

  const styles = useMemo(() => StyleSheet.create({
    tabButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: variant === 'pills' ? 20 : variant === 'default' ? 8 : 0,
      gap: 8,
      borderBottomWidth: variant === 'underline' ? 2 : 0,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      backgroundColor: variant === 'pills'
        ? theme.colors.primary
        : variant === 'default'
        ? theme.colors.background
        : 'transparent',
      borderBottomColor: variant === 'underline' ? theme.colors.primary : 'transparent',
      shadowColor: variant === 'default' ? '#000' : 'transparent',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: variant === 'default' ? 0.05 : 0,
      shadowRadius: 2,
      elevation: variant === 'default' ? 2 : 0,
    },
    inactiveTab: {
      backgroundColor: 'transparent',
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
    activeLabel: {
      color: variant === 'pills' ? '#FFFFFF' : theme.colors.primary,
    },
    inactiveLabel: {
      color: theme.colors.textSecondary,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      minWidth: 20,
    },
    activeBadge: {
      backgroundColor: variant === 'pills'
        ? 'rgba(255, 255, 255, 0.2)'
        : theme.colors.primary + '20',
    },
    inactiveBadge: {
      backgroundColor: theme.colors.border,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'center',
    },
    activeBadgeText: {
      color: variant === 'pills' ? '#FFFFFF' : theme.colors.primary,
    },
    inactiveBadgeText: {
      color: theme.colors.textSecondary,
    },
  }), [variant, theme, isActive]);

  const iconColor = useMemo(() => {
    if (isActive && variant === 'pills') return '#FFFFFF';
    if (isActive) return theme.colors.primary;
    return theme.colors.textSecondary;
  }, [isActive, variant, theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={item.disabled}
      style={[
        styles.tabButton,
        isActive ? styles.activeTab : styles.inactiveTab,
        item.disabled && { opacity: 0.5 },
      ]}
      activeOpacity={0.7}
    >
      {Icon && <Icon size={18} color={iconColor} />}
      
      <Text style={[styles.tabLabel, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {item.label}
      </Text>

      {item.badge !== undefined && (
        <View style={[styles.badge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={[styles.badgeText, isActive ? styles.activeBadgeText : styles.inactiveBadgeText]}>
            {item.badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

TabButton.displayName = 'TabButton';

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'default',
}) => {
  const { theme } = useAppearance();
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.id);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange]);

  const activeItem = useMemo(
    () => items.find((item) => item.id === value),
    [items, value]
  );

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: variant === 'default' ? 4 : 0,
      paddingVertical: 4,
      backgroundColor: variant === 'default' ? theme.colors.card : 'transparent',
      borderBottomWidth: variant === 'underline' ? 1 : 0,
      borderBottomColor: theme.colors.border,
      gap: variant === 'pills' ? 8 : 0,
    },
    contentContainer: {
      padding: 16,
    },
  }), [theme, variant]);

  const renderTabButton = useCallback((item: TabItem) => {
    const isActive = item.id === value;
    
    return (
      <TabButton
        key={item.id}
        item={item}
        isActive={isActive}
        variant={variant}
        theme={theme}
        onPress={() => !item.disabled && handleChange(item.id)}
      />
    );
  }, [value, variant, theme, handleChange]);

  return (
    <View style={styles.container}>
      {/* Tab List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {items.map(renderTabButton)}
      </ScrollView>

      {/* Tab Content */}
      {activeItem?.content && (
        <View style={styles.contentContainer}>
          {activeItem.content}
        </View>
      )}
    </View>
  );
};
