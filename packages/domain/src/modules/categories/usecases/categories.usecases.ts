import type { CategoryResponse, CategoryUpdate, NewCategory } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CategoriesListFilters, CategoriesPort } from '../ports.js';

export const createCategoriesUseCases = (categories: CategoriesPort) => ({
  create: (payload: NewCategory): Promise<CategoryResponse> => categories.create(payload),
  findById: async (userId: number, categoryId: number): Promise<CategoryResponse> => {
    const category = await categories.findById(userId, categoryId);
    if (!category) throw new DomainError({ code: 'CATEGORY_NOT_FOUND', message: 'Category not found.' });
    return category;
  },
  listByUser: (userId: number, filters: CategoriesListFilters): Promise<CategoryResponse[]> => categories.listByUser(userId, filters),
  updateById: async (userId: number, categoryId: number, payload: CategoryUpdate): Promise<CategoryResponse> => {
    const category = await categories.updateById(userId, categoryId, payload);
    if (!category) throw new DomainError({ code: 'CATEGORY_NOT_FOUND', message: 'Category not found.' });
    return category;
  },
  deleteById: async (userId: number, categoryId: number): Promise<void> => {
    const deleted = await categories.deleteById(userId, categoryId);
    if (!deleted) throw new DomainError({ code: 'CATEGORY_NOT_FOUND', message: 'Category not found.' });
  },
});
