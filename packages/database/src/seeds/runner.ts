import type { Database as FortunaDatabase, TransactionType } from '@repo/shared';
import type { Kysely, Transaction } from 'kysely';

import { createSqliteKysely } from '../adapters/index.js';
import { DEFAULT_ACCOUNT_TYPES, DEFAULT_CATEGORY_GROUPS } from './templates.js';

export type SeedMode = 'all' | 'account-types' | 'categories';

export interface SeedOptions {
  databaseUrl?: string;
  mode?: SeedMode;
  userId?: number;
}

export interface SeedReport {
  mode: SeedMode;
  accountTypesInserted: number;
  categoryGroupsInserted: number;
  categoriesInserted: number;
}

const ensureUserExists = async (db: Transaction<FortunaDatabase>, userId: number): Promise<void> => {
  const user = await db
    .selectFrom('users')
    .select('id')
    .where('id', '=', userId)
    .executeTakeFirst();

  if (!user) {
    throw new Error(`Cannot seed categories: user ${userId} does not exist.`);
  }
};

export const seedAccountTypes = async (db: Kysely<FortunaDatabase>): Promise<number> => {
  const beforeRow = await db
    .selectFrom('account_types')
    .select((eb) => eb.fn.countAll<number>().as('count'))
    .executeTakeFirstOrThrow();

  await db
    .insertInto('account_types')
    .values(DEFAULT_ACCOUNT_TYPES.map((name) => ({ name })))
    .onConflict((conflict) => conflict.column('name').doNothing())
    .execute();

  const afterRow = await db
    .selectFrom('account_types')
    .select((eb) => eb.fn.countAll<number>().as('count'))
    .executeTakeFirstOrThrow();

  return Number(afterRow.count) - Number(beforeRow.count);
};

const makeCategoryKey = (
  categoryGroupId: number,
  name: string,
  type: TransactionType,
): string => `${categoryGroupId}|${name}|${type}`;

export interface UserCategorySeedReport {
  categoryGroupsInserted: number;
  categoriesInserted: number;
}

export const seedCategoriesForUser = async (
  db: Kysely<FortunaDatabase>,
  userId: number,
): Promise<UserCategorySeedReport> => {
  return db.transaction().execute(async (trx) => {
    await ensureUserExists(trx, userId);

    const groupNames = DEFAULT_CATEGORY_GROUPS.map((group) => group.name);

    const existingGroups = await trx
      .selectFrom('category_groups')
      .select(['id', 'name'])
      .where('user_id', '=', userId)
      .where('name', 'in', groupNames)
      .execute();

    const existingGroupNames = new Set(existingGroups.map((group) => group.name));
    const missingGroups = DEFAULT_CATEGORY_GROUPS
      .filter((group) => !existingGroupNames.has(group.name))
      .map((group) => ({ user_id: userId, name: group.name }));

    if (missingGroups.length > 0) {
      await trx.insertInto('category_groups').values(missingGroups).execute();
    }

    const groups = await trx
      .selectFrom('category_groups')
      .select(['id', 'name'])
      .where('user_id', '=', userId)
      .where('name', 'in', groupNames)
      .execute();

    const groupIdByName = new Map(groups.map((group) => [group.name, group.id]));

    const groupIds = groups.map((group) => group.id);

    const existingCategories =
      groupIds.length > 0
        ? await trx
            .selectFrom('categories')
            .select(['category_group_id', 'name', 'type'])
            .where('user_id', '=', userId)
            .where('category_group_id', 'in', groupIds)
            .execute()
        : [];

    const existingCategoryKeys = new Set(
      existingCategories.map((category) =>
        makeCategoryKey(category.category_group_id, category.name, category.type),
      ),
    );

    const categoriesToInsert: Array<{
      user_id: number;
      category_group_id: number;
      name: string;
      type: TransactionType;
    }> = [];

    for (const group of DEFAULT_CATEGORY_GROUPS) {
      const groupId = groupIdByName.get(group.name);

      if (!groupId) {
        throw new Error(`Cannot seed categories: missing category group "${group.name}" for user ${userId}.`);
      }

      for (const category of group.categories) {
        const categoryKey = makeCategoryKey(groupId, category.name, category.type);

        if (existingCategoryKeys.has(categoryKey)) {
          continue;
        }

        existingCategoryKeys.add(categoryKey);

        categoriesToInsert.push({
          user_id: userId,
          category_group_id: groupId,
          name: category.name,
          type: category.type,
        });
      }
    }

    if (categoriesToInsert.length > 0) {
      await trx.insertInto('categories').values(categoriesToInsert).execute();
    }

    return {
      categoryGroupsInserted: missingGroups.length,
      categoriesInserted: categoriesToInsert.length,
    };
  });
};

const resolveMode = (mode: SeedMode | undefined): SeedMode => mode ?? 'all';

export const runSeeds = async (options: SeedOptions = {}): Promise<SeedReport> => {
  const mode = resolveMode(options.mode);
  const db = createSqliteKysely<FortunaDatabase>(
    options.databaseUrl ? { databaseUrl: options.databaseUrl } : {},
  );

  try {
    let accountTypesInserted = 0;
    let categoryGroupsInserted = 0;
    let categoriesInserted = 0;

    if (mode === 'all' || mode === 'account-types') {
      accountTypesInserted = await seedAccountTypes(db);
    }

    if (mode === 'all' || mode === 'categories') {
      if (!options.userId) {
        throw new Error(`Seed mode "${mode}" requires --user-id=<number>.`);
      }

      const result = await seedCategoriesForUser(db, options.userId);
      categoryGroupsInserted = result.categoryGroupsInserted;
      categoriesInserted = result.categoriesInserted;
    }

    return {
      mode,
      accountTypesInserted,
      categoryGroupsInserted,
      categoriesInserted,
    };
  } finally {
    await db.destroy();
  }
};
