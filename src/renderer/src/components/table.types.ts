export type TableValue = string | number | Date;

export type TableHeader = {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
};

export type TableColumn = {
  key: string;
  value: TableValue;
  formatter: (value: TableValue) => string;
};

export type TableAction = {
  key: string;
  icon: string;
  details: unknown;
  onClick?: (key: string, details: unknown) => void;
};

export type TableProps = {
  id?: string;
  headers: TableHeader[];
  rows: TableColumn[][];
  actionable?: boolean;
  actions?: TableAction[];
};
