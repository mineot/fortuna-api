import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { PAYEES_CHANNELS } from './payees.types';

export function registerPayeesHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'payees', PAYEES_CHANNELS);
}
