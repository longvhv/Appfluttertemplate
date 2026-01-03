import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronRight, Home, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: Icon;
  onPress?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  showHomeIcon?: boolean;
  maxItems?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = 'chevron',
  showHomeIcon = true,
  maxItems = 3,
}) => {
  const { theme } = useAppearance();

  const visibleItems = items.length > maxItems
    ? [items[0], { id: 'ellipsis', label: '...' } as BreadcrumbItem, ...items.slice(-1)]
    : items;

  const renderSeparator = () => {
    if (separator === 'slash') {
      return <Text style={[styles.separator, { color: theme.colors.textSecondary }]}>/</Text>;
    }
    if (separator === 'dot') {
      return <Text style={[styles.separator, { color: theme.colors.textSecondary }]}>•</Text>;
    }
    return <ChevronRight size={16} color={theme.colors.textSecondary} />;
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 8,
    },
    scrollView: {
      flexGrow: 0,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    label: {
      fontSize: 14,
    },
    activeLabel: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    inactiveLabel: {
      color: theme.colors.textSecondary,
    },
    separator: {
      fontSize: 14,
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.content}>
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const Icon = item.icon;

            return (
              <React.Fragment key={item.id}>
                {item.label === '...' ? (
                  <Text style={[styles.label, styles.inactiveLabel]}>...</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={item.onPress}
                    disabled={isLast}
                    activeOpacity={0.7}
                  >
                    {showHomeIcon && index === 0 && !Icon && (
                      <Home size={16} color={isLast ? theme.colors.text : theme.colors.textSecondary} />
                    )}
                    {Icon && <Icon size={16} color={isLast ? theme.colors.text : theme.colors.textSecondary} />}
                    <Text style={[styles.label, isLast ? styles.activeLabel : styles.inactiveLabel]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}

                {!isLast && renderSeparator()}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
