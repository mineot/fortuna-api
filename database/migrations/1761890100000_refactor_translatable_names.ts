import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    await this.ensureTermKeyColumn('categories');

    const hasCategoriesName = await this.db.schema.hasColumn('categories', 'name');

    const categories = hasCategoriesName
      ? await this.db.from('categories').select(['id', 'user_id', 'name'])
      : await this.db.from('categories').select(['id', 'user_id', 'term_key']);

    if (hasCategoriesName) {
      for (const row of categories) {
        await this.db
          .from('categories')
          .where('id', row.id)
          .update({ term_key: `category.${row.id}.name` });
      }
    }

    const now = new Date();

    if (categories.length > 0) {
      const categoryTerms = categories.flatMap((row) => [
        {
          user_id: row.user_id,
          namespace: 'categories',
          term_key: hasCategoriesName ? `category.${row.id}.name` : row.term_key,
          locale: 'pt-BR',
          value: hasCategoriesName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
        {
          user_id: row.user_id,
          namespace: 'categories',
          term_key: hasCategoriesName ? `category.${row.id}.name` : row.term_key,
          locale: 'en-US',
          value: hasCategoriesName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
      ]);

      await this.db
        .table('translation_terms')
        .insert(categoryTerms)
        .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
        .ignore();
    }

    if (hasCategoriesName) {
      await this.db.schema.alterTable('categories', (table) => {
        table.dropUnique(['user_id', 'name']);
        table.dropColumn('name');
      });
    }

    if (hasCategoriesName || !(await this.hasIndex('categories_user_id_term_key_unique'))) {
      await this.db.schema.alterTable('categories', (table) => {
        table.unique(['user_id', 'term_key']);
      });
    }
  }

  async down() {
    const hasCategoriesName = await this.db.schema.hasColumn('categories', 'name');

    if (!hasCategoriesName) {
      await this.db.schema.alterTable('categories', (table) => {
        table.string('name', 120).notNullable().defaultTo('');
      });
    }

    const categories = await this.db.from('categories').select(['id', 'user_id', 'term_key']);

    const categoryTerms = await this.db
      .from('translation_terms')
      .select(['user_id', 'term_key', 'value'])
      .where('namespace', 'categories')
      .where('locale', 'pt-BR');

    const categoryMap = new Map(
      categoryTerms.map((term) => [`${term.user_id ?? 'null'}::${term.term_key}`, term.value]),
    );

    for (const row of categories) {
      const name = categoryMap.get(`${row.user_id ?? 'null'}::${row.term_key}`) ?? row.term_key;
      await this.db.from('categories').where('id', row.id).update({ name });
    }

    const hasCategoriesTermKey = await this.db.schema.hasColumn('categories', 'term_key');

    if (hasCategoriesTermKey) {
      await this.db.schema.alterTable('categories', (table) => {
        table.dropUnique(['user_id', 'term_key']);
        table.dropColumn('term_key');
      });
    }

    if (!(await this.hasIndex('categories_user_id_name_unique'))) {
      await this.db.schema.alterTable('categories', (table) => {
        table.unique(['user_id', 'name']);
      });
    }
  }

  private async hasIndex(indexName: string) {
    const row = await this.db
      .from('sqlite_master')
      .select('name')
      .where('type', 'index')
      .where('name', indexName)
      .first();

    return !!row;
  }

  private async ensureTermKeyColumn(tableName: string) {
    if (await this.db.schema.hasColumn(tableName, 'term_key')) return;

    try {
      await this.db.schema.alterTable(tableName, (table) => {
        table.string('term_key', 180).nullable();
      });
    } catch (error: any) {
      const message = String(error?.message ?? '').toLowerCase();
      if (message.includes('duplicate column name: term_key')) return;
      throw error;
    }
  }
}
