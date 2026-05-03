import type { ButtonVariant } from './_button.types';
import type { PaginatorProps } from './_paginator.types';

export type TableAlign = 'start' | 'center' | 'end';

export type TableValue = string | number | Date;

export type TableDetails = Record<string, TableValue>;

export type TableFormatting = (value: TableValue) => string;

export type TableColumn = {
  key: string;
  label: string;
  align?: TableAlign;
  formatting?: TableFormatting;
};

export type TableData = {
  key: string;
  value: TableValue;
};

export type TableAction = {
  key: string;
  variant: ButtonVariant;
  icon: string;
  details?: TableDetails;
  onClick: (key: string, details?: TableDetails) => void;
};

export type TableProps = {
  id?: string;
  columns: TableColumn[];
  rows: TableData[][];
  paginate?: PaginatorProps;
  actions?: TableAction[];
};

export const DEFAULT_TABLE_FORMATTING = (value: TableValue): string => {
  return value.toString();
};
