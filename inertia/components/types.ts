// FIXME: keep here only generic types

// GENERAL

export type ButtonTypes = 'button' | 'submit' | 'reset' | 'icon';
export type ErrorType = Record<string, string | undefined>;
export type AlignTypes = 'left' | 'center' | 'right';

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

export type InputTypes =
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

// TABLE

export type TableDataActionTypes = 'edit' | 'delete';

export type TableDataAction = {
  type: TableDataActionTypes;
  title: string;
  onAction: (action: TableDataActionTypes, value: any) => void;
};

export type TableData = {
  type: 'column' | 'action';
  key: string;
  align?: AlignTypes;
  actions?: TableDataAction[];
};

export type TableHeader = TableData & { label?: string };
export type TableRow = TableData & { value: any };
export type TableMeta = { total: number; lastPage: number; currentPage: number };

// FORM MODAL

export type FormModalTitle = { create: string; edit: string };
export type FormControlTypes = InputTypes | 'select' | 'textarea';

export type FormModalControl = {
  id: string;
  name: string;
  type: FormControlTypes;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  defaultValue?: any;
};

export type FormModalControlType = Record<string, FormModalControl>;

export type ModalAction = {
  variant: Variants;
  closeModal: boolean;
  label: string;
  icon?: string;
  loading?: boolean;
  title?: string;
  click?: () => void;
};
