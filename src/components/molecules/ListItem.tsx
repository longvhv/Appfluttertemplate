import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ChevronRight } from 'lucide-react';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: LucideIcon;
  leftElement?: React.ReactNode;
  rightIcon?: LucideIcon;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ListItem({
  title,
  subtitle,
  leftIcon: LeftIcon,
  leftElement,
  rightIcon: RightIcon,
  rightElement,
  showChevron = false,
  onPress,
  disabled = false,
  className = '',
}: ListItemProps) {
  const isInteractive = !!onPress;
  const Component = isInteractive ? motion.button : 'div';

  return (
    <Component
      onClick={onPress}
      disabled={disabled}
      className={`
        w-full flex items-center gap-adaptive card-padding
        ${isInteractive ? 'hover:bg-muted/50 dark:hover:bg-muted/50 cursor-pointer transition-colors' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...(isInteractive ? { whileTap: { scale: 0.98 } } : {})}
    >
      {/* Left Icon/Element */}
      {leftElement ? (
        leftElement
      ) : LeftIcon ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center flex-shrink-0">
          <LeftIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : null}

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-foreground text-sm truncate">{title}</p>
        {subtitle && (
          <p className="text-muted-foreground text-xs truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right Icon/Element */}
      {rightElement ? (
        rightElement
      ) : RightIcon ? (
        <RightIcon className="w-5 h-5 text-muted-foreground/70 flex-shrink-0" />
      ) : showChevron ? (
        <ChevronRight className="w-5 h-5 text-muted-foreground/70 flex-shrink-0" />
      ) : null}
    </Component>
  );
}
