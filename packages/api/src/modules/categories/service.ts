import type {
  CategoryResponse,
  CategoryUpdate,
  CreateCategoryDto,
  TransactionType,
  UpdateCategoryDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CategoriesListQuery extends PaginationInput {
  category_group_id?: number | undefined;
  type?: TransactionType | undefined;
}

type CreateCategoryPayload = Omit<CreateCategoryDto, 'user_id'>;
type UpdateCategoryPayload = Omit<UpdateCategoryDto, 'user_id'>;

export const createCategoriesService = (repositories: ApiRepositories) => ({
  create: async (userId: number, payload: CreateCategoryPayload): Promise<CategoryResponse> => {
    return repositories.categories.create({
      user_id: userId,
      ...payload,
    });
  },

  findById: async (userId: number, categoryId: number): Promise<CategoryResponse> => {
    const category = await repositories.categories.findById(userId, categoryId);

    if (!category) {
      throw new DomainError(404, {
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found.',
      });
    }

    return category;
  },

  listByUser: async (userId: number, query: CategoriesListQuery) => {
    const filters = {
      limit: query.page_size,
      offset: getOffsetFromPagination(query),
      ...(query.category_group_id !== undefined ? { categoryGroupId: query.category_group_id } : {}),
      ...(query.type !== undefined ? { type: query.type } : {}),
    };

    const data = await repositories.categories.listByUser(userId, {
      ...filters,
    });

    return toPaginatedResponse(data, query);
  },

  updateById: async (
    userId: number,
    categoryId: number,
    payload: UpdateCategoryPayload,
  ): Promise<CategoryResponse> => {
    const category = await repositories.categories.updateById(
      userId,
      categoryId,
      omitUndefined(payload) as CategoryUpdate,
    );

    if (!category) {
      throw new DomainError(404, {
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found.',
      });
    }

    return category;
  },

  deleteById: async (userId: number, categoryId: number): Promise<void> => {
    const deleted = await repositories.categories.deleteById(userId, categoryId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found.',
      });
    }
  },
});

export type CategoriesService = ReturnType<typeof createCategoriesService>;
