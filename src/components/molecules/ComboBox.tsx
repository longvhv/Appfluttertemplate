import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ComboBoxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  onCreateOption?: (value: string) => void;
  className?: string;
  label?: string;
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found',
  disabled = false,
  clearable = true,
  creatable = false,
  onCreateOption,
  className = '',
  label,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const filteredOptions = searchQuery
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Group options
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, ComboBoxOption[]>);

  const flatFilteredOptions = Object.values(groupedOptions).flat();

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    onChange?.('');
    setSearchQuery('');
  };

  const handleCreate = () => {
    if (creatable && searchQuery && onCreateOption) {
      onCreateOption(searchQuery);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < flatFilteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatFilteredOptions[highlightedIndex]) {
          handleSelect(flatFilteredOptions[highlightedIndex].value);
        } else if (creatable && searchQuery) {
          handleCreate();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
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
          w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl
          border-2 transition-all
          bg-card dark:bg-card text-foreground
          ${isOpen
            ? 'border-indigo-600 ring-4 ring-indigo-600/20'
            : 'border-border dark:border-border hover:border-indigo-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={selectedValue ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption?.label || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {clearable && selectedValue && (
            <X
              className="w-4 h-4 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
          <ChevronsUpDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
            {/* Search Input */}
            <div className="p-2 border-b border-border dark:border-border">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {flatFilteredOptions.length > 0 ? (
                Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    {group !== 'default' && (
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/30 dark:bg-muted/30">
                        {group}
                      </div>
                    )}
                    {groupOptions.map((option, index) => {
                      const isSelected = option.value === selectedValue;
                      const globalIndex = flatFilteredOptions.indexOf(option);
                      const isHighlighted = globalIndex === highlightedIndex;

                      return (
                        <button
                          key={option.value}
                          onClick={() => !option.disabled && handleSelect(option.value)}
                          disabled={option.disabled}
                          className={`
                            w-full px-4 py-2.5 text-left transition-colors
                            flex items-center justify-between gap-2
                            ${isHighlighted
                              ? 'bg-indigo-50 dark:bg-indigo-950/30'
                              : 'hover:bg-muted/50 dark:hover:bg-muted/50'
                            }
                            ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              {option.label}
                            </div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {option.description}
                              </div>
                            )}
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  {emptyText}
                  {creatable && searchQuery && (
                    <button
                      onClick={handleCreate}
                      className="block w-full mt-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      Create "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
