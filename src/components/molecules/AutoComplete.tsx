import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AutoCompleteOption {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  metadata?: any;
}

export interface AutoCompleteProps {
  options: AutoCompleteOption[];
  value?: string;
  onChange?: (value: string, option?: AutoCompleteOption) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxResults?: number;
  minChars?: number;
  debounceMs?: number;
  allowCustom?: boolean;
  className?: string;
  label?: string;
}

export function AutoComplete({
  options,
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  disabled = false,
  loading = false,
  maxResults = 10,
  minChars = 1,
  debounceMs = 300,
  allowCustom = true,
  className = '',
  label,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = (query: string): AutoCompleteOption[] => {
    if (!query || query.length < minChars) return [];
    
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, maxResults);
  };

  const filteredOptions = filterOptions(inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(0);

    if (allowCustom) {
      onChange?.(newValue);
    }

    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);
  };

  const handleSelectOption = (option: AutoCompleteOption) => {
    setInputValue(option.label);
    onChange?.(option.label, option);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= minChars && setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-2.5 rounded-xl
            border-2 transition-all
            bg-card dark:bg-card
            text-foreground placeholder:text-muted-foreground
            border-border dark:border-border
            focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full px-4 py-3 text-left transition-colors
                    ${index === highlightedIndex
                      ? 'bg-indigo-50 dark:bg-indigo-950/30'
                      : 'hover:bg-muted/50 dark:hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {option.icon && (
                      <div className="flex-shrink-0 mt-0.5">
                        {option.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results */}
      {isOpen && inputValue.length >= minChars && filteredOptions.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl p-4 text-center text-muted-foreground"
        >
          No results found
        </motion.div>
      )}
    </div>
  );
}
