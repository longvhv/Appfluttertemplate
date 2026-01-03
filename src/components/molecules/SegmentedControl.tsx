import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    container: 'h-8',
    text: 'text-xs',
    padding: 'px-3',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'h-10',
    text: 'text-sm',
    padding: 'px-4',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'h-12',
    text: 'text-base',
    padding: 'px-6',
    icon: 'w-5 h-5',
  },
};

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
}: SegmentedControlProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const styles = sizeStyles[size];

  useEffect(() => {
    const selectedButton = buttonRefs.current.get(value);
    if (selectedButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();
      
      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={`
        relative inline-flex items-center
        bg-muted dark:bg-muted rounded-xl p-1
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Animated indicator */}
      <motion.div
        className={`
          absolute ${styles.container} bg-card dark:bg-card
          rounded-lg shadow-sm
        `}
        initial={false}
        animate={{
          width: indicatorStyle.width,
          left: indicatorStyle.left,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Options */}
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(option.value, el);
              }
            }}
            onClick={() => !option.disabled && onChange(option.value)}
            disabled={option.disabled}
            className={`
              relative z-10 flex items-center justify-center gap-2
              ${styles.container} ${styles.padding} ${styles.text}
              font-medium transition-colors
              ${fullWidth ? 'flex-1' : ''}
              ${isSelected
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {Icon && <Icon className={styles.icon} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// Icon-only variant
export interface IconSegmentedControlProps {
  options: Array<{
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    tooltip?: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function IconSegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
}: IconSegmentedControlProps) {
  const styles = sizeStyles[size];

  return (
    <div className="relative inline-flex items-center bg-muted dark:bg-muted rounded-xl p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            title={option.tooltip}
            className={`
              relative flex items-center justify-center
              ${styles.container} ${styles.padding}
              rounded-lg transition-all
              ${isSelected
                ? 'bg-card dark:bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon className={styles.icon} />
          </button>
        );
      })}
    </div>
  );
}
