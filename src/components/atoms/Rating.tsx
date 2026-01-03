import React, { useState } from 'react';
import { Star, Heart, ThumbsUp } from 'lucide-react';

export type RatingIcon = 'star' | 'heart' | 'thumbs';
export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  icon?: RatingIcon;
  size?: RatingSize;
  showValue?: boolean;
  allowHalf?: boolean;
  color?: string;
  emptyColor?: string;
  className?: string;
}

const iconComponents = {
  star: Star,
  heart: Heart,
  thumbs: ThumbsUp,
};

const sizeStyles: Record<RatingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function Rating({
  value,
  max = 5,
  onChange,
  readonly = false,
  icon = 'star',
  size = 'md',
  showValue = false,
  allowHalf = false,
  color = 'text-yellow-400',
  emptyColor = 'text-gray-300 dark:text-gray-600',
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const IconComponent = iconComponents[icon];
  const isInteractive = !readonly && onChange;

  const handleClick = (index: number, isHalf: boolean) => {
    if (!isInteractive) return;
    const newValue = allowHalf && isHalf ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isInteractive || !allowHalf) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseEnter = (index: number) => {
    if (!isInteractive) return;
    if (!allowHalf) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, index) => {
          const isFilled = displayValue >= index + 1;
          const isHalfFilled = displayValue > index && displayValue < index + 1;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index, false)}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              disabled={!isInteractive}
              className={`
                relative transition-colors
                ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                ${isInteractive ? 'active:scale-95' : ''}
              `}
            >
              {/* Background icon (empty) */}
              <IconComponent
                className={`${sizeStyles[size]} ${emptyColor}`}
                fill="currentColor"
              />

              {/* Foreground icon (filled) */}
              {(isFilled || isHalfFilled) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: isHalfFilled ? '50%' : '100%',
                  }}
                >
                  <IconComponent
                    className={`${sizeStyles[size]} ${color}`}
                    fill="currentColor"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-foreground">
          {displayValue.toFixed(allowHalf ? 1 : 0)} / {max}
        </span>
      )}
    </div>
  );
}

// Review Rating component with feedback
export interface ReviewRatingProps {
  value: number;
  onChange: (value: number) => void;
  labels?: string[];
  showLabel?: boolean;
}

export function ReviewRating({
  value,
  onChange,
  labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  showLabel = true,
}: ReviewRatingProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayIndex = hoveredIndex !== null ? hoveredIndex : value - 1;
  const currentLabel = labels[displayIndex] || '';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const isFilled = value > index;
          const isHovered = hoveredIndex !== null && hoveredIndex >= index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(index + 1)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="transition-transform hover:scale-125 active:scale-95"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  isFilled || isHovered
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && currentLabel && (
        <p className="text-sm font-medium text-muted-foreground">{currentLabel}</p>
      )}
    </div>
  );
}

// Compact rating display (readonly)
export interface CompactRatingProps {
  value: number;
  max?: number;
  count?: number;
  size?: RatingSize;
}

export function CompactRating({
  value,
  max = 5,
  count,
  size = 'sm',
}: CompactRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Star className={`${sizeStyles[size]} text-yellow-400 fill-yellow-400`} />
      <span className="text-sm font-medium text-foreground">
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
