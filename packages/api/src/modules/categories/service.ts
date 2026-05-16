import type {
  CategoryResponse,
  CategoryUpdate,
  CreateCategoryDto,
  TransactionType,
  UpdateCategoryDto,
} from '@repo/shared';
import { createCategoriesUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export interface CategoriesListQuery extends PaginationInput {
  category_group_id?: number | undefined;
  type?: TransactionType | undefined;
}

type CreateCategoryPayload = Omit<CreateCategoryDto, 'user_id'>;
type UpdateCategoryPayload = Omit<UpdateCategoryDto, 'user_id'>;

export const createCategoriesService = (repositories: ApiRepositories) => {
  const useCases = createCategoriesUseCases(repositories.categories);

  return {
    create: async (userId: number, payload: CreateCategoryPayload): Promise<CategoryResponse> =>
      useCases.create({ user_id: userId, ...payload }),

    findById: async (userId: number, categoryId: number): Promise<CategoryResponse> => {
      try {
        return await useCases.findById(userId, categoryId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: CategoriesListQuery) => {
      const data = await useCases.listByUser(userId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
        ...(query.category_group_id !== undefined ? { categoryGroupId: query.category_group_id } : {}),
        ...(query.type !== undefined ? { type: query.type } : {}),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      categoryId: number,
      payload: UpdateCategoryPayload,
    ): Promise<CategoryResponse> => {
      try {
        return await useCases.updateById(userId, categoryId, omitUndefined(payload) as CategoryUpdate);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, categoryId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, categoryId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type CategoriesService = ReturnType<typeof createCategoriesService>;
