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
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type TableColumnText = { type: 'column'; value: string };
export type TableColumnButton = {
  variant: Variants;
  label: string;
  icon?: Icons;
  action: () => void;
};
export type TableColumnButtons = { type: 'buttons'; buttons: TableColumnButton[] };
export type TableHeader = Array<{ value: string; fit?: boolean }>;
export type TableColumn = Array<TableColumnText | TableColumnButtons>;
export type TableRow = TableColumn[];
export type TablePaginator = { path: string; meta: any };
