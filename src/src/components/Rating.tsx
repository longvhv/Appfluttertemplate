import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  precision?: number;
  readOnly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  icon?: React.ComponentType<{ className?: string; fill?: string }>;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  precision = 1,
  readOnly = false,
  disabled = false,
  showValue = false,
  icon: IconComponent = Star,
  emptyIcon: EmptyIconComponent = Star,
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const displayValue = hoverValue !== null ? hoverValue : value;
  const isInteractive = !readOnly && !disabled && onChange;

  const handleClick = (index: number) => {
    if (!isInteractive) return;
    const newValue = index + 1;
    onChange?.(newValue);
  };

  const handleMouseEnter = (index: number) => {
    if (!isInteractive) return;
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverValue(null);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="inline-flex gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const filled = displayValue >= index + 1;
          const partiallyFilled =
            precision < 1 && displayValue > index && displayValue < index + 1;
          const fillPercentage = partiallyFilled
            ? ((displayValue - index) / precision) * 100
            : 0;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              disabled={!isInteractive}
              whileHover={isInteractive ? { scale: 1.1 } : undefined}
              whileTap={isInteractive ? { scale: 0.95 } : undefined}
              className={`
                relative
                ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
                ${disabled ? 'opacity-50' : ''}
                transition-transform
              `}
            >
              {partiallyFilled ? (
                <div className="relative">
                  <EmptyIconComponent
                    className={`${sizes[size]} text-gray-300 dark:text-gray-600`}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    <IconComponent
                      className={`${sizes[size]} text-yellow-400`}
                      fill="currentColor"
                    />
                  </div>
                </div>
              ) : (
                <IconComponent
                  className={`
                    ${sizes[size]}
                    ${
                      filled
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }
                  `}
                  fill={filled ? 'currentColor' : 'none'}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(precision < 1 ? 1 : 0)}/{max}
        </span>
      )}
    </div>
  );
}

// RatingGroup - for showing rating with reviews count
export interface RatingGroupProps {
  value: number;
  max?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingGroup({
  value,
  max = 5,
  count,
  size = 'md',
  className = '',
}: RatingGroupProps) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Rating value={value} max={max} size={size} readOnly />
      <span className={`${textSizes[size]} font-medium text-gray-900 dark:text-white`}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={`${textSizes[size]} text-gray-500 dark:text-gray-400`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
