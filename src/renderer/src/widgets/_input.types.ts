import type { ChangeEventHandler } from 'react';

export type InputType = 'text' | 'number' | 'date' | 'time' | 'datetime-local';

export type InputValue = string | number | Date;

export type Validation = {
  rule: 'REQUIRED' | 'CUSTOM';
  message: string;
  customValidation(value: InputValue | undefined): boolean;
};

export type InputProps = {
  id: string;
  label: string;
  value?: InputValue;
  type?: InputType;
  placehoder?: string;
  validations?: Validation[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  parseFrom?: (value: InputValue) => string;
  parseTo?: (value: string) => InputValue;
};
