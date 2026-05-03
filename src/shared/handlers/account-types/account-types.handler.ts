import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { ACCOUNT_TYPES_CHANNELS } from './account-types.types';

export function registerAccountTypesHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'account_types', ACCOUNT_TYPES_CHANNELS);
}
