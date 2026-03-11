import type { Migration } from '../core/migrator';

export const initMigration: Migration = {
  name: '0001_init',
  projectVersion: '1.0.0',
  async up() {
    // Migration intentionally empty for now.
  },
  async down() {
    // Migration intentionally empty for now.
  },
};
