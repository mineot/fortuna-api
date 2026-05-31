import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    // No-op. Account types now persist name/description directly in table columns.
  }

  async down() {
    // No-op.
  }
}
