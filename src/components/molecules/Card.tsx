import React, { useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card dark:bg-card shadow-sm',
  elevated: 'bg-card dark:bg-card shadow-md',
  outlined: 'bg-transparent border-2 border-border dark:border-border',
  filled: 'bg-muted dark:bg-muted',
};

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'card-padding',
  lg: 'card-padding-lg',
  xl: 'card-padding-xl',
};

export const Card = React.memo<CardProps>(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  pressable = false,
  onPress,
  className = '',
}) => {
  const combinedClassName = useMemo(() => {
    const baseStyles = 'rounded-xl transition-all duration-200';
    const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02]' : '';
    const pressableStyles = pressable ? 'cursor-pointer active:scale-[0.98]' : '';

    return `
      ${baseStyles}
      ${variantStyles[variant]}
      ${paddingStyles[padding]}
      ${hoverStyles}
      ${pressableStyles}
      ${className}
    `;
  }, [variant, padding, hover, pressable, className]);

  const animationProps = useMemo(() => ({
    whileTap: pressable ? { scale: 0.98 } : undefined,
    whileHover: hover ? { scale: 1.02 } : undefined,
  }), [pressable, hover]);

  const handlePress = useCallback(() => {
    if (onPress) onPress();
  }, [onPress]);

  const Component = pressable ? motion.button : motion.div;

  return (
    <Component
      onClick={handlePress}
      className={combinedClassName}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

// Memoized Card sub-components
export const CardHeader = React.memo<{ children: React.ReactNode; className?: string }>(({ 
  children, 
  className = '' 
}) => (
  <div className={`mb-adaptive ${className}`}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardBody = React.memo<{ children: React.ReactNode; className?: string }>(({ 
  children, 
  className = '' 
}) => (
  <div className={className}>
    {children}
  </div>
));

CardBody.displayName = 'CardBody';

export const CardFooter = React.memo<{ children: React.ReactNode; className?: string }>(({ 
  children, 
  className = '' 
}) => (
  <div className={`mt-adaptive ${className}`}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Compound pattern
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;