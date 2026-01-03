import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Input from '../atoms/Input';
import { InputComponentProps } from '../atoms/Input';

/**
 * FormField Component - React Native
 * 
 * Enhanced with validation logic to match web
 */

export interface FormFieldProps extends Omit<InputComponentProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | undefined;
  };
  showValidation?: boolean;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  value,
  onChangeText,
  validationRules,
  showValidation = true,
  style,
  ...inputProps
}) => {
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

  const handleChangeText = (newValue: string) => {
    onChangeText(newValue);
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
    <View style={style}>
      <Input
        {...inputProps}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        error={touched && showValidation ? error : undefined}
      />
    </View>
  );
};

export default FormField;