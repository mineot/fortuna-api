import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerTypesHandlers } from './types.handler';

export function registerIpcHandlers(db: Kysely<Database>): void {
  registerTypesHandlers(db);
}
