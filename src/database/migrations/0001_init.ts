import { Kysely } from 'kysely';
import type { Database } from '../schema';
import type { MigrationDefinition } from '../migrator';

export const migration0001Init: MigrationDefinition = {
  name: '0001_init',
  version: 1,

  async up(db: Kysely<Database>): Promise<void> {
    // criar tabelas iniciais aqui
  },

  async down(db: Kysely<Database>): Promise<void> {
    // desfazer criação inicial aqui
  },
};
