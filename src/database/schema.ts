import type { Generated } from 'kysely';

export interface Database {
  migrations: {
    version: number;
    name: string;
    executed_at: string;
  };
  types: {
    id: Generated<number>;
    group: string;
    value: string;
  };
}
