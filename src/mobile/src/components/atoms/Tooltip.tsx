import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  disabled = false,
}: TooltipProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const showTooltip = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const handleLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    // In a real app, you'd use measureInWindow for accurate positioning
    setPosition({ x, y, width, height });
  };

  // Note: On React Native, tooltips are typically shown as modals
  // or using libraries like react-native-tooltip. This is a simplified version.
  
  return (
    <>
      <TouchableOpacity
        onPress={showTooltip}
        onLongPress={showTooltip}
        onLayout={handleLayout}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <Pressable
          style={styles.overlay}
          onPress={hideTooltip}
        >
          <View
            style={[
              styles.tooltip,
              {
                backgroundColor: isDarkMode
                  ? theme.colors.gray[700]
                  : theme.colors.gray[900],
              },
            ]}
          >
            <Text style={[styles.content, { color: '#FFFFFF' }]}>
              {content}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tooltip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 250,
  },
  content: {
    fontSize: 13,
    textAlign: 'center',
  },
});

// Note: For production, consider using:
// - react-native-tooltip
// - react-native-paper Tooltip
// - Custom implementation with better positioning
