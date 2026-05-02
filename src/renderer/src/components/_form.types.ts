import type { InputProps, InputValue } from '@widgets';

export type FormProps = {
  controls?: InputProps[];
  data?: Record<string, InputValue>;
  onSubmit: (data: Record<string, InputValue>) => void;
  onCancel?: () => void;
};
