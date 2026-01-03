import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface DurationInputProps {
  value?: Duration;
  onChange?: (duration: Duration) => void;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  maxHours?: number;
  disabled?: boolean;
  format?: 'compact' | 'expanded';
  className?: string;
  label?: string;
}

export function DurationInput({
  value,
  onChange,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  maxHours = 99,
  disabled = false,
  format = 'compact',
  className = '',
  label,
}: DurationInputProps) {
  const [duration, setDuration] = useState<Duration>(
    value || { hours: 0, minutes: 0, seconds: 0 }
  );

  const handleChange = (field: keyof Duration, value: string) => {
    const num = parseInt(value) || 0;
    const newDuration = { ...duration };

    if (field === 'hours') {
      newDuration.hours = Math.min(Math.max(num, 0), maxHours);
    } else if (field === 'minutes') {
      newDuration.minutes = Math.min(Math.max(num, 0), 59);
    } else if (field === 'seconds') {
      newDuration.seconds = Math.min(Math.max(num, 0), 59);
    }

    setDuration(newDuration);
    onChange?.(newDuration);
  };

  const handleIncrement = (field: keyof Duration) => {
    const newDuration = { ...duration };

    if (field === 'hours') {
      newDuration.hours = Math.min(duration.hours + 1, maxHours);
    } else if (field === 'minutes') {
      if (duration.minutes === 59) {
        newDuration.minutes = 0;
        if (showHours) newDuration.hours = Math.min(duration.hours + 1, maxHours);
      } else {
        newDuration.minutes = duration.minutes + 1;
      }
    } else if (field === 'seconds') {
      if (duration.seconds === 59) {
        newDuration.seconds = 0;
        if (showMinutes) {
          if (duration.minutes === 59) {
            newDuration.minutes = 0;
            if (showHours) newDuration.hours = Math.min(duration.hours + 1, maxHours);
          } else {
            newDuration.minutes = duration.minutes + 1;
          }
        }
      } else {
        newDuration.seconds = duration.seconds + 1;
      }
    }

    setDuration(newDuration);
    onChange?.(newDuration);
  };

  const handleDecrement = (field: keyof Duration) => {
    const newDuration = { ...duration };

    if (field === 'hours') {
      newDuration.hours = Math.max(duration.hours - 1, 0);
    } else if (field === 'minutes') {
      if (duration.minutes === 0) {
        newDuration.minutes = 59;
        if (showHours) newDuration.hours = Math.max(duration.hours - 1, 0);
      } else {
        newDuration.minutes = duration.minutes - 1;
      }
    } else if (field === 'seconds') {
      if (duration.seconds === 0) {
        newDuration.seconds = 59;
        if (showMinutes) {
          if (duration.minutes === 0) {
            newDuration.minutes = 59;
            if (showHours) newDuration.hours = Math.max(duration.hours - 1, 0);
          } else {
            newDuration.minutes = duration.minutes - 1;
          }
        }
      } else {
        newDuration.seconds = duration.seconds - 1;
      }
    }

    setDuration(newDuration);
    onChange?.(newDuration);
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  const getTotalSeconds = () => {
    return duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
  };

  const formatDuration = () => {
    const parts = [];
    if (showHours && duration.hours > 0) {
      parts.push(`${duration.hours}h`);
    }
    if (showMinutes && duration.minutes > 0) {
      parts.push(`${duration.minutes}m`);
    }
    if (showSeconds && duration.seconds > 0) {
      parts.push(`${duration.seconds}s`);
    }
    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  if (format === 'compact') {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}

        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card">
          <Clock className="w-5 h-5 text-indigo-600" />

          {showHours && (
            <>
              <input
                type="number"
                value={pad(duration.hours)}
                onChange={(e) => handleChange('hours', e.target.value)}
                disabled={disabled}
                className="w-12 text-center bg-transparent text-foreground font-mono text-lg outline-none disabled:opacity-50"
                min="0"
                max={maxHours}
              />
              <span className="text-muted-foreground font-mono">h</span>
            </>
          )}

          {showMinutes && (
            <>
              <input
                type="number"
                value={pad(duration.minutes)}
                onChange={(e) => handleChange('minutes', e.target.value)}
                disabled={disabled}
                className="w-12 text-center bg-transparent text-foreground font-mono text-lg outline-none disabled:opacity-50"
                min="0"
                max="59"
              />
              <span className="text-muted-foreground font-mono">m</span>
            </>
          )}

          {showSeconds && (
            <>
              <input
                type="number"
                value={pad(duration.seconds)}
                onChange={(e) => handleChange('seconds', e.target.value)}
                disabled={disabled}
                className="w-12 text-center bg-transparent text-foreground font-mono text-lg outline-none disabled:opacity-50"
                min="0"
                max="59"
              />
              <span className="text-muted-foreground font-mono">s</span>
            </>
          )}
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          Total: {getTotalSeconds()} seconds ({formatDuration()})
        </div>
      </div>
    );
  }

  // Expanded format with increment/decrement buttons
  const DurationField = ({ 
    field, 
    label: fieldLabel, 
    max 
  }: { 
    field: keyof Duration; 
    label: string; 
    max: number;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleIncrement(field)}
        disabled={disabled}
        className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50"
      >
        ▲
      </button>

      <input
        type="number"
        value={pad(duration[field])}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={disabled}
        className="w-16 py-2 text-center text-2xl font-mono font-semibold bg-muted/50 dark:bg-muted/50 text-foreground border-2 border-border dark:border-border rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all disabled:opacity-50"
        min="0"
        max={max}
      />

      <button
        onClick={() => handleDecrement(field)}
        disabled={disabled}
        className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50"
      >
        ▼
      </button>

      <span className="text-xs text-muted-foreground font-medium mt-1">
        {fieldLabel}
      </span>
    </div>
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      )}

      <div className="inline-flex items-center gap-6 p-6 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card">
        <Clock className="w-6 h-6 text-indigo-600" />

        {showHours && <DurationField field="hours" label="Hours" max={maxHours} />}
        {showMinutes && <DurationField field="minutes" label="Minutes" max={59} />}
        {showSeconds && <DurationField field="seconds" label="Seconds" max={59} />}
      </div>

      <div className="mt-3 text-sm text-muted-foreground text-center">
        Total: {getTotalSeconds()} seconds • {formatDuration()}
      </div>
    </div>
  );
}
