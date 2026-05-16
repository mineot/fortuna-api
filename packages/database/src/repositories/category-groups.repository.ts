import type {
  CategoryGroup,
  CategoryGroupUpdate,
  Database as FortunaDatabase,
  NewCategoryGroup,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils.js';

export interface CategoryGroupListFilters {
  limit?: number;
  offset?: number;
}

export interface CategoryGroupsRepository {
  create: (payload: NewCategoryGroup) => Promise<CategoryGroup>;
  findById: (userId: number, categoryGroupId: number) => Promise<CategoryGroup | undefined>;
  listByUser: (userId: number, filters?: CategoryGroupListFilters) => Promise<CategoryGroup[]>;
  updateById: (
    userId: number,
    categoryGroupId: number,
    payload: CategoryGroupUpdate,
  ) => Promise<CategoryGroup | undefined>;
  deleteById: (userId: number, categoryGroupId: number) => Promise<boolean>;
}

export const createCategoryGroupsRepository = (
  db: Kysely<FortunaDatabase>,
): CategoryGroupsRepository => {
  return {
    create: async (payload) => {
      return db
        .insertInto('category_groups')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    findById: async (userId, categoryGroupId) => {
      return db
        .selectFrom('category_groups')
        .selectAll()
        .where('id', '=', categoryGroupId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('category_groups')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('id', 'asc');

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, categoryGroupId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('category_groups')
          .selectAll()
          .where('id', '=', categoryGroupId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('category_groups')
        .set(payload)
        .where('id', '=', categoryGroupId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, categoryGroupId) => {
      const result = await db
        .deleteFrom('category_groups')
        .where('id', '=', categoryGroupId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
