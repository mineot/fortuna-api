import type { TransactionsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const TRANSACTIONS_CHANNELS = {
  list: 'transactions:list',
  findOne: 'transactions:find-one',
  add: 'transactions:add',
  change: 'transactions:change',
  remove: 'transactions:remove',
} as const;

export type TransactionsRow = Selectable<TransactionsTable>;
export type TransactionsAddInput = Insertable<TransactionsTable>;
export type TransactionsChangeInput = { id: number; changes: Updateable<TransactionsTable> };
