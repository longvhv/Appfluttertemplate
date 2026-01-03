import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox, Search, AlertCircle, type Icon } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Button } from '../atoms/Button';

export interface EmptyStateProps {
  icon?: Icon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  variant?: 'default' | 'search' | 'error' | 'minimal';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: CustomIcon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
}) => {
  const { theme } = useAppearance();

  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return Search;
      case 'error':
        return AlertCircle;
      default:
        return Inbox;
    }
  };

  const Icon = CustomIcon || getDefaultIcon();

  const getIconColor = () => {
    switch (variant) {
      case 'error':
        return '#EF4444';
      case 'search':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case 'error':
        return '#FEF2F2';
      case 'search':
        return theme.colors.primary + '10';
      default:
        return theme.colors.border + '40';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      minHeight: 300,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variant !== 'minimal' ? getIconBackgroundColor() : 'transparent',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 300,
      marginBottom: 24,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Icon */}
      {variant !== 'minimal' && (
        <View style={styles.iconContainer}>
          <Icon size={40} color={getIconColor()} />
        </View>
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <View style={styles.actions}>
          {action && (
            <Button
              variant="primary"
              onPress={action.onPress}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="outline"
              onPress={secondaryAction.onPress}
            >
              {secondaryAction.label}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};
