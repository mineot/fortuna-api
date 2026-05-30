import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'settings';

  async up() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'locale_initialized_at');
    if (hasColumn) return;

    await this.db.schema.alterTable(this.tableName, (table) => {
      table.timestamp('locale_initialized_at').nullable();
    });
  }

  async down() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'locale_initialized_at');
    if (!hasColumn) return;

    await this.db.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('locale_initialized_at');
    });
  }
}
