import type { ChangeEventHandler } from 'react';

export type InputType = 'text' | 'number' | 'date' | 'time' | 'datetime-local';

export type InputValue = string | number | Date;

export type InputProps = {
  id: string;
  label: string;
  value?: InputValue;
  type?: InputType;
  placehoder?: string;
  message?: string;
  messageType?: 'warning' | 'danger';
  onChange?: ChangeEventHandler<HTMLInputElement>;
  parseFrom?: (value: InputValue) => string;
  parseTo?: (value: string) => InputValue;
  required?: boolean;
};
