import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

export interface DropdownMenuItem {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  onSelect: (value: string) => void;
  selected?: string;
  align?: 'left' | 'right';
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  onSelect,
  selected,
  align = 'left',
  className = '',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (item: DropdownMenuItem) => {
    if (!item.disabled && !item.divider) {
      onSelect(item.value);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 mt-2
              ${align === 'right' ? 'right-0' : 'left-0'}
              min-w-[200px]
              bg-card dark:bg-card
              border border-border dark:border-border
              rounded-xl shadow-lg
              overflow-hidden
            `}
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={index}
                      className="h-px bg-border dark:border-border my-1"
                    />
                  );
                }

                const Icon = item.icon;
                const isSelected = selected === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    disabled={item.disabled}
                    className={`
                      w-full px-4 py-2 text-left flex items-center gap-2
                      transition-colors
                      ${item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : item.danger
                        ? 'hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400'
                        : 'hover:bg-muted/50 dark:hover:bg-muted/50 text-foreground'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="flex-1 text-sm">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Context Menu variant (right-click)
export interface ContextMenuProps {
  children: React.ReactNode;
  items: DropdownMenuItem[];
  onSelect: (value: string) => void;
}

export function ContextMenu({
  children,
  items,
  onSelect,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleSelect = (item: DropdownMenuItem) => {
    if (!item.disabled && !item.divider) {
      onSelect(item.value);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            ref={containerRef}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 100,
            }}
            className="
              min-w-[200px]
              bg-card dark:bg-card
              border border-border dark:border-border
              rounded-xl shadow-lg
              overflow-hidden
            "
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={index}
                      className="h-px bg-border dark:border-border my-1"
                    />
                  );
                }

                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    disabled={item.disabled}
                    className={`
                      w-full px-4 py-2 text-left flex items-center gap-2
                      transition-colors
                      ${item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : item.danger
                        ? 'hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400'
                        : 'hover:bg-muted/50 dark:hover:bg-muted/50 text-foreground'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
