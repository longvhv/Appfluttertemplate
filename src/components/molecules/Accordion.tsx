import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, LucideIcon } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

// Memoized accordion item
const AccordionItemComponent = React.memo<{
  item: AccordionItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}>(({ item, isExpanded, onToggle }) => {
  const Icon = item.icon;

  const handleClick = useCallback(() => {
    if (!item.disabled) {
      onToggle(item.id);
    }
  }, [item.disabled, item.id, onToggle]);

  const buttonClassName = useMemo(() => {
    const baseClasses = 'w-full card-padding flex items-center gap-adaptive text-left transition-colors';
    const disabledClasses = item.disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-muted/50 dark:hover:bg-muted/50 cursor-pointer';
    
    return `${baseClasses} ${disabledClasses}`;
  }, [item.disabled]);

  return (
    <div className="bg-card dark:bg-card rounded-xl shadow-sm border border-border dark:border-border overflow-hidden">
      <button
        type="button"
        onClick={handleClick}
        disabled={item.disabled}
        className={buttonClassName}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${item.id}`}
      >
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
        
        <span className="text-foreground flex-1 font-medium">
          {item.title}
        </span>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-adaptive pb-adaptive text-muted-foreground border-t border-border/50 dark:border-border/50 pt-adaptive">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = '',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  return (
    <div className={`space-adaptive-y-sm ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isExpanded={isExpanded}
            onToggle={toggleItem}
          />
        );
      })}
    </div>
  );
}