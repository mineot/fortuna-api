import type { Database } from '@db';
import { ipcMain } from 'electron';
import { type Insertable, type Kysely, type Selectable, sql, type Updateable } from 'kysely';

type CrudChannels = {
  list: string;
  listAll: string;
  findOne: string;
  add: string;
  change: string;
  remove: string;
};
type ListInput = {
  page?: number;
  pageSize?: number;
  order?: 'asc' | 'desc';
};
type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startItem: number;
  endItem: number;
};

type TableWithId = { id: unknown };
type CrudTableName = {
  [K in keyof Database]: Database[K] extends TableWithId ? K : never;
}[keyof Database];

type CrudRow<TTable extends CrudTableName> = Selectable<Database[TTable]>;
type CrudInsert<TTable extends CrudTableName> = Insertable<Database[TTable]>;
type CrudUpdate<TTable extends CrudTableName> = Updateable<Database[TTable]>;

export function registerCrudHandlers<TTable extends CrudTableName>(
  db: Kysely<Database>,
  table: TTable,
  channels: CrudChannels,
): void {
  ipcMain.removeHandler(channels.list);
  ipcMain.handle(channels.list, async (_event, input?: ListInput): Promise<PaginatedResult<CrudRow<TTable>>> => {
    const page = Math.max(1, input?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? 20));
    const order = input?.order === 'asc' ? 'asc' : 'desc';
    const offset = (page - 1) * pageSize;

    const selectQuery = db.selectFrom(table).selectAll() as any;
    const items = await selectQuery.orderBy('id', order).limit(pageSize).offset(offset).execute();

    const totalQuery = db.selectFrom(table).select(sql<number>`count(*)`.as('count')) as any;
    const totalRow = await totalQuery.executeTakeFirstOrThrow();
    const total = Number(totalRow.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const startItem = total === 0 ? 0 : offset + 1;
    const endItem = total === 0 ? 0 : Math.min(offset + items.length, total);

    return {
      items: items as CrudRow<TTable>[],
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startItem,
      endItem,
    };
  });

  ipcMain.removeHandler(channels.listAll);
  ipcMain.handle(channels.listAll, async (): Promise<CrudRow<TTable>[]> => {
    const rows = await db.selectFrom(table).selectAll().execute();
    return rows as CrudRow<TTable>[];
  });

  ipcMain.removeHandler(channels.findOne);
  ipcMain.handle(channels.findOne, async (_event, id: number): Promise<CrudRow<TTable> | undefined> => {
    const query = db.selectFrom(table).selectAll() as any;
    return query.where(sql`id = ${id}`).executeTakeFirst();
  });

  ipcMain.removeHandler(channels.add);
  ipcMain.handle(channels.add, async (_event, input: CrudInsert<TTable>): Promise<CrudRow<TTable>> => {
    const query = db.insertInto(table).values(input) as any;
    return query.returningAll().executeTakeFirstOrThrow();
  });

  ipcMain.removeHandler(channels.change);
  ipcMain.handle(
    channels.change,
    async (_event, input: { id: number; changes: CrudUpdate<TTable> }): Promise<CrudRow<TTable> | undefined> => {
      const query = db.updateTable(table).set(input.changes as any) as any;
      return query.where(sql`id = ${input.id}`).returningAll().executeTakeFirst();
    },
  );

  ipcMain.removeHandler(channels.remove);
  ipcMain.handle(channels.remove, async (_event, id: number): Promise<boolean> => {
    const query = db.deleteFrom(table) as any;
    const result = await query.where(sql`id = ${id}`).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0) > 0;
  });
}
