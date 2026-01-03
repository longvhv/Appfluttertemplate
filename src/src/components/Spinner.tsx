import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
  label?: string;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  label,
}: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    white: 'text-white',
    current: 'text-current',
  };

  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
}

// Full page spinner overlay
export function SpinnerOverlay({
  label = 'Loading...',
}: {
  label?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" color="primary" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Inline container spinner
export function SpinnerContainer({
  label = 'Loading...',
  minHeight = '200px',
}: {
  label?: string;
  minHeight?: string;
}) {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <Spinner size="lg" color="primary" label={label} />
    </div>
  );
}
