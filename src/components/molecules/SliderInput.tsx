import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface SliderInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showButtons?: boolean;
  showInput?: boolean;
  marks?: { value: number; label: string }[];
  formatValue?: (value: number) => string;
  className?: string;
  label?: string;
  unit?: string;
}

export function SliderInput({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  showButtons = true,
  showInput = true,
  marks,
  formatValue,
  className = '',
  label,
  unit,
}: SliderInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max);
    setInternalValue(clampedValue);
    onChange?.(clampedValue);
  };

  const handleIncrement = () => {
    handleChange(internalValue + step);
  };

  const handleDecrement = () => {
    handleChange(internalValue - step);
  };

  const percentage = ((internalValue - min) / (max - min)) * 100;

  const displayValue = formatValue
    ? formatValue(internalValue)
    : unit
    ? `${internalValue}${unit}`
    : internalValue;

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {showValue && (
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Decrement Button */}
        {showButtons && (
          <button
            onClick={handleDecrement}
            disabled={disabled || internalValue <= min}
            className="p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4 text-foreground" />
          </button>
        )}

        {/* Slider */}
        <div className="flex-1 relative">
          {/* Track */}
          <div className="h-2 bg-muted dark:bg-muted rounded-full relative overflow-hidden">
            {/* Progress */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={internalValue}
            onChange={(e) => handleChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {/* Custom Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-800 border-2 border-indigo-600 rounded-full shadow-lg pointer-events-none transition-all"
            style={{ left: `calc(${percentage}% - 10px)` }}
          />

          {/* Marks */}
          {marks && (
            <div className="relative mt-2">
              {marks.map((mark) => {
                const markPercentage = ((mark.value - min) / (max - min)) * 100;
                return (
                  <div
                    key={mark.value}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${markPercentage}%` }}
                  >
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {mark.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Increment Button */}
        {showButtons && (
          <button
            onClick={handleIncrement}
            disabled={disabled || internalValue >= max}
            className="p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        )}

        {/* Number Input */}
        {showInput && (
          <input
            type="number"
            value={internalValue}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="w-20 px-3 py-2 rounded-lg border border-border dark:border-border bg-card dark:bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          />
        )}
      </div>
    </div>
  );
}
