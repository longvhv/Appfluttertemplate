import React, { forwardRef, useState } from 'react';

export type MaskPattern = 
  | 'phone' // (123) 456-7890
  | 'phone-intl' // +1 (123) 456-7890
  | 'credit-card' // 1234 5678 9012 3456
  | 'date' // MM/DD/YYYY
  | 'time' // HH:MM
  | 'ssn' // XXX-XX-XXXX
  | 'zip' // XXXXX-XXXX
  | 'custom';

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  mask: MaskPattern;
  customMask?: string; // e.g., "999-99-9999" where 9=digit, A=letter, *=any
  showMask?: boolean;
  variant?: 'default' | 'filled' | 'flushed';
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      mask,
      customMask,
      showMask = false,
      variant = 'default',
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState('');

    const masks: Record<MaskPattern, string> = {
      phone: '(999) 999-9999',
      'phone-intl': '+9 (999) 999-9999',
      'credit-card': '9999 9999 9999 9999',
      date: '99/99/9999',
      time: '99:99',
      ssn: '999-99-9999',
      zip: '99999-9999',
      custom: customMask || '',
    };

    const getMaskPattern = () => masks[mask] || '';

    const applyMask = (input: string, pattern: string): string => {
      let result = '';
      let inputIndex = 0;

      for (let i = 0; i < pattern.length && inputIndex < input.length; i++) {
        const maskChar = pattern[i];
        const inputChar = input[inputIndex];

        if (maskChar === '9') {
          // Digit
          if (/\d/.test(inputChar)) {
            result += inputChar;
            inputIndex++;
          } else {
            inputIndex++;
            i--;
          }
        } else if (maskChar === 'A') {
          // Letter
          if (/[a-zA-Z]/.test(inputChar)) {
            result += inputChar;
            inputIndex++;
          } else {
            inputIndex++;
            i--;
          }
        } else if (maskChar === '*') {
          // Any character
          result += inputChar;
          inputIndex++;
        } else {
          // Literal character
          result += maskChar;
          if (inputChar === maskChar) {
            inputIndex++;
          }
        }
      }

      return result;
    };

    const removeMask = (masked: string, pattern: string): string => {
      let result = '';
      let patternIndex = 0;

      for (let i = 0; i < masked.length; i++) {
        const char = masked[i];
        const maskChar = pattern[patternIndex];

        if (maskChar === '9' || maskChar === 'A' || maskChar === '*') {
          result += char;
          patternIndex++;
        } else if (char === maskChar) {
          patternIndex++;
        } else {
          result += char;
        }
      }

      return result;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const pattern = getMaskPattern();
      
      // Remove all non-alphanumeric characters
      const cleaned = input.replace(/[^a-zA-Z0-9]/g, '');
      
      // Apply mask
      const masked = applyMask(cleaned, pattern);
      setDisplayValue(masked);

      // Call onChange with unmasked value
      if (onChange) {
        const unmasked = removeMask(masked, pattern);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: unmasked,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const getPlaceholder = () => {
      if (props.placeholder) return props.placeholder;
      if (showMask) return getMaskPattern();
      
      const placeholders: Record<MaskPattern, string> = {
        phone: '(123) 456-7890',
        'phone-intl': '+1 (123) 456-7890',
        'credit-card': '1234 5678 9012 3456',
        date: 'MM/DD/YYYY',
        time: 'HH:MM',
        ssn: 'XXX-XX-XXXX',
        zip: '12345-6789',
        custom: '',
      };
      
      return placeholders[mask] || '';
    };

    const sizeClasses = {
      sm: 'h-9 text-sm px-3',
      md: 'h-11 text-base px-4',
      lg: 'h-13 text-lg px-4',
    };

    const variantClasses = {
      default: `
        border border-border dark:border-border
        bg-background dark:bg-background
        focus:ring-2 focus:ring-indigo-600 focus:border-transparent
      `,
      filled: `
        border-0
        bg-muted dark:bg-muted
        focus:ring-2 focus:ring-indigo-600
      `,
      flushed: `
        border-0 border-b-2 border-border dark:border-border
        bg-transparent
        rounded-none px-0
        focus:border-indigo-600 focus:ring-0
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

        <input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          className={`
            w-full rounded-xl
            text-foreground placeholder:text-muted-foreground
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${error ? 'border-red-600 focus:ring-red-600' : ''}
          `}
          {...props}
        />

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

MaskedInput.displayName = 'MaskedInput';

// Convenience components
export const PhoneMaskInput = forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => <MaskedInput ref={ref} mask="phone" {...props} />
);
PhoneMaskInput.displayName = 'PhoneMaskInput';

export const CreditCardInput = forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => <MaskedInput ref={ref} mask="credit-card" {...props} />
);
CreditCardInput.displayName = 'CreditCardInput';

export const DateMaskInput = forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => <MaskedInput ref={ref} mask="date" {...props} />
);
DateMaskInput.displayName = 'DateMaskInput';

export const SSNInput = forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => <MaskedInput ref={ref} mask="ssn" {...props} />
);
SSNInput.displayName = 'SSNInput';
