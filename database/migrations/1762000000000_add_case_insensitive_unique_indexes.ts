import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  private readonly tables = [
    'account_types',
    'accounts',
    'category_groups',
    'categories',
    'payees',
    'shopping_lists',
    'credit_cards',
  ] as const;

  private indexName(tableName: string) {
    return `${tableName}_user_id_name_ci`;
  }

  async up() {
    for (const tableName of this.tables) {
      await this.schema.alterTable(tableName, (table) => {
        table.unique(['user_id', 'name'], {
          indexName: this.indexName(tableName),
        });
      });
    }
  }

  async down() {
    for (const tableName of this.tables) {
      await this.schema.alterTable(tableName, (table) => {
        table.dropUnique(['user_id', 'name'], this.indexName(tableName));
      });
    }
  }
}
