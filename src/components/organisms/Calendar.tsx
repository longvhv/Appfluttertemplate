import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color?: string;
  description?: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  minDate?: Date;
  maxDate?: Date;
  highlightToday?: boolean;
  className?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function Calendar({
  events = [],
  selectedDate,
  onDateSelect,
  onEventClick,
  minDate,
  maxDate,
  highlightToday = true,
  className = '',
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [direction, setDirection] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;
    
    onDateSelect?.(date);
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === date.getTime();
    });
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return date.getTime() === selected.getTime();
  };

  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Build calendar grid
  const calendarDays: Array<{ day: number; isCurrentMonth: boolean }> = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-2"
          >
            {calendarDays.map((item, index) => {
              const dayEvents = item.isCurrentMonth ? getEventsForDate(item.day) : [];
              const isSelected = item.isCurrentMonth && isDateSelected(item.day);
              const isTodayDate = item.isCurrentMonth && highlightToday && isToday(item.day);
              const isDisabledDate = item.isCurrentMonth && isDisabled(item.day);

              return (
                <button
                  key={index}
                  onClick={() => item.isCurrentMonth && !isDisabledDate && handleDateClick(item.day)}
                  disabled={!item.isCurrentMonth || isDisabledDate}
                  className={`
                    relative aspect-square p-1 rounded-lg transition-all
                    ${item.isCurrentMonth
                      ? 'text-foreground hover:bg-muted dark:hover:bg-muted'
                      : 'text-muted-foreground/50'
                    }
                    ${isSelected
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : ''
                    }
                    ${isTodayDate && !isSelected
                      ? 'border-2 border-indigo-600'
                      : 'border-2 border-transparent'
                    }
                    ${isDisabledDate
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                    }
                  `}
                >
                  <div className="text-sm font-medium">{item.day}</div>
                  
                  {/* Event Indicators */}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: isSelected ? '#fff' : (event.color || '#6366f1'),
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Event List */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-border dark:border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Events for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate.getDate()).length > 0 ? (
              getEventsForDate(selectedDate.getDate()).map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-full rounded-full"
                      style={{ backgroundColor: event.color || '#6366f1' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      {(event.startTime || event.endTime) && (
                        <p className="text-sm text-muted-foreground">
                          {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No events scheduled
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Calendar (no events list)
export function CompactCalendar({
  onDateSelect,
  selectedDate,
  ...props
}: Omit<CalendarProps, 'events' | 'onEventClick'>) {
  return (
    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-4">
      <Calendar
        {...props}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}
