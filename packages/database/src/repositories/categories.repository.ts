import type {
  Category,
  CategoryUpdate,
  Database as FortunaDatabase,
  NewCategory,
  TransactionType,
} from '@repo/shared';
import type { Kysely } from 'kysely';

import { hasPatchValues, toNumber } from './utils';

export interface CategoryListFilters {
  categoryGroupId?: number;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}

export interface CategoriesRepository {
  create: (payload: NewCategory) => Promise<Category>;
  findById: (userId: number, categoryId: number) => Promise<Category | undefined>;
  listByUser: (userId: number, filters?: CategoryListFilters) => Promise<Category[]>;
  updateById: (
    userId: number,
    categoryId: number,
    payload: CategoryUpdate,
  ) => Promise<Category | undefined>;
  deleteById: (userId: number, categoryId: number) => Promise<boolean>;
}

export const createCategoriesRepository = (db: Kysely<FortunaDatabase>): CategoriesRepository => {
  return {
    create: async (payload) => {
      return db.insertInto('categories').values(payload).returningAll().executeTakeFirstOrThrow();
    },

    findById: async (userId, categoryId) => {
      return db
        .selectFrom('categories')
        .selectAll()
        .where('id', '=', categoryId)
        .where('user_id', '=', userId)
        .executeTakeFirst();
    },

    listByUser: async (userId, filters = {}) => {
      let query = db
        .selectFrom('categories')
        .selectAll()
        .where('user_id', '=', userId)
        .orderBy('id', 'asc');

      if (filters.categoryGroupId) {
        query = query.where('category_group_id', '=', filters.categoryGroupId);
      }

      if (filters.type) {
        query = query.where('type', '=', filters.type);
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit);
      }

      if (typeof filters.offset === 'number') {
        query = query.offset(filters.offset);
      }

      return query.execute();
    },

    updateById: async (userId, categoryId, payload) => {
      if (!hasPatchValues(payload)) {
        return db
          .selectFrom('categories')
          .selectAll()
          .where('id', '=', categoryId)
          .where('user_id', '=', userId)
          .executeTakeFirst();
      }

      return db
        .updateTable('categories')
        .set(payload)
        .where('id', '=', categoryId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();
    },

    deleteById: async (userId, categoryId) => {
      const result = await db
        .deleteFrom('categories')
        .where('id', '=', categoryId)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      return toNumber(result.numDeletedRows) > 0;
    },
  };
};
