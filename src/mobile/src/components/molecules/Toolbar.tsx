import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MoreVertical, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: Icon;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
  type?: 'button' | 'divider' | 'group';
  children?: ToolbarItem[];
}

export interface ToolbarProps {
  items: ToolbarItem[];
  position?: 'top' | 'bottom';
  variant?: 'default' | 'compact' | 'floating';
  showLabels?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  items,
  position = 'top',
  variant = 'default',
  showLabels = true,
}) => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: variant === 'floating'
        ? theme.colors.card
        : variant === 'compact'
        ? theme.colors.background
        : theme.colors.card,
      borderBottomWidth: variant === 'floating' ? 0 : 1,
      borderBottomColor: theme.colors.border,
      borderRadius: variant === 'floating' ? 12 : 0,
      paddingVertical: variant === 'compact' ? 4 : 8,
      paddingHorizontal: variant === 'compact' ? 4 : 8,
      shadowColor: variant === 'floating' ? '#000' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: variant === 'floating' ? 0.1 : 0,
      shadowRadius: variant === 'floating' ? 8 : 0,
      elevation: variant === 'floating' ? 4 : 0,
      marginHorizontal: variant === 'floating' ? 16 : 0,
      marginVertical: variant === 'floating' ? 8 : 0,
    },
    scrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: variant === 'compact' ? 4 : 8,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    defaultButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    dangerButton: {
      backgroundColor: '#EF4444',
    },
    compactButton: {
      backgroundColor: 'transparent',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    defaultButtonText: {
      color: theme.colors.text,
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    dangerButtonText: {
      color: '#FFFFFF',
    },
    divider: {
      width: 1,
      height: 24,
      backgroundColor: theme.colors.border,
      marginHorizontal: 4,
    },
    group: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });

  const renderButton = (item: ToolbarItem) => {
    if (item.type === 'divider') {
      return <View key={item.id} style={styles.divider} />;
    }

    if (item.type === 'group' && item.children) {
      return (
        <View key={item.id} style={styles.group}>
          {item.children.map(renderButton)}
        </View>
      );
    }

    const Icon = item.icon;
    const getButtonStyle = () => {
      if (variant === 'compact') return styles.compactButton;
      if (item.variant === 'primary') return styles.primaryButton;
      if (item.variant === 'danger') return styles.dangerButton;
      return styles.defaultButton;
    };

    const getTextStyle = () => {
      if (item.variant === 'primary') return styles.primaryButtonText;
      if (item.variant === 'danger') return styles.dangerButtonText;
      return styles.defaultButtonText;
    };

    const getIconColor = () => {
      if (item.variant === 'primary' || item.variant === 'danger') return '#FFFFFF';
      return theme.colors.text;
    };

    return (
      <TouchableOpacity
        key={item.id}
        onPress={item.onPress}
        disabled={item.disabled}
        style={[styles.button, getButtonStyle(), item.disabled && { opacity: 0.5 }]}
        activeOpacity={0.7}
      >
        {Icon && <Icon size={18} color={getIconColor()} />}
        {showLabels && item.label && (
          <Text style={[styles.buttonText, getTextStyle()]}>
            {item.label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(renderButton)}
      </ScrollView>
    </View>
  );
};
