import type { RecurringTransactionsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const RECURRING_TRANSACTIONS_CHANNELS = {
  list: 'recurring-transactions:list',
  findOne: 'recurring-transactions:find-one',
  add: 'recurring-transactions:add',
  change: 'recurring-transactions:change',
  remove: 'recurring-transactions:remove',
} as const;

export type RecurringTransactionsRow = Selectable<RecurringTransactionsTable>;
export type RecurringTransactionsAddInput = Insertable<RecurringTransactionsTable>;
export type RecurringTransactionsChangeInput = { id: number; changes: Updateable<RecurringTransactionsTable> };
