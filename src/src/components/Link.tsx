import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'primary' | 'subtle' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  showExternalIcon?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Link({
  variant = 'default',
  size = 'md',
  external = false,
  showExternalIcon = true,
  disabled = false,
  children,
  className = '',
  ...props
}: LinkProps) {
  const variants = {
    default: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300',
    primary: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold',
    subtle: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    underline: 'text-gray-900 dark:text-white underline hover:text-indigo-600 dark:hover:text-indigo-400',
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  if (disabled) {
    return (
      <span
        className={`
          ${sizes[size]}
          text-gray-400 dark:text-gray-500
          cursor-not-allowed
          ${className}
        `}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      {...externalProps}
      className={`
        inline-flex items-center gap-1.5
        ${sizes[size]}
        ${variants[variant]}
        transition-colors
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
      {external && showExternalIcon && (
        <ExternalLink className="w-3.5 h-3.5" />
      )}
    </a>
  );
}
