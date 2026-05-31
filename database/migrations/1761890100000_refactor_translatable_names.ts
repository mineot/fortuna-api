import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    // Intentionally left blank. Categories are now direct-name based.
  }

  async down() {
    // Intentionally left blank.
  }
}
