import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { RECURRING_TRANSACTIONS_CHANNELS } from './recurring-transactions.types';

export function registerRecurringTransactionsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'recurring_transactions', RECURRING_TRANSACTIONS_CHANNELS);
}
