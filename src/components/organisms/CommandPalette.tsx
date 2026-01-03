import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, Hash, File, User, Settings, type LucideIcon } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  category?: string;
  shortcut?: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  recentItems?: CommandItem[];
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder = 'Search commands...',
  recentItems = [],
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
    if (!newOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  };

  // Keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Filter items based on search
  const filteredItems = search
    ? items.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
          item.label.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower))
        );
      })
    : items;

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const allFilteredItems = Object.values(groupedItems).flat();

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allFilteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allFilteredItems.length) % allFilteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = allFilteredItems[selectedIndex];
      if (selectedItem) {
        selectedItem.onSelect();
        handleOpenChange(false);
      }
    } else if (e.key === 'Escape') {
      handleOpenChange(false);
    }
  };

  const handleSelect = (item: CommandItem) => {
    item.onSelect();
    handleOpenChange(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 ${className}`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => handleOpenChange(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Command Palette */}
        <div className="absolute inset-0 overflow-y-auto p-4 sm:p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {search === '' && recentItems.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent
                  </div>
                  {recentItems.map((item, index) => (
                    <CommandItem
                      key={item.id}
                      item={item}
                      selected={index === selectedIndex}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    {category}
                  </div>
                  {categoryItems.map((item) => {
                    const itemIndex = allFilteredItems.indexOf(item);
                    return (
                      <CommandItem
                        key={item.id}
                        item={item}
                        selected={itemIndex === selectedIndex}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </div>
              ))}

              {allFilteredItems.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No results found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">↵</kbd>
                    Select
                  </span>
                </div>
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">⌘K</kbd> to toggle</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

interface CommandItemProps {
  item: CommandItem;
  selected: boolean;
  onSelect: (item: CommandItem) => void;
}

const CommandItem: React.FC<CommandItemProps> = ({ item, selected, onSelect }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item)}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
        ${selected
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      {Icon && (
        <div className={`
          w-8 h-8 flex items-center justify-center rounded-md
          ${selected
            ? 'bg-blue-100 dark:bg-blue-900/40'
            : 'bg-gray-100 dark:bg-gray-800'
          }
        `}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.description}
          </div>
        )}
      </div>

      {item.shortcut && (
        <kbd className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
          {item.shortcut}
        </kbd>
      )}
    </button>
  );
};
