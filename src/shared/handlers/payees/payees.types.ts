import type { PayeesTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const PAYEES_CHANNELS = {
  list: 'payees:list',
  listAll: 'payees:list-all',
  findOne: 'payees:find-one',
  add: 'payees:add',
  change: 'payees:change',
  remove: 'payees:remove',
} as const;

export type PayeesRow = Selectable<PayeesTable>;
export type PayeesAddInput = Insertable<PayeesTable>;
export type PayeesChangeInput = { id: number; changes: Updateable<PayeesTable> };
