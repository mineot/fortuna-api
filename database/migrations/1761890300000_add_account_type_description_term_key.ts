import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'account_types';

  async up() {
    const hasDescriptionTermKey = await this.db.schema.hasColumn(
      this.tableName,
      'description_term_key',
    );

    if (!hasDescriptionTermKey) {
      await this.db.schema.alterTable(this.tableName, (table) => {
        table.string('description_term_key', 220).nullable();
      });
    }

    const rows = await this.db
      .from(this.tableName)
      .select(['id', 'user_id', 'term_key', 'description', 'description_term_key']);

    const now = new Date();

    for (const row of rows) {
      if (!row.description || `${row.description}`.trim().length === 0) continue;

      const descriptionTermKey = row.description_term_key || `${row.term_key}.description`;

      await this.db.from(this.tableName).where('id', row.id).update({
        description_term_key: descriptionTermKey,
      });

      await this.db
        .table('translation_terms')
        .insert({
          user_id: row.user_id,
          namespace: 'account_types',
          term_key: descriptionTermKey,
          locale: 'en-US',
          value: row.description,
          created_at: now,
          updated_at: now,
        })
        .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
        .ignore();

      await this.db
        .table('translation_terms')
        .insert({
          user_id: row.user_id,
          namespace: 'account_types',
          term_key: descriptionTermKey,
          locale: 'pt-BR',
          value: row.description,
          created_at: now,
          updated_at: now,
        })
        .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
        .ignore();
    }
  }

  async down() {
    const hasDescriptionTermKey = await this.db.schema.hasColumn(
      this.tableName,
      'description_term_key',
    );

    if (!hasDescriptionTermKey) return;

    const rows = await this.db
      .from(this.tableName)
      .select(['id', 'user_id', 'description_term_key', 'description']);

    const terms = (await this.db
      .from('translation_terms')
      .select(['user_id', 'term_key', 'value'])
      .where('namespace', 'account_types')
      .where('locale', 'pt-BR')) as Array<{
      user_id: number | null;
      term_key: string;
      value: string;
    }>;

    const entries: Array<[string, string]> = terms.map((term) => [
      `${term.user_id ?? 'null'}::${term.term_key}`,
      term.value,
    ]);
    const map = new Map<string, string>(entries);

    for (const row of rows) {
      if (!row.description_term_key) continue;
      const value = map.get(`${row.user_id ?? 'null'}::${row.description_term_key}`);
      if (!value) continue;
      await this.db.from(this.tableName).where('id', row.id).update({ description: value });
    }

    await this.db.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description_term_key');
    });
  }
}
