import { Button } from '@widgets';
import { type TableProps } from './_table.types';
import { Paginator } from '@widgets';
import { useTranslation } from 'react-i18next';
import { useTable } from './_table.hook';

export function Table(props: TableProps) {
  const { t } = useTranslation();
  const { findAlignByKey, findFormattingByKey, getAlign, rowToDetails } = useTable(props);

  return (
    <div className="d-flex flex-column gap-2">
      <table id={props.id} className="table table-sm table-hover m-0">
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th scope="col" className={getAlign(column.align)} key={column.key}>
                <span>{column.label}</span>
              </th>
            ))}
            {props.actions?.length ? <th scope="col"></th> : null}
          </tr>
        </thead>
        <tbody>
          {props.rows.length === 0 && (
            <tr>
              <td className="text-center" colSpan={Math.max(1, props.columns.length + (props.actions?.length ? 1 : 0))}>
                <span>{t('common.noRecords')}</span>
              </td>
            </tr>
          )}
          {props.rows.map((row) => (
            <tr className="align-middle" key={row.rowId}>
              {row.data.map((data, cellIndex) => (
                <td className={findAlignByKey(data.key)} key={`${data.key}-${cellIndex}`}>
                  <span>{findFormattingByKey(data.key)(data.value)}</span>
                </td>
              ))}
              {props.actions?.length ? (
                <td className="d-flex gap-2 align-items-center justify-content-center">
                  {props.actions.map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant}
                      icon={action.icon}
                      onClick={() => action.onClick(action.key, rowToDetails(row.data), action.details)}
                    />
                  ))}
                </td>
              ) : null}
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
