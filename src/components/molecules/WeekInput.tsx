import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface WeekValue {
  year: number;
  week: number;
  startDate: Date;
  endDate: Date;
}

export interface WeekInputProps {
  value?: WeekValue;
  onChange?: (week: WeekValue) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function WeekInput({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select week...',
  className = '',
  label,
}: WeekInputProps) {
  const [selectedWeek, setSelectedWeek] = useState<WeekValue | null>(value || null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const getWeekRange = (date: Date): { startDate: Date; endDate: Date } => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const startDate = new Date(date.setDate(diff));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return { startDate: new Date(startDate), endDate: new Date(endDate) };
  };

  const handleWeekSelect = (date: Date) => {
    const weekNumber = getWeekNumber(date);
    const { startDate, endDate } = getWeekRange(new Date(date));
    
    const weekValue: WeekValue = {
      year: date.getFullYear(),
      week: weekNumber,
      startDate,
      endDate,
    };

    setSelectedWeek(weekValue);
    onChange?.(weekValue);
    setShowCalendar(false);
  };

  const formatWeek = (week: WeekValue) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = week.startDate.toLocaleDateString('en-US', options);
    const end = week.endDate.toLocaleDateString('en-US', options);
    return `Week ${week.week}, ${week.year} (${start} - ${end})`;
  };

  const getWeeksInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Start from the first day of the week containing the 1st
    const startDay = new Date(firstDay);
    const day = startDay.getDay();
    startDay.setDate(startDay.getDate() - day + (day === 0 ? -6 : 1));

    let current = new Date(startDay);

    while (current <= lastDay || current.getMonth() === month) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(new Date(current));
      current.setDate(current.getDate() + 1);

      if (current > lastDay && currentWeek.length > 0) {
        // Fill the rest of the week
        while (currentWeek.length < 7) {
          currentWeek.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        weeks.push(currentWeek);
        break;
      }
    }

    return weeks;
  };

  const isWeekSelected = (weekDates: Date[]) => {
    if (!selectedWeek) return false;
    const weekStart = weekDates[0];
    return weekStart.toDateString() === selectedWeek.startDate.toDateString();
  };

  const weeks = getWeeksInMonth(currentMonth);

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
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className={selectedWeek ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedWeek ? formatWeek(selectedWeek) : placeholder}
          </span>
        </div>
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
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <div className="font-semibold text-foreground">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="space-y-1">
              {weeks.map((week, weekIndex) => {
                const isSelected = isWeekSelected(week);
                const weekNumber = getWeekNumber(week[0]);

                return (
                  <button
                    key={weekIndex}
                    onClick={() => handleWeekSelect(week[0])}
                    className={`
                      w-full grid grid-cols-7 gap-1 p-1 rounded-lg transition-all
                      ${isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'hover:bg-muted dark:hover:bg-muted'
                      }
                    `}
                  >
                    {week.map((date, dateIndex) => {
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      
                      return (
                        <div
                          key={dateIndex}
                          className={`
                            text-sm p-2 rounded text-center
                            ${isCurrentMonth
                              ? isSelected ? 'text-white' : 'text-foreground'
                              : 'text-muted-foreground opacity-50'
                            }
                          `}
                        >
                          {date.getDate()}
                        </div>
                      );
                    })}
                  </button>
                );
              })}
            </div>

            {/* Week Number Info */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border text-xs text-muted-foreground text-center">
              Click on a week to select
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
