import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

export interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
}

export interface TimeInputProps {
  value?: TimeValue;
  onChange?: (time: TimeValue) => void;
  format?: '12' | '24';
  showSeconds?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function TimeInput({
  value,
  onChange,
  format = '24',
  showSeconds = false,
  disabled = false,
  className = '',
  label,
}: TimeInputProps) {
  const [time, setTime] = useState<TimeValue>(
    value || { hours: 0, minutes: 0, seconds: 0 }
  );
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value) {
      setTime(value);
      if (format === '12' && value.hours >= 12) {
        setPeriod('PM');
      }
    }
  }, [value, format]);

  const handleTimeChange = (field: keyof TimeValue, delta: number) => {
    const newTime = { ...time };

    if (field === 'hours') {
      let newHours = time.hours + delta;
      const maxHours = format === '12' ? 12 : 23;
      
      if (newHours > maxHours) newHours = 0;
      if (newHours < 0) newHours = maxHours;
      
      newTime.hours = newHours;
    } else if (field === 'minutes') {
      let newMinutes = time.minutes + delta;
      
      if (newMinutes > 59) {
        newMinutes = 0;
        handleTimeChange('hours', 1);
      }
      if (newMinutes < 0) {
        newMinutes = 59;
        handleTimeChange('hours', -1);
      }
      
      newTime.minutes = newMinutes;
    } else if (field === 'seconds' && showSeconds) {
      let newSeconds = (time.seconds || 0) + delta;
      
      if (newSeconds > 59) newSeconds = 0;
      if (newSeconds < 0) newSeconds = 59;
      
      newTime.seconds = newSeconds;
    }

    setTime(newTime);
    onChange?.(newTime);
  };

  const handleInputChange = (field: keyof TimeValue, value: string) => {
    const num = parseInt(value) || 0;
    const newTime = { ...time };

    if (field === 'hours') {
      const maxHours = format === '12' ? 12 : 23;
      newTime.hours = Math.min(Math.max(num, 0), maxHours);
    } else if (field === 'minutes') {
      newTime.minutes = Math.min(Math.max(num, 0), 59);
    } else if (field === 'seconds') {
      newTime.seconds = Math.min(Math.max(num, 0), 59);
    }

    setTime(newTime);
    onChange?.(newTime);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    
    const newTime = { ...time };
    if (newPeriod === 'PM' && time.hours < 12) {
      newTime.hours += 12;
    } else if (newPeriod === 'AM' && time.hours >= 12) {
      newTime.hours -= 12;
    }
    
    setTime(newTime);
    onChange?.(newTime);
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  const displayHours = format === '12' && time.hours > 12 
    ? time.hours - 12 
    : format === '12' && time.hours === 0
    ? 12
    : time.hours;

  const TimeSelector = ({ 
    value, 
    field, 
    max 
  }: { 
    value: number; 
    field: keyof TimeValue; 
    max: number;
  }) => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleTimeChange(field, 1)}
        disabled={disabled}
        className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50"
      >
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      </button>
      
      <input
        type="text"
        value={pad(value)}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={disabled}
        className="w-14 py-2 text-center text-2xl font-semibold bg-transparent text-foreground border-2 border-transparent hover:border-border dark:hover:border-border focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 rounded-lg transition-all disabled:opacity-50"
        maxLength={2}
      />
      
      <button
        onClick={() => handleTimeChange(field, -1)}
        disabled={disabled}
        className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50"
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="inline-flex items-center gap-4 p-4 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card">
        {/* Icon */}
        <Clock className="w-6 h-6 text-indigo-600" />

        {/* Hours */}
        <TimeSelector 
          value={displayHours} 
          field="hours" 
          max={format === '12' ? 12 : 23} 
        />

        <span className="text-2xl font-semibold text-muted-foreground">:</span>

        {/* Minutes */}
        <TimeSelector 
          value={time.minutes} 
          field="minutes" 
          max={59} 
        />

        {/* Seconds */}
        {showSeconds && (
          <>
            <span className="text-2xl font-semibold text-muted-foreground">:</span>
            <TimeSelector 
              value={time.seconds || 0} 
              field="seconds" 
              max={59} 
            />
          </>
        )}

        {/* AM/PM Toggle */}
        {format === '12' && (
          <button
            onClick={togglePeriod}
            disabled={disabled}
            className="px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50"
          >
            {period}
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="mt-2 text-sm text-muted-foreground">
        Time: {pad(time.hours)}:{pad(time.minutes)}
        {showSeconds && `:${pad(time.seconds || 0)}`}
        {format === '12' && ` ${period}`}
      </div>
    </div>
  );
}
