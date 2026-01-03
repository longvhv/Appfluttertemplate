import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Check, Pipette } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presets?: string[];
  showPresets?: boolean;
}

const defaultPresets = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
  '#F97316', '#EAB308', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4', '#0EA5E9', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B', '#000000', '#FFFFFF',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#3B82F6',
  onChange,
  presets = defaultPresets,
  showPresets = true,
}) => {
  const { theme } = useAppearance();
  const [color, setColor] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const styles = StyleSheet.create({
    preview: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      gap: 12,
    },
    colorBox: {
      width: 32,
      height: 32,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    colorText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'monospace',
      color: theme.colors.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '85%',
      maxWidth: 400,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    currentColor: {
      height: 120,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    presetsTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    presetsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    presetButton: {
      width: 44,
      height: 44,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButton: {
      marginTop: 16,
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.preview}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.colorBox, { backgroundColor: color }]} />
        <Text style={styles.colorText}>{color}</Text>
        <Pipette size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Color</Text>

              {/* Current Color */}
              <View style={[styles.currentColor, { backgroundColor: color }]} />

              {/* Preset Colors */}
              {showPresets && (
                <>
                  <Text style={styles.presetsTitle}>Presets</Text>
                  <ScrollView style={{ maxHeight: 200 }}>
                    <View style={styles.presetsGrid}>
                      {presets.map((preset) => (
                        <TouchableOpacity
                          key={preset}
                          onPress={() => handleChange(preset)}
                          style={[styles.presetButton, { backgroundColor: preset }]}
                          activeOpacity={0.7}
                        >
                          {color === preset && (
                            <Check size={20} color="#FFFFFF" strokeWidth={3} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPicker(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
