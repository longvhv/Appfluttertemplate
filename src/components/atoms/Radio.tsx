import React from 'react';
import { motion } from 'motion/react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: RadioSize;
  value?: string;
  name?: string;
  className?: string;
}

const sizeStyles: Record<RadioSize, { outer: string; inner: string; text: string }> = {
  sm: { outer: 'w-4 h-4', inner: 'w-2 h-2', text: 'text-sm' },
  md: { outer: 'w-5 h-5', inner: 'w-2.5 h-2.5', text: 'text-base' },
  lg: { outer: 'w-6 h-6', inner: 'w-3 h-3', text: 'text-lg' },
};

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  value,
  name,
  className = '',
}: RadioProps) {
  const { outer, inner, text } = sizeStyles[size];

  const radioElement = (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        ${outer}
        relative inline-flex items-center justify-center
        rounded-full border-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${checked 
          ? 'border-indigo-600 bg-card dark:bg-card' 
          : 'bg-card dark:bg-card border-border dark:border-border'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500'}
      `}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className={`${inner} rounded-full bg-indigo-600`}
          />
        )}
      </AnimatePresence>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        className="sr-only"
      />
    </button>
  );

  if (!label && !description) {
    return radioElement;
  }

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        {radioElement}
        <div className="flex-1" onClick={() => !disabled && onChange(!checked)}>
          {label && (
            <label className={`block ${text} text-foreground cursor-pointer`}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
