export type TableAlign = 'start' | 'center' | 'end';

export type TableValue = string | number | Date;

export type TableColumn = {
  key: string;
  label: string;
  align?: TableAlign;
  formatting?: (value: TableValue) => string;
};

export type TableData = {
  key: string;
  value: TableValue;
};

export type TablePaginate = {};

export type TableProps = {
  id?: string;
  columns: TableColumn[];
  rows: TableData[][];
};
