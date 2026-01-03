import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography } from '../../theme/tokens';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Accordion Component - React Native
 * 
 * Collapsible content sections
 */

export interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultExpanded?: (string | number)[];
  onChange?: (expandedIds: (string | number)[]) => void;
  style?: ViewStyle;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  defaultExpanded = [],
  onChange,
  style,
}) => {
  const { theme } = useAppearance();
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>(defaultExpanded);

  const toggleItem = (id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    let newExpandedIds: (string | number)[];

    if (expandedIds.includes(id)) {
      // Collapse
      newExpandedIds = expandedIds.filter((expandedId) => expandedId !== id);
    } else {
      // Expand
      if (multiple) {
        newExpandedIds = [...expandedIds, id];
      } else {
        newExpandedIds = [id];
      }
    }

    setExpandedIds(newExpandedIds);
    onChange?.(newExpandedIds);
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    item: {
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
    },
    headerDisabled: {
      opacity: 0.5,
    },
    icon: {
      marginRight: spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      ...typography.body1,
      fontWeight: '600',
      color: theme.colors.text,
    },
    chevron: {
      marginLeft: spacing.sm,
    },
    content: {
      padding: spacing.md,
      paddingTop: 0,
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          expanded={expandedIds.includes(item.id)}
          onToggle={() => !item.disabled && toggleItem(item.id)}
          isLast={index === items.length - 1}
          theme={theme}
          styles={styles}
        />
      ))}
    </View>
  );
};

interface AccordionItemComponentProps {
  item: AccordionItem;
  expanded: boolean;
  onToggle: () => void;
  isLast: boolean;
  theme: any;
  styles: any;
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  item,
  expanded,
  onToggle,
  isLast,
  theme,
  styles,
}) => {
  const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.item, isLast && styles.lastItem]}>
      <TouchableOpacity
        style={[styles.header, item.disabled && styles.headerDisabled]}
        onPress={onToggle}
        disabled={item.disabled}
        activeOpacity={0.7}
      >
        {item.icon && <View style={styles.icon}>{item.icon}</View>}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <Animated.View
          style={[styles.chevron, { transform: [{ rotate: rotation }] }]}
        >
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{item.content}</View>}
    </View>
  );
};

export default Accordion;
