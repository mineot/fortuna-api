import type { AccountsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const ACCOUNTS_CHANNELS = {
  list: 'accounts:list',
  findOne: 'accounts:find-one',
  add: 'accounts:add',
  change: 'accounts:change',
  remove: 'accounts:remove',
} as const;

export type AccountsRow = Selectable<AccountsTable>;
export type AccountsAddInput = Insertable<AccountsTable>;
export type AccountsChangeInput = { id: number; changes: Updateable<AccountsTable> };
