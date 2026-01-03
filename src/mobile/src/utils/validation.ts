/**
 * Validation Utilities for React Native
 * 
 * Provides validation helpers and hooks for forms
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Validation rule type
 */
export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: any) => boolean | string;
  custom?: (value: any) => boolean | string;
}

/**
 * Field error type
 */
export interface FieldError {
  type: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, FieldError | undefined>;
}

/**
 * Email validation
 */
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL validation
 */
export function isURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return urlRegex.test(url);
}

/**
 * Phone number validation (US format)
 */
export function isPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function isCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Strong password validation
 */
export function isStrongPassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
}

/**
 * Alphanumeric validation
 */
export function isAlphanumeric(value: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
}

/**
 * Numeric validation
 */
export function isNumeric(value: string): boolean {
  const numericRegex = /^\d+$/;
  return numericRegex.test(value);
}

/**
 * Date validation (YYYY-MM-DD)
 */
export function isDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime());
}

/**
 * Validate a single field
 */
export function validateField(value: any, rules: ValidationRule): FieldError | undefined {
  // Required validation
  if (rules.required) {
    const isEmpty = value === undefined || value === null || value === '';
    if (isEmpty) {
      const message = typeof rules.required === 'string' 
        ? rules.required 
        : 'This field is required';
      return { type: 'required', message };
    }
  }

  // Skip other validations if value is empty (and not required)
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  // MinLength validation
  if (rules.minLength && typeof value === 'string') {
    if (value.length < rules.minLength.value) {
      return { type: 'minLength', message: rules.minLength.message };
    }
  }

  // MaxLength validation
  if (rules.maxLength && typeof value === 'string') {
    if (value.length > rules.maxLength.value) {
      return { type: 'maxLength', message: rules.maxLength.message };
    }
  }

  // Min validation
  if (rules.min && typeof value === 'number') {
    if (value < rules.min.value) {
      return { type: 'min', message: rules.min.message };
    }
  }

  // Max validation
  if (rules.max && typeof value === 'number') {
    if (value > rules.max.value) {
      return { type: 'max', message: rules.max.message };
    }
  }

  // Pattern validation
  if (rules.pattern) {
    if (!rules.pattern.value.test(String(value))) {
      return { type: 'pattern', message: rules.pattern.message };
    }
  }

  // Custom validation
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) {
      const message = typeof result === 'string' ? result : 'Validation failed';
      return { type: 'validate', message };
    }
  }

  // Alias for custom
  if (rules.custom) {
    const result = rules.custom(value);
    if (result !== true) {
      const message = typeof result === 'string' ? result : 'Validation failed';
      return { type: 'custom', message };
    }
  }

  return undefined;
}

/**
 * Validate multiple fields
 */
export function validateFields(
  values: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const errors: Record<string, FieldError | undefined> = {};
  let valid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(values[field], fieldRules);
    if (error) {
      errors[field] = error;
      valid = false;
    }
  }

  return { valid, errors };
}

/**
 * Form validation hook
 */
export function useValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<keyof T, ValidationRule>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, FieldError | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate on change if field has been touched
    if (touched[field as string]) {
      const error = validateField(value, rules[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touched, rules]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const error = validateField(values[field], rules[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [values, rules]);

  const validateForm = useCallback(() => {
    const result = validateFields(values, rules);
    setErrors(result.errors);
    return result.valid;
  }, [values, rules]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => 
      async (e?: any) => {
        e?.preventDefault?.();

        setIsSubmitting(true);
        const isValid = validateForm();

        if (isValid) {
          try {
            await onSubmit(values);
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setIsSubmitting(false);
          // Mark all fields as touched to show errors
          const allTouched = Object.keys(rules).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          );
          setTouched(allTouched);
        }
      },
    [values, rules, validateForm]
  );

  const reset = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldError = useCallback((field: keyof T, error: FieldError | undefined) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isValid = useMemo(
    () => Object.keys(errors).every(key => !errors[key]),
    [errors]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    setFieldError,
    validateForm,
    handleSubmit,
    reset,
    clearErrors,
  };
}

/**
 * Field validation hook
 */
export function useFieldValidation(
  initialValue: any,
  rules: ValidationRule
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<FieldError | undefined>();
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    const validationError = validateField(value, rules);
    setError(validationError);
    return !validationError;
  }, [value, rules]);

  const handleChange = useCallback((newValue: any) => {
    setValue(newValue);
    if (touched) {
      const validationError = validateField(newValue, rules);
      setError(validationError);
    }
  }, [touched, rules]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: !error,
    setValue: handleChange,
    onBlur: handleBlur,
    validate,
    reset,
  };
}

/**
 * Common validation rules
 */
export const commonRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },
  strongPassword: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    validate: (value: string) => 
      isStrongPassword(value) || 
      'Password must contain uppercase, lowercase, number and special character',
  },
  phone: {
    required: 'Phone number is required',
    validate: (value: string) => 
      isPhoneNumber(value) || 'Invalid phone number',
  },
  url: {
    pattern: {
      value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
      message: 'Invalid URL',
    },
  },
  number: {
    validate: (value: any) => 
      !isNaN(Number(value)) || 'Must be a number',
  },
  positiveNumber: {
    validate: (value: any) => 
      (!isNaN(Number(value)) && Number(value) > 0) || 'Must be a positive number',
  },
};
