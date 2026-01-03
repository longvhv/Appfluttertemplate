import React, { forwardRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showButtons?: boolean;
  variant?: 'default' | 'filled' | 'flushed';
  prefix?: string;
  suffix?: string;
  format?: boolean;
  allowNegative?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      min,
      max,
      step = 1,
      precision = 0,
      showButtons = true,
      variant = 'default',
      prefix,
      suffix,
      format = false,
      allowNegative = true,
      value,
      onChange,
      onBlur,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      value !== undefined ? String(value) : ''
    );

    const parseValue = (val: string): number | null => {
      const cleaned = val.replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    };

    const formatNumber = (num: number): string => {
      if (format) {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(num);
      }
      return num.toFixed(precision);
    };

    const clampValue = (num: number): number => {
      let clamped = num;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      if (!allowNegative) clamped = Math.max(0, clamped);
      return clamped;
    };

    const updateValue = (newValue: number) => {
      const clamped = clampValue(newValue);
      const formatted = formatNumber(clamped);
      setInternalValue(formatted);

      if (onChange) {
        const event = {
          target: { value: String(clamped) },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInternalValue(val);

      const parsed = parseValue(val);
      if (parsed !== null) {
        updateValue(parsed);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const parsed = parseValue(internalValue);
      if (parsed !== null) {
        updateValue(parsed);
      } else {
        setInternalValue('');
      }
      onBlur?.(e);
    };

    const increment = () => {
      const current = parseValue(internalValue) || 0;
      updateValue(current + step);
    };

    const decrement = () => {
      const current = parseValue(internalValue) || 0;
      updateValue(current - step);
    };

    const canIncrement = max === undefined || (parseValue(internalValue) || 0) < max;
    const canDecrement = min === undefined || (parseValue(internalValue) || 0) > min;

    const sizeClasses = {
      sm: 'h-9 text-sm px-3',
      md: 'h-11 text-base px-4',
      lg: 'h-13 text-lg px-4',
    };

    const buttonSizeClasses = {
      sm: 'w-8 h-full',
      md: 'w-10 h-full',
      lg: 'w-12 h-full',
    };

    const variantClasses = {
      default: `
        border border-border dark:border-border
        bg-background dark:bg-background
        focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent
      `,
      filled: `
        border-0
        bg-muted dark:bg-muted
        focus-within:ring-2 focus-within:ring-indigo-600
      `,
      flushed: `
        border-0 border-b-2 border-border dark:border-border
        bg-transparent
        rounded-none px-0
        focus-within:border-indigo-600 focus-within:ring-0
      `,
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div
          className={`
            flex items-center rounded-xl overflow-hidden
            transition-all duration-200
            ${variantClasses[variant]}
            ${error ? 'border-red-600 focus-within:ring-red-600' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Decrement Button */}
          {showButtons && (
            <button
              type="button"
              onClick={decrement}
              disabled={disabled || !canDecrement}
              className={`
                ${buttonSizeClasses[size]}
                flex items-center justify-center
                text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/50
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                border-r border-border dark:border-border
              `}
            >
              <Minus className="w-4 h-4" />
            </button>
          )}

          {/* Prefix */}
          {prefix && (
            <span className="text-muted-foreground px-3">{prefix}</span>
          )}

          {/* Input */}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              flex-1 bg-transparent border-0 outline-none
              text-foreground placeholder:text-muted-foreground
              ${sizeClasses[size]}
              ${!showButtons && !prefix ? 'pl-4' : 'pl-0'}
              ${!showButtons && !suffix ? 'pr-4' : 'pr-0'}
            `}
            {...props}
          />

          {/* Suffix */}
          {suffix && (
            <span className="text-muted-foreground px-3">{suffix}</span>
          )}

          {/* Increment Button */}
          {showButtons && (
            <button
              type="button"
              onClick={increment}
              disabled={disabled || !canIncrement}
              className={`
                ${buttonSizeClasses[size]}
                flex items-center justify-center
                text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/50
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                border-l border-border dark:border-border
              `}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
        {!error && hint && (
          <p className="text-sm text-muted-foreground mt-2">{hint}</p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
