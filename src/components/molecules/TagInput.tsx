import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Tag {
  id: string | number;
  label: string;
  color?: string;
}

export interface TagInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  suggestions?: string[];
  onTagAdd?: (tag: Tag) => void;
  onTagRemove?: (tag: Tag) => void;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Type and press Enter...',
  maxTags,
  allowDuplicates = false,
  suggestions = [],
  onTagAdd,
  onTagRemove,
  size = 'md',
  error,
  disabled = false,
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (label: string) => {
    if (!label.trim()) return;
    if (maxTags && tags.length >= maxTags) return;
    if (!allowDuplicates && tags.some(t => t.label.toLowerCase() === label.toLowerCase())) return;

    const newTag: Tag = {
      id: Date.now(),
      label: label.trim(),
    };

    const newTags = [...tags, newTag];
    onChange(newTags);
    onTagAdd?.(newTag);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: Tag) => {
    const newTags = tags.filter(tag => tag.id !== tagToRemove.id);
    onChange(newTags);
    onTagRemove?.(tagToRemove);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) &&
         !tags.some(t => t.label.toLowerCase() === s.toLowerCase())
  );

  const sizeClasses = {
    sm: 'min-h-[36px] text-sm',
    md: 'min-h-[44px] text-base',
    lg: 'min-h-[52px] text-lg',
  };

  const tagSizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={`
          w-full rounded-xl border-2
          bg-background dark:bg-background
          flex flex-wrap gap-2 p-2
          transition-all duration-200
          cursor-text
          ${sizeClasses[size]}
          ${error
            ? 'border-red-600 focus-within:ring-2 focus-within:ring-red-600'
            : 'border-border dark:border-border focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Tags */}
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`
                inline-flex items-center gap-1.5 rounded-lg
                ${tag.color || 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400'}
                ${tagSizeClasses[size]}
              `}
            >
              <span className="font-medium">{tag.label}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input */}
        {(!maxTags || tags.length < maxTags) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0 && suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={disabled}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Max tags indicator */}
      {maxTags && (
        <p className="text-xs text-muted-foreground mt-2">
          {tags.length}/{maxTags} tags
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}

// Email Tag Input (validates emails)
export function EmailTagInput({
  emails,
  onChange,
  ...props
}: Omit<TagInputProps, 'tags' | 'onChange'> & {
  emails: string[];
  onChange: (emails: string[]) => void;
}) {
  const tags = emails.map((email, index) => ({
    id: index,
    label: email,
  }));

  const handleChange = (newTags: Tag[]) => {
    const newEmails = newTags.map(tag => tag.label);
    onChange(newEmails);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleTagAdd = (tag: Tag) => {
    if (!isValidEmail(tag.label)) {
      alert('Please enter a valid email address');
      return false;
    }
    props.onTagAdd?.(tag);
  };

  return (
    <TagInput
      {...props}
      tags={tags}
      onChange={handleChange}
      onTagAdd={handleTagAdd}
      placeholder="Enter email addresses..."
    />
  );
}
