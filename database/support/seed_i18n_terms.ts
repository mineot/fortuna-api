import TranslationTerm from '#models/translation_term';

type UpsertTermInput = {
  userId: number;
  namespace: 'account_types' | 'category_groups' | 'categories';
  termKey: string;
  enUS: string;
  ptBR: string;
};

export async function seedTerms(input: UpsertTermInput) {
  await TranslationTerm.firstOrCreate(
    {
      userId: input.userId,
      namespace: input.namespace,
      termKey: input.termKey,
      locale: 'en-US',
    },
    {
      value: input.enUS,
    },
  );

  await TranslationTerm.firstOrCreate(
    {
      userId: input.userId,
      namespace: input.namespace,
      termKey: input.termKey,
      locale: 'pt-BR',
    },
    {
      value: input.ptBR,
    },
  );
}
