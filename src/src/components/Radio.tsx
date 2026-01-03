import React, { createContext, useContext } from 'react';
import { motion } from 'motion/react';

// Context for RadioGroup
interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  return context;
};

// RadioGroup
export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  name,
  disabled = false,
  orientation = 'vertical',
  children,
  className = '',
}: RadioGroupProps) {
  const orientationStyles = {
    horizontal: 'flex flex-row flex-wrap gap-4',
    vertical: 'flex flex-col gap-3',
  };

  return (
    <RadioGroupContext.Provider value={{ value, onChange, name, disabled }}>
      <div role="radiogroup" className={`${orientationStyles[orientation]} ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// Radio
export interface RadioProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Radio({
  value,
  label,
  description,
  disabled: disabledProp = false,
  size = 'md',
  className = '',
}: RadioProps) {
  const context = useRadioGroupContext();

  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }

  const { value: groupValue, onChange, name, disabled: groupDisabled } = context;
  const isChecked = groupValue === value;
  const isDisabled = disabledProp || groupDisabled;

  const sizes = {
    sm: { radio: 'w-4 h-4', dot: 'w-2 h-2', text: 'text-sm' },
    md: { radio: 'w-5 h-5', dot: 'w-2.5 h-2.5', text: 'text-base' },
    lg: { radio: 'w-6 h-6', dot: 'w-3 h-3', text: 'text-lg' },
  };

  const currentSize = sizes[size];

  const handleChange = () => {
    if (!isDisabled) {
      onChange(value);
    }
  };

  return (
    <label
      className={`
        inline-flex items-start gap-3
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="flex items-center h-6">
        <div className="relative">
          <input
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={isDisabled}
            className="sr-only"
          />
          <div
            className={`
              ${currentSize.radio}
              rounded-full border-2 transition-all
              flex items-center justify-center
              ${
                isChecked
                  ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-gray-900'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
              }
              ${
                !isDisabled &&
                'hover:border-indigo-500 dark:hover:border-indigo-400'
              }
            `}
          >
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`
                    ${currentSize.dot}
                    rounded-full
                    bg-indigo-600 dark:bg-indigo-500
                  `}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={`${currentSize.text} font-medium text-gray-900 dark:text-white`}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}

// RadioCard - Alternative card-style radio
export interface RadioCardProps {
  value: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioCard({
  value,
  title,
  description,
  icon,
  disabled: disabledProp = false,
  className = '',
}: RadioCardProps) {
  const context = useRadioGroupContext();

  if (!context) {
    throw new Error('RadioCard must be used within a RadioGroup');
  }

  const { value: groupValue, onChange, name, disabled: groupDisabled } = context;
  const isChecked = groupValue === value;
  const isDisabled = disabledProp || groupDisabled;

  const handleChange = () => {
    if (!isDisabled) {
      onChange(value);
    }
  };

  return (
    <label
      className={`
        relative flex items-start p-4 rounded-lg border-2 transition-all
        ${
          isChecked
            ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        className="sr-only"
      />

      <div className="flex items-start gap-4 flex-1">
        {icon && (
          <div
            className={`
              flex-shrink-0
              ${isChecked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}
            `}
          >
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-white">{title}</div>
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 ml-4">
          <div
            className={`
              w-5 h-5 rounded-full border-2 transition-all
              flex items-center justify-center
              ${
                isChecked
                  ? 'border-indigo-600 dark:border-indigo-500'
                  : 'border-gray-300 dark:border-gray-600'
              }
            `}
          >
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </label>
  );
}

// Need to import AnimatePresence
import { AnimatePresence } from 'motion/react';
