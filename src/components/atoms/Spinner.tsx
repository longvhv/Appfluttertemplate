import React from 'react';
import { motion } from 'motion/react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'current';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const colorStyles: Record<SpinnerColor, string> = {
  primary: 'border-indigo-600 border-t-transparent',
  secondary: 'border-muted-foreground border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
}: SpinnerProps) {
  const dimension = sizeStyles[size];

  return (
    <motion.div
      className={`border-2 rounded-full ${colorStyles[color]} ${className}`}
      style={{ width: dimension, height: dimension }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Loading overlay component
export function LoadingOverlay({ 
  visible, 
  text 
}: { 
  visible: boolean; 
  text?: string;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-card dark:bg-card rounded-2xl p-6 flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        {text && <p className="text-foreground">{text}</p>}
      </div>
    </div>
  );
}
