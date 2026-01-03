import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label?: string;
    direction?: 'up' | 'down' | 'neutral';
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  variant?: 'default' | 'gradient' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

const colorStyles = {
  primary: {
    gradient: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    icon: 'text-indigo-600 dark:text-indigo-400',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  success: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-950/30',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-600 dark:text-green-400',
  },
  warning: {
    gradient: 'from-yellow-500 to-orange-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    gradient: 'from-red-500 to-pink-600',
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-600 dark:text-red-400',
  },
  info: {
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
  },
  default: {
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    icon: 'text-gray-600 dark:text-gray-400',
    text: 'text-gray-600 dark:text-gray-400',
  },
};

const sizeConfig = {
  sm: {
    padding: 'p-4',
    icon: 'w-8 h-8',
    iconContainer: 'w-10 h-10',
    value: 'text-xl',
    label: 'text-xs',
    trend: 'text-xs',
  },
  md: {
    padding: 'p-6',
    icon: 'w-10 h-10',
    iconContainer: 'w-12 h-12',
    value: 'text-3xl',
    label: 'text-sm',
    trend: 'text-sm',
  },
  lg: {
    padding: 'p-8',
    icon: 'w-12 h-12',
    iconContainer: 'w-16 h-16',
    value: 'text-4xl',
    label: 'text-base',
    trend: 'text-base',
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  variant = 'default',
  size = 'md',
  footer,
  animated = true,
  onClick,
  className = '',
}: StatsCardProps) {
  const colors = colorStyles[color];
  const sizeStyles = sizeConfig[size];

  const trendDirection = trend?.direction || (trend && trend.value > 0 ? 'up' : trend && trend.value < 0 ? 'down' : 'neutral');
  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor =
    trendDirection === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trendDirection === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        whileHover: onClick ? { y: -4 } : undefined,
      }
    : {};

  return (
    <Wrapper
      onClick={onClick}
      className={`
        ${sizeStyles.padding}
        rounded-2xl
        ${variant === 'gradient'
          ? `bg-gradient-to-br ${colors.gradient} text-white`
          : variant === 'outlined'
          ? 'bg-card dark:bg-card border-2 border-border dark:border-border'
          : 'bg-card dark:bg-card border border-border dark:border-border'
        }
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
      {...wrapperProps}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`
              ${sizeStyles.label} uppercase tracking-wide font-medium mb-2
              ${variant === 'gradient' ? 'text-white/80' : 'text-muted-foreground'}
            `}
          >
            {label}
          </p>
          <p
            className={`
              ${sizeStyles.value} font-bold mb-2
              ${variant === 'gradient' ? 'text-white' : 'text-foreground'}
            `}
          >
            {value}
          </p>

          {trend && (
            <div className={`flex items-center gap-1 ${sizeStyles.trend}`}>
              <TrendIcon className="w-4 h-4" />
              <span className={variant === 'gradient' ? 'text-white/90' : trendColor}>
                {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span className={variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'}>
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`
              ${sizeStyles.iconContainer}
              rounded-xl flex items-center justify-center
              ${variant === 'gradient' ? 'bg-white/20' : colors.bg}
            `}
          >
            <Icon className={`${sizeStyles.icon} ${variant === 'gradient' ? 'text-white' : colors.icon}`} />
          </div>
        )}
      </div>

      {footer && (
        <div
          className={`
            mt-4 pt-4 border-t
            ${variant === 'gradient' ? 'border-white/20' : 'border-border dark:border-border'}
          `}
        >
          {footer}
        </div>
      )}
    </Wrapper>
  );
}

// Stats Group for displaying multiple stats
export interface StatsGroupProps {
  stats: Array<Omit<StatsCardProps, 'animated'>>;
  columns?: 1 | 2 | 3 | 4;
  animated?: boolean;
  className?: string;
}

export function StatsGroup({
  stats,
  columns = 3,
  animated = true,
  className = '',
}: StatsGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} animated={animated} />
      ))}
    </div>
  );
}
