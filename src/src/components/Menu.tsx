import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
  shortcut?: string;
}

export interface MenuProps {
  items: MenuItem[];
  onSelect?: (key: string) => void;
  className?: string;
}

export function Menu({ items, onSelect, className = '' }: MenuProps) {
  const [openSubmenuKey, setOpenSubmenuKey] = useState<string | null>(null);

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled || item.children) return;
    
    item.onClick?.();
    onSelect?.(item.key);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (item.divider) {
      return (
        <div
          key={item.key}
          className="my-1 border-t border-gray-200 dark:border-gray-700"
        />
      );
    }

    const hasSubmenu = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="relative">
        <button
          type="button"
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => hasSubmenu && setOpenSubmenuKey(item.key)}
          disabled={item.disabled}
          className={`
            w-full flex items-center justify-between gap-3
            px-3 py-2 text-sm
            transition-colors
            ${
              item.danger
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            text-left
          `}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {item.icon && (
              <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>
            )}
            <span className="truncate">{item.label}</span>
          </div>

          {item.shortcut && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {item.shortcut}
            </span>
          )}

          {hasSubmenu && (
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
        </button>

        {/* Submenu */}
        {hasSubmenu && (
          <AnimatePresence>
            {openSubmenuKey === item.key && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full top-0 ml-1 z-50"
              >
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]">
                  {item.children!.map((child) => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        rounded-lg shadow-lg
        border border-gray-200 dark:border-gray-700
        py-1 min-w-[200px]
        ${className}
      `}
    >
      {items.map((item) => renderMenuItem(item))}
    </div>
  );
}

// ContextMenu - right-click menu
export interface ContextMenuProps {
  children: React.ReactNode;
  items: MenuItem[];
  onSelect?: (key: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ContextMenu({
  children,
  items,
  onSelect,
  disabled = false,
  className = '',
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleSelect = (key: string) => {
    setIsOpen(false);
    onSelect?.(key);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40" />

            {/* Menu */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 50,
              }}
            >
              <Menu items={items} onSelect={handleSelect} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// MenuButton - trigger menu with a button
export interface MenuButtonProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  onSelect?: (key: string) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export function MenuButton({
  trigger,
  items,
  onSelect,
  placement = 'bottom-start',
  className = '',
}: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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

  const placements = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };

  const handleSelect = (key: string) => {
    setIsOpen(false);
    onSelect?.(key);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${placements[placement]} z-50`}
          >
            <Menu items={items} onSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
