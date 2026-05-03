import type { UsersTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const USERS_CHANNELS = {
  list: 'users:list',
  findOne: 'users:find-one',
  add: 'users:add',
  change: 'users:change',
  remove: 'users:remove',
} as const;

export type UsersRow = Selectable<UsersTable>;
export type UsersAddInput = Insertable<UsersTable>;
export type UsersChangeInput = { id: number; changes: Updateable<UsersTable> };
