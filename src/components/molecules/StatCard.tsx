import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  change?: string;
  chart?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'minimal';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  change,
  chart,
  variant = 'default',
  loading = false,
  onClick,
  className = '',
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus;
    }
    
    return trend.isPositive ? TrendingUp : TrendingDown;
  };

  const TrendIcon = getTrendIcon();

  const getGradientColors = () => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        </div>
      </Card>
    );
  }

  const content = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`
            p-3 rounded-xl
            ${variant === 'gradient'
              ? `bg-gradient-to-br ${getGradientColors()} text-white`
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
          `}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Trend/Change */}
      {(trend || change) && (
        <div className="flex items-center gap-2 mb-4">
          {trend && TrendIcon && (
            <span className={`
              flex items-center gap-1 text-sm font-medium
              ${trend.isPositive !== false && trend.value > 0
                ? 'text-green-600 dark:text-green-400'
                : trend.isPositive === false || trend.value < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
              }
            `}>
              <TrendIcon className="w-4 h-4" />
              {Math.abs(trend.value)}%
            </span>
          )}
          
          {trend?.label && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {trend.label}
            </span>
          )}
          
          {change && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {change}
            </span>
          )}
        </div>
      )}

      {/* Chart */}
      {chart && (
        <div className="-mx-4 -mb-4 mt-4">
          {chart}
        </div>
      )}
    </>
  );

  if (variant === 'gradient' && Icon) {
    return (
      <motion.div
        whileHover={onClick ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        className={`
          p-6 rounded-xl bg-gradient-to-br ${getGradientColors()}
          text-white shadow-lg
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-white/80 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold">
              {value}
            </h3>
          </div>

          {Icon && (
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        {(trend || change) && (
          <div className="flex items-center gap-2">
            {trend && TrendIcon && (
              <span className="flex items-center gap-1 text-sm font-medium text-white/90">
                <TrendIcon className="w-4 h-4" />
                {Math.abs(trend.value)}%
              </span>
            )}
            
            {trend?.label && (
              <span className="text-sm text-white/70">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        whileHover={onClick ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        className={`
          p-6 border-l-4 border-blue-500
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <Card
        onClick={onClick}
        className={`${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {content}
      </Card>
    </motion.div>
  );
};
