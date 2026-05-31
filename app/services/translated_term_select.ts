import Database from '@adonisjs/lucid/services/db';

type TranslatedNameSelectInput = {
  tableName: string;
  namespace: string;
  locale: string;
  fallbackLocale: string;
  termKeyColumn?: string;
  outputAlias?: string;
  fallbackToTermKey?: boolean;
  userId?: number | null;
};

export function translatedNameSelect(input: TranslatedNameSelectInput) {
  const table = input.tableName;
  const termKeyColumn = input.termKeyColumn || 'term_key';
  const outputAlias = input.outputAlias || 'name';
  const fallbackToTermKey = input.fallbackToTermKey !== false;
  const userSpecificEnabled = input.userId !== undefined && input.userId !== null;

  const userLocaleClause = userSpecificEnabled
    ? `(tt.locale = ? and tt.user_id = ?)`
    : `(tt.locale = ? and tt.user_id is null)`;
  const globalLocaleClause = `(tt.locale = ? and tt.user_id is null)`;
  const userFallbackClause = userSpecificEnabled
    ? `(tt.locale = ? and tt.user_id = ?)`
    : `(tt.locale = ? and tt.user_id is null)`;
  const globalFallbackClause = `(tt.locale = ? and tt.user_id is null)`;

  const sql = `
    COALESCE(
      (SELECT tt.value
       FROM translation_terms tt
       WHERE tt.namespace = ?
         AND tt.term_key = ${table}.${termKeyColumn}
         AND ${userLocaleClause}
       LIMIT 1),
      (SELECT tt.value
       FROM translation_terms tt
       WHERE tt.namespace = ?
         AND tt.term_key = ${table}.${termKeyColumn}
         AND ${globalLocaleClause}
       LIMIT 1),
      (SELECT tt.value
       FROM translation_terms tt
       WHERE tt.namespace = ?
         AND tt.term_key = ${table}.${termKeyColumn}
         AND ${userFallbackClause}
       LIMIT 1),
      (SELECT tt.value
       FROM translation_terms tt
       WHERE tt.namespace = ?
         AND tt.term_key = ${table}.${termKeyColumn}
         AND ${globalFallbackClause}
       LIMIT 1),
      ${fallbackToTermKey ? `${table}.${termKeyColumn}` : 'null'}
    )
  `;

  const bindings: (string | number)[] = [];

  bindings.push(input.namespace, input.locale);
  if (userSpecificEnabled) bindings.push(input.userId as number);

  bindings.push(input.namespace, input.locale);

  bindings.push(input.namespace, input.fallbackLocale);
  if (userSpecificEnabled) bindings.push(input.userId as number);

  bindings.push(input.namespace, input.fallbackLocale);

  return Database.raw(`${sql} as ${outputAlias}`, bindings);
}
