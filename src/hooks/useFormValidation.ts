
import { useState } from 'react';

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    match?: string;
    message?: string;
  };
}

export interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = (initialValues: Record<string, string>, rules: ValidationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Validate field on change if it has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const rule = rules[name];
    let error = '';

    if (!rule) return;

    if (rule.required && !value) {
      error = rule.message || 'This field is required';
    } else if (rule.minLength && value.length < rule.minLength) {
      error = rule.message || `Must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      error = rule.message || `Must be no more than ${rule.maxLength} characters`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      error = rule.message || 'Invalid format';
    } else if (rule.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      error = rule.message || 'Invalid email address';
    } else if (rule.match && values[rule.match] !== value) {
      error = rule.message || 'Passwords do not match';
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));

    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {};
    const newTouched: Record<string, boolean> = {};

    // Mark all fields as touched
    Object.keys(rules).forEach(field => {
      newTouched[field] = true;
      const isFieldValid = validateField(field, values[field]);
      if (!isFieldValid) {
        isValid = false;
        newErrors[field] = errors[field] || 'This field is invalid';
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
};
