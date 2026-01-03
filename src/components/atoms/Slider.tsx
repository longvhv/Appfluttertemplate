import React, { useState, useRef, useEffect } from 'react';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: SliderSize;
  showValue?: boolean;
  showMinMax?: boolean;
  color?: string;
  formatValue?: (value: number) => string;
  marks?: Array<{ value: number; label: string }>;
  className?: string;
}

const sizeStyles: Record<SliderSize, { track: string; thumb: string }> = {
  sm: { track: 'h-1', thumb: 'w-3 h-3' },
  md: { track: 'h-2', thumb: 'w-4 h-4' },
  lg: { track: 'h-3', thumb: 'w-5 h-5' },
};

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  showValue = false,
  showMinMax = false,
  color = 'bg-indigo-600',
  formatValue = (v) => v.toString(),
  marks,
  className = '',
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const styles = sizeStyles[size];

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        updateValue(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className={`relative ${className}`}>
      {/* Min/Max labels */}
      {showMinMax && (
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}

      {/* Slider track */}
      <div className="relative">
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`
            relative ${styles.track} rounded-full
            bg-gray-200 dark:bg-gray-700
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Filled track */}
          <div
            className={`absolute left-0 top-0 ${styles.track} rounded-full ${color} transition-none`}
            style={{ width: `${percentage}%` }}
          />

          {/* Thumb */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              ${styles.thumb} rounded-full
              ${color} border-2 border-white dark:border-gray-900
              shadow-md transition-none
              ${isDragging ? 'scale-125' : ''}
              ${disabled ? '' : 'hover:scale-110'}
            `}
            style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
          />

          {/* Marks */}
          {marks && marks.map((mark) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100;
            return (
              <div
                key={mark.value}
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"
                style={{ left: `${markPercentage}%` }}
              />
            );
          })}
        </div>

        {/* Mark labels */}
        {marks && (
          <div className="relative mt-2">
            {marks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute text-xs text-muted-foreground -translate-x-1/2"
                  style={{ left: `${markPercentage}%` }}
                >
                  {mark.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Value display */}
      {showValue && (
        <div className="text-center mt-2 text-sm font-medium text-foreground">
          {formatValue(value)}
        </div>
      )}
    </div>
  );
}

// Range Slider (two handles)
export interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: SliderSize;
  showValue?: boolean;
  color?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  showValue = false,
  color = 'bg-indigo-600',
  formatValue = (v) => v.toString(),
  className = '',
}: RangeSliderProps) {
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const styles = sizeStyles[size];

  const [minValue, maxValue] = value;
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const updateValue = (clientX: number, handle: 'min' | 'max') => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;

    if (handle === 'min') {
      const clampedValue = Math.max(min, Math.min(maxValue - step, steppedValue));
      onChange([clampedValue, maxValue]);
    } else {
      const clampedValue = Math.max(minValue + step, Math.min(max, steppedValue));
      onChange([minValue, clampedValue]);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        updateValue(e.clientX, dragging);
      }
    };

    const handleEnd = () => {
      setDragging(null);
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [dragging, minValue, maxValue]);

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className={`
          relative ${styles.track} rounded-full
          bg-gray-200 dark:bg-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Filled track */}
        <div
          className={`absolute top-0 ${styles.track} rounded-full ${color}`}
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />

        {/* Min thumb */}
        <div
          onMouseDown={() => !disabled && setDragging('min')}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${styles.thumb} rounded-full
            ${color} border-2 border-white dark:border-gray-900
            shadow-md z-10
            ${dragging === 'min' ? 'scale-125' : ''}
            ${disabled ? '' : 'hover:scale-110 cursor-grab active:cursor-grabbing'}
          `}
          style={{ left: `${minPercentage}%`, transform: `translate(-50%, -50%)` }}
        />

        {/* Max thumb */}
        <div
          onMouseDown={() => !disabled && setDragging('max')}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${styles.thumb} rounded-full
            ${color} border-2 border-white dark:border-gray-900
            shadow-md z-10
            ${dragging === 'max' ? 'scale-125' : ''}
            ${disabled ? '' : 'hover:scale-110 cursor-grab active:cursor-grabbing'}
          `}
          style={{ left: `${maxPercentage}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      {showValue && (
        <div className="flex justify-between text-sm font-medium text-foreground mt-2">
          <span>{formatValue(minValue)}</span>
          <span>{formatValue(maxValue)}</span>
        </div>
      )}
    </div>
  );
}
