import type { Kysely } from 'kysely';

import type { Database } from '../schema';

export interface Migration {
  version: number;
  name: string;
  up: (db: Kysely<Database>) => Promise<void>;
  down: (db: Kysely<Database>) => Promise<void>;
}
