import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ViewStyle } from 'react-native';
import { Calendar, X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing, shadows } from '../../theme/tokens';
import DatePicker from './DatePicker';

/**
 * DateRangeInput Component - React Native
 * 
 * Date range picker with start and end dates
 */

export interface DateRangeInputProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  style?: ViewStyle;
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startDate,
  endDate,
  onChange,
  placeholder = 'Select date range',
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  style,
}) => {
  const { theme } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'start' | 'end'>('start');

  const formatDateRange = () => {
    if (!startDate && !endDate) return placeholder;
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    if (startDate) {
      return `${formatDate(startDate)} - ...`;
    }
    
    return `... - ${formatDate(endDate!)}`;
  };

  const handleDateSelect = (date: Date) => {
    if (mode === 'start') {
      onChange?.(date, endDate);
      setMode('end');
    } else {
      onChange?.(startDate, date);
      setIsOpen(false);
      setMode('start');
    }
  };

  const handleClear = () => {
    onChange?.(undefined, undefined);
    setMode('start');
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
      color: startDate || endDate ? theme.colors.text : theme.colors.placeholder,
      flex: 1,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modal: {
      backgroundColor: theme.colors.card,
      borderRadius: borderRadius.xl,
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
    closeButton: {
      padding: spacing.xs,
    },
    modeSelector: {
      flexDirection: 'row',
      padding: spacing.md,
      gap: spacing.sm,
    },
    modeButton: {
      flex: 1,
      padding: spacing.sm,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
    },
    modeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    modeButtonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    datePickerContainer: {
      padding: spacing.md,
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
    clearButton: {
      backgroundColor: theme.colors.surface,
    },
    doneButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[styles.trigger, { opacity: disabled ? 0.5 : 1 }]}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>{formatDateRange()}</Text>
        <Calendar size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date Range</Text>
                <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* Mode Selector */}
              <View style={styles.modeSelector}>
                <TouchableOpacity
                  onPress={() => setMode('start')}
                  style={[
                    styles.modeButton,
                    mode === 'start' && styles.modeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      { color: mode === 'start' ? '#FFFFFF' : theme.colors.text },
                    ]}
                  >
                    Start Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMode('end')}
                  style={[
                    styles.modeButton,
                    mode === 'end' && styles.modeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modeButtonText,
                      { color: mode === 'end' ? '#FFFFFF' : theme.colors.text },
                    ]}
                  >
                    End Date
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Date Picker */}
              <View style={styles.datePickerContainer}>
                <DatePicker
                  value={mode === 'start' ? startDate : endDate}
                  onChange={handleDateSelect}
                  minDate={mode === 'end' ? startDate : minDate}
                  maxDate={maxDate}
                />
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={handleClear} style={[styles.button, styles.clearButton]}>
                  <Text style={[styles.buttonText, { color: theme.colors.text }]}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={[styles.button, styles.doneButton]}
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DateRangeInput;
