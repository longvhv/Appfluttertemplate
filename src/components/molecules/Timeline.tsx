import React from 'react';
import { motion } from 'motion/react';

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'detailed';
  animated?: boolean;
  className?: string;
}

const colorStyles = {
  default: {
    icon: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    line: 'bg-gray-200 dark:bg-gray-700',
  },
  primary: {
    icon: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    line: 'bg-indigo-200 dark:bg-indigo-900/50',
  },
  success: {
    icon: 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400',
    line: 'bg-green-200 dark:bg-green-900/50',
  },
  warning: {
    icon: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400',
    line: 'bg-yellow-200 dark:bg-yellow-900/50',
  },
  error: {
    icon: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
    line: 'bg-red-200 dark:bg-red-900/50',
  },
};

export function Timeline({
  items,
  variant = 'default',
  animated = true,
  className = '',
}: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const colors = colorStyles[item.color || 'default'];
        const isLast = index === items.length - 1;

        const ItemWrapper = animated ? motion.div : 'div';
        const itemProps = animated
          ? {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
            }
          : {};

        return (
          <ItemWrapper key={item.id} className="flex gap-4 relative" {...itemProps}>
            {/* Left side - Icon and Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                {Icon ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-2 min-h-[40px] ${colors.line}`} />
              )}
            </div>

            {/* Right side - Content */}
            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-foreground font-medium">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
                <time className="text-xs text-muted-foreground flex-shrink-0">
                  {item.timestamp}
                </time>
              </div>

              {item.content && variant === 'detailed' && (
                <div className="mt-3 p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                  {item.content}
                </div>
              )}
            </div>
          </ItemWrapper>
        );
      })}
    </div>
  );
}

// Compact timeline variant
export interface CompactTimelineProps {
  items: Array<{
    id: string | number;
    label: string;
    timestamp: string;
  }>;
  className?: string;
}

export function CompactTimeline({ items, className = '' }: CompactTimelineProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
          <span className="text-foreground flex-1">{item.label}</span>
          <time className="text-xs text-muted-foreground">{item.timestamp}</time>
        </div>
      ))}
    </div>
  );
}

// Horizontal timeline
export interface HorizontalTimelineProps {
  items: Array<{
    id: string | number;
    label: string;
    date: string;
  }>;
  currentIndex?: number;
  onItemClick?: (index: number) => void;
}

export function HorizontalTimeline({
  items,
  currentIndex = 0,
  onItemClick,
}: HorizontalTimelineProps) {
  return (
    <div className="relative">
      {/* Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border dark:bg-border" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-500"
        style={{ width: `${(currentIndex / (items.length - 1)) * 100}%` }}
      />

      {/* Items */}
      <div className="relative flex justify-between">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(index)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all
                  ${isActive
                    ? 'bg-indigo-600 text-white scale-110'
                    : isPast
                    ? 'bg-indigo-600 text-white'
                    : 'bg-card dark:bg-card border-2 border-border dark:border-border text-muted-foreground'
                  }
                  ${onItemClick ? 'cursor-pointer group-hover:scale-110' : ''}
                `}
              >
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
