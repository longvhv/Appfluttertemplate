import React, { useState, useRef, useEffect } from 'react';

export interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoFocus?: boolean;
  className?: string;
  id?: string;
}

export function TextArea({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  error,
  label,
  helperText,
  rows = 4,
  maxLength,
  showCount = false,
  resize = 'vertical',
  autoFocus = false,
  className = '',
  id,
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-gray-900 dark:text-white mb-2"
        >
          {label}
        </label>
      )}

      {/* TextArea */}
      <div className="relative">
        <textarea
          ref={textAreaRef}
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 
            bg-white dark:bg-gray-800
            border rounded-lg
            transition-all duration-200
            ${resizeClasses[resize]}
            ${
              error
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                : isFocused
                ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400'
                : 'border-gray-300 dark:border-gray-600'
            }
            ${
              disabled
                ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-50'
                : 'hover:border-gray-400 dark:hover:border-gray-500'
            }
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          `}
        />
      </div>

      {/* Helper Text / Error / Character Count */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>

        {showCount && maxLength && (
          <p
            className={`text-sm ${
              value.length >= maxLength
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

// Auto-resizing TextArea
export function AutoResizeTextArea({
  value = '',
  onChange,
  minRows = 2,
  maxRows = 10,
  ...props
}: Omit<TextAreaProps, 'rows' | 'resize'> & {
  minRows?: number;
  maxRows?: number;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textAreaRef.current.style.height = 'auto';

      const lineHeight = parseInt(
        window.getComputedStyle(textAreaRef.current).lineHeight
      );
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;

      const scrollHeight = textAreaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, minRows, maxRows]);

  return (
    <div className={props.className}>
      {props.label && (
        <label
          htmlFor={props.id}
          className="block font-medium text-gray-900 dark:text-white mb-2"
        >
          {props.label}
        </label>
      )}

      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        placeholder={props.placeholder}
        disabled={props.disabled}
        maxLength={props.maxLength}
        className={`
          w-full px-4 py-3 
          bg-white dark:bg-gray-800
          border rounded-lg
          transition-all duration-200
          resize-none
          overflow-y-auto
          ${
            props.error
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          }
          ${
            props.disabled
              ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-50'
              : 'hover:border-gray-400 dark:hover:border-gray-500'
          }
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        `}
      />

      {(props.error || props.helperText || (props.showCount && props.maxLength)) && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex-1">
            {props.error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {props.error}
              </p>
            )}
            {!props.error && props.helperText && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {props.helperText}
              </p>
            )}
          </div>

          {props.showCount && props.maxLength && (
            <p
              className={`text-sm ${
                value.length >= props.maxLength
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {value.length} / {props.maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
