import type { TransfersTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const TRANSFERS_CHANNELS = {
  list: 'transfers:list',
  listAll: 'transfers:list-all',
  findOne: 'transfers:find-one',
  add: 'transfers:add',
  change: 'transfers:change',
  remove: 'transfers:remove',
} as const;

export type TransfersRow = Selectable<TransfersTable>;
export type TransfersAddInput = Insertable<TransfersTable>;
export type TransfersChangeInput = { id: number; changes: Updateable<TransfersTable> };
