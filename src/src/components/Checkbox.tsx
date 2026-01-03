import React from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  label,
  description,
  error,
  size = 'md',
  className = '',
  id,
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const sizeClasses = {
    sm: {
      box: 'w-4 h-4',
      icon: 14,
      label: 'text-sm',
      description: 'text-xs',
    },
    md: {
      box: 'w-5 h-5',
      icon: 16,
      label: 'text-base',
      description: 'text-sm',
    },
    lg: {
      box: 'w-6 h-6',
      icon: 18,
      label: 'text-lg',
      description: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  const boxClasses = `
    ${currentSize.box}
    inline-flex items-center justify-center
    rounded border-2 transition-all duration-200
    ${
      checked || indeterminate
        ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
        : error
        ? 'border-red-500 dark:border-red-400'
        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
    }
    ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer hover:border-blue-500 dark:hover:border-blue-400'
    }
    ${!disabled && !checked && !indeterminate ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}
  `;

  return (
    <div className={`inline-flex items-start gap-3 ${className}`}>
      <div
        className={boxClasses}
        onClick={handleChange}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleChange();
          }
        }}
      >
        {indeterminate ? (
          <Minus
            size={currentSize.icon}
            className="text-white"
            strokeWidth={3}
          />
        ) : checked ? (
          <Check
            size={currentSize.icon}
            className="text-white"
            strokeWidth={3}
          />
        ) : null}
      </div>

      {(label || description) && (
        <div className="flex-1 pt-0.5">
          {label && (
            <label
              htmlFor={id}
              className={`
                block font-medium
                ${currentSize.label}
                ${
                  disabled
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-900 dark:text-white cursor-pointer'
                }
              `}
              onClick={!disabled ? handleChange : undefined}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={`
                mt-1 text-gray-600 dark:text-gray-400
                ${currentSize.description}
              `}
            >
              {description}
            </p>
          )}
          {error && (
            <p
              id={`${id}-error`}
              className={`
                mt-1 text-red-600 dark:text-red-400
                ${currentSize.description}
              `}
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Checkbox Group
export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CheckboxGroup({
  children,
  label,
  description,
  error,
  orientation = 'vertical',
  spacing = 'md',
  className = '',
}: CheckboxGroupProps) {
  const spacingClasses = {
    sm: orientation === 'vertical' ? 'gap-2' : 'gap-3',
    md: orientation === 'vertical' ? 'gap-3' : 'gap-4',
    lg: orientation === 'vertical' ? 'gap-4' : 'gap-6',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}
      <div
        className={`
          flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
          ${spacingClasses[spacing]}
        `}
        role="group"
      >
        {children}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
