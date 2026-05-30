import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  async up() {
    await this.ensureTermKeyColumn('account_types');
    await this.ensureTermKeyColumn('category_groups');
    await this.ensureTermKeyColumn('categories');

    const hasAccountTypesName = await this.db.schema.hasColumn('account_types', 'name');
    const hasCategoryGroupsName = await this.db.schema.hasColumn('category_groups', 'name');
    const hasCategoriesName = await this.db.schema.hasColumn('categories', 'name');

    const accountTypes = hasAccountTypesName
      ? await this.db.from('account_types').select(['id', 'user_id', 'name'])
      : await this.db.from('account_types').select(['id', 'user_id', 'term_key']);
    const categoryGroups = hasCategoryGroupsName
      ? await this.db.from('category_groups').select(['id', 'user_id', 'name'])
      : await this.db.from('category_groups').select(['id', 'user_id', 'term_key']);
    const categories = hasCategoriesName
      ? await this.db.from('categories').select(['id', 'user_id', 'name'])
      : await this.db.from('categories').select(['id', 'user_id', 'term_key']);

    if (hasAccountTypesName) {
      for (const row of accountTypes) {
        await this.db
          .from('account_types')
          .where('id', row.id)
          .update({ term_key: `account_type.${row.id}.name` });
      }
    }

    if (hasCategoryGroupsName) {
      for (const row of categoryGroups) {
        await this.db
          .from('category_groups')
          .where('id', row.id)
          .update({ term_key: `category_group.${row.id}.name` });
      }
    }

    if (hasCategoriesName) {
      for (const row of categories) {
        await this.db
          .from('categories')
          .where('id', row.id)
          .update({ term_key: `category.${row.id}.name` });
      }
    }

    const now = new Date();

    if (accountTypes.length > 0) {
      const accountTypeTerms = accountTypes.flatMap((row) => [
        {
          user_id: row.user_id,
          namespace: 'account_types',
          term_key: hasAccountTypesName ? `account_type.${row.id}.name` : row.term_key,
          locale: 'pt-BR',
          value: hasAccountTypesName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
        {
          user_id: row.user_id,
          namespace: 'account_types',
          term_key: hasAccountTypesName ? `account_type.${row.id}.name` : row.term_key,
          locale: 'en-US',
          value: hasAccountTypesName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
      ]);

      await this.db
        .table('translation_terms')
        .insert(accountTypeTerms)
        .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
        .ignore();
    }

    if (categoryGroups.length > 0) {
      const categoryGroupTerms = categoryGroups.flatMap((row) => [
        {
          user_id: row.user_id,
          namespace: 'category_groups',
          term_key: hasCategoryGroupsName ? `category_group.${row.id}.name` : row.term_key,
          locale: 'pt-BR',
          value: hasCategoryGroupsName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
        {
          user_id: row.user_id,
          namespace: 'category_groups',
          term_key: hasCategoryGroupsName ? `category_group.${row.id}.name` : row.term_key,
          locale: 'en-US',
          value: hasCategoryGroupsName ? row.name : row.term_key,
          created_at: now,
          updated_at: now,
        },
      ]);

      await this.db
        .table('translation_terms')
        .insert(categoryGroupTerms)
        .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
        .ignore();
    }

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

    if (hasAccountTypesName) {
      await this.db.schema.alterTable('account_types', (table) => {
        table.dropUnique(['user_id', 'name']);
        table.dropColumn('name');
      });
    }
    if (hasCategoryGroupsName) {
      await this.db.schema.alterTable('category_groups', (table) => {
        table.dropUnique(['user_id', 'name']);
        table.dropColumn('name');
      });
    }
    if (hasCategoriesName) {
      await this.db.schema.alterTable('categories', (table) => {
        table.dropUnique(['user_id', 'name']);
        table.dropColumn('name');
      });
    }

    if (hasAccountTypesName || !(await this.hasIndex('account_types_user_id_term_key_unique'))) {
      await this.db.schema.alterTable('account_types', (table) => {
        table.unique(['user_id', 'term_key']);
      });
    }
    if (
      hasCategoryGroupsName ||
      !(await this.hasIndex('category_groups_user_id_term_key_unique'))
    ) {
      await this.db.schema.alterTable('category_groups', (table) => {
        table.unique(['user_id', 'term_key']);
      });
    }
    if (hasCategoriesName || !(await this.hasIndex('categories_user_id_term_key_unique'))) {
      await this.db.schema.alterTable('categories', (table) => {
        table.unique(['user_id', 'term_key']);
      });
    }
  }

  async down() {
    const hasAccountTypesName = await this.db.schema.hasColumn('account_types', 'name');
    const hasCategoryGroupsName = await this.db.schema.hasColumn('category_groups', 'name');
    const hasCategoriesName = await this.db.schema.hasColumn('categories', 'name');

    if (!hasAccountTypesName) {
      await this.db.schema.alterTable('account_types', (table) => {
        table.string('name', 120).notNullable().defaultTo('');
      });
    }
    if (!hasCategoryGroupsName) {
      await this.db.schema.alterTable('category_groups', (table) => {
        table.string('name', 120).notNullable().defaultTo('');
      });
    }
    if (!hasCategoriesName) {
      await this.db.schema.alterTable('categories', (table) => {
        table.string('name', 120).notNullable().defaultTo('');
      });
    }

    const accountTypes = await this.db.from('account_types').select(['id', 'user_id', 'term_key']);
    const categoryGroups = await this.db
      .from('category_groups')
      .select(['id', 'user_id', 'term_key']);
    const categories = await this.db.from('categories').select(['id', 'user_id', 'term_key']);

    const accountTypeTerms = await this.db
      .from('translation_terms')
      .select(['user_id', 'term_key', 'value'])
      .where('namespace', 'account_types')
      .where('locale', 'pt-BR');

    const categoryGroupTerms = await this.db
      .from('translation_terms')
      .select(['user_id', 'term_key', 'value'])
      .where('namespace', 'category_groups')
      .where('locale', 'pt-BR');

    const categoryTerms = await this.db
      .from('translation_terms')
      .select(['user_id', 'term_key', 'value'])
      .where('namespace', 'categories')
      .where('locale', 'pt-BR');

    const accountTypeMap = new Map(
      accountTypeTerms.map((term) => [`${term.user_id ?? 'null'}::${term.term_key}`, term.value]),
    );
    const categoryGroupMap = new Map(
      categoryGroupTerms.map((term) => [`${term.user_id ?? 'null'}::${term.term_key}`, term.value]),
    );
    const categoryMap = new Map(
      categoryTerms.map((term) => [`${term.user_id ?? 'null'}::${term.term_key}`, term.value]),
    );

    for (const row of accountTypes) {
      const name = accountTypeMap.get(`${row.user_id ?? 'null'}::${row.term_key}`) ?? row.term_key;
      await this.db.from('account_types').where('id', row.id).update({ name });
    }

    for (const row of categoryGroups) {
      const name =
        categoryGroupMap.get(`${row.user_id ?? 'null'}::${row.term_key}`) ?? row.term_key;
      await this.db.from('category_groups').where('id', row.id).update({ name });
    }

    for (const row of categories) {
      const name = categoryMap.get(`${row.user_id ?? 'null'}::${row.term_key}`) ?? row.term_key;
      await this.db.from('categories').where('id', row.id).update({ name });
    }

    const hasAccountTypesTermKey = await this.db.schema.hasColumn('account_types', 'term_key');
    const hasCategoryGroupsTermKey = await this.db.schema.hasColumn('category_groups', 'term_key');
    const hasCategoriesTermKey = await this.db.schema.hasColumn('categories', 'term_key');

    if (hasAccountTypesTermKey) {
      await this.db.schema.alterTable('account_types', (table) => {
        table.dropUnique(['user_id', 'term_key']);
        table.dropColumn('term_key');
      });
    }
    if (hasCategoryGroupsTermKey) {
      await this.db.schema.alterTable('category_groups', (table) => {
        table.dropUnique(['user_id', 'term_key']);
        table.dropColumn('term_key');
      });
    }
    if (hasCategoriesTermKey) {
      await this.db.schema.alterTable('categories', (table) => {
        table.dropUnique(['user_id', 'term_key']);
        table.dropColumn('term_key');
      });
    }

    if (!(await this.hasIndex('account_types_user_id_name_unique'))) {
      await this.db.schema.alterTable('account_types', (table) => {
        table.unique(['user_id', 'name']);
      });
    }
    if (!(await this.hasIndex('category_groups_user_id_name_unique'))) {
      await this.db.schema.alterTable('category_groups', (table) => {
        table.unique(['user_id', 'name']);
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
