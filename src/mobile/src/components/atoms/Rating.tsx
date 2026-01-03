import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Star, Heart, ThumbsUp } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

/**
 * Rating Component - React Native
 * 
 * Star rating with multiple icons and half-star support
 */

export type RatingIcon = 'star' | 'heart' | 'thumbs';
export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  icon?: RatingIcon;
  size?: RatingSize;
  showValue?: boolean;
  allowHalf?: boolean;
  color?: string;
  emptyColor?: string;
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  onChange,
  readonly = false,
  icon = 'star',
  size = 'md',
  showValue = false,
  allowHalf = false,
  color = '#FACC15',
  emptyColor = '#D1D5DB',
  style,
}) => {
  const { theme } = useAppearance();
  const [pressedValue, setPressedValue] = useState<number | null>(null);
  const isInteractive = !readonly && onChange;

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 32;
      default:
        return 24;
    }
  };

  const getIcon = (filled: boolean) => {
    const iconSize = getIconSize();
    const iconColor = filled ? color : emptyColor;

    switch (icon) {
      case 'heart':
        return <Heart size={iconSize} color={iconColor} fill={filled ? iconColor : 'none'} />;
      case 'thumbs':
        return <ThumbsUp size={iconSize} color={iconColor} fill={filled ? iconColor : 'none'} />;
      default:
        return <Star size={iconSize} color={iconColor} fill={filled ? iconColor : 'none'} />;
    }
  };

  const handlePress = (index: number) => {
    if (!isInteractive) return;
    const newValue = index + 1;
    onChange(newValue);
  };

  const displayValue = pressedValue ?? value;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    iconButton: {
      position: 'relative',
    },
    valueText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconsContainer}>
        {Array.from({ length: max }).map((_, index) => {
          const isFilled = displayValue >= index + 1;
          const isHalfFilled = allowHalf && displayValue > index && displayValue < index + 1;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              onPressIn={() => setPressedValue(index + 1)}
              onPressOut={() => setPressedValue(null)}
              disabled={!isInteractive}
              activeOpacity={0.7}
              style={styles.iconButton}
            >
              {getIcon(isFilled || isHalfFilled)}
            </TouchableOpacity>
          );
        })}
      </View>

      {showValue && (
        <Text style={styles.valueText}>
          {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
        </Text>
      )}
    </View>
  );
};

// Compact rating display (readonly)
export interface CompactRatingProps {
  value: number;
  max?: number;
  count?: number;
  size?: RatingSize;
  style?: ViewStyle;
}

export const CompactRating: React.FC<CompactRatingProps> = ({
  value,
  max = 5,
  count,
  size = 'sm',
  style,
}) => {
  const { theme } = useAppearance();

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 32;
      default:
        return 24;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    value: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    count: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Star size={getIconSize()} color="#FACC15" fill="#FACC15" />
      <Text style={styles.value}>{value.toFixed(1)}</Text>
      {count !== undefined && <Text style={styles.count}>({count})</Text>}
    </View>
  );
};

export default Rating;
