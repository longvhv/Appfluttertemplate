import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  marks?: { value: number; label?: string }[];
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = false,
  showMinMax = false,
  marks,
  formatValue = (v) => v.toString(),
  className = '',
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
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
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-4">
        {showMinMax && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {formatValue(min)}
          </span>
        )}

        <div className="flex-1 relative py-4">
          {/* Track */}
          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`
              relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Active Track */}
            <div
              className="absolute h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />

            {/* Marks */}
            {marks?.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${markPercentage}%` }}
                >
                  <div className="w-2 h-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-full -ml-1" />
                  {mark.label && (
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {mark.label}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Thumb */}
            <motion.div
              className={`
                absolute top-1/2 -translate-y-1/2 -ml-2
                w-5 h-5 bg-white dark:bg-gray-900
                border-2 border-indigo-600 dark:border-indigo-500
                rounded-full shadow-md
                ${disabled ? '' : 'hover:scale-110'}
                transition-transform
              `}
              style={{ left: `${percentage}%` }}
              whileHover={!disabled ? { scale: 1.2 } : undefined}
              whileTap={!disabled ? { scale: 1.1 } : undefined}
            />
          </div>

          {/* Value Tooltip */}
          {showValue && (
            <motion.div
              className="absolute -top-10 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-medium"
              style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isDragging ? 1 : 0.8, y: 0 }}
            >
              {formatValue(value)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
            </motion.div>
          )}
        </div>

        {showMinMax && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {formatValue(max)}
          </span>
        )}
      </div>
    </div>
  );
}

// RangeSlider - for selecting a range
export interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
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
  formatValue = (v) => v.toString(),
  className = '',
}: RangeSliderProps) {
  const [minValue, maxValue] = value;
  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative py-4">
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="absolute h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{formatValue(minValue)}</span>
          <span>{formatValue(maxValue)}</span>
        </div>
      </div>
    </div>
  );
}
