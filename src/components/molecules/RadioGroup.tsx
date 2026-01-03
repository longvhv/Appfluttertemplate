import React from 'react';
import { Radio, RadioProps } from '../atoms/Radio';

export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
  name: string;
  label?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  size?: RadioProps['size'];
  className?: string;
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  label,
  error,
  orientation = 'vertical',
  size = 'md',
  className = '',
}: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-foreground mb-adaptive-sm">
          {label}
        </label>
      )}

      <div className={`
        flex gap-adaptive
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
      `}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => !option.disabled && onChange(option.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
