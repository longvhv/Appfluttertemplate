import React from 'react';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
export type TextColor = 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
export type TextAlign = 'left' | 'center' | 'right';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: TextWeight;
  className?: string;
  numberOfLines?: number; // For truncation
}

const variantStyles: Record<TextVariant, { tag: keyof JSX.IntrinsicElements; className: string }> = {
  h1: { tag: 'h1', className: 'text-3xl' },
  h2: { tag: 'h2', className: 'text-2xl' },
  h3: { tag: 'h3', className: 'text-xl' },
  h4: { tag: 'h4', className: 'text-lg' },
  body: { tag: 'p', className: 'text-base' },
  caption: { tag: 'span', className: 'text-sm' },
  label: { tag: 'label', className: 'text-sm' },
};

const colorStyles: Record<TextColor, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-indigo-600 dark:text-indigo-400',
  secondary: 'text-purple-600 dark:text-purple-400',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-orange-600 dark:text-orange-400',
};

const alignStyles: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const weightStyles: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function Text({
  children,
  variant = 'body',
  color = 'default',
  align = 'left',
  weight = 'normal',
  className = '',
  numberOfLines,
}: TextProps) {
  const { tag: Tag, className: variantClassName } = variantStyles[variant];
  
  const truncateStyles = numberOfLines
    ? `line-clamp-${numberOfLines} overflow-hidden`
    : '';
  
  const combinedClassName = `
    ${variantClassName}
    ${colorStyles[color]}
    ${alignStyles[align]}
    ${weightStyles[weight]}
    ${truncateStyles}
    ${className}
  `.trim();

  return (
    <Tag className={combinedClassName}>
      {children}
    </Tag>
  );
}
