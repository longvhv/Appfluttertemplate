import React from 'react';
import { motion } from 'motion/react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-none';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getDefaultSize = () => {
    switch (variant) {
      case 'circular':
        return { width: 40, height: 40 };
      case 'text':
        return { width: '100%', height: 16 };
      default:
        return { width: '100%', height: 100 };
    }
  };

  const defaultSize = getDefaultSize();
  const finalWidth = width || defaultSize.width;
  const finalHeight = height || defaultSize.height;

  const baseClasses = `bg-gray-200 dark:bg-gray-800 ${getVariantStyles()}`;

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'overflow-hidden relative',
    none: '',
  };

  if (animation === 'wave') {
    return (
      <div
        className={`${baseClasses} ${animationClasses.wave} ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${className}`}
      style={{ width: finalWidth, height: finalHeight }}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 dark:border-gray-800 rounded-xl ${className}`}>
    <div className="flex items-start gap-4">
      <SkeletonAvatar size={48} />
      <div className="flex-1 space-y-3">
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} />
        <Skeleton width="100%" height={80} variant="rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} width={`${100 / columns}%`} height={32} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} width={`${100 / columns}%`} height={48} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <SkeletonAvatar size={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonGrid: React.FC<{ items?: number; columns?: number; className?: string }> = ({
  items = 6,
  columns = 3,
  className = '',
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton height={200} variant="rounded" />
        <Skeleton width="80%" height={20} />
        <Skeleton width="60%" height={16} />
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC<{ fields?: number; className?: string }> = ({
  fields = 4,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton width="30%" height={14} />
        <Skeleton width="100%" height={40} variant="rounded" />
      </div>
    ))}
    <Skeleton width={120} height={40} variant="rounded" />
  </div>
);
