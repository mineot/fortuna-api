import type { TransactionType } from '@repo/shared';

import type { DatabaseClient } from '../../client';

interface DefaultCategoryGroup {
  name: string;
  categories: ReadonlyArray<{
    name: string;
    type: TransactionType;
  }>;
}

const DEFAULT_CATEGORY_GROUPS: ReadonlyArray<DefaultCategoryGroup> = [
  {
    name: 'Income',
    categories: [
      { name: 'Salary', type: 'income' },
      { name: 'Freelance', type: 'income' },
      { name: 'Investments', type: 'income' },
      { name: 'Refund', type: 'income' },
    ],
  },
  {
    name: 'Fixed Expenses',
    categories: [
      { name: 'Rent', type: 'expense' },
      { name: 'Electricity', type: 'expense' },
      { name: 'Internet', type: 'expense' },
      { name: 'Water', type: 'expense' },
    ],
  },
  {
    name: 'Variable Expenses',
    categories: [
      { name: 'Food', type: 'expense' },
      { name: 'Transportation', type: 'expense' },
      { name: 'Health', type: 'expense' },
      { name: 'Entertainment', type: 'expense' },
    ],
  },
  {
    name: 'Credit Card',
    categories: [{ name: 'Credit Card Payment', type: 'expense' }],
  },
] as const;

export interface SeedUserCategoriesResult {
  userId: number;
  insertedGroups: string[];
  skippedGroups: string[];
  insertedCategories: Array<{ group: string; name: string; type: TransactionType }>;
  skippedCategories: Array<{ group: string; name: string; type: TransactionType }>;
}

const createCategoryKey = (groupId: number, name: string, type: TransactionType): string =>
  `${groupId}:${name}:${type}`;

export const seedUserCategoryGroupsAndCategories = async (
  db: DatabaseClient,
  userId: number,
): Promise<SeedUserCategoriesResult> => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error(`Invalid userId: ${userId}. userId must be a positive integer.`);
  }

  return db.transaction().execute(async (trx) => {
    const groupNames = DEFAULT_CATEGORY_GROUPS.map((group) => group.name);
    const existingGroups = await trx
      .selectFrom('category_groups')
      .select(['id', 'name'])
      .where('user_id', '=', userId)
      .where('name', 'in', groupNames)
      .execute();

    const existingGroupNames = new Set(existingGroups.map((group) => group.name));
    const insertedGroups = groupNames.filter((name) => !existingGroupNames.has(name));
    const skippedGroups = groupNames.filter((name) => existingGroupNames.has(name));

    if (insertedGroups.length > 0) {
      await trx
        .insertInto('category_groups')
        .values(insertedGroups.map((name) => ({ user_id: userId, name })))
        .execute();
    }

    const allGroups = await trx
      .selectFrom('category_groups')
      .select(['id', 'name'])
      .where('user_id', '=', userId)
      .where('name', 'in', groupNames)
      .execute();

    const groupIdByName = new Map(allGroups.map((group) => [group.name, group.id]));
    const groupIds = allGroups.map((group) => group.id);

    const existingCategories = groupIds.length
      ? await trx
          .selectFrom('categories')
          .select(['category_group_id', 'name', 'type'])
          .where('user_id', '=', userId)
          .where('category_group_id', 'in', groupIds)
          .execute()
      : [];

    const existingCategoryKeys = new Set(
      existingCategories.map((category) =>
        createCategoryKey(category.category_group_id, category.name, category.type),
      ),
    );

    const insertedCategories: Array<{ group: string; name: string; type: TransactionType }> = [];
    const skippedCategories: Array<{ group: string; name: string; type: TransactionType }> = [];
    const categoryRowsToInsert: Array<{
      user_id: number;
      category_group_id: number;
      name: string;
      type: TransactionType;
    }> = [];

    for (const group of DEFAULT_CATEGORY_GROUPS) {
      const groupId = groupIdByName.get(group.name);

      if (groupId === undefined) {
        throw new Error(`Category group not found after seed step: ${group.name}`);
      }

      for (const category of group.categories) {
        const categoryKey = createCategoryKey(groupId, category.name, category.type);
        const resultItem = {
          group: group.name,
          name: category.name,
          type: category.type,
        };

        if (existingCategoryKeys.has(categoryKey)) {
          skippedCategories.push(resultItem);
          continue;
        }

        insertedCategories.push(resultItem);
        categoryRowsToInsert.push({
          user_id: userId,
          category_group_id: groupId,
          name: category.name,
          type: category.type,
        });
      }
    }

    if (categoryRowsToInsert.length > 0) {
      await trx.insertInto('categories').values(categoryRowsToInsert).execute();
    }

    return {
      userId,
      insertedGroups,
      skippedGroups,
      insertedCategories,
      skippedCategories,
    };
  });
};
