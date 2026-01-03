import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';

export interface TransferItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferListProps {
  leftItems: TransferItem[];
  rightItems?: TransferItem[];
  onChange?: (left: TransferItem[], right: TransferItem[]) => void;
  leftTitle?: string;
  rightTitle?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function TransferList({
  leftItems: initialLeftItems,
  rightItems: initialRightItems = [],
  onChange,
  leftTitle = 'Available',
  rightTitle = 'Selected',
  searchable = true,
  disabled = false,
  className = '',
  label,
}: TransferListProps) {
  const [leftItems, setLeftItems] = useState<TransferItem[]>(initialLeftItems);
  const [rightItems, setRightItems] = useState<TransferItem[]>(initialRightItems);
  const [leftSelected, setLeftSelected] = useState<Set<string>>(new Set());
  const [rightSelected, setRightSelected] = useState<Set<string>>(new Set());
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const handleTransfer = (items: TransferItem[], from: 'left' | 'right') => {
    if (from === 'left') {
      const newLeft = leftItems.filter((item) => !items.find((i) => i.id === item.id));
      const newRight = [...rightItems, ...items];
      setLeftItems(newLeft);
      setRightItems(newRight);
      setLeftSelected(new Set());
      onChange?.(newLeft, newRight);
    } else {
      const newRight = rightItems.filter((item) => !items.find((i) => i.id === item.id));
      const newLeft = [...leftItems, ...items];
      setLeftItems(newLeft);
      setRightItems(newRight);
      setRightSelected(new Set());
      onChange?.(newLeft, newRight);
    }
  };

  const handleTransferAll = (from: 'left' | 'right') => {
    if (from === 'left') {
      const transferableItems = leftItems.filter((item) => !item.disabled);
      handleTransfer(transferableItems, 'left');
    } else {
      const transferableItems = rightItems.filter((item) => !item.disabled);
      handleTransfer(transferableItems, 'right');
    }
  };

  const handleToggleItem = (itemId: string, side: 'left' | 'right') => {
    const selectedSet = side === 'left' ? leftSelected : rightSelected;
    const setSelected = side === 'left' ? setLeftSelected : setRightSelected;

    const newSelected = new Set(selectedSet);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelected(newSelected);
  };

  const filterItems = (items: TransferItem[], search: string) => {
    if (!search) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const ItemList = ({
    items,
    selected,
    onToggle,
    search,
    onSearchChange,
    side,
  }: {
    items: TransferItem[];
    selected: Set<string>;
    onToggle: (id: string) => void;
    search: string;
    onSearchChange: (value: string) => void;
    side: 'left' | 'right';
  }) => {
    const filteredItems = filterItems(items, search);

    return (
      <div className="flex-1 flex flex-col border-2 border-border dark:border-border rounded-xl overflow-hidden bg-card dark:bg-card">
        {/* Search */}
        {searchable && (
          <div className="p-3 border-b border-border dark:border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border dark:border-border bg-background dark:bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px] max-h-[400px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = selected.has(item.id);

              return (
                <motion.button
                  key={item.id}
                  onClick={() => !item.disabled && onToggle(item.id)}
                  disabled={item.disabled}
                  whileHover={!item.disabled ? { scale: 1.01 } : {}}
                  whileTap={!item.disabled ? { scale: 0.99 } : {}}
                  className={`
                    w-full px-3 py-2.5 rounded-lg text-left transition-all
                    ${isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-950/30 border-2 border-indigo-600'
                      : 'bg-muted/30 dark:bg-muted/30 border-2 border-transparent hover:border-border dark:hover:border-border'
                    }
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="text-sm font-medium text-foreground">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                  )}
                </motion.button>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No items
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-border dark:border-border bg-muted/30 dark:bg-muted/30 text-xs text-muted-foreground">
          {selected.size > 0 ? `${selected.size} selected • ` : ''}
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  const selectedLeftItems = leftItems.filter((item) => leftSelected.has(item.id));
  const selectedRightItems = rightItems.filter((item) => rightSelected.has(item.id));

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
        </label>
      )}

      <div className="flex items-center gap-4">
        {/* Left List */}
        <div className="flex-1">
          <div className="text-sm font-medium text-foreground mb-2">{leftTitle}</div>
          <ItemList
            items={leftItems}
            selected={leftSelected}
            onToggle={(id) => handleToggleItem(id, 'left')}
            search={leftSearch}
            onSearchChange={setLeftSearch}
            side="left"
          />
        </div>

        {/* Transfer Buttons */}
        <div className="flex flex-col gap-2">
          {/* Transfer selected to right */}
          <button
            onClick={() => handleTransfer(selectedLeftItems, 'left')}
            disabled={disabled || leftSelected.size === 0}
            className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Transfer selected to right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Transfer all to right */}
          <button
            onClick={() => handleTransferAll('left')}
            disabled={disabled || leftItems.length === 0}
            className="p-2 rounded-lg bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Transfer all to right"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>

          {/* Transfer all to left */}
          <button
            onClick={() => handleTransferAll('right')}
            disabled={disabled || rightItems.length === 0}
            className="p-2 rounded-lg bg-muted dark:bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Transfer all to left"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>

          {/* Transfer selected to left */}
          <button
            onClick={() => handleTransfer(selectedRightItems, 'right')}
            disabled={disabled || rightSelected.size === 0}
            className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Transfer selected to left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Right List */}
        <div className="flex-1">
          <div className="text-sm font-medium text-foreground mb-2">{rightTitle}</div>
          <ItemList
            items={rightItems}
            selected={rightSelected}
            onToggle={(id) => handleToggleItem(id, 'right')}
            search={rightSearch}
            onSearchChange={setRightSearch}
            side="right"
          />
        </div>
      </div>
    </div>
  );
}
