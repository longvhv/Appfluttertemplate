import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DatePicker } from './DatePicker';

export interface DateTimeInputProps {
  value?: Date;
  onChange?: (value: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: '12h' | '24h';
  minuteStep?: number;
  className?: string;
  label?: string;
  error?: boolean;
}

export function DateTimeInput({
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  format = '12h',
  minuteStep = 15,
  className = '',
  label,
  error = false,
}: DateTimeInputProps) {
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [hours, setHours] = useState(
    format === '12h'
      ? selectedDate.getHours() % 12 || 12
      : selectedDate.getHours()
  );
  const [minutes, setMinutes] = useState(selectedDate.getMinutes());
  const [period, setPeriod] = useState(selectedDate.getHours() >= 12 ? 'PM' : 'AM');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateDateTime(date, hours, minutes, period);
  };

  const handleTimeChange = (newHours: number, newMinutes: number, newPeriod?: string) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (newPeriod) setPeriod(newPeriod);
    updateDateTime(selectedDate, newHours, newMinutes, newPeriod || period);
  };

  const updateDateTime = (date: Date, h: number, m: number, p: string) => {
    const newDate = new Date(date);
    
    if (format === '12h') {
      const hours24 = p === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      newDate.setHours(hours24);
    } else {
      newDate.setHours(h);
    }
    
    newDate.setMinutes(m);
    newDate.setSeconds(0);
    onChange?.(newDate);
  };

  const formatTime = () => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return format === '12h' ? `${h}:${m} ${period}` : `${h}:${m}`;
  };

  const generateHours = () => {
    return format === '12h'
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Date Selection */}
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
        />

        {/* Time Selection */}
        <div className={`
          p-4 rounded-xl border-2 transition-all
          bg-card dark:bg-card
          ${error
            ? 'border-red-600'
            : 'border-border dark:border-border'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Time</span>
            <span className="ml-auto text-sm font-mono text-indigo-600 dark:text-indigo-400">
              {formatTime()}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            {/* Hours */}
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Hours
              </label>
              <select
                value={hours}
                onChange={(e) => handleTimeChange(parseInt(e.target.value), minutes, period)}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {generateHours().map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-2xl font-bold text-muted-foreground pt-5">:</div>

            {/* Minutes */}
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">
                Minutes
              </label>
              <select
                value={minutes}
                onChange={(e) => handleTimeChange(hours, parseInt(e.target.value), period)}
                disabled={disabled}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {generateMinutes().map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            {/* Period (AM/PM) */}
            {format === '12h' && (
              <div className="w-20">
                <label className="block text-xs text-muted-foreground mb-1">
                  Period
                </label>
                <select
                  value={period}
                  onChange={(e) => handleTimeChange(hours, minutes, e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            )}
          </div>

          {/* Quick Time Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: '9:00 AM', h: 9, m: 0, p: 'AM' },
              { label: '12:00 PM', h: 12, m: 0, p: 'PM' },
              { label: '3:00 PM', h: 3, m: 0, p: 'PM' },
              { label: '6:00 PM', h: 6, m: 0, p: 'PM' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleTimeChange(preset.h, preset.m, preset.p)}
                disabled={disabled}
                className="px-3 py-1 text-xs rounded-lg bg-muted dark:bg-muted hover:bg-indigo-100 dark:hover:bg-indigo-950/30 text-foreground transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected DateTime Display */}
        <div className="text-center text-sm text-muted-foreground">
          Selected: {selectedDate.toLocaleDateString()} at {formatTime()}
        </div>
      </div>
    </div>
  );
}
