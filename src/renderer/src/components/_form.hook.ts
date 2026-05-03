import type { InputProps, InputValue, Validation } from '@widgets';
import { type ChangeEvent, type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';

import type { FormProps } from './_form.types';

export function useForm(props: FormProps) {
  const controls = props.controls ?? [];

  const initialData = useMemo(() => resolveInitialData(controls, props.data), [controls, props.data]);

  const [formData, setFormData] = useState<Record<string, InputValue>>(initialData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidationErrors({});
  }, [initialData]);

  const onFormSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      event.preventDefault();
      const submitResult = resolveSubmitResult(controls, formData);
      setValidationErrors(submitResult.errors);
      if (!submitResult.canSubmit) return;
      props.onSubmit(formData);
    },
    [controls, formData, props],
  );

  const onFormClean = useCallback(() => {
    setFormData(initialData);
    setValidationErrors({});
  }, [initialData]);

  const getValidations = useCallback(
    (id: string, validations: Validation[] | undefined): Validation[] => {
      const validationMessage = validationErrors[id];
      return validationMessage
        ? [{ rule: 'CUSTOM', message: validationMessage, customValidation: () => false }, ...(validations ?? [])]
        : (validations ?? []);
    },
    [validationErrors],
  );

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>, control: InputProps) => {
    const nextValue = resolveNextValue(control, event.currentTarget.value);

    setFormData((currentData) => ({ ...currentData, [control.id]: nextValue }));
    setValidationErrors((currentErrors) => {
      if (!currentErrors[control.id]) {
        return currentErrors;
      }

      const { [control.id]: _, ...rest } = currentErrors;
      return rest;
    });

    control.onChange?.(event);
  }, []);

  return {
    onFormSubmit,
    onFormClean,
    controls,
    formData,
    getValidations,
    onChange,
  };
}

export function resolveInitialData(
  controls: InputProps[],
  data: Record<string, InputValue> | undefined,
): Record<string, InputValue> {
  const nextData: Record<string, InputValue> = {};

  for (const control of controls) {
    const initialValue = data?.[control.id] ?? control.value;
    if (initialValue !== undefined) nextData[control.id] = initialValue;
  }

  return nextData;
}

export function validateControls(controls: InputProps[], data: Record<string, InputValue>): Record<string, string> {
  const nextErrors: Record<string, string> = {};

  for (const control of controls) {
    const controlValidations = control.validations ?? [];
    const value = data[control.id];

    for (const validation of controlValidations) {
      if (validation.rule === 'REQUIRED' && !isFilled(value)) {
        nextErrors[control.id] = validation.message;
        break;
      }

      if (validation.rule === 'CUSTOM' && validation.customValidation && !validation.customValidation(value)) {
        nextErrors[control.id] = validation.message;
        break;
      }
    }
  }

  return nextErrors;
}

export function resolveNextValue(control: InputProps, rawValue: string): InputValue {
  return control.parseTo ? control.parseTo(rawValue) : rawValue;
}

export function resolveSubmitResult(controls: InputProps[], data: Record<string, InputValue>) {
  const errors = validateControls(controls, data);
  return { errors, canSubmit: Object.keys(errors).length === 0 };
}

function isFilled(value: InputValue | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}
