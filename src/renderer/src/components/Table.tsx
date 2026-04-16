import { useMemo } from 'react';
import type { FormatterValue } from '../helpers/formatter.helper';

type Key = string;
type Label = string;
type Align = 'left' | 'center' | 'right';

type Formater = (value: FormatterValue) => string;

type Header = {
  key: Key;
  label: Label;
  align?: Align;
};

type Row = {
  key: Key;
  value: FormatterValue;
  formater?: Formater;
};

type TableProps = {
  headers: Header[];
  rows: Row[][];
};

function getAlign(align?: Align) {
  switch (align) {
    case 'center':
      return 'table-align-center';
    case 'right':
      return 'table-align-right';
    case 'left':
    default:
      return 'table-align-left';
  }
}

export function Table(props: TableProps) {
  const headers = useMemo(() => {
    return props.headers.map((header) => {
      return (
        <th className={getAlign(header.align)} key={header.key}>
          {header.label}
        </th>
      );
    });
  }, [props.headers]);

  const rows = useMemo(() => {
    return props.rows.map((cols) => {
      const columns = cols.map((col) => {
        const header: Header = props.headers.find((h) => h.key === col.key) ?? { key: col.key, label: 'None' };

        return (
          <td className={getAlign(header.align)} key={col.key}>
            {col.formater ? col.formater(col.value) : String(col.value)}
          </td>
        );
      });
      return <tr key={cols.toString()}>{columns}</tr>;
    });
  }, [props.rows]);

  return (
    <table className="table">
      <thead className="table-head">
        <tr>{headers}</tr>
      </thead>
      <tbody className="table-body">{rows}</tbody>
    </table>
  );
}
