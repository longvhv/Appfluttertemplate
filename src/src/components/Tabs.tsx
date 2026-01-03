import React, { useState, createContext, useContext } from 'react';
import { motion } from 'motion/react';

// Context for Tabs
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: 'underline' | 'pills' | 'enclosed';
  size: 'sm' | 'md' | 'lg';
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Tabs Container
export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'underline' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  children,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || value || '');

  const handleTabChange = (newValue: string) => {
    if (!value) {
      setActiveTab(newValue);
    }
    onChange?.(newValue);
  };

  const currentTab = value !== undefined ? value : activeTab;

  return (
    <TabsContext.Provider
      value={{ activeTab: currentTab, setActiveTab: handleTabChange, variant, size }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// TabsList
export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  const { variant } = useTabsContext();

  const variantStyles = {
    underline: 'border-b border-gray-200 dark:border-gray-700',
    pills: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
    enclosed: 'border-b border-gray-200 dark:border-gray-700',
  };

  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

// TabsTrigger
export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  icon,
  badge,
  className = '',
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, variant, size } = useTabsContext();
  const isActive = activeTab === value;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    underline: {
      base: 'relative border-b-2 border-transparent transition-colors',
      active:
        'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400',
      inactive:
        'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    pills: {
      base: 'rounded-md transition-all',
      active:
        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm',
      inactive:
        'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    enclosed: {
      base: 'relative border border-transparent rounded-t-lg -mb-px transition-all',
      active:
        'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-900 text-gray-900 dark:text-white',
      inactive:
        'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        ${sizes[size]}
        ${currentVariant.base}
        ${isActive ? currentVariant.active : currentVariant.inactive}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-medium whitespace-nowrap
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        flex items-center gap-2
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={`
            inline-flex items-center justify-center
            min-w-[20px] h-5 px-1.5 rounded-full text-xs
            ${
              isActive
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
          `}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// TabsContent
export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  keepMounted?: boolean;
}

export function TabsContent({
  value,
  children,
  className = '',
  keepMounted = false,
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
      transition={{ duration: 0.2 }}
      className={`${!isActive && keepMounted ? 'hidden' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
