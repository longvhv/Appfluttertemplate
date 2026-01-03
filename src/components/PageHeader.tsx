import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, subtitle, onBack, rightAction }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background dark:bg-background border-b border-border dark:border-border">
      <div className="max-w-lg mx-auto px-adaptive py-adaptive">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-adaptive flex-1">
            {onBack && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <div>
              <h1 className="text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </div>
  );
}