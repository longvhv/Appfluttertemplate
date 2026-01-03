import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'underline' | 'box';
  type?: 'text' | 'password' | 'number';
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  size = 'md',
  variant = 'default',
  type = 'number',
  error = false,
  disabled = false,
  autoFocus = false,
  onComplete,
  className = '',
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'w-8 h-10 text-base',
    md: 'w-12 h-14 text-xl',
    lg: 'w-14 h-16 text-2xl',
  };

  const variants = {
    default: `
      border-2 rounded-lg
      ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
      bg-white dark:bg-gray-900
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
    `,
    underline: `
      border-b-2 border-l-0 border-r-0 border-t-0 rounded-none
      ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
      bg-transparent
      focus:border-indigo-500
    `,
    box: `
      border-2 rounded-xl
      ${error ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}
      focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900
    `,
  };

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, inputValue: string) => {
    // Handle paste
    if (inputValue.length > 1) {
      handlePaste(inputValue);
      return;
    }

    // Validate input based on type
    if (type === 'number' && inputValue && !/^\d$/.test(inputValue)) {
      return;
    }

    const newValue = value.split('');
    newValue[index] = inputValue;
    onChange(newValue.join(''));

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      
      if (newValue[index]) {
        // Clear current digit
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // Move to previous and clear
        inputRefs.current[index - 1]?.focus();
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Handle delete key
    if (e.key === 'Delete') {
      e.preventDefault();
      const newValue = value.split('');
      newValue[index] = '';
      onChange(newValue.join(''));
    }
  };

  const handlePaste = (pasteValue: string) => {
    const sanitized = type === 'number' 
      ? pasteValue.replace(/\D/g, '')
      : pasteValue;
    
    const newValue = sanitized.slice(0, length).padEnd(length, '');
    onChange(newValue);

    // Focus appropriate input
    const nextIndex = Math.min(sanitized.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    handlePaste(pasteData);
  };

  const handleFocus = (index: number) => {
    // Select the content when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-2 ${className}`}
      onPaste={handlePasteEvent}
    >
      {Array.from({ length }, (_, index) => {
        const hasValue = value[index] !== undefined && value[index] !== '';
        
        return (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type={type === 'password' ? 'password' : 'text'}
            inputMode={type === 'number' ? 'numeric' : 'text'}
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              ${sizes[size]}
              ${variants[variant]}
              text-center
              font-semibold
              text-gray-900 dark:text-white
              transition-all
              focus:outline-none
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}
              ${hasValue ? 'scale-105' : ''}
            `}
          />
        );
      })}
    </div>
  );
}

// OTPInputGroup - with label and error message
export interface OTPInputGroupProps extends OTPInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export function OTPInputGroup({
  label,
  helperText,
  errorMessage,
  error: errorProp,
  className = '',
  ...props
}: OTPInputGroupProps) {
  const hasError = errorProp || !!errorMessage;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <OTPInput error={hasError} {...props} />

      {helperText && !errorMessage && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
