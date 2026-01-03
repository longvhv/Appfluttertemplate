import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

// Context for Accordion
interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (value: string) => void;
  multiple: boolean;
  variant: 'default' | 'bordered' | 'separated';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
};

// Accordion Container
export interface AccordionProps {
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated';
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  defaultValue,
  value,
  onChange,
  multiple = false,
  variant = 'default',
  children,
  className = '',
}: AccordionProps) {
  const getInitialValue = () => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialValue());

  const toggleItem = (itemValue: string) => {
    let newExpanded: string[];

    if (multiple) {
      newExpanded = expandedItems.includes(itemValue)
        ? expandedItems.filter((v) => v !== itemValue)
        : [...expandedItems, itemValue];
    } else {
      newExpanded = expandedItems.includes(itemValue) ? [] : [itemValue];
    }

    if (value === undefined) {
      setExpandedItems(newExpanded);
    }

    onChange?.(multiple ? newExpanded : newExpanded[0] || '');
  };

  const currentExpanded = value !== undefined
    ? Array.isArray(value) ? value : [value]
    : expandedItems;

  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
    separated: 'space-y-2',
  };

  return (
    <AccordionContext.Provider
      value={{ expandedItems: currentExpanded, toggleItem, multiple, variant }}
    >
      <div className={`${variantStyles[variant]} ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

// AccordionItem
export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  value,
  children,
  disabled = false,
  className = '',
}: AccordionItemProps) {
  const { variant } = useAccordionContext();

  const variantStyles = {
    default: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
    bordered: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
    separated: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
  };

  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// AccordionTrigger
export interface AccordionTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionTrigger({
  value,
  children,
  icon,
  disabled = false,
  className = '',
}: AccordionTriggerProps) {
  const { expandedItems, toggleItem } = useAccordionContext();
  const isExpanded = expandedItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => !disabled && toggleItem(value)}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between
        px-4 py-3 text-left
        bg-white dark:bg-gray-900
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset
        ${className}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        {icon && <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">{icon}</span>}
        <span className="font-medium text-gray-900 dark:text-white">{children}</span>
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0 ml-2"
      >
        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </motion.div>
    </button>
  );
}

// AccordionContent
export interface AccordionContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({
  value,
  children,
  className = '',
}: AccordionContentProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div
            className={`
              px-4 py-3
              bg-gray-50 dark:bg-gray-800/50
              text-gray-700 dark:text-gray-300
              ${className}
            `}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
