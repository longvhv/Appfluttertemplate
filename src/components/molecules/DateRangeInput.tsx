import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangeInputProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: 'short' | 'long';
  clearable?: boolean;
  className?: string;
  label?: string;
}

export function DateRangeInput({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date range...',
  format = 'short',
  clearable = true,
  className = '',
  label,
}: DateRangeInputProps) {
  const [range, setRange] = useState<DateRange>(
    value || { startDate: null, endDate: null }
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      const newRange = { startDate: date, endDate: null };
      setRange(newRange);
      onChange?.(newRange);
      setSelectingStart(false);
    } else {
      const newRange = {
        startDate: range.startDate,
        endDate: date < (range.startDate || new Date()) ? range.startDate : date,
      };
      if (date < (range.startDate || new Date())) {
        newRange.startDate = date;
        newRange.endDate = range.startDate;
      }
      setRange(newRange);
      onChange?.(newRange);
      setShowCalendar(false);
      setSelectingStart(true);
    }
  };

  const handleClear = () => {
    const newRange = { startDate: null, endDate: null };
    setRange(newRange);
    onChange?.(newRange);
    setSelectingStart(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!range.startDate || !range.endDate) return false;
    return date >= range.startDate && date <= range.endDate;
  };

  const isDateSelected = (date: Date) => {
    return (
      (range.startDate && date.toDateString() === range.startDate.toDateString()) ||
      (range.endDate && date.toDateString() === range.endDate.toDateString())
    );
  };

  const days = getDaysInMonth(currentMonth);
  const displayText =
    range.startDate && range.endDate
      ? `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`
      : range.startDate
      ? `${formatDate(range.startDate)} - ...`
      : placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Input Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setShowCalendar(!showCalendar)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl
          border-2 transition-all bg-card dark:bg-card
          ${showCalendar
            ? 'border-indigo-600 ring-4 ring-indigo-600/20'
            : 'border-border dark:border-border hover:border-indigo-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <span className={`truncate ${range.startDate ? 'text-foreground' : 'text-muted-foreground'}`}>
            {displayText}
          </span>
        </div>

        {clearable && range.startDate && (
          <X
            className="w-4 h-4 text-muted-foreground hover:text-foreground flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl p-4"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                ←
              </button>
              <div className="font-semibold text-foreground">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="p-2" />;
                }

                const isSelected = isDateSelected(date);
                const inRange = isDateInRange(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`
                      p-2 text-sm rounded-lg transition-all relative
                      ${isSelected
                        ? 'bg-indigo-600 text-white font-semibold'
                        : inRange
                        ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600'
                        : 'hover:bg-muted dark:hover:bg-muted text-foreground'
                      }
                      ${isToday && !isSelected ? 'ring-2 ring-indigo-600/50' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Helper Text */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border text-xs text-muted-foreground text-center">
              {selectingStart ? 'Select start date' : 'Select end date'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
