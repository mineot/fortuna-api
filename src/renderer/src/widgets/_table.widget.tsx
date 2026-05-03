import { Button } from '@widgets';
import { DEFAULT_TABLE_FORMATTING, type TableAlign, type TableFormatting, type TableProps } from './_table.types';
import { Paginator } from '@widgets';
import { useTranslation } from 'react-i18next';

export function Table(props: TableProps) {
  const { t } = useTranslation();

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

  return (
    <div className="d-flex flex-column gap-2">
      <table className="table table-sm table-hover m-0">
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th scope="col" className={getAlign(column.align)} key={column.key}>
                <span>{column.label}</span>
              </th>
            ))}
            {props.actions && <th scope="col"></th>}
          </tr>
        </thead>
        <tbody>
          {props.rows.length === 0 && (
            <tr>
              <td className="text-center">
                <span>{t('common.noRecords')}</span>
              </td>
            </tr>
          )}
          {props.rows.map((row) => (
            <tr className="align-middle">
              {row.map((data) => (
                <td className={findAlignByKey(data.key)}>
                  <span>{findFormattingByKey(data.key)(data.value)}</span>
                </td>
              ))}
              {props.actions && (
                <td className="d-flex gap-2 align-items-center justify-content-center">
                  {props.actions.map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant}
                      icon={action.icon}
                      onClick={() => action.onClick(action.key, action.details)}
                    />
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {props.paginate && (
        <Paginator
          page={props.paginate.page}
          pageSize={props.paginate.pageSize}
          total={props.paginate.total}
          totalPages={props.paginate.totalPages}
          hasNextPage={props.paginate.hasNextPage}
          hasPrevPage={props.paginate.hasPrevPage}
          startItem={props.paginate.startItem}
          endItem={props.paginate.endItem}
          onPageChange={props.paginate.onPageChange}
        />
      )}
    </div>
  );
}
