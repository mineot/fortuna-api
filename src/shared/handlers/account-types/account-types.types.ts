import type { AccountTypesTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const ACCOUNT_TYPES_CHANNELS = {
  list: 'account-types:list',
  listAll: 'account-types:list-all',
  findOne: 'account-types:find-one',
  add: 'account-types:add',
  change: 'account-types:change',
  remove: 'account-types:remove',
} as const;

export type AccountTypesRow = Selectable<AccountTypesTable>;
export type AccountTypesAddInput = Insertable<AccountTypesTable>;
export type AccountTypesChangeInput = { id: number; changes: Updateable<AccountTypesTable> };
