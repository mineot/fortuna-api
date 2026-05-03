import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { ACCOUNTS_CHANNELS } from './accounts.types';

export function registerAccountsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'accounts', ACCOUNTS_CHANNELS);
}
