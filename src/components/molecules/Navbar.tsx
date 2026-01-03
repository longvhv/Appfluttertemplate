import React from 'react';
import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';

export interface NavbarItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export interface NavbarProps {
  items: NavbarItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'sticky' | 'floating';
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  items,
  logo,
  actions,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'sticky':
        return 'sticky top-0 z-40';
      case 'floating':
        return 'mx-4 my-4 rounded-2xl shadow-lg';
      default:
        return '';
    }
  };

  return (
    <nav
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${getVariantStyles()} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && <div className="flex-shrink-0">{logo}</div>}

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <NavbarItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="px-2 py-3 space-y-1">
          {items.map((item) => (
            <NavbarItemComponent key={item.id} item={item} mobile />
          ))}
        </div>
      </div>
    </nav>
  );
};

interface NavbarItemComponentProps {
  item: NavbarItem;
  mobile?: boolean;
}

const NavbarItemComponent: React.FC<NavbarItemComponentProps> = ({ item, mobile = false }) => {
  const Icon = item.icon;

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    }
  };

  if (mobile) {
    return (
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
          ${item.active
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative px-4 py-2 rounded-lg transition-colors flex items-center gap-2
        ${item.active
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
          {item.badge}
        </span>
      )}
      {item.active && (
        <motion.div
          layoutId="navbar-active"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
