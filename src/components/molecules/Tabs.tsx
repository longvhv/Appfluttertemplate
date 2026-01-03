import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

// Memoized tab button component
const TabButton = React.memo<{
  item: TabItem;
  isActive: boolean;
  onClick: () => void;
  styles: any;
}>(({ item, isActive, onClick, styles }) => {
  const Icon = item.icon;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={item.disabled}
      onClick={onClick}
      className={`${styles.tab} ${isActive ? styles.active : styles.inactive} ${
        item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
          {item.badge}
        </span>
      )}
    </button>
  );
});

TabButton.displayName = 'TabButton';

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  orientation = 'horizontal',
  variant = 'default',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.id);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange]);

  const activeItem = useMemo(
    () => items.find((item) => item.id === value),
    [items, value]
  );

  const styles = useMemo(() => {
    const base = 'relative px-4 py-2 transition-colors flex items-center gap-2';
    
    switch (variant) {
      case 'pills':
        return {
          container: 'gap-2',
          tab: `${base} rounded-lg`,
          active: 'bg-blue-600 text-white',
          inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
        };
      case 'underline':
        return {
          container: 'gap-0 border-b border-gray-200 dark:border-gray-800',
          tab: `${base} border-b-2 border-transparent`,
          active: 'border-blue-600 text-blue-600 dark:text-blue-400',
          inactive: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
        };
      default:
        return {
          container: 'gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg',
          tab: `${base} rounded-md`,
          active: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm',
          inactive: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
        };
    }
  }, [variant]);

  return (
    <div className={`${orientation === 'vertical' ? 'flex gap-4' : ''} ${className}`}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`
          flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
          ${styles.container}
        `}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === value;

          return (
            <TabButton
              key={item.id}
              item={item}
              isActive={isActive}
              onClick={() => !item.disabled && handleChange(item.id)}
              styles={styles}
            />
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 mt-4">
        <AnimatePresence mode="wait">
          {activeItem?.content && (
            <motion.div
              key={value}
              id={`panel-${value}`}
              role="tabpanel"
              aria-labelledby={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeItem.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};