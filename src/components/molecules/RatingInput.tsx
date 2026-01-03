import React, { useState } from 'react';
import { Star, Heart, ThumbsUp, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export interface RatingInputProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  icon?: 'star' | 'heart' | 'thumbs' | 'flame';
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  showValue?: boolean;
  labels?: string[];
  className?: string;
  label?: string;
}

export function RatingInput({
  value = 0,
  onChange,
  max = 5,
  allowHalf = false,
  icon = 'star',
  size = 'md',
  readOnly = false,
  showValue = true,
  labels,
  className = '',
  label,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [rating, setRating] = useState(value);

  const displayValue = hoverValue !== null ? hoverValue : rating;

  const handleClick = (index: number, isHalf: boolean) => {
    if (readOnly) return;
    const newRating = allowHalf && isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
    onChange?.(newRating);
  };

  const handleMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = allowHalf && x < rect.width / 2;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const getIcon = () => {
    switch (icon) {
      case 'heart':
        return Heart;
      case 'thumbs':
        return ThumbsUp;
      case 'flame':
        return Flame;
      default:
        return Star;
    }
  };

  const Icon = getIcon();

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const iconSize = sizeClasses[size];

  const getColor = (index: number) => {
    const filled = displayValue > index;
    const halfFilled = allowHalf && displayValue === index + 0.5;

    if (icon === 'heart') return filled || halfFilled ? '#ef4444' : '#d1d5db';
    if (icon === 'flame') return filled || halfFilled ? '#f97316' : '#d1d5db';
    return filled || halfFilled ? '#eab308' : '#d1d5db';
  };

  const getFillPercentage = (index: number) => {
    if (displayValue <= index) return 0;
    if (displayValue >= index + 1) return 100;
    return (displayValue - index) * 100;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Rating Icons */}
        <div
          className="flex items-center gap-1"
          onMouseLeave={handleMouseLeave}
        >
          {Array.from({ length: max }).map((_, index) => (
            <div
              key={index}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isHalf = allowHalf && x < rect.width / 2;
                handleClick(index, isHalf);
              }}
              className={`
                relative transition-transform
                ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              `}
            >
              {/* Background Icon */}
              <Icon
                className={iconSize}
                style={{ color: '#d1d5db' }}
                fill="#d1d5db"
              />

              {/* Filled Icon */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${getFillPercentage(index)}%` }}
              >
                <Icon
                  className={iconSize}
                  style={{ color: getColor(index) }}
                  fill={getColor(index)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Value Display */}
        {showValue && (
          <motion.span
            key={displayValue}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-sm font-semibold text-foreground ml-2"
          >
            {displayValue.toFixed(1)} / {max}
          </motion.span>
        )}
      </div>

      {/* Labels */}
      {labels && labels[Math.floor(displayValue)] && (
        <motion.p
          key={displayValue}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {labels[Math.floor(displayValue) - 1] || labels[0]}
        </motion.p>
      )}
    </div>
  );
}
