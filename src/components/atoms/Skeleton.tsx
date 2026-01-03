import React from 'react';
import { motion } from 'motion/react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const defaultHeights = {
    text: '1rem',
    circular: '3rem',
    rectangular: '3rem',
    rounded: '3rem',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? defaultHeights[variant] : '100%'),
    height: height || defaultHeights[variant],
  };

  const baseClass = `
    bg-muted dark:bg-muted
    ${variantStyles[variant]}
    ${className}
  `;

  if (animation === 'pulse') {
    return (
      <motion.div
        className={baseClass}
        style={style}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }

  if (animation === 'wave') {
    return (
      <div className={`${baseClass} relative overflow-hidden`} style={style}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return <div className={baseClass} style={style} />;
}

// Pre-built skeleton patterns
export function SkeletonText({ 
  lines = 3, 
  lastLineWidth = '60%' 
}: { 
  lines?: number; 
  lastLineWidth?: string;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ 
  showImage = true,
  showTitle = true,
  showDescription = true,
  lines = 2,
}: {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
}) {
  return (
    <div className="bg-card dark:bg-card rounded-xl p-4 space-y-4">
      {showImage && <Skeleton variant="rounded" height="12rem" />}
      {showTitle && <Skeleton variant="text" width="60%" height="1.5rem" />}
      {showDescription && <SkeletonText lines={lines} />}
    </div>
  );
}

export function SkeletonAvatar({ 
  size = 'md' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl' 
}) {
  const sizes = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
    xl: '5rem',
  };

  return (
    <Skeleton
      variant="circular"
      width={sizes[size]}
      height={sizes[size]}
    />
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 p-4">
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export function SkeletonList({ 
  items = 3 
}: { 
  items?: number 
}) {
  return (
    <div className="divide-y divide-border dark:divide-border">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

export function SkeletonButton({ 
  width = '6rem',
  height = '2.5rem',
}: {
  width?: string;
  height?: string;
}) {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
    />
  );
}

// Full page skeleton
export function SkeletonPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" height="2rem" />
        <Skeleton variant="text" width="60%" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* List */}
      <SkeletonList items={5} />
    </div>
  );
}
