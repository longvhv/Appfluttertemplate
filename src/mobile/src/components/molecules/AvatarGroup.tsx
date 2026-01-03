import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Avatar from '../atoms/Avatar';
import { useAppearance } from '../../contexts/AppearanceContext';

/**
 * AvatarGroup Component - React Native
 * 
 * Overlapping avatars with overflow count
 */

export interface AvatarGroupProps {
  avatars: Array<{
    id: string | number;
    name: string;
    src?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'loose';
  onPress?: (id: string | number) => void;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  spacing = 'normal',
  onPress,
  style,
}) => {
  const { theme } = useAppearance();
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const getSizes = () => {
    switch (size) {
      case 'xs':
        return { avatar: 24, overlap: 8 };
      case 'sm':
        return { avatar: 32, overlap: 12 };
      case 'lg':
        return { avatar: 48, overlap: 20 };
      case 'xl':
        return { avatar: 64, overlap: 28 };
      default:
        return { avatar: 40, overlap: 16 };
    }
  };

  const getSpacing = () => {
    const { overlap } = getSizes();
    switch (spacing) {
      case 'tight':
        return overlap + 4;
      case 'loose':
        return overlap - 4;
      default:
        return overlap;
    }
  };

  const sizes = getSizes();
  const overlapOffset = getSpacing();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes.avatar,
    },
    avatarWrapper: {
      borderWidth: 2,
      borderColor: theme.colors.card,
      borderRadius: sizes.avatar / 2,
      overflow: 'hidden',
    },
    remainingCount: {
      width: sizes.avatar,
      height: sizes.avatar,
      borderRadius: sizes.avatar / 2,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    remainingText: {
      fontSize: size === 'xs' || size === 'sm' ? 10 : size === 'xl' ? 16 : 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {visibleAvatars.map((avatar, index) => {
        const zIndex = visibleAvatars.length - index;
        const marginLeft = index === 0 ? 0 : -overlapOffset;

        const AvatarComponent = (
          <View
            key={avatar.id}
            style={[
              styles.avatarWrapper,
              {
                zIndex,
                marginLeft,
              },
            ]}
          >
            <Avatar
              name={avatar.name}
              src={avatar.src}
              size={size}
              status={avatar.status}
            />
          </View>
        );

        if (onPress) {
          return (
            <TouchableOpacity
              key={avatar.id}
              onPress={() => onPress(avatar.id)}
              activeOpacity={0.7}
            >
              {AvatarComponent}
            </TouchableOpacity>
          );
        }

        return AvatarComponent;
      })}

      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingCount,
            {
              zIndex: 0,
              marginLeft: -overlapOffset,
            },
          ]}
        >
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

// Stacked Avatar Group (vertical)
export interface StackedAvatarGroupProps {
  avatars: AvatarGroupProps['avatars'];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const StackedAvatarGroup: React.FC<StackedAvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 'md',
  style,
}) => {
  const { theme } = useAppearance();
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const getSizes = () => {
    switch (size) {
      case 'xs':
        return { avatar: 24, overlap: 8 };
      case 'sm':
        return { avatar: 32, overlap: 12 };
      case 'lg':
        return { avatar: 48, overlap: 20 };
      case 'xl':
        return { avatar: 64, overlap: 28 };
      default:
        return { avatar: 40, overlap: 16 };
    }
  };

  const sizes = getSizes();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      width: sizes.avatar,
    },
    avatarWrapper: {
      borderWidth: 2,
      borderColor: theme.colors.card,
      borderRadius: sizes.avatar / 2,
      overflow: 'hidden',
    },
    remainingCount: {
      width: sizes.avatar,
      height: sizes.avatar,
      borderRadius: sizes.avatar / 2,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    remainingText: {
      fontSize: size === 'xs' || size === 'sm' ? 10 : size === 'xl' ? 16 : 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {visibleAvatars.map((avatar, index) => {
        const zIndex = visibleAvatars.length - index;
        const marginTop = index === 0 ? 0 : -sizes.overlap;

        return (
          <View
            key={avatar.id}
            style={[
              styles.avatarWrapper,
              {
                zIndex,
                marginTop,
              },
            ]}
          >
            <Avatar
              name={avatar.name}
              src={avatar.src}
              size={size}
              status={avatar.status}
            />
          </View>
        );
      })}

      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingCount,
            {
              zIndex: 0,
              marginTop: -sizes.overlap,
            },
          ]}
        >
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

export default AvatarGroup;
