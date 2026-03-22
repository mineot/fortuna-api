import type { Generated, Selectable, Insertable, Updateable } from 'kysely';

// interface Auditable {
//   id: Generated<number>;
//   created_at: string;
//   updated_at: string;
// }

// interface Archivetable extends Auditable {
//   archived: boolean;
//   archived_at: string;
// }

interface MigrationTable {
  id: Generated<number>;
  name: string;
  version: number;
  executed_at: string;
}

export interface Database {
  migrations: MigrationTable;
}

export type Migration = Selectable<MigrationTable>;
export type NewMigration = Insertable<MigrationTable>;
export type MigrationUpdate = Updateable<MigrationTable>;
