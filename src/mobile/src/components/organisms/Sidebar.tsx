import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Home,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  ChevronRight,
  type Icon,
} from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { useLanguage } from '../../contexts/LanguageContext';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: Icon;
  href?: string;
  badge?: string | number;
  active?: boolean;
  children?: SidebarMenuItem[];
  onPress?: () => void;
}

export interface SidebarProps {
  items?: SidebarMenuItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onItemPress?: (item: SidebarMenuItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  header,
  footer,
  onItemPress,
}) => {
  const { theme } = useAppearance();
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      {header && <View style={styles.header}>{header}</View>}

      {/* Menu Items */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              expanded={expandedItems.has(item.id)}
              onToggleExpand={() => toggleExpanded(item.id)}
              onPress={() => onItemPress?.(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

interface SidebarItemProps {
  item: SidebarMenuItem;
  expanded: boolean;
  onToggleExpand: () => void;
  onPress: () => void;
  depth?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  expanded,
  onToggleExpand,
  onPress,
  depth = 0,
}) => {
  const { theme } = useAppearance();
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const [animation] = useState(new Animated.Value(expanded ? 1 : 0));

  const handlePress = () => {
    if (hasChildren) {
      onToggleExpand();
      Animated.timing(animation, {
        toValue: expanded ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if (item.onPress) {
      item.onPress();
    }
    onPress();
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 4,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginLeft: depth * 16,
      backgroundColor: item.active
        ? theme.colors.primaryLight + '20'
        : 'transparent',
    },
    iconContainer: {
      width: 20,
      height: 20,
    },
    labelContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 15,
      fontWeight: item.active ? '600' : '400',
      color: item.active ? theme.colors.primary : theme.colors.text,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryLight + '30',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    chevron: {
      transform: [
        {
          rotate: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '90deg'],
          }),
        },
      ],
    },
    childrenContainer: {
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Icon
            size={20}
            color={item.active ? theme.colors.primary : theme.colors.textSecondary}
          />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>{item.label}</Text>

          <View style={styles.badgeContainer}>
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}

            {hasChildren && (
              <Animated.View style={styles.chevron}>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </Animated.View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Nested Items */}
      {hasChildren && expanded && (
        <View style={styles.childrenContainer}>
          {item.children!.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              expanded={false}
              onToggleExpand={() => {}}
              onPress={() => {}}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Default menu items
const defaultItems: SidebarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    active: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: 'New',
    children: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    badge: 12,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badge: 5,
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: HelpCircle,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];
