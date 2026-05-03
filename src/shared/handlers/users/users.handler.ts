import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { USERS_CHANNELS } from './users.types';

export function registerUsersHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'users', USERS_CHANNELS);
}
