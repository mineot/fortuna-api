export type InputProps = {
  id: string;
  label: string;
  message?: string;
  value?: string;
  onChange?: (value: string) => void;
  warning?: boolean;
  error?: boolean;
  required?: boolean;
};
