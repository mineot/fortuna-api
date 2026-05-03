import {
  DEFAULT_TABLE_FORMATTING,
  type TableAlign,
  type TableDetails,
  type TableFormatting,
  type TableProps,
} from './table.types';

export function useTable(props: TableProps) {
  const getAlign = (align?: TableAlign): string => {
    return align ? `text-${align}` : 'text-start';
  };

  const findAlignByKey = (key: string): string => {
    const column = props.columns.find((column) => column.key === key);
    return getAlign(column?.align);
  };

  const findFormattingByKey = (key: string): TableFormatting => {
    const column = props.columns.find((column) => column.key === key);
    return column?.formatting ?? DEFAULT_TABLE_FORMATTING;
  };

  const rowToDetails = (rowData: TableProps['rows'][number]['data']): TableDetails => {
    return rowData.reduce<TableDetails>((details, data) => {
      details[data.key] = data.value;
      return details;
    }, {});
  };

  return {
    findAlignByKey,
    findFormattingByKey,
    getAlign,
    rowToDetails,
  };
}
