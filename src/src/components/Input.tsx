import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, X, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'default',
      type = 'text',
      disabled,
      clearable,
      onClear,
      value,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-5 text-lg',
    };

    const variants = {
      default: `
        bg-white dark:bg-gray-900
        border border-gray-300 dark:border-gray-700
        rounded-lg
      `,
      filled: `
        bg-gray-100 dark:bg-gray-800
        border border-transparent
        rounded-lg
      `,
      flushed: `
        bg-transparent
        border-0 border-b-2 border-gray-300 dark:border-gray-700
        rounded-none
        px-0
      `,
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const hasClearButton = clearable && value && !disabled;
    const hasPasswordToggle = type === 'password';

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full
              ${sizes[size]}
              ${variants[variant]}
              ${leftIcon ? 'pl-10' : ''}
              ${(rightIcon || hasPasswordToggle || hasClearButton || error || success) ? 'pr-10' : ''}
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition-all
              ${
                error
                  ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500'
                  : success
                  ? 'border-green-500 dark:border-green-500 focus:border-green-500 focus:ring-green-500'
                  : isFocused
                  ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}
              focus:outline-none
            `}
            {...props}
          />

          {/* Right Icons Container */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Error Icon */}
            {error && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}

            {/* Success Icon */}
            {success && !error && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}

            {/* Clear Button */}
            {hasClearButton && !error && !success && (
              <button
                type="button"
                onClick={() => {
                  onClear?.();
                  const event = new Event('input', { bubbles: true });
                  ref && typeof ref !== 'function' && ref.current?.dispatchEvent(event);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Password Toggle */}
            {hasPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !hasPasswordToggle && !hasClearButton && !error && !success && (
              <div className="text-gray-400 dark:text-gray-500">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error */}
        {(error || helperText) && (
          <p
            className={`
              text-sm mt-1.5
              ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// NumberInput - specialized input for numbers
export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  onValueChange?: (value: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      formatValue,
      onValueChange,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseFloat(e.target.value);
      if (!isNaN(numValue)) {
        onValueChange?.(numValue);
      }
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

// PinInput - for OTP/PIN codes
export interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  mask?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PinInput({
  length = 6,
  value,
  onChange,
  mask = false,
  size = 'md',
  error = false,
  disabled = false,
  className = '',
}: PinInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const sizes = {
    sm: 'w-8 h-10 text-lg',
    md: 'w-10 h-12 text-xl',
    lg: 'w-12 h-14 text-2xl',
  };

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) {
      digit = digit[digit.length - 1];
    }

    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join(''));

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      onChange(pasteData.padEnd(length, ''));
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type={mask ? 'password' : 'text'}
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            ${sizes[size]}
            text-center
            bg-white dark:bg-gray-900
            border-2
            ${
              error
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500'
            }
            rounded-lg
            font-semibold
            text-gray-900 dark:text-white
            transition-all
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      ))}
    </div>
  );
}
