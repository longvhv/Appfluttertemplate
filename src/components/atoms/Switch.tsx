import React from 'react';
import { motion } from 'motion/react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  label?: string;
  description?: string;
  className?: string;
}

const sizeStyles: Record<SwitchSize, { track: string; thumb: string }> = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5' },
  lg: { track: 'w-14 h-8', thumb: 'w-6 h-6' },
};

const thumbPositions: Record<SwitchSize, { off: number; on: number }> = {
  sm: { off: 2, on: 18 },
  md: { off: 2, on: 22 },
  lg: { off: 4, on: 30 },
};

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
}: SwitchProps) {
  const { track, thumb } = sizeStyles[size];
  const { off, on } = thumbPositions[size];

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        ${track}
        relative inline-flex items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${checked ? 'bg-indigo-600' : 'bg-muted dark:bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <motion.span
        className={`
          ${thumb}
          inline-block rounded-full bg-white shadow-lg
        `}
        initial={false}
        animate={{ x: checked ? on : off }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  if (!label && !description) {
    return switchElement;
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {switchElement}
      <div className="flex-1">
        {label && (
          <label className="block text-sm text-foreground cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
