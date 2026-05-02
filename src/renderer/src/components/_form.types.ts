import type { InputProps, InputValue } from '@widgets';
import type { FormEventHandler } from 'react';

export type FormProps = {
  controls?: InputProps[];
  data?: Record<string, InputValue>;
  enableClean?: boolean;
  enableCancel?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  onClean?: () => void;
  onCancel?: () => void;
};
