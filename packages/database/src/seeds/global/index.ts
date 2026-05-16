import type { DatabaseClient } from '../../client';

export const DEFAULT_ACCOUNT_TYPES = [
  'Checking',
  'Savings',
  'Wallet',
  'Investment',
  'Other',
] as const;

export interface SeedAccountTypesResult {
  inserted: string[];
  skipped: string[];
}

export const seedAccountTypes = async (
  db: DatabaseClient,
): Promise<SeedAccountTypesResult> => {
  const existingRows = await db.selectFrom('account_types').select('name').execute();
  const existingNames = new Set(existingRows.map((row) => row.name));

  const inserted = DEFAULT_ACCOUNT_TYPES.filter((name) => !existingNames.has(name));
  const skipped = DEFAULT_ACCOUNT_TYPES.filter((name) => existingNames.has(name));

  if (inserted.length > 0) {
    await db
      .insertInto('account_types')
      .values(inserted.map((name) => ({ name })))
      .execute();
  }

  return {
    inserted,
    skipped,
  };
};
