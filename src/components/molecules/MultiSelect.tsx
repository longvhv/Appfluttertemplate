import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../atoms/Badge';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxSelected?: number;
  closeOnSelect?: boolean;
  className?: string;
  label?: string;
  error?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  searchable = true,
  maxSelected,
  closeOnSelect = false,
  className = '',
  label,
  error = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const filteredOptions = searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Group options
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, MultiSelectOption[]>);

  const handleToggleOption = (optionValue: string | number) => {
    const isSelected = value.includes(optionValue);
    
    if (isSelected) {
      onChange?.(value.filter(v => v !== optionValue));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange?.([...value, optionValue]);
      if (closeOnSelect) setIsOpen(false);
    }
  };

  const handleRemove = (optionValue: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange?.(value.filter(v => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const handleSelectAll = () => {
    const allValues = options
      .filter(opt => !opt.disabled)
      .map(opt => opt.value);
    onChange?.(allValues);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-xl border-2 transition-all
          bg-card dark:bg-card text-left
          ${error
            ? 'border-red-600 focus:border-red-600'
            : 'border-border dark:border-border focus:border-indigo-600'
          }
          focus:ring-4 focus:ring-indigo-600/20
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-wrap gap-1 min-h-[24px]">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge
                  key={option.value}
                  variant="primary"
                  size="sm"
                  onRemove={(e) => handleRemove(option.value, e)}
                >
                  {option.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {selectedOptions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-0.5 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
                title="Clear all"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search */}
            {searchable && (
              <div className="p-2 border-b border-border dark:border-border">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            )}

            {/* Actions */}
            <div className="p-2 border-b border-border dark:border-border flex gap-2">
              <button
                onClick={handleSelectAll}
                className="flex-1 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => onChange?.([])}
                className="flex-1 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group}>
                  {group !== 'default' && (
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/30 dark:bg-muted/30">
                      {group}
                    </div>
                  )}
                  {groupOptions.map((option) => {
                    const isSelected = value.includes(option.value);
                    const isDisabled = option.disabled || (maxSelected !== undefined && value.length >= maxSelected && !isSelected);

                    return (
                      <button
                        key={option.value}
                        onClick={() => !isDisabled && handleToggleOption(option.value)}
                        disabled={isDisabled}
                        className={`
                          w-full px-4 py-2.5 text-left transition-colors
                          flex items-center gap-3
                          ${isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-foreground hover:bg-muted/50 dark:hover:bg-muted/50'
                          }
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          ${isSelected
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-border dark:border-border'
                          }
                        `}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="flex-1">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            {maxSelected && (
              <div className="p-2 border-t border-border dark:border-border text-xs text-muted-foreground text-center">
                {value.length} / {maxSelected} selected
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
