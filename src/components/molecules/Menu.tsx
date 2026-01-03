import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check } from 'lucide-react';

export interface MenuItemData {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  checked?: boolean;
  children?: MenuItemData[];
  onClick?: () => void;
}

export interface MenuProps {
  items: MenuItemData[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  trigger,
  open: controlledOpen,
  onOpenChange,
  placement = 'bottom-start',
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const getPlacementStyles = () => {
    switch (placement) {
      case 'bottom-start':
        return 'top-full left-0 mt-2';
      case 'bottom-end':
        return 'top-full right-0 mt-2';
      case 'top-start':
        return 'bottom-full left-0 mb-2';
      case 'top-end':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full left-0 mt-2';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {trigger && (
        <button
          ref={triggerRef}
          onClick={() => handleOpenChange(!open)}
          className="focus:outline-none"
        >
          {trigger}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${getPlacementStyles()} z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1`}
          >
            <MenuItems items={items} onClose={() => handleOpenChange(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MenuItemsProps {
  items: MenuItemData[];
  onClose: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({ items, onClose }) => {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {item.divider ? (
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
          ) : (
            <MenuItem item={item} onClose={onClose} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

interface MenuItemProps {
  item: MenuItemData;
  onClose: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onClose }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    
    if (!hasChildren && item.onClick) {
      item.onClick();
      onClose();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setSubmenuOpen(true)}
      onMouseLeave={() => hasChildren && setSubmenuOpen(false)}
    >
      <button
        onClick={handleClick}
        disabled={item.disabled}
        className={`
          w-full px-3 py-2 text-left flex items-center gap-3 transition-colors
          ${item.disabled
            ? 'opacity-50 cursor-not-allowed'
            : item.danger
            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
      >
        {/* Icon */}
        {item.icon && (
          <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
        )}

        {/* Checkbox */}
        {item.checked !== undefined && (
          <span className="w-4 h-4 flex-shrink-0">
            {item.checked && <Check className="w-4 h-4" />}
          </span>
        )}

        {/* Label */}
        <span className="flex-1">{item.label}</span>

        {/* Shortcut */}
        {item.shortcut && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.shortcut}
          </span>
        )}

        {/* Submenu Indicator */}
        {hasChildren && (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && submenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-1 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
          >
            <MenuItems items={item.children!} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
