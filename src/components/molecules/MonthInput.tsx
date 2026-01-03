import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MonthValue {
  month: number; // 0-11
  year: number;
  date: Date;
}

export interface MonthInputProps {
  value?: MonthValue;
  onChange?: (month: MonthValue) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  format?: 'short' | 'long';
  className?: string;
  label?: string;
}

export function MonthInput({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select month...',
  format = 'long',
  className = '',
  label,
}: MonthInputProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthValue | null>(value || null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1);
    
    const monthValue: MonthValue = {
      month: monthIndex,
      year: currentYear,
      date,
    };

    setSelectedMonth(monthValue);
    onChange?.(monthValue);
    setShowPicker(false);
  };

  const formatMonth = (month: MonthValue) => {
    if (format === 'short') {
      return `${shortMonths[month.month]} ${month.year}`;
    }
    return `${months[month.month]} ${month.year}`;
  };

  const isMonthDisabled = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1);
    
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) {
      return true;
    }
    
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) {
      return true;
    }
    
    return false;
  };

  const isMonthSelected = (monthIndex: number) => {
    return selectedMonth?.month === monthIndex && selectedMonth?.year === currentYear;
  };

  const isCurrentMonth = (monthIndex: number) => {
    const now = new Date();
    return monthIndex === now.getMonth() && currentYear === now.getFullYear();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl
          border-2 transition-all bg-card dark:bg-card
          ${showPicker
            ? 'border-indigo-600 ring-4 ring-indigo-600/20'
            : 'border-border dark:border-border hover:border-indigo-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className={selectedMonth ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedMonth ? formatMonth(selectedMonth) : placeholder}
          </span>
        </div>
      </button>

      {/* Month Picker Dropdown */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl p-4"
          >
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentYear(currentYear - 1)}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <div className="font-semibold text-foreground text-lg">
                {currentYear}
              </div>
              <button
                onClick={() => setCurrentYear(currentYear + 1)}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const selected = isMonthSelected(index);
                const current = isCurrentMonth(index);
                const monthDisabled = isMonthDisabled(index);

                return (
                  <button
                    key={index}
                    onClick={() => !monthDisabled && handleMonthSelect(index)}
                    disabled={monthDisabled}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${selected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : current
                        ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-muted dark:hover:bg-muted text-foreground'
                      }
                      ${monthDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                    `}
                  >
                    {format === 'short' ? shortMonths[index] : month}
                  </button>
                );
              })}
            </div>

            {/* Quick Select */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border flex gap-2">
              <button
                onClick={() => {
                  const now = new Date();
                  handleMonthSelect(now.getMonth());
                }}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80 text-foreground transition-colors"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  setCurrentYear(lastMonth.getFullYear());
                  handleMonthSelect(lastMonth.getMonth());
                }}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80 text-foreground transition-colors"
              >
                Last Month
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
