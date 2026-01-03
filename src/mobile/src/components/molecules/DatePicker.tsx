import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Modal } from './Modal';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  error,
  label,
  minDate,
  maxDate,
  format = 'MM/DD/YYYY',
}: DatePickerProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value
      ? new Date(value.getFullYear(), value.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date) && onChange) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <View>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isDarkMode
                ? theme.colors.text.primary
                : theme.colors.gray[900],
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          styles.input,
          {
            backgroundColor: disabled
              ? isDarkMode
                ? theme.colors.gray[900]
                : theme.colors.gray[50]
              : isDarkMode
              ? theme.colors.gray[800]
              : '#FFFFFF',
            borderColor: error
              ? theme.colors.error
              : isDarkMode
              ? theme.colors.border
              : theme.colors.gray[300],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.inputText,
            {
              color: value
                ? isDarkMode
                  ? theme.colors.text.primary
                  : theme.colors.gray[900]
                : isDarkMode
                ? theme.colors.text.secondary
                : theme.colors.gray[500],
            },
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Calendar
          size={20}
          color={
            isDarkMode ? theme.colors.text.secondary : theme.colors.gray[400]
          }
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      {/* Calendar Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Date"
        size="sm"
      >
        {/* Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <ChevronLeft
              size={20}
              color={
                isDarkMode
                  ? theme.colors.text.secondary
                  : theme.colors.gray[600]
              }
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.monthYear,
              {
                color: isDarkMode
                  ? theme.colors.text.primary
                  : theme.colors.gray[900],
              },
            ]}
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <ChevronRight
              size={20}
              color={
                isDarkMode
                  ? theme.colors.text.secondary
                  : theme.colors.gray[600]
              }
            />
          </TouchableOpacity>
        </View>

        {/* Week Days */}
        <View style={styles.weekDays}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDay}>
              <Text
                style={[
                  styles.weekDayText,
                  {
                    color: isDarkMode
                      ? theme.colors.text.secondary
                      : theme.colors.gray[600],
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isSelected = value && isSameDay(day, value);
            const isTodayDate = isToday(day);
            const isDisabled = isDateDisabled(day);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(day)}
                disabled={isDisabled}
                style={[
                  styles.dayButton,
                  isSelected && {
                    backgroundColor: theme.colors.primary,
                  },
                  !isSelected &&
                    isTodayDate && {
                      backgroundColor: isDarkMode
                        ? 'rgba(59, 130, 246, 0.15)'
                        : '#EFF6FF',
                    },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: !isCurrentMonth
                        ? isDarkMode
                          ? theme.colors.gray[600]
                          : theme.colors.gray[400]
                        : isSelected
                        ? '#FFFFFF'
                        : isTodayDate
                        ? theme.colors.primary
                        : isDarkMode
                        ? theme.colors.text.primary
                        : theme.colors.gray[900],
                      opacity: isDisabled ? 0.5 : 1,
                    },
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 14,
    flex: 1,
  },
  error: {
    fontSize: 13,
    marginTop: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    padding: 4,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 13,
  },
});
