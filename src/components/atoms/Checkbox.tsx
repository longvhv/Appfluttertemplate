import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  error?: string;
  className?: string;
}

const sizeStyles: Record<CheckboxSize, { box: string; icon: number; text: string }> = {
  sm: { box: 'w-4 h-4', icon: 12, text: 'text-sm' },
  md: { box: 'w-5 h-5', icon: 16, text: 'text-base' },
  lg: { box: 'w-6 h-6', icon: 20, text: 'text-lg' },
};

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  error,
  className = '',
}: CheckboxProps) {
  const { box, icon, text } = sizeStyles[size];

  const checkboxElement = (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        ${box}
        relative inline-flex items-center justify-center
        rounded-md border-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${checked 
          ? 'bg-indigo-600 border-indigo-600' 
          : error
          ? 'bg-card dark:bg-card border-red-500'
          : 'bg-card dark:bg-card border-border dark:border-border'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500'}
      `}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={icon} className="text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );

  if (!label && !description) {
    return checkboxElement;
  }

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        {checkboxElement}
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
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-8">{error}</p>
      )}
    </div>
  );
}
