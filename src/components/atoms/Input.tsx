import React from 'react';
import { LucideIcon } from 'lucide-react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'flushed';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  maxLength?: number;
  autoComplete?: string;
  name?: string;
  id?: string;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-adaptive-sm text-base',
  lg: 'px-5 py-adaptive text-lg',
};

const variantStyles: Record<InputVariant, string> = {
  default: 'border border-border dark:border-border bg-card dark:bg-card',
  filled: 'border-0 bg-muted dark:bg-muted',
  flushed: 'border-0 border-b-2 border-border dark:border-border rounded-none bg-transparent',
};

export function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  label,
  error,
  hint,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  fullWidth = true,
  className = '',
  maxLength,
  autoComplete,
  name,
  id,
}: InputProps) {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'rounded-xl transition-all duration-200 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  const paddingLeft = LeftIcon ? 'pl-10' : '';
  const paddingRight = RightIcon ? 'pr-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm text-foreground mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <LeftIcon className="w-5 h-5 text-muted-foreground/70" />
          </div>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${widthStyles}
            ${errorStyles}
            ${paddingLeft}
            ${paddingRight}
          `}
        />
        
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      
      {hint && !error && (
        <p className="text-muted-foreground text-xs mt-1">{hint}</p>
      )}
    </div>
  );
}
