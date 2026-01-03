import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, shadows } from '../../theme/tokens';

/**
 * FloatingActionButton Component - React Native
 * 
 * Material Design FAB with expandable actions
 */

export interface FABAction {
  id: string | number;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
}

export interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  onPress?: () => void;
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  actions,
  position = 'bottom-right',
  size = 'md',
  color = '#6366F1',
  label,
  style,
}) => {
  const { theme } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const hasActions = actions && actions.length > 0;

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { button: 48, icon: 20, actionButton: 40, actionIcon: 16 };
      case 'lg':
        return { button: 64, icon: 28, actionButton: 56, actionIcon: 24 };
      default:
        return { button: 56, icon: 24, actionButton: 48, actionIcon: 20 };
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'bottom-left':
        return { bottom: 24, left: 24 };
      case 'top-right':
        return { top: 24, right: 24 };
      case 'top-left':
        return { top: 24, left: 24 };
      default:
        return { bottom: 24, right: 24 };
    }
  };

  const sizes = getSizes();
  const positionStyle = getPosition();

  const handleMainPress = () => {
    if (hasActions) {
      setIsOpen(!isOpen);
    } else if (onPress) {
      onPress();
    }
  };

  const handleActionPress = (action: FABAction) => {
    action.onPress();
    setIsOpen(false);
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      ...positionStyle,
      alignItems: position.includes('right') ? 'flex-end' : 'flex-start',
    },
    actionsContainer: {
      marginBottom: 16,
      gap: 12,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    actionLabel: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.md,
      ...shadows.md,
    },
    actionLabelText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    actionButton: {
      width: sizes.actionButton,
      height: sizes.actionButton,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.lg,
    },
    mainButton: {
      width: sizes.button,
      height: sizes.button,
      borderRadius: borderRadius.full,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xl,
    },
    mainButtonWithLabel: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 8,
      borderRadius: borderRadius.full,
    },
    labelText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  const MainIcon = icon || <Plus size={sizes.icon} color="#FFFFFF" />;

  return (
    <View style={[styles.container, style]}>
      {/* Actions */}
      {hasActions && isOpen && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <View
              key={action.id}
              style={[
                styles.actionRow,
                position.includes('left') && { flexDirection: 'row-reverse' },
              ]}
            >
              {action.label && (
                <View style={styles.actionLabel}>
                  <Text style={styles.actionLabelText}>{action.label}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => handleActionPress(action)}
                style={[
                  styles.actionButton,
                  { backgroundColor: action.color || '#8B5CF6' },
                ]}
                activeOpacity={0.8}
              >
                {action.icon}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Main Button */}
      <TouchableOpacity
        onPress={handleMainPress}
        style={[
          styles.mainButton,
          label && styles.mainButtonWithLabel,
        ]}
        activeOpacity={0.8}
      >
        {hasActions && isOpen ? (
          <X size={sizes.icon} color="#FFFFFF" />
        ) : (
          MainIcon
        )}
        {label && <Text style={styles.labelText}>{label}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;
