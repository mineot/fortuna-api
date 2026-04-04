import { ApiMessage } from 'src/api-message';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { getDatabase } from '@db';
import { IpcMainInvokeEvent } from 'electron';
import type { FilterTypes, NewType, TypeSelect, TypeUpdate } from 'src/database/schema';

export async function registerListAllTypes(
  _event: IpcMainInvokeEvent,
  params?: FilterTypes,
): ApiMessage<TypeSelect[]> {
  const db = getDatabase();
  const { group, name } = params ?? {};

  let query = db.selectFrom('types').selectAll();

  if (typeof group === 'number') {
    query = query.where('group', '=', group);
  }

  if (name && name.length) {
    query = query.where('name', 'like', `%${name}%`);
  }

  return {
    type: 'success',
    data: await query.orderBy('group').orderBy('name').execute(),
  };
}

export async function registerCreateType(
  _event: IpcMainInvokeEvent,
  type: NewType,
): ApiMessage<InsertResult[]> {
  const db = getDatabase();
  type.created_at = new Date().toISOString();
  type.updated_at = new Date().toISOString();

  return {
    type: 'success',
    data: await db.insertInto('types').values(type).execute(),
  };
}

export async function registerUpdateType(
  _event: IpcMainInvokeEvent,
  type: TypeUpdate,
  id: number,
): ApiMessage<UpdateResult[]> {
  const db = getDatabase();
  type.updated_at = new Date().toISOString();

  return {
    type: 'success',
    data: await db.updateTable('types').set(type).where('id', '=', id).execute(),
  };
}

export async function registerDeleteType(
  _event: IpcMainInvokeEvent,
  id: number,
): ApiMessage<DeleteResult[]> {
  const db = getDatabase();
  return {
    type: 'success',
    data: await db.deleteFrom('types').where('id', '=', id).execute(),
  };
}
