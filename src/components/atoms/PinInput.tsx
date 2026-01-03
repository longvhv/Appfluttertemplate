import React, { useState, useRef, useEffect } from 'react';

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: 'text' | 'number' | 'password';
  mask?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export function PinInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  type = 'number',
  mask = false,
  size = 'md',
  error = false,
  disabled = false,
  autoFocus = false,
  placeholder = '○',
  className = '',
}: PinInputProps) {
  const [pins, setPins] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] || '')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value !== pins.join('')) {
      setPins(Array.from({ length }, (_, i) => value[i] || ''));
    }
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    // Handle paste
    if (val.length > 1) {
      handlePaste(index, val);
      return;
    }

    // Validate input
    if (type === 'number' && val && !/^\d$/.test(val)) return;

    const newPins = [...pins];
    newPins[index] = val;
    setPins(newPins);

    const newValue = newPins.join('');
    onChange?.(newValue);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all pins are filled
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (pins[index]) {
        // Clear current pin
        handleChange(index, '');
      } else if (index > 0) {
        // Move to previous and clear
        inputRefs.current[index - 1]?.focus();
        handleChange(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (startIndex: number, pastedData: string) => {
    const pastedPins = pastedData.slice(0, length - startIndex).split('');
    
    // Validate pasted data
    if (type === 'number' && pastedPins.some(pin => !/^\d$/.test(pin))) {
      return;
    }

    const newPins = [...pins];
    pastedPins.forEach((pin, i) => {
      const index = startIndex + i;
      if (index < length) {
        newPins[index] = pin;
      }
    });

    setPins(newPins);
    const newValue = newPins.join('');
    onChange?.(newValue);

    // Focus last filled input
    const lastIndex = Math.min(startIndex + pastedPins.length, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {pins.map((pin, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type={mask ? 'password' : type === 'number' ? 'tel' : 'text'}
          inputMode={type === 'number' ? 'numeric' : 'text'}
          maxLength={1}
          value={pin}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={handleFocus}
          onPaste={(e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            handlePaste(index, pastedData);
          }}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          placeholder={placeholder}
          className={`
            ${sizeClasses[size]}
            border-2 rounded-xl
            text-center font-semibold
            text-foreground placeholder:text-muted-foreground
            bg-background dark:bg-background
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-600 focus:ring-red-600'
              : 'border-border dark:border-border'
            }
            ${pin ? 'border-indigo-600' : ''}
          `}
        />
      ))}
    </div>
  );
}

// OTP Input alias
export function OTPInput(props: PinInputProps) {
  return <PinInput type="number" length={6} {...props} />;
}

// Verification Code Input
export function VerificationCodeInput(props: PinInputProps) {
  return <PinInput type="number" length={4} {...props} />;
}
