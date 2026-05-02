import type { ChangeEventHandler } from 'react';

export type InputProps = {
  id: string;
  label: string;
  value?: string;
  type?: 'text';
  placehoder?: string;
  message?: string;
  messageType?: 'warning' | 'danger';
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
};
