import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius } from '../../theme/tokens';

/**
 * Chip Component - React Native
 * 
 * Tags/pills with optional icons and remove button
 */

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  onRemove?: () => void;
  icon?: React.ReactNode;
  avatar?: string;
  clickable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  onRemove,
  icon,
  avatar,
  clickable = false,
  onPress,
  style,
}) => {
  const { theme, isDark } = useAppearance();
  const isClickable = clickable || !!onPress;

  const getVariantColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return {
          bg: isDark ? 'rgba(99, 102, 241, 0.2)' : '#E0E7FF',
          text: isDark ? '#A5B4FC' : '#4F46E5',
        };
      case 'success':
        return {
          bg: isDark ? 'rgba(34, 197, 94, 0.2)' : '#D1FAE5',
          text: isDark ? '#86EFAC' : '#059669',
        };
      case 'warning':
        return {
          bg: isDark ? 'rgba(234, 179, 8, 0.2)' : '#FEF3C7',
          text: isDark ? '#FDE047' : '#D97706',
        };
      case 'error':
        return {
          bg: isDark ? 'rgba(220, 38, 38, 0.2)' : '#FEE2E2',
          text: isDark ? '#FCA5A5' : '#DC2626',
        };
      case 'info':
        return {
          bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE',
          text: isDark ? '#93C5FD' : '#2563EB',
        };
      default:
        return {
          bg: isDark ? '#1F2937' : '#F3F4F6',
          text: isDark ? '#D1D5DB' : '#374151',
        };
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { height: 24, px: 8, gap: 4, fontSize: 12, iconSize: 12 };
      case 'lg':
        return { height: 40, px: 16, gap: 8, fontSize: 16, iconSize: 20 };
      default:
        return { height: 32, px: 12, gap: 6, fontSize: 14, iconSize: 16 };
    }
  };

  const colors = getVariantColors();
  const sizes = getSizes();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes.height,
      paddingHorizontal: sizes.px,
      gap: sizes.gap,
      backgroundColor: colors.bg,
      borderRadius: borderRadius.full,
    },
    avatar: {
      width: size === 'sm' ? 16 : size === 'md' ? 20 : 24,
      height: size === 'sm' ? 16 : size === 'md' ? 20 : 24,
      borderRadius: borderRadius.full,
    },
    label: {
      fontSize: sizes.fontSize,
      fontWeight: '500',
      color: colors.text,
    },
    removeButton: {
      padding: size === 'sm' ? 2 : 4,
      borderRadius: borderRadius.full,
    },
  });

  const content = (
    <>
      {avatar && (
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )}
      {icon}
      <Text style={styles.label}>{label}</Text>
      {onRemove && (
        <TouchableOpacity
          onPress={(e) => {
            onRemove();
          }}
          style={styles.removeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={sizes.iconSize} color={colors.text} />
        </TouchableOpacity>
      )}
    </>
  );

  if (isClickable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
};

// Chip Group for managing multiple chips
export interface ChipGroupProps {
  chips: Array<{
    id: string | number;
    label: string;
    variant?: ChipVariant;
  }>;
  onRemove?: (id: string | number) => void;
  variant?: ChipVariant;
  size?: ChipSize;
  style?: ViewStyle;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  onRemove,
  variant,
  size = 'md',
  style,
}) => {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          variant={chip.variant || variant}
          size={size}
          onRemove={onRemove ? () => onRemove(chip.id) : undefined}
        />
      ))}
    </View>
  );
};

export default Chip;
