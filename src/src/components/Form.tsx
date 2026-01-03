import React, { createContext, useContext, FormHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Form Context
interface FormContextValue {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const FormContext = createContext<FormContextValue>({});

export const useFormContext = () => useContext(FormContext);

// Form Container
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export function Form({
  size = 'md',
  disabled = false,
  children,
  className = '',
  ...props
}: FormProps) {
  return (
    <FormContext.Provider value={{ size, disabled }}>
      <form className={`space-y-6 ${className}`} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// FormField - wrapper for form inputs
export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

// FormLabel
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

export function FormLabel({
  required = false,
  optional = false,
  children,
  className = '',
  ...props
}: FormLabelProps) {
  const { size } = useFormContext();

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <label
      className={`
        block font-medium text-gray-700 dark:text-gray-300
        ${sizes[size || 'md']}
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && (
        <span className="text-gray-400 dark:text-gray-500 ml-2 font-normal">
          (Optional)
        </span>
      )}
    </label>
  );
}

// FormControl - wrapper for input elements
export interface FormControlProps {
  children: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormControl({
  children,
  error = false,
  disabled = false,
  className = '',
}: FormControlProps) {
  const contextDisabled = useFormContext().disabled;
  const isDisabled = disabled || contextDisabled;

  return (
    <div
      className={`
        relative
        ${error ? 'form-control-error' : ''}
        ${isDisabled ? 'form-control-disabled' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// FormHelperText
export interface FormHelperTextProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function FormHelperText({
  children,
  icon,
  className = '',
}: FormHelperTextProps) {
  const { size } = useFormContext();

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-start gap-1.5 ${sizes[size || 'md']} text-gray-500 dark:text-gray-400 ${className}`}>
      {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

// FormErrorMessage
export interface FormErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export function FormErrorMessage({
  children,
  className = '',
}: FormErrorMessageProps) {
  const { size } = useFormContext();

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`
        flex items-start gap-1.5
        ${sizes[size || 'md']}
        text-red-600 dark:text-red-400
        ${className}
      `}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

// FormSuccessMessage
export interface FormSuccessMessageProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSuccessMessage({
  children,
  className = '',
}: FormSuccessMessageProps) {
  const { size } = useFormContext();

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={`
        flex items-start gap-1.5
        ${sizes[size || 'md']}
        text-green-600 dark:text-green-400
        ${className}
      `}
    >
      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

// FormSection - for grouping form fields
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// FormActions - for form buttons
export interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'stretch';
  className?: string;
}

export function FormActions({
  children,
  align = 'right',
  className = '',
}: FormActionsProps) {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    stretch: 'justify-stretch',
  };

  return (
    <div
      className={`
        flex items-center gap-3
        ${alignments[align]}
        pt-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}
