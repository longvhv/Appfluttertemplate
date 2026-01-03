import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

/**
 * RangeSliderInput Component
 * 
 * Dual-handle range slider for selecting a range between min and max values.
 * Features smooth dragging, precise value control, and customizable appearance.
 * 
 * @component
 * @example
 * ```tsx
 * <RangeSliderInput
 *   value={[20, 80]}
 *   onChange={setRange}
 *   min={0}
 *   max={100}
 *   label="Price Range"
 *   formatValue={(v) => `$${v}`}
 * />
 * ```
 * 
 * Features:
 * - Dual handle slider
 * - Min/max value display
 * - Custom formatting
 * - Keyboard support
 * - Step control
 * - Touch-friendly
 */

export type RangeValue = [number, number];

export interface RangeSliderInputProps {
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  showValues?: boolean;
  showMinMax?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const RangeSliderInput: React.FC<RangeSliderInputProps> = ({
  value = [0, 100],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue = (v) => v.toString(),
  showValues = true,
  showMinMax = true,
  disabled = false,
  error,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [localValue, setLocalValue] = useState<RangeValue>(value);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = useCallback((val: number): number => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!trackRef.current) return min;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step]);

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const newValue = getValueFromPosition(e.clientX);
    
    setLocalValue(prev => {
      let updated: RangeValue = [...prev];
      
      if (isDragging === 'min') {
        updated[0] = Math.min(newValue, prev[1] - step);
      } else {
        updated[1] = Math.max(newValue, prev[0] + step);
      }
      
      return updated;
    });
  }, [isDragging, disabled, getValueFromPosition, step]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onChange?.(localValue);
      setIsDragging(null);
    }
  }, [isDragging, localValue, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || e.target !== e.currentTarget) return;

    const clickValue = getValueFromPosition(e.clientX);
    const [minVal, maxVal] = localValue;
    const distToMin = Math.abs(clickValue - minVal);
    const distToMax = Math.abs(clickValue - maxVal);

    let updated: RangeValue;
    if (distToMin < distToMax) {
      updated = [clickValue, maxVal];
    } else {
      updated = [minVal, clickValue];
    }

    setLocalValue(updated);
    onChange?.(updated);
  };

  const handleKeyDown = (handle: 'min' | 'max') => (e: React.KeyboardEvent) => {
    if (disabled) return;

    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      delta = step;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      delta = -step;
    } else {
      return;
    }

    e.preventDefault();
    
    setLocalValue(prev => {
      let updated: RangeValue = [...prev];
      
      if (handle === 'min') {
        updated[0] = Math.max(min, Math.min(prev[0] + delta, prev[1] - step));
      } else {
        updated[1] = Math.min(max, Math.max(prev[1] + delta, prev[0] + step));
      }
      
      onChange?.(updated);
      return updated;
    });
  };

  const minPercentage = getPercentage(localValue[0]);
  const maxPercentage = getPercentage(localValue[1]);

  return (
    <div className={`range-slider-input ${className}`}>
      {label && (
        <label className="block mb-3">
          {label}
        </label>
      )}

      {/* Value Display */}
      {showValues && (
        <div className="flex justify-between items-center mb-3">
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
            {formatValue(localValue[0])}
          </div>
          <div className="text-gray-400 text-sm">to</div>
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
            {formatValue(localValue[1])}
          </div>
        </div>
      )}

      {/* Slider Track */}
      <div className="relative py-4">
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className={`relative h-2 bg-gray-200 rounded-full ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {/* Selected Range */}
          <div
            className={`absolute h-full bg-blue-500 rounded-full ${
              isDragging ? 'bg-blue-600' : ''
            }`}
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md ${
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            } ${
              isDragging === 'min' ? 'scale-110 border-blue-600 shadow-lg' : ''
            } transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
            onKeyDown={handleKeyDown('min')}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-label="Minimum value"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[0]}
          >
            <GripVertical className="w-3 h-3 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Max Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md ${
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            } ${
              isDragging === 'max' ? 'scale-110 border-blue-600 shadow-lg' : ''
            } transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
            onKeyDown={handleKeyDown('max')}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-label="Maximum value"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[1]}
          >
            <GripVertical className="w-3 h-3 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Min/Max Labels */}
        {showMinMax && (
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Keyboard Hint */}
      {!disabled && !error && (
        <p className="mt-1 text-xs text-gray-400">
          Use arrow keys to adjust values
        </p>
      )}
    </div>
  );
};

export default RangeSliderInput;
