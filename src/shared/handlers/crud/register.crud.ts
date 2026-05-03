import type { Database } from '@db';
import { ipcMain } from 'electron';
import { type Kysely, sql } from 'kysely';

import {
  ALLOWED_OPERATORS,
  type AllowedOperator,
  type CrudChannels,
  type CrudInsert,
  type CrudRow,
  type CrudTableName,
  type CrudUpdate,
  type Filter,
  type ListInput,
  type Order,
  type PaginatedResult,
} from './register.types';

function applyOrder(orders: Order[], selectQuery: any) {
  orders.forEach((order) => {
    if (typeof order.column === 'string' && order.column.length > 0) {
      selectQuery.orderBy(order.column, order.order);
    }
  });
}

function applyFilter(
  filters: Filter[],
  selectQuery: { where: (column: string, operator: string, value: unknown) => unknown },
) {
  filters.forEach((filter) => {
    if (typeof filter.column !== 'string' || filter.column.length === 0) return;
    const operator = filter.operator.toLowerCase() as AllowedOperator;
    if (!ALLOWED_OPERATORS.has(operator)) return;
    if ((operator === 'in' || operator === 'not in') && !Array.isArray(filter.value)) return;
    selectQuery.where(filter.column, operator, filter.value);
  });
}

export function registerCrudHandlers<TTable extends CrudTableName>(
  db: Kysely<Database>,
  table: TTable,
  channels: CrudChannels,
): void {
  ipcMain.removeHandler(channels.list);
  ipcMain.handle(channels.list, async (_event, input?: ListInput): Promise<PaginatedResult<CrudRow<TTable>>> => {
    const page = Math.max(1, input?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? 20));
    const orders = input?.orders ?? [];
    const filters = input?.filters ?? [];

    const selectQuery = db.selectFrom(table).selectAll() as any;
    applyOrder(orders, selectQuery);
    applyFilter(filters, selectQuery);

    const totalQuery = (db.selectFrom(table) as any).select(db.fn.countAll<number>().as('count')) as any;
    applyFilter(filters, totalQuery);
    const totalRow = await totalQuery.executeTakeFirstOrThrow();
    const total = Number(totalRow.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const offset = (currentPage - 1) * pageSize;
    const items = await selectQuery.limit(pageSize).offset(offset).execute();
    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const startItem = total === 0 ? 0 : offset + 1;
    const endItem = total === 0 ? 0 : Math.min(offset + items.length, total);

    return {
      items: items as CrudRow<TTable>[],
      page: currentPage,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startItem,
      endItem,
    };
  });

  ipcMain.removeHandler(channels.findOne);
  ipcMain.handle(channels.findOne, async (_event, id: number): Promise<CrudRow<TTable> | undefined> => {
    const query: any = db.selectFrom(table).selectAll();
    return query.where(sql`id = ${id}`).executeTakeFirst() as Promise<CrudRow<TTable> | undefined>;
  });

  ipcMain.removeHandler(channels.add);
  ipcMain.handle(channels.add, async (_event, input: CrudInsert<TTable>): Promise<CrudRow<TTable>> => {
    const query = db.insertInto(table).values(input);
    return query.returningAll().executeTakeFirstOrThrow() as Promise<CrudRow<TTable>>;
  });

  ipcMain.removeHandler(channels.change);
  ipcMain.handle(
    channels.change,
    async (_event, input: { id: number; changes: CrudUpdate<TTable> }): Promise<CrudRow<TTable> | undefined> => {
      const query = (db.updateTable(table) as any).set(input.changes as any);
      return query
        .where(sql`id = ${input.id}`)
        .returningAll()
        .executeTakeFirst() as Promise<CrudRow<TTable> | undefined>;
    },
  );

  ipcMain.removeHandler(channels.remove);
  ipcMain.handle(channels.remove, async (_event, id: number): Promise<boolean> => {
    const query: any = db.deleteFrom(table);
    const result = await query.where(sql`id = ${id}`).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0) > 0;
  });
}
