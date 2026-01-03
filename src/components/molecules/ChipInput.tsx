import React, { useState, useRef, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChipInputProps {
  value?: string[];
  onChange?: (chips: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxChips?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'colored';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function ChipInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter...',
  suggestions = [],
  maxChips,
  allowDuplicates = false,
  disabled = false,
  variant = 'default',
  size = 'md',
  className = '',
  label,
}: ChipInputProps) {
  const [chips, setChips] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = [
    'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400',
    'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400',
    'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400',
    'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    'bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400',
  ];

  const getChipColor = (index: number) => {
    return variant === 'colored' ? colors[index % colors.length] : 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400';
  };

  const addChip = (chip: string) => {
    const trimmedChip = chip.trim();
    
    if (!trimmedChip) return;
    
    if (!allowDuplicates && chips.includes(trimmedChip)) {
      setInputValue('');
      return;
    }
    
    if (maxChips && chips.length >= maxChips) {
      return;
    }

    const newChips = [...chips, trimmedChip];
    setChips(newChips);
    onChange?.(newChips);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeChip = (index: number) => {
    const newChips = chips.filter((_, i) => i !== index);
    setChips(newChips);
    onChange?.(newChips);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      removeChip(chips.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !chips.includes(s)
  );

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Chips Container */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`
            min-h-[44px] flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl
            border-2 border-border dark:border-border bg-card dark:bg-card
            cursor-text transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/20'}
          `}
        >
          {/* Chips */}
          <AnimatePresence mode="popLayout">
            {chips.map((chip, index) => (
              <motion.div
                key={`${chip}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`
                  flex items-center gap-1.5 rounded-lg font-medium
                  ${sizeClasses[size]} ${getChipColor(index)}
                `}
              >
                <span>{chip}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(index);
                  }}
                  disabled={disabled}
                  className="hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors disabled:cursor-not-allowed"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0 && suggestions.length > 0)}
            disabled={disabled || (maxChips !== undefined && chips.length >= maxChips)}
            placeholder={chips.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed"
          />
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => addChip(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors text-sm text-foreground"
                  >
                    <Plus className="w-4 h-4 inline mr-2 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{chips.length} chip{chips.length !== 1 ? 's' : ''}</span>
        {maxChips && (
          <span>
            {chips.length} / {maxChips}
          </span>
        )}
      </div>
    </div>
  );
}
