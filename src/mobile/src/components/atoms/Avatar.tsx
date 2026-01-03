import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { typography } from '../../theme/tokens';

/**
 * Avatar Component - React Native
 * 
 * User avatar with fallback to initials
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 24,
  '2xl': 32,
};

// Memoized function outside component
const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = React.memo(({
  src,
  name,
  size = 'md',
  style,
  backgroundColor,
  textColor,
}) => {
  const { theme } = useAppearance();
  const [imageError, setImageError] = useState(false);

  const avatarSize = useMemo(() => sizeMap[size], [size]);
  const fontSize = useMemo(() => fontSizeMap[size], [size]);

  const initials = useMemo(
    () => (name ? getInitials(name) : ''),
    [name]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: backgroundColor || theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    text: {
      fontSize,
      fontWeight: '600',
      color: textColor || '#FFFFFF',
    },
  }), [avatarSize, fontSize, backgroundColor, textColor, theme.colors.primary]);

  const showImage = src && !imageError;

  return (
    <View style={[styles.container, style]}>
      {showImage ? (
        <Image 
          source={{ uri: src }} 
          style={styles.image}
          onError={handleImageError}
        />
      ) : (
        <Text style={styles.text}>{initials}</Text>
      )}
    </View>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;