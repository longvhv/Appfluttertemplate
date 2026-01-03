import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Home, type LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  showHomeIcon?: boolean;
  maxItems?: number;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = 'chevron',
  showHomeIcon = true,
  maxItems = 4,
  className = '',
}) => {
  const visibleItems = items.length > maxItems
    ? [items[0], { id: 'ellipsis', label: '...' } as BreadcrumbItem, ...items.slice(-2)]
    : items;

  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-gray-400 dark:text-gray-600">/</span>;
      case 'dot':
        return <span className="text-gray-400 dark:text-gray-600">•</span>;
      case 'chevron':
      default:
        return <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 flex-wrap">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const Icon = item.icon;

          return (
            <li key={item.id} className="flex items-center gap-2">
              {item.label === '...' ? (
                <span className="text-gray-500 dark:text-gray-400">...</span>
              ) : (
                <motion.button
                  onClick={item.onClick}
                  disabled={isLast}
                  whileHover={!isLast ? { scale: 1.05 } : {}}
                  whileTap={!isLast ? { scale: 0.95 } : {}}
                  className={`
                    flex items-center gap-1.5 transition-colors
                    ${isLast
                      ? 'text-gray-900 dark:text-white font-medium cursor-default'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {showHomeIcon && index === 0 && !Icon && (
                    <Home className="w-4 h-4" />
                  )}
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              )}
              
              {!isLast && (
                <span className="flex items-center">
                  {getSeparator()}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
