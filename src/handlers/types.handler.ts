import { getDatabase } from '@db';
import { IpcMainInvokeEvent } from 'electron';
import type { Type } from 'src/database/schema';

export type ListAllParams = {
  group?: number;
  name?: string;
};

export function registerListAllTypes(
  _event: IpcMainInvokeEvent,
  params?: ListAllParams,
): Promise<Type[]> {
  const db = getDatabase();
  const { group, name } = params ?? {};

  let query = db.selectFrom('types').selectAll();

  if (typeof group === 'number') {
    query = query.where('group', '=', group);
  }

  if (name && name.length) {
    query = query.where('name', 'like', `%${name}%`);
  }

  return query.orderBy('group').orderBy('name').execute();
}
