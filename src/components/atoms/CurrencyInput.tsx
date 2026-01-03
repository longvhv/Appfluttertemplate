import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

export interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
  label?: string;
}

export function CurrencyInput({
  value = 0,
  onChange,
  currency = 'USD',
  locale = 'en-US',
  min,
  max,
  disabled = false,
  placeholder = '0.00',
  className = '',
  error = false,
  label,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(formatCurrency(value));

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    VND: '₫',
  };

  const symbol = currencySymbols[currency] || currency;

  function formatCurrency(num: number): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(num);
  }

  function parseCurrency(str: string): number {
    const cleaned = str.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned) || 0;
    return num;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    const numValue = parseCurrency(rawValue);
    
    if (min !== undefined && numValue < min) return;
    if (max !== undefined && numValue > max) return;
    
    onChange?.(numValue);
  };

  const handleBlur = () => {
    setFocused(false);
    const numValue = parseCurrency(inputValue);
    setInputValue(formatCurrency(numValue));
  };

  const handleFocus = () => {
    setFocused(true);
    // Show raw number on focus for easier editing
    setInputValue(value.toString());
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {symbol}
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-2.5 rounded-xl
            border-2 transition-all
            bg-card dark:bg-card
            text-foreground placeholder:text-muted-foreground
            ${error
              ? 'border-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-600/20'
              : 'border-border dark:border-border focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20'
            }
            ${disabled
              ? 'opacity-50 cursor-not-allowed'
              : ''
            }
          `}
        />
      </div>
      {(min !== undefined || max !== undefined) && (
        <div className="mt-1 text-xs text-muted-foreground">
          {min !== undefined && max !== undefined
            ? `Range: ${symbol}${formatCurrency(min)} - ${symbol}${formatCurrency(max)}`
            : min !== undefined
            ? `Min: ${symbol}${formatCurrency(min)}`
            : `Max: ${symbol}${formatCurrency(max)}`
          }
        </div>
      )}
    </div>
  );
}
