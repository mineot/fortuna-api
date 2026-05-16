import type {
  Category,
  CategoryGroup,
  CategoryGroupUpdate,
  CategoryUpdate,
  NewCategory,
  NewCategoryGroup,
  NewPayee,
  Payee,
  PayeeUpdate,
} from '@repo/shared';

import type { DatabaseClient } from '../../client';

const hasAffectedRows = (value: bigint | number): boolean => Number(value) > 0;

export interface CategoriesRepository {
  createCategoryGroup(input: NewCategoryGroup): Promise<CategoryGroup>;
  findCategoryGroupById(id: number): Promise<CategoryGroup | undefined>;
  listCategoryGroupsByUserId(userId: number): Promise<CategoryGroup[]>;
  updateCategoryGroupById(id: number, patch: CategoryGroupUpdate): Promise<CategoryGroup | undefined>;
  deleteCategoryGroupById(id: number): Promise<boolean>;

  createCategory(input: NewCategory): Promise<Category>;
  findCategoryById(id: number): Promise<Category | undefined>;
  listCategoriesByUserId(userId: number): Promise<Category[]>;
  listCategoriesByGroupId(categoryGroupId: number): Promise<Category[]>;
  updateCategoryById(id: number, patch: CategoryUpdate): Promise<Category | undefined>;
  deleteCategoryById(id: number): Promise<boolean>;

  createPayee(input: NewPayee): Promise<Payee>;
  findPayeeById(id: number): Promise<Payee | undefined>;
  listPayeesByUserId(userId: number): Promise<Payee[]>;
  updatePayeeById(id: number, patch: PayeeUpdate): Promise<Payee | undefined>;
  deletePayeeById(id: number): Promise<boolean>;
}

export const createCategoriesRepository = (db: DatabaseClient): CategoriesRepository => ({
  async createCategoryGroup(input) {
    return db
      .insertInto('category_groups')
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async findCategoryGroupById(id) {
    return db.selectFrom('category_groups').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listCategoryGroupsByUserId(userId) {
    return db
      .selectFrom('category_groups')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updateCategoryGroupById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findCategoryGroupById(id);
    }

    return db
      .updateTable('category_groups')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteCategoryGroupById(id) {
    const result = await db.deleteFrom('category_groups').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createCategory(input) {
    return db.insertInto('categories').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findCategoryById(id) {
    return db.selectFrom('categories').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listCategoriesByUserId(userId) {
    return db
      .selectFrom('categories')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async listCategoriesByGroupId(categoryGroupId) {
    return db
      .selectFrom('categories')
      .selectAll()
      .where('category_group_id', '=', categoryGroupId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updateCategoryById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findCategoryById(id);
    }

    return db
      .updateTable('categories')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteCategoryById(id) {
    const result = await db.deleteFrom('categories').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },

  async createPayee(input) {
    return db.insertInto('payees').values(input).returningAll().executeTakeFirstOrThrow();
  },

  async findPayeeById(id) {
    return db.selectFrom('payees').selectAll().where('id', '=', id).executeTakeFirst();
  },

  async listPayeesByUserId(userId) {
    return db
      .selectFrom('payees')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('id', 'asc')
      .execute();
  },

  async updatePayeeById(id, patch) {
    if (Object.keys(patch).length === 0) {
      return this.findPayeeById(id);
    }

    return db
      .updateTable('payees')
      .set(patch)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  async deletePayeeById(id) {
    const result = await db.deleteFrom('payees').where('id', '=', id).executeTakeFirst();

    return hasAffectedRows(result.numDeletedRows);
  },
});
