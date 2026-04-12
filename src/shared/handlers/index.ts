import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerAppHandlers } from './app.handler';
import { registerTypesHandlers } from './types.handler';

export function registerIpcHandlers(db: Kysely<Database>): void {
  registerAppHandlers();
  registerTypesHandlers(db);
}
