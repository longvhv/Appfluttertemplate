import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: 'numeric' | 'alphanumeric';
  secure?: boolean;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  type = 'numeric',
  secure = false,
  className = '',
  label,
  error = false,
  errorMessage,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      setOtp([...otpArray, ...Array(length - otpArray.length).fill('')]);
    }
  }, [value, length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Validate input based on type
    const isValid = type === 'numeric' 
      ? /^\d*$/.test(val)
      : /^[a-zA-Z0-9]*$/.test(val);
    
    if (!isValid) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Take only last character
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange?.(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    const isValid = type === 'numeric'
      ? /^\d+$/.test(pastedData)
      : /^[a-zA-Z0-9]+$/.test(pastedData);
    
    if (!isValid) return;

    const newOtp = [...pastedData.split(''), ...Array(length).fill('')].slice(0, length);
    setOtp(newOtp);
    onChange?.(newOtp.join(''));

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      )}
      
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type={secure ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            value={otp[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            maxLength={1}
            autoFocus={autoFocus && index === 0}
            className={`
              w-12 h-14 text-center text-xl font-semibold
              rounded-xl border-2 transition-all
              bg-card dark:bg-card
              text-foreground
              ${error
                ? 'border-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-600/20'
                : otp[index]
                ? 'border-indigo-600 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20'
                : 'border-border dark:border-border focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {errorMessage}
        </p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Enter the {length}-digit code sent to your {type === 'numeric' ? 'device' : 'email'}
        </p>
      )}
    </div>
  );
}
