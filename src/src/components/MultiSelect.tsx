import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  searchable?: boolean;
  maxSelected?: number;
  showSelectAll?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  error,
  label,
  searchable = false,
  maxSelected,
  showSelectAll = true,
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredOptions = searchable && searchQuery
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleToggle = (optionValue: string) => {
    if (!onChange) return;

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    if (!onChange) return;
    const allValues = options.filter((opt) => !opt.disabled).map((opt) => opt.value);
    onChange(value.length === allValues.length ? [] : allValues);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const isAllSelected = options.filter((opt) => !opt.disabled).every((opt) => value.includes(opt.value));

  return (
    <div className={className}>
      {label && (
        <label className="block font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center gap-2 px-4 py-2 min-h-[42px]
            bg-white dark:bg-gray-800
            border rounded-lg
            transition-all duration-200
            ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : 'hover:border-gray-400 dark:hover:border-gray-500'}
            ${isOpen ? 'ring-2 ring-blue-500 dark:ring-blue-400 border-blue-500 dark:border-blue-400' : ''}
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          `}
        >
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm"
                >
                  {opt.label}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={(e) => handleRemove(opt.value, e)}
                  />
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            )}

            {showSelectAll && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-900 dark:text-white">Select All</span>
                {isAllSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </button>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = option.disabled || (maxSelected && !isSelected && value.length >= maxSelected);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !isDisabled && handleToggle(option.value)}
                    disabled={isDisabled}
                    className={`
                      w-full flex items-center justify-between px-4 py-2
                      transition-colors
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'}
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    <span className={isSelected ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-900 dark:text-white'}>
                      {option.label}
                    </span>
                    {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {maxSelected && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {value.length} / {maxSelected} selected
        </p>
      )}
    </div>
  );
}
