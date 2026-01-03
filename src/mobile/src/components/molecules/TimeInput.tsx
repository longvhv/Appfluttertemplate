import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ViewStyle } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing, shadows } from '../../theme/tokens';
import { Picker } from '@react-native-picker/picker';

/**
 * TimeInput Component - React Native
 * 
 * Time picker with hours and minutes
 */

export interface TimeInputProps {
  value?: { hours: number; minutes: number };
  onChange?: (value: { hours: number; minutes: number }) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  format24h?: boolean;
  style?: ViewStyle;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  label,
  error,
  disabled = false,
  format24h = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(value?.hours || 0);
  const [tempMinutes, setTempMinutes] = useState(value?.minutes || 0);

  const formatTime = () => {
    if (!value) return placeholder;

    const { hours, minutes } = value;
    
    if (format24h) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleConfirm = () => {
    onChange?.({ hours: tempHours, minutes: tempMinutes });
    setIsOpen(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 48,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.colors.background,
    },
    triggerText: {
      fontSize: 16,
      color: value ? theme.colors.text : theme.colors.placeholder,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      ...shadows.xl,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    picker: {
      width: 100,
    },
    separator: {
      fontSize: 32,
      fontWeight: '600',
      color: theme.colors.text,
      paddingTop: 60,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const hours = format24h
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[styles.trigger, { opacity: disabled ? 0.5 : 1 }]}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>{formatTime()}</Text>
        <Clock size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Time</Text>
              </View>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempHours}
                  onValueChange={setTempHours}
                  style={styles.picker}
                >
                  {hours.map((h) => (
                    <Picker.Item key={h} label={h.toString().padStart(2, '0')} value={h} />
                  ))}
                </Picker>

                <Text style={styles.separator}>:</Text>

                <Picker
                  selectedValue={tempMinutes}
                  onValueChange={setTempMinutes}
                  style={styles.picker}
                >
                  {minutes.map((m) => (
                    <Picker.Item key={m} label={m.toString().padStart(2, '0')} value={m} />
                  ))}
                </Picker>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TimeInput;
