import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  showClearButton?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  showClearButton = true,
  autoFocus = false,
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const sizes = {
    sm: 'h-8 text-sm px-8',
    md: 'h-10 text-base px-10',
    lg: 'h-12 text-lg px-12',
  };

  const iconSizes = {
    sm: { icon: 'w-4 h-4', left: 'left-2', right: 'right-2' },
    md: { icon: 'w-5 h-5', left: 'left-3', right: 'right-3' },
    lg: { icon: 'w-6 h-6', left: 'left-3', right: 'right-3' },
  };

  const variants = {
    default:
      'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
    filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent',
    outlined:
      'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce search
    if (onSearch && debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2
          ${iconSizes[size].left}
          text-gray-400 dark:text-gray-500
          pointer-events-none
        `}
      >
        <Search className={iconSizes[size].icon} />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full
          ${sizes[size]}
          ${variants[variant]}
          rounded-lg
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all
          ${
            isFocused
              ? 'ring-2 ring-indigo-500 border-indigo-500'
              : 'hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none
        `}
      />

      {/* Loading/Clear Button */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2
          ${iconSizes[size].right}
        `}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-gray-400 dark:text-gray-500"
            >
              <Loader2 className={`${iconSizes[size].icon} animate-spin`} />
            </motion.div>
          ) : (
            value &&
            showClearButton && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="
                  text-gray-400 dark:text-gray-500
                  hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors
                  p-1 rounded-full
                  hover:bg-gray-100 dark:hover:bg-gray-700
                "
              >
                <X className={iconSizes[size].icon} />
              </motion.button>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// SearchBarWithSuggestions
export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SearchBarWithSuggestionsProps extends SearchBarProps {
  suggestions?: SearchSuggestion[];
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
}

export function SearchBarWithSuggestions({
  suggestions = [],
  onSelectSuggestion,
  showSuggestions = true,
  ...searchBarProps
}: SearchBarWithSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onSelectSuggestion?.(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <SearchBar {...searchBarProps} />

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              absolute top-full left-0 right-0 mt-2
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              rounded-lg shadow-lg
              max-h-64 overflow-auto
              z-50
            "
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="
                  w-full flex items-start gap-3 p-3
                  text-left
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  transition-colors
                  border-b border-gray-100 dark:border-gray-800
                  last:border-b-0
                "
              >
                {suggestion.icon && (
                  <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                    {suggestion.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {suggestion.label}
                  </div>
                  {suggestion.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
