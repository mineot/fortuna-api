export type Variant = 'success' | 'warning' | 'info' | 'error';

export type Icon = 'bi-check-lg' | 'bi-exclamation-lg' | 'bi-info-lg' | 'bi-ban' | null;

export type Toast = {
  variant: Variant;
  message: string;
  details?: string[];
};

export const Icons: Record<Variant, Icon> = {
  success: 'bi-check-lg',
  warning: 'bi-exclamation-lg',
  info: 'bi-info-lg',
  error: 'bi-ban',
};

export const Backgrounds: Record<Variant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  error: 'bg-danger',
};

export const Texts: Record<Variant, string> = {
  success: 'text-white',
  warning: 'text-black',
  info: 'text-white',
  error: 'text-white',
};
