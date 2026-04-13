import type { Database } from '@db';
import type {
  TypeFilters,
  TypeInsertInput,
  TypeRemove,
  TypeUpdateInput,
} from '@db/schema';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export function registerTypesHandlers(db: Kysely<Database>): void {
  ipcMain.removeHandler(IPC_CHANNELS.typesList);
  ipcMain.handle(IPC_CHANNELS.typesList, async (_event, filters?: TypeFilters) => {
    let query = db.selectFrom('types').selectAll();

    if (filters?.group) {
      query = query.where(
        sql<boolean>`lower("group") like ${`%${filters.group.toLocaleLowerCase()}%`}`,
      );
    }

    if (filters?.name) {
      query = query.where(
        sql<boolean>`lower("value") like ${`%${filters.name.toLocaleLowerCase()}%`}`,
      );
    }

    return query.orderBy('group', 'asc').orderBy('value', 'asc').execute();
  });

  ipcMain.removeHandler(IPC_CHANNELS.typesInsert);
  ipcMain.handle(IPC_CHANNELS.typesInsert, async (_event, input: TypeInsertInput) => {
    const created = await db
      .insertInto('types')
      .values({
        group: input.group,
        value: input.value,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return created;
  });

  ipcMain.removeHandler(IPC_CHANNELS.typesUpdate);
  ipcMain.handle(IPC_CHANNELS.typesUpdate, async (_event, input: TypeUpdateInput) => {
    const patch: Partial<Pick<Database['types'], 'group' | 'value'>> = {};

    if (input.group !== undefined) {
      patch.group = input.group;
    }

    if (input.value !== undefined) {
      patch.value = input.value;
    }

    if (Object.keys(patch).length === 0) {
      return db.selectFrom('types').selectAll().where('id', '=', input.id).executeTakeFirst();
    }

    return db
      .updateTable('types')
      .set(patch)
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirst();
  });

  ipcMain.removeHandler(IPC_CHANNELS.typesRemove);
  ipcMain.handle(IPC_CHANNELS.typesRemove, async (_event, input: TypeRemove) => {
    const result = await db.deleteFrom('types').where('id', '=', input.id).executeTakeFirst();
    return Number(result.numDeletedRows) > 0;
  });
}
