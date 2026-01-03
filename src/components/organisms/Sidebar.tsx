import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
  active?: boolean;
  children?: SidebarMenuItem[];
  onClick?: () => void;
}

export interface SidebarProps {
  items?: SidebarMenuItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  collapsed: controlledCollapsed,
  onCollapse,
  header,
  footer,
  className = '',
}) => {
  const { t } = useLanguage();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = () => {
    const newValue = !collapsed;
    if (onCollapse) {
      onCollapse(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
    // Collapse all nested menus when sidebar collapses
    if (newValue) {
      setExpandedItems(new Set());
    }
  };

  const toggleExpanded = (id: string) => {
    if (collapsed) return;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col ${className}`}
    >
      {/* Header */}
      {header && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          {header}
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <ul className="space-y-1 px-2">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              expanded={expandedItems.has(item.id)}
              onToggleExpand={() => toggleExpanded(item.id)}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {footer}
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={handleCollapse}
        className="m-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </motion.aside>
  );
};

interface SidebarItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  depth?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed,
  expanded,
  onToggleExpand,
  depth = 0,
}) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand();
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <li>
      <motion.button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
          ${item.active 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
          ${depth > 0 ? 'ml-4' : ''}
        `}
        whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <span className="truncate">{item.label}</span>
              
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    {item.badge}
                  </span>
                )}
                
                {hasChildren && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge for collapsed state */}
        {collapsed && item.badge && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </motion.button>

      {/* Nested Items */}
      <AnimatePresence>
        {hasChildren && expanded && !collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-1 mt-1"
          >
            {item.children!.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                collapsed={collapsed}
                expanded={false}
                onToggleExpand={() => {}}
                depth={depth + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

// Default menu items
const defaultItems: SidebarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    active: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: 'New',
    children: [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    badge: 12,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    badge: 5,
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: HelpCircle,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
];
