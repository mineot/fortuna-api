import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'account_types';

  async up() {
    const hasDescription = await this.db.schema.hasColumn(this.tableName, 'description');
    if (!hasDescription) return;

    await this.db.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description');
    });
  }

  async down() {
    const hasDescription = await this.db.schema.hasColumn(this.tableName, 'description');
    if (hasDescription) return;

    await this.db.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable();
    });
  }
}
