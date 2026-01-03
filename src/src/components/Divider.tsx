import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  spacing = 'md',
  label,
  labelPosition = 'center',
  className = '',
}: DividerProps) {
  const thicknesses = {
    thin: orientation === 'horizontal' ? 'border-t' : 'border-l',
    medium:
      orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
    thick:
      orientation === 'horizontal' ? 'border-t-4' : 'border-l-4',
  };

  const variants = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const spacings = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  };

  if (label && orientation === 'horizontal') {
    const positions = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div
        className={`
          flex items-center
          ${positions[labelPosition]}
          ${spacings[spacing]}
          ${className}
        `}
      >
        {labelPosition !== 'left' && (
          <div
            className={`
              flex-1
              ${thicknesses[thickness]}
              ${variants[variant]}
              border-gray-200 dark:border-gray-700
              ${labelPosition === 'center' ? 'mr-4' : ''}
            `}
          />
        )}

        <span className="px-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {label}
        </span>

        {labelPosition !== 'right' && (
          <div
            className={`
              flex-1
              ${thicknesses[thickness]}
              ${variants[variant]}
              border-gray-200 dark:border-gray-700
              ${labelPosition === 'center' ? 'ml-4' : ''}
            `}
          />
        )}
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={`
          ${thicknesses[thickness]}
          ${variants[variant]}
          ${spacings[spacing]}
          border-gray-200 dark:border-gray-700
          ${className}
        `}
        style={{ height: '100%', minHeight: '24px' }}
      />
    );
  }

  return (
    <hr
      className={`
        ${thicknesses[thickness]}
        ${variants[variant]}
        ${spacings[spacing]}
        border-gray-200 dark:border-gray-700
        ${className}
      `}
    />
  );
}
