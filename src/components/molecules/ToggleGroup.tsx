import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export interface ToggleGroupOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  type = 'single',
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  className = '',
  label,
}: ToggleGroupProps) {
  const [selected, setSelected] = useState<string | string[]>(
    value || (type === 'multiple' ? [] : '')
  );

  const isSelected = (optionValue: string) => {
    if (type === 'multiple' && Array.isArray(selected)) {
      return selected.includes(optionValue);
    }
    return selected === optionValue;
  };

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    let newValue: string | string[];

    if (type === 'multiple') {
      const currentArray = Array.isArray(selected) ? selected : [];
      if (currentArray.includes(optionValue)) {
        newValue = currentArray.filter((v) => v !== optionValue);
      } else {
        newValue = [...currentArray, optionValue];
      }
    } else {
      newValue = selected === optionValue ? '' : optionValue;
    }

    setSelected(newValue);
    onChange?.(newValue);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getButtonClasses = (option: ToggleGroupOption) => {
    const selected = isSelected(option.value);
    const baseClasses = `
      relative flex items-center justify-center gap-2 font-medium
      transition-all ${sizeClasses[size]}
      ${option.disabled || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    if (variant === 'default') {
      return `
        ${baseClasses}
        ${selected
          ? 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
          : 'bg-muted/50 dark:bg-muted/50 text-foreground hover:bg-muted dark:hover:bg-muted'
        }
      `;
    }

    if (variant === 'outline') {
      return `
        ${baseClasses}
        border-2
        ${selected
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
          : 'border-border dark:border-border bg-transparent text-foreground hover:border-indigo-400'
        }
      `;
    }

    // solid
    return `
      ${baseClasses}
      ${selected
        ? 'bg-indigo-600 text-white'
        : 'bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80'
      }
    `;
  };

  const containerClasses = orientation === 'horizontal'
    ? 'flex flex-wrap gap-2'
    : 'flex flex-col gap-2';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      )}

      <div className={containerClasses}>
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <motion.button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              disabled={option.disabled || disabled}
              className={`${getButtonClasses(option)} rounded-xl`}
              whileHover={!(option.disabled || disabled) ? { scale: 1.02 } : {}}
              whileTap={!(option.disabled || disabled) ? { scale: 0.98 } : {}}
            >
              {/* Icon */}
              {option.icon && (
                <span className={selected ? 'text-current' : 'text-muted-foreground'}>
                  {option.icon}
                </span>
              )}

              {/* Label */}
              <span>{option.label}</span>

              {/* Check Mark for Multiple */}
              {type === 'multiple' && selected && (
                <Check className="w-4 h-4 ml-1" />
              )}

              {/* Selected Indicator */}
              {selected && variant === 'default' && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
