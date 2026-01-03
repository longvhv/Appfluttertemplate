/**
 * Form Utilities for React Native
 * 
 * Provides form helpers and state management
 */

import { useState, useCallback, useRef, useMemo } from 'react';

/**
 * Form field type
 */
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

/**
 * Form state type
 */
export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValidating: boolean;
}

/**
 * Form options
 */
export interface FormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>> | Promise<Partial<Record<keyof T, string>>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Form hook
 */
export function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
  const {
    initialValues,
    onSubmit,
    validate,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    isValidating: false,
  });

  const initialValuesRef = useRef(initialValues);

  const setFieldValue = useCallback(async (field: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      dirty: { ...prev.dirty, [field]: true },
    }));

    if (validateOnChange && validate) {
      setState(prev => ({ ...prev, isValidating: true }));
      const newValues = { ...state.values, [field]: value };
      const errors = await validate(newValues);
      setState(prev => ({
        ...prev,
        errors: errors || {},
        isValidating: false,
      }));
    }
  }, [validate, validateOnChange, state.values]);

  const setFieldTouched = useCallback(async (field: keyof T, touched: boolean = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));

    if (validateOnBlur && validate && touched) {
      setState(prev => ({ ...prev, isValidating: true }));
      const errors = await validate(state.values);
      setState(prev => ({
        ...prev,
        errors: errors || {},
        isValidating: false,
      }));
    }
  }, [validate, validateOnBlur, state.values]);

  const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const validateForm = useCallback(async () => {
    if (!validate) return true;

    setState(prev => ({ ...prev, isValidating: true }));
    const errors = await validate(state.values);
    setState(prev => ({
      ...prev,
      errors: errors || {},
      isValidating: false,
    }));

    return Object.keys(errors || {}).length === 0;
  }, [validate, state.values]);

  const handleSubmit = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    // Mark all fields as touched
    const allTouched = Object.keys(state.values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setState(prev => ({ ...prev, touched: allTouched }));

    const isValid = await validateForm();

    if (isValid) {
      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setState(prev => ({ ...prev, isSubmitting: false }));
  }, [state.values, validateForm, onSubmit]);

  const reset = useCallback((values?: T) => {
    setState({
      values: values || initialValuesRef.current,
      errors: {},
      touched: {},
      dirty: {},
      isSubmitting: false,
      isValidating: false,
    });
  }, []);

  const setValues = useCallback((values: T | ((prev: T) => T)) => {
    setState(prev => ({
      ...prev,
      values: typeof values === 'function' ? values(prev.values) : values,
    }));
  }, []);

  const setErrors = useCallback((errors: Partial<Record<keyof T, string>>) => {
    setState(prev => ({ ...prev, errors }));
  }, []);

  const getFieldProps = useCallback((field: keyof T) => ({
    value: state.values[field],
    onChangeText: (value: any) => setFieldValue(field, value),
    onBlur: () => setFieldTouched(field),
    error: state.touched[field] ? state.errors[field] : undefined,
  }), [state, setFieldValue, setFieldTouched]);

  const isValid = useMemo(
    () => Object.keys(state.errors).length === 0,
    [state.errors]
  );

  const isDirty = useMemo(
    () => Object.keys(state.dirty).some(key => state.dirty[key as keyof T]),
    [state.dirty]
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    isSubmitting: state.isSubmitting,
    isValidating: state.isValidating,
    isValid,
    isDirty,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    setValues,
    setErrors,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

/**
 * Multi-step form hook
 */
export function useMultiStepForm<T extends Record<string, any>>(
  steps: Array<{
    name: string;
    fields: Array<keyof T>;
    validate?: (values: Partial<T>) => Partial<Record<keyof T, string>> | Promise<Partial<Record<keyof T, string>>>;
  }>,
  initialValues: T
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const currentStepConfig = useMemo(() => steps[currentStep], [steps, currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const next = useCallback(async () => {
    const { validate } = currentStepConfig;

    if (validate) {
      const validationErrors = await validate(formData);
      setErrors(validationErrors || {});

      if (Object.keys(validationErrors || {}).length > 0) {
        return false;
      }
    }

    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
      return true;
    }

    return true;
  }, [currentStepConfig, formData, isLastStep]);

  const prev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  const goTo = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep, steps.length]
  );

  return {
    currentStep,
    currentStepConfig,
    formData,
    errors,
    isFirstStep,
    isLastStep,
    progress,
    next,
    prev,
    goTo,
    updateField,
    reset,
  };
}

/**
 * Form array hook (for dynamic fields)
 */
export function useFormArray<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);

  const append = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const prepend = useCallback((item: T) => {
    setItems(prev => [item, ...prev]);
  }, []);

  const remove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setItems(prev => [
      ...prev.slice(0, index),
      item,
      ...prev.slice(index),
    ]);
  }, []);

  const update = useCallback((index: number, item: T) => {
    setItems(prev => prev.map((prevItem, i) => i === index ? item : prevItem));
  }, []);

  const move = useCallback((from: number, to: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const [item] = newItems.splice(from, 1);
      newItems.splice(to, 0, item);
      return newItems;
    });
  }, []);

  const swap = useCallback((indexA: number, indexB: number) => {
    setItems(prev => {
      const newItems = [...prev];
      [newItems[indexA], newItems[indexB]] = [newItems[indexB], newItems[indexA]];
      return newItems;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const reset = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    append,
    prepend,
    remove,
    insert,
    update,
    move,
    swap,
    clear,
    reset,
  };
}

/**
 * Form persistence hook (saves to AsyncStorage)
 */
export function useFormPersistence<T extends Record<string, any>>(
  key: string,
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  // Note: In a real app, you'd use AsyncStorage here
  const save = useCallback(async (data: T) => {
    setIsLoading(true);
    try {
      // await AsyncStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(key, JSON.stringify(data));
      setValues(data);
    } catch (error) {
      console.error('Failed to save form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      // const stored = await AsyncStorage.getItem(key);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setValues(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    } finally {
      setIsLoading(false);
    }
    return initialValues;
  }, [key, initialValues]);

  const clear = useCallback(async () => {
    setIsLoading(true);
    try {
      // await AsyncStorage.removeItem(key);
      localStorage.removeItem(key);
      setValues(initialValues);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValues]);

  return {
    values,
    isLoading,
    save,
    load,
    clear,
  };
}

/**
 * Auto-save hook
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void | Promise<void>,
  delay: number = 1000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave]);

  // Auto-save on data change
  useState(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  return {
    isSaving,
    lastSaved,
    save,
  };
}

/**
 * Form touched helper
 */
export function touchAllFields<T extends Record<string, any>>(
  values: T
): Record<keyof T, boolean> {
  return Object.keys(values).reduce(
    (acc, key) => ({ ...acc, [key]: true }),
    {} as Record<keyof T, boolean>
  );
}

/**
 * Get changed fields
 */
export function getChangedFields<T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in current) {
    if (current[key] !== original[key]) {
      changed[key] = current[key];
    }
  }

  return changed;
}

/**
 * Deep compare objects
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
