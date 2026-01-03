import React from 'react';
import { Input, InputProps } from '../atoms/Input';

export interface FormFieldProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | undefined;
  };
  showValidation?: boolean;
}

export function FormField({
  value,
  onChange,
  validationRules,
  showValidation = true,
  ...inputProps
}: FormFieldProps) {
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const validate = React.useCallback((val: string) => {
    if (!validationRules) return undefined;

    if (validationRules.required && !val.trim()) {
      return 'This field is required';
    }

    if (validationRules.minLength && val.length < validationRules.minLength) {
      return `Minimum ${validationRules.minLength} characters required`;
    }

    if (validationRules.maxLength && val.length > validationRules.maxLength) {
      return `Maximum ${validationRules.maxLength} characters allowed`;
    }

    if (validationRules.pattern && !validationRules.pattern.test(val)) {
      return 'Invalid format';
    }

    if (validationRules.custom) {
      return validationRules.custom(val);
    }

    return undefined;
  }, [validationRules]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (touched && showValidation) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (showValidation) {
      const validationError = validate(value);
      setError(validationError);
    }
  };

  return (
    <div onBlur={handleBlur}>
      <Input
        {...inputProps}
        value={value}
        onChange={handleChange}
        error={touched && showValidation ? error : undefined}
      />
    </div>
  );
}
