import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { GripVertical } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface SplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  initialSize?: number; // Percentage (0-100)
  minSize?: number; // Percentage
  maxSize?: number; // Percentage
  showHandle?: boolean;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  leftPanel,
  rightPanel,
  orientation = 'vertical',
  initialSize = 50,
  minSize = 20,
  maxSize = 80,
  showHandle = true,
}) => {
  const { theme } = useAppearance();
  const [size, setSize] = useState(initialSize);
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (orientation === 'vertical') {
        const newSize = (gestureState.moveX / dimensions.width) * 100;
        const clampedSize = Math.max(minSize, Math.min(maxSize, newSize));
        setSize(clampedSize);
      } else {
        const newSize = (gestureState.moveY / dimensions.height) * 100;
        const clampedSize = Math.max(minSize, Math.min(maxSize, newSize));
        setSize(clampedSize);
      }
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: orientation === 'vertical' ? 'row' : 'column',
    },
    panel1: {
      [orientation === 'vertical' ? 'width' : 'height']: `${size}%`,
      overflow: 'hidden',
    },
    panel2: {
      flex: 1,
      overflow: 'hidden',
    },
    handle: {
      backgroundColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    handleVertical: {
      width: 4,
    },
    handleHorizontal: {
      height: 4,
    },
    handleActive: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Left/Top Panel */}
      <View style={styles.panel1}>{leftPanel}</View>

      {/* Resizer Handle */}
      {showHandle && (
        <View
          {...panResponder.panHandlers}
          style={[
            styles.handle,
            orientation === 'vertical' ? styles.handleVertical : styles.handleHorizontal,
          ]}
        >
          <GripVertical
            size={16}
            color={theme.colors.textSecondary}
            style={{
              transform: [{ rotate: orientation === 'vertical' ? '0deg' : '90deg' }],
            }}
          />
        </View>
      )}

      {/* Right/Bottom Panel */}
      <View style={styles.panel2}>{rightPanel}</View>
    </View>
  );
};