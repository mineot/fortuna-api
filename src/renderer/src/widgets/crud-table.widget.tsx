import type { CrudTable } from './crud-table.types';

type CrudTableProps = {
  config?: CrudTable;
};

export function CrudTableWidget({ config }: CrudTableProps) {
  return <div className="crud-table-widget"></div>;
}
