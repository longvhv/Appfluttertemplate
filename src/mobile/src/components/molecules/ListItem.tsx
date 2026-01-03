import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing } from '../../theme/tokens';

/**
 * ListItem Component - React Native
 * 
 * List item with icon, title, subtitle, and chevron
 */

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ComponentType<any>;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon: LeftIcon,
  rightContent,
  showChevron = false,
  onPress,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: theme.colors.card,
      opacity: disabled ? 0.5 : 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    rightContent: {
      marginLeft: spacing.sm,
    },
  });

  const content = (
    <>
      {LeftIcon && (
        <View style={styles.iconContainer}>
          <LeftIcon size={20} color={theme.colors.primary} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}

      {showChevron && (
        <ChevronRight size={20} color={theme.colors.textTertiary} />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};

export default ListItem;
