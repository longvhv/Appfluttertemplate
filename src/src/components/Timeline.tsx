import React from 'react';
import { motion } from 'motion/react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Timeline({
  items,
  variant = 'default',
  size = 'md',
  className = '',
}: TimelineProps) {
  const sizes = {
    sm: {
      dot: 'w-2 h-2',
      icon: 'w-6 h-6',
      line: 'w-0.5',
      title: 'text-sm',
      description: 'text-xs',
      timestamp: 'text-xs',
    },
    md: {
      dot: 'w-3 h-3',
      icon: 'w-8 h-8',
      line: 'w-0.5',
      title: 'text-base',
      description: 'text-sm',
      timestamp: 'text-sm',
    },
    lg: {
      dot: 'w-4 h-4',
      icon: 'w-10 h-10',
      line: 'w-1',
      title: 'text-lg',
      description: 'text-base',
      timestamp: 'text-base',
    },
  };

  const colors = {
    default: {
      dot: 'bg-gray-400 dark:bg-gray-500',
      icon: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
      line: 'bg-gray-200 dark:bg-gray-700',
    },
    primary: {
      dot: 'bg-indigo-600 dark:bg-indigo-500',
      icon: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
      line: 'bg-indigo-200 dark:bg-indigo-900',
    },
    success: {
      dot: 'bg-green-600 dark:bg-green-500',
      icon: 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400',
      line: 'bg-green-200 dark:bg-green-900',
    },
    warning: {
      dot: 'bg-yellow-600 dark:bg-yellow-500',
      icon: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
      line: 'bg-yellow-200 dark:bg-yellow-900',
    },
    danger: {
      dot: 'bg-red-600 dark:bg-red-500',
      icon: 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400',
      line: 'bg-red-200 dark:bg-red-900',
    },
  };

  const renderIndicator = (item: TimelineItem) => {
    const color = colors[item.color || 'default'];

    if (item.icon) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            ${sizes[size].icon}
            rounded-full
            ${color.icon}
            flex items-center justify-center
            flex-shrink-0
          `}
        >
          {item.icon}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`
          ${sizes[size].dot}
          rounded-full
          ${color.dot}
          flex-shrink-0
        `}
      />
    );
  };

  if (variant === 'alternate') {
    return (
      <div className={`relative ${className}`}>
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />

        <div className="space-y-12">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            const color = colors[item.color || 'default'];

            return (
              <div key={item.id} className="relative">
                {/* Dot */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
                  {renderIndicator(item)}
                </div>

                {/* Content */}
                <div
                  className={`
                    flex
                    ${isLeft ? 'justify-end pr-[calc(50%+2rem)]' : 'justify-start pl-[calc(50%+2rem)]'}
                  `}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="max-w-md"
                  >
                    {item.timestamp && (
                      <p className={`${sizes[size].timestamp} text-gray-500 dark:text-gray-400 mb-1`}>
                        {item.timestamp}
                      </p>
                    )}
                    <h4 className={`${sizes[size].title} font-semibold text-gray-900 dark:text-white`}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className={`${sizes[size].description} text-gray-600 dark:text-gray-400 mt-1`}>
                        {item.description}
                      </p>
                    )}
                    {item.content && <div className="mt-2">{item.content}</div>}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-6">
        {items.map((item, index) => {
          const color = colors[item.color || 'default'];
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="relative flex gap-4">
              {/* Timeline Track */}
              <div className="relative flex flex-col items-center">
                {renderIndicator(item)}
                {!isLast && (
                  <div
                    className={`
                      ${sizes[size].line}
                      flex-1 mt-2
                      ${color.line}
                      min-h-[40px]
                    `}
                  />
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 pb-6"
              >
                {item.timestamp && (
                  <p className={`${sizes[size].timestamp} text-gray-500 dark:text-gray-400 mb-1`}>
                    {item.timestamp}
                  </p>
                )}
                <h4 className={`${sizes[size].title} font-semibold text-gray-900 dark:text-white`}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className={`${sizes[size].description} text-gray-600 dark:text-gray-400 mt-1`}>
                    {item.description}
                  </p>
                )}
                {item.content && <div className="mt-2">{item.content}</div>}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
