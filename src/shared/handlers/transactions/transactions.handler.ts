import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { TRANSACTIONS_CHANNELS } from './transactions.types';

export function registerTransactionsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'transactions', TRANSACTIONS_CHANNELS);
}
