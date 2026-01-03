import React from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div className={`w-px h-full bg-border dark:bg-border ${className}`} />
    );
  }

  if (label) {
    return (
      <div className={`relative my-adaptive ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border dark:border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background dark:bg-background px-3 text-sm text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full border-t border-border dark:border-border ${className}`} />
  );
}
