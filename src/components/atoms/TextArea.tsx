import React, { forwardRef, useState, useRef, useEffect } from 'react';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  variant?: 'default' | 'filled' | 'flushed';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      resize = 'vertical',
      autoResize = false,
      maxLength,
      showCount = false,
      variant = 'default',
      className = '',
      rows = 4,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (maxLength && newValue.length > maxLength) return;
      
      setCharCount(newValue.length);
      onChange?.(e);
    };

    const sizeClasses = {
      sm: 'text-sm px-3 py-2',
      md: 'text-base px-4 py-2.5',
      lg: 'text-lg px-4 py-3',
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
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

    const setRefs = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={setRefs}
            rows={rows}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            className={`
              w-full rounded-xl
              text-foreground placeholder:text-muted-foreground
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${resizeClasses[resize]}
              ${variantClasses[variant]}
              ${error ? 'border-red-600 focus:ring-red-600' : ''}
            `}
            {...props}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {!error && hint && (
              <p className="text-sm text-muted-foreground">{hint}</p>
            )}
          </div>

          {showCount && (
            <p className="text-sm text-muted-foreground ml-2">
              {charCount}
              {maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
