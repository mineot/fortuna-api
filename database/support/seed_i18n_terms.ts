import Database from '@adonisjs/lucid/services/db';

type UpsertTermInput = {
  userId: number;
  namespace: 'account_types' | 'category_groups' | 'categories';
  termKey: string;
  enUS: string;
  ptBR: string;
};

export async function seedTerms(input: UpsertTermInput) {
  const now = new Date();

  await Database.table('translation_terms')
    .insert({
      user_id: input.userId,
      namespace: input.namespace,
      term_key: input.termKey,
      locale: 'en-US',
      value: input.enUS,
      created_at: now,
      updated_at: now,
    })
    .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
    .merge({
      value: input.enUS,
      updated_at: now,
    });

  await Database.table('translation_terms')
    .insert({
      user_id: input.userId,
      namespace: input.namespace,
      term_key: input.termKey,
      locale: 'pt-BR',
      value: input.ptBR,
      created_at: now,
      updated_at: now,
    })
    .onConflict(['user_id', 'namespace', 'term_key', 'locale'])
    .merge({
      value: input.ptBR,
      updated_at: now,
    });
}
