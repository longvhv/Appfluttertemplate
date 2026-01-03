import React, { useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  autoFocus?: boolean;
  debounce?: number;
  className?: string;
}

// Memoized clear button
const ClearButton = React.memo<{ onClick: () => void }>(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-muted dark:hover:bg-muted flex items-center justify-center transition-colors"
    aria-label="Clear search"
  >
    <X className="w-4 h-4 text-muted-foreground" />
  </button>
));

ClearButton.displayName = 'ClearButton';

export const SearchBar = React.memo<SearchBarProps>(({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  onSearch,
  autoFocus = false,
  className = '',
}) => {
  const handleClear = useCallback(() => {
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [onSearch, value, handleClear]);

  const showClearButton = useMemo(() => value.length > 0, [value]);

  return (
    <div className={`relative ${className}`} role="search">
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70 pointer-events-none" 
        aria-hidden="true"
      />
      
      <input
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-12 pr-12 py-adaptive-sm bg-card dark:bg-card border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground/50"
        aria-label="Search input"
      />
      
      {showClearButton && <ClearButton onClick={handleClear} />}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';