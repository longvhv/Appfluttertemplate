import React from 'react';
import { motion } from 'motion/react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  labelPosition = 'right',
  className = '',
}: SwitchProps) {
  const sizes = {
    sm: { track: 'w-8 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-3' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const currentSize = sizes[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={`
        ${currentSize.track}
        relative inline-flex shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${
          checked
            ? 'bg-indigo-600 dark:bg-indigo-500'
            : 'bg-gray-200 dark:bg-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`
          ${currentSize.thumb}
          inline-block rounded-full bg-white shadow-lg
          transform transition duration-200 ease-in-out
          ${checked ? currentSize.translate : 'translate-x-0.5'}
        `}
        style={{ marginTop: '1px' }}
      />
    </button>
  );

  if (label) {
    return (
      <label
        className={`inline-flex items-center gap-3 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        {labelPosition === 'left' && (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
        {switchElement}
        {labelPosition === 'right' && (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </label>
    );
  }

  return <div className={className}>{switchElement}</div>;
}
