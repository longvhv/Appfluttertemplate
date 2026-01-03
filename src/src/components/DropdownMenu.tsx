import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  divide?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  placement = 'bottom-start',
  className = '',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'bottom-start':
          top = triggerRect.bottom + 8;
          left = triggerRect.left;
          break;
        case 'bottom-end':
          top = triggerRect.bottom + 8;
          left = triggerRect.right - menuRect.width;
          break;
        case 'top-start':
          top = triggerRect.top - menuRect.height - 8;
          left = triggerRect.left;
          break;
        case 'top-end':
          top = triggerRect.top - menuRect.height - 8;
          left = triggerRect.right - menuRect.width;
          break;
      }

      // Keep within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + menuRect.width > window.innerWidth - padding) {
        left = window.innerWidth - menuRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + menuRect.height > window.innerHeight - padding) {
        top = window.innerHeight - menuRect.height - padding;
      }

      setPosition({ top, left });
    }
  }, [isOpen, placement]);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: () => setIsOpen(!isOpen),
  });

  return (
    <>
      {clonedTrigger}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={`
              fixed z-50 min-w-[200px]
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-lg shadow-lg
              py-1
              animate-in fade-in zoom-in-95 duration-200
              ${className}
            `}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {items.map((item, index) => {
              const variantClass =
                item.variant === 'danger'
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

              return (
                <React.Fragment key={index}>
                  {item.divide && index > 0 && (
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-2 text-sm transition-colors
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : variantClass}
                      `}
                    >
                      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : variantClass}
                      `}
                    >
                      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                      <span className="flex-1">{item.label}</span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
