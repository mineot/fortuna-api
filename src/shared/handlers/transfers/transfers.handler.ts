import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { TRANSFERS_CHANNELS } from './transfers.types';

export function registerTransfersHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'transfers', TRANSFERS_CHANNELS);
}
