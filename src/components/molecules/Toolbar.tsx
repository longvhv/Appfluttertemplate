import React from 'react';
import { motion } from 'motion/react';
import { MoreVertical, type LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Menu, MenuItemData } from './Menu';

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
  type?: 'button' | 'divider' | 'group';
  children?: ToolbarItem[];
}

export interface ToolbarProps {
  items: ToolbarItem[];
  position?: 'top' | 'bottom';
  variant?: 'default' | 'compact' | 'floating';
  showLabels?: boolean;
  overflowBehavior?: 'wrap' | 'scroll' | 'menu';
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  items,
  position = 'top',
  variant = 'default',
  showLabels = true,
  overflowBehavior = 'wrap',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'gap-0.5 bg-gray-100 dark:bg-gray-900 p-0.5 rounded-lg';
      case 'floating':
        return 'gap-2 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-2 border border-gray-200 dark:border-gray-800';
      default:
        return 'gap-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-2';
    }
  };

  const getOverflowStyles = () => {
    switch (overflowBehavior) {
      case 'scroll':
        return 'overflow-x-auto';
      case 'menu':
        return 'overflow-hidden';
      default:
        return 'flex-wrap';
    }
  };

  // Convert overflow items to menu if needed
  const visibleItems = items;
  const overflowItems: ToolbarItem[] = [];

  return (
    <div
      className={`
        flex items-center ${getVariantStyles()} ${getOverflowStyles()}
        ${position === 'bottom' ? 'border-t border-b-0' : ''}
        ${className}
      `}
    >
      {visibleItems.map((item, index) => {
        if (item.type === 'divider') {
          return (
            <div
              key={item.id}
              className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"
            />
          );
        }

        if (item.type === 'group' && item.children) {
          return (
            <div key={item.id} className="flex items-center gap-1">
              {item.children.map((child) => (
                <ToolbarButton
                  key={child.id}
                  item={child}
                  variant={variant}
                  showLabel={showLabels}
                />
              ))}
            </div>
          );
        }

        return (
          <ToolbarButton
            key={item.id}
            item={item}
            variant={variant}
            showLabel={showLabels}
          />
        );
      })}

      {/* Overflow Menu */}
      {overflowItems.length > 0 && (
        <Menu
          items={overflowItems.map((item) => ({
            id: item.id,
            label: item.label || '',
            icon: item.icon ? <item.icon className="w-4 h-4" /> : undefined,
            onClick: item.onClick,
            disabled: item.disabled,
            danger: item.variant === 'danger',
          }))}
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          }
        />
      )}
    </div>
  );
};

interface ToolbarButtonProps {
  item: ToolbarItem;
  variant: string;
  showLabel: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ item, variant, showLabel }) => {
  const Icon = item.icon;

  const getButtonVariant = (): any => {
    switch (item.variant) {
      case 'primary':
        return 'primary';
      case 'danger':
        return 'danger';
      default:
        return variant === 'compact' ? 'ghost' : 'outline';
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={getButtonVariant()}
        size={variant === 'compact' ? 'sm' : 'md'}
        onClick={item.onClick}
        disabled={item.disabled}
      >
        {Icon && <Icon className={`w-4 h-4 ${showLabel && item.label ? 'mr-2' : ''}`} />}
        {showLabel && item.label}
      </Button>
    </motion.div>
  );
};

// Pre-built toolbar variants
export const EditorToolbar: React.FC<Partial<ToolbarProps>> = (props) => (
  <Toolbar
    {...props}
    variant="default"
    showLabels={false}
  />
);

export const ActionToolbar: React.FC<Partial<ToolbarProps>> = (props) => (
  <Toolbar
    {...props}
    variant="floating"
    showLabels={true}
  />
);

export const CompactToolbar: React.FC<Partial<ToolbarProps>> = (props) => (
  <Toolbar
    {...props}
    variant="compact"
    showLabels={false}
  />
);
