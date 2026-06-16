export type Variants =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

export type Icons = 'cursor-fill' | 'pencil-fill' | 'trash3-fill';

export type ButtonTypes = 'button' | 'submit' | 'reset';

export type InputTypes =
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'radio'
  | 'range'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type FormControlTypes = InputTypes | 'dropdown' | 'textarea';

export type ModelValueTypes = string | number | boolean | Date;

export type ErrorType = Record<string, string | undefined>;
