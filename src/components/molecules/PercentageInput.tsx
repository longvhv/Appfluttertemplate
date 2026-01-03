import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * PercentageInput Component
 * 
 * Specialized input for percentage values with formatting, validation,
 * and optional range constraints. Displays visual indicators and supports
 * both decimal and percentage entry modes.
 * 
 * @component
 * @example
 * ```tsx
 * <PercentageInput
 *   value={75}
 *   onChange={setValue}
 *   label="Discount"
 *   min={0}
 *   max={100}
 *   showIndicator
 * />
 * ```
 * 
 * Features:
 * - Percentage formatting (%)
 * - Min/max validation
 * - Decimal precision control
 * - Visual progress indicator
 * - Trend indicators
 * - Keyboard shortcuts (↑/↓)
 */

export interface PercentageInputProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showIndicator?: boolean;
  showTrend?: boolean;
  previousValue?: number;
  helperText?: string;
  className?: string;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  value = 0,
  onChange,
  label = 'Percentage',
  placeholder = '0',
  min = 0,
  max = 100,
  step = 1,
  decimals = 2,
  required = false,
  disabled = false,
  error,
  showIndicator = false,
  showTrend = false,
  previousValue,
  helperText,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toFixed(decimals));
    }
  }, [value, decimals, isFocused]);

  const validateAndFormat = useCallback((numValue: number): number => {
    let validated = numValue;
    
    if (min !== undefined && validated < min) validated = min;
    if (max !== undefined && validated > max) validated = max;
    
    return parseFloat(validated.toFixed(decimals));
  }, [min, max, decimals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace('%', '').trim();
    setInputValue(rawValue);

    if (rawValue === '' || rawValue === '-') {
      return;
    }

    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      const validated = validateAndFormat(numValue);
      onChange?.(validated);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (inputValue === '' || inputValue === '-') {
      setInputValue('0');
      onChange?.(0);
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const validated = validateAndFormat(numValue);
        setInputValue(validated.toFixed(decimals));
        onChange?.(validated);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = validateAndFormat(value + step);
      onChange?.(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = validateAndFormat(value - step);
      onChange?.(newValue);
    }
  };

  const getProgressPercentage = (): number => {
    if (min === undefined || max === undefined) return 0;
    const range = max - min;
    return ((value - min) / range) * 100;
  };

  const getTrendDirection = (): 'up' | 'down' | 'neutral' => {
    if (!showTrend || previousValue === undefined) return 'neutral';
    if (value > previousValue) return 'up';
    if (value < previousValue) return 'down';
    return 'neutral';
  };

  const getTrendColor = (): string => {
    const trend = getTrendDirection();
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const progressPercentage = getProgressPercentage();
  const trendDirection = getTrendDirection();

  return (
    <div className={`percentage-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {showTrend && previousValue !== undefined && (
            <span className={`text-xs flex items-center gap-1 ${getTrendColor()}`}>
              {trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
              {trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
              <span>
                {trendDirection === 'up' && '+'}
                {(value - previousValue).toFixed(decimals)}%
              </span>
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Percent className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-12 py-2 border rounded-lg ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {/* Percentage Symbol */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          %
        </div>
      </div>

      {/* Progress Indicator */}
      {showIndicator && !error && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{min}%</span>
            <span className="font-medium">{value.toFixed(decimals)}%</span>
            <span>{max}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                value >= 75 ? 'bg-green-500' :
                value >= 50 ? 'bg-blue-500' :
                value >= 25 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Range Info */}
      {!error && (min !== 0 || max !== 100) && (
        <p className="mt-1 text-xs text-gray-500">
          Range: {min}% - {max}%
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {/* Keyboard Shortcuts Hint */}
      {!disabled && !helperText && !error && (
        <p className="mt-1 text-xs text-gray-400">
          Use ↑/↓ arrows to adjust by {step}%
        </p>
      )}
    </div>
  );
};

export default PercentageInput;
