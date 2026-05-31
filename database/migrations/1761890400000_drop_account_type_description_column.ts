import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    // No-op. Account type description remains as a direct table column.
  }

  async down() {
    // No-op.
  }
}
