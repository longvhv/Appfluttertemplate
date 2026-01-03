import React, { useState } from 'react';
import { Link, ExternalLink, Check, X } from 'lucide-react';

export interface UrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoValidate?: boolean;
  showPreview?: boolean;
  className?: string;
  label?: string;
}

export function UrlInput({
  value = '',
  onChange,
  onValidate,
  placeholder = 'https://example.com',
  disabled = false,
  required = false,
  autoValidate = true,
  showPreview = true,
  className = '',
  label,
}: UrlInputProps) {
  const [touched, setTouched] = useState(false);

  const isValidUrl = (url: string): boolean => {
    if (!url) return !required;
    
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const isValid = isValidUrl(value);
  const showValidation = touched && autoValidate;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    
    if (autoValidate) {
      const valid = isValidUrl(newValue);
      onValidate?.(valid);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    
    // Auto-add https:// if missing
    if (value && !value.match(/^https?:\/\//)) {
      const correctedUrl = `https://${value}`;
      if (isValidUrl(correctedUrl)) {
        onChange?.(correctedUrl);
      }
    }
  };

  const openPreview = () => {
    if (isValid && value) {
      window.open(value, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Link className="w-5 h-5" />
        </div>
        
        <input
          type="url"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-20 py-2.5 rounded-xl
            border-2 transition-all
            bg-card dark:bg-card
            text-foreground placeholder:text-muted-foreground
            ${showValidation
              ? isValid
                ? 'border-green-600 focus:border-green-600 focus:ring-4 focus:ring-green-600/20'
                : 'border-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-600/20'
              : 'border-border dark:border-border focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {/* Validation & Preview Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {showValidation && (
            <>
              {isValid ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
            </>
          )}
          
          {showPreview && isValid && value && (
            <button
              type="button"
              onClick={openPreview}
              className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
            </button>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {showValidation && !isValid && value && (
        <p className="mt-1 text-xs text-red-600">
          Please enter a valid URL (https://example.com)
        </p>
      )}
    </div>
  );
}
