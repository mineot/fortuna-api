import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { getDatabase } from '@db';
import { IpcMainInvokeEvent } from 'electron';
import type { FilterTypes, NewType, Type, TypeUpdate } from 'src/database/schemas';

export async function registerListAllTypes(
  _event: IpcMainInvokeEvent,
  params?: FilterTypes,
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

  return await query.orderBy('group').orderBy('name').execute();
}

export async function registerFindType(
  _event: IpcMainInvokeEvent,
  id: number,
): Promise<Type | undefined> {
  const db = getDatabase();
  return await db.selectFrom('types').selectAll().where('id', '=', id).executeTakeFirst();
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
  id: number,
): Promise<UpdateResult[]> {
  const db = getDatabase();
  type.updated_at = new Date().toISOString();
  return await db.updateTable('types').set(type).where('id', '=', id).execute();
}

export async function registerDeleteType(
  _event: IpcMainInvokeEvent,
  id: number,
): Promise<DeleteResult[]> {
  const db = getDatabase();
  return await db.deleteFrom('types').where('id', '=', id).execute();
}
