import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing, shadows } from '../../theme/tokens';

/**
 * QuickActions Component - React Native
 * 
 * Action grid overlay for common tasks
 */

export interface QuickAction {
  id: string | number;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  trigger?: React.ReactElement;
  gridColumns?: 2 | 3 | 4;
  style?: ViewStyle;
}

// Memoized action button component
const ActionButton = React.memo<{
  action: QuickAction;
  size: number;
  onPress: () => void;
  theme: any;
}>(({ action, size, onPress, theme }) => {
  const styles = useMemo(() => StyleSheet.create({
    action: {
      width: size,
      aspectRatio: 1,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.sm,
      gap: spacing.xs,
      backgroundColor: action.color || theme.colors.surface,
      opacity: action.disabled ? 0.5 : 1,
    },
    actionLabel: {
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '500',
      color: theme.colors.text,
    },
  }), [size, action.color, action.disabled, theme]);

  return (
    <TouchableOpacity
      style={styles.action}
      onPress={onPress}
      disabled={action.disabled}
      activeOpacity={0.7}
    >
      {action.icon}
      <Text style={styles.actionLabel} numberOfLines={2}>
        {action.label}
      </Text>
    </TouchableOpacity>
  );
});

ActionButton.displayName = 'ActionButton';

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  trigger,
  gridColumns = 3,
  style,
}) => {
  const { theme } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState(() => {
    const { width } = Dimensions.get('window');
    return { width };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width });
    });

    return () => subscription?.remove();
  }, []);

  const handleActionPress = useCallback((action: QuickAction) => {
    if (!action.disabled) {
      action.onPress();
      setIsOpen(false);
    }
  }, []);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const actionSize = useMemo(
    () => (dimensions.width - spacing.lg * 2 - spacing.md * (gridColumns - 1)) / gridColumns,
    [dimensions.width, gridColumns]
  );

  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.xl,
      maxWidth: 400,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    triggerButton: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.full,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xl,
    },
  }), [theme]);

  const renderAction = useCallback((action: QuickAction) => (
    <ActionButton
      key={action.id}
      action={action}
      size={actionSize}
      onPress={() => handleActionPress(action)}
      theme={theme}
    />
  ), [actionSize, handleActionPress, theme]);

  return (
    <View style={style}>
      {/* Trigger */}
      {trigger ? (
        <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
          {trigger}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleOpen}
          style={styles.triggerButton}
          activeOpacity={0.8}
        >
          <Zap size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Actions Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Quick Actions</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <X size={18} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* Actions Grid */}
              <View style={styles.grid}>
                {actions.map(renderAction)}
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default QuickActions;