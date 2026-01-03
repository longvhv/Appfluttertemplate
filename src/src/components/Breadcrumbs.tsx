import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  showHome?: boolean;
  maxItems?: number;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator = 'chevron',
  showHome = true,
  maxItems,
  className = '',
}: BreadcrumbsProps) {
  const separators = {
    chevron: <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />,
    slash: <span className="text-gray-400 dark:text-gray-600">/</span>,
    dot: <span className="text-gray-400 dark:text-gray-600">•</span>,
  };

  const homeItem: BreadcrumbItem = {
    label: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />,
  };

  let displayItems = showHome ? [homeItem, ...items] : items;

  // Handle maxItems with ellipsis
  if (maxItems && displayItems.length > maxItems) {
    const firstItems = displayItems.slice(0, 1);
    const lastItems = displayItems.slice(-(maxItems - 2));
    displayItems = [
      ...firstItems,
      { label: '...', onClick: undefined },
      ...lastItems,
    ];
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-sm">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.onClick || item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className={`
                    inline-flex items-center gap-1 transition-colors
                    ${
                      isLast
                        ? 'text-gray-900 dark:text-white font-medium cursor-default'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separators[separator]}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
