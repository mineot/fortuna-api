import type { ChangeEvent } from 'react';

import type { InputProps, InputValue, Validation } from './_input.types';

export function useInput(props: InputProps) {
  const toInputString = (value: InputValue | undefined): string => {
    if (value === undefined) return '';
    if (value instanceof Date) return value.toISOString();
    return String(value);
  };

  const resolveValidationMessage = (validations: Validation[], value: InputValue | undefined): string | undefined => {
    for (const validation of validations) {
      if (!validation.customValidation(value)) return validation.message;
    }

    return undefined;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;

    if (!props.parseTo) {
      props.onChange(event);
      return;
    }

    const parsedValue = props.parseTo(event.target.value);
    const nextStringValue = props.parseFrom ? props.parseFrom(parsedValue) : toInputString(parsedValue);

    event.target.value = nextStringValue;
    event.currentTarget.value = nextStringValue;
    props.onChange(event);
  };

  const inputValue = props.parseFrom ? props.parseFrom(props.value ?? '') : toInputString(props.value);
  const validations = props.validations ?? [];
  const required = validations.some((validation) => validation.rule === 'REQUIRED');
  const validationMessage = resolveValidationMessage(validations, props.value);

  return { required, inputValue, validationMessage, handleChange };
}
