export type ButtonDetail = {
  key: string;
  value: unknown;
};

export type Button = {
  id: string;
  type: 'button';
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger';
  label: string;
  details?: ButtonDetail[];
  click: (event: Event, details?: ButtonDetail[]) => void;
};
