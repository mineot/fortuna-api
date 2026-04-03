import { getDatabase } from '@db';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { IpcMainInvokeEvent } from 'electron';
import type { NewType, Type, TypeUpdate } from 'src/database/schema';

export type ListAllParams = {
  group?: number;
  name?: string;
};

export async function registerListAllTypes(
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

export async function registerCreateType(
  _event: IpcMainInvokeEvent,
  type: NewType,
): Promise<InsertResult[]> {
  const db = getDatabase();
  type.created_at = new Date().toISOString();
  type.updated_at = new Date().toISOString();
  return await db.insertInto('types').values(type).execute();
}

export async function registerUpdateType(
  _event: IpcMainInvokeEvent,
  type: TypeUpdate,
): Promise<UpdateResult[]> {
  if (!type.id) {
    throw new Error('Type id is required');
  }

  const db = getDatabase();
  type.updated_at = new Date().toISOString();
  return await db.updateTable('types').set(type).where('id', '=', type.id).execute();
}

export async function registerDeleteType(
  _event: IpcMainInvokeEvent,
  id: number,
): Promise<DeleteResult[]> {
  const db = getDatabase();
  return await db.deleteFrom('types').where('id', '=', id).execute();
}
