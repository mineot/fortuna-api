import type { Generated } from "kysely";

export interface MigrationTable {
  id: Generated<number>;
  name: string;
  projectVersion: string;
  appliedAt: string;
}

export interface DatabaseSchema {
  migrations: MigrationTable;
}
