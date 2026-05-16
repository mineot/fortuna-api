import type {
  CategoryGroupResponse,
  CategoryGroupUpdate,
  CreateCategoryGroupDto,
  UpdateCategoryGroupDto,
} from '@repo/shared';
import { createCategoryGroupsUseCases } from '@repo/domain';

import { mapDomainError } from '../../lib/domain-error.mapper.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export type CategoryGroupsListQuery = PaginationInput;

type CreateCategoryGroupPayload = Omit<CreateCategoryGroupDto, 'user_id'>;
type UpdateCategoryGroupPayload = Omit<UpdateCategoryGroupDto, 'user_id'>;

export const createCategoryGroupsService = (repositories: ApiRepositories) => {
  const useCases = createCategoryGroupsUseCases(repositories.categoryGroups);

  return {
    create: async (userId: number, payload: CreateCategoryGroupPayload): Promise<CategoryGroupResponse> => {
      return useCases.create({ user_id: userId, ...payload });
    },

    findById: async (userId: number, categoryGroupId: number): Promise<CategoryGroupResponse> => {
      try {
        return await useCases.findById(userId, categoryGroupId);
      } catch (error) {
        return mapDomainError(error);
      }
    },

    listByUser: async (userId: number, query: CategoryGroupsListQuery) => {
      const data = await useCases.listByUser(userId, {
        limit: query.page_size,
        offset: getOffsetFromPagination(query),
      });
      return toPaginatedResponse(data, query);
    },

    updateById: async (
      userId: number,
      categoryGroupId: number,
      payload: UpdateCategoryGroupPayload,
    ): Promise<CategoryGroupResponse> => {
      try {
        return await useCases.updateById(
          userId,
          categoryGroupId,
          omitUndefined(payload) as CategoryGroupUpdate,
        );
      } catch (error) {
        return mapDomainError(error);
      }
    },

    deleteById: async (userId: number, categoryGroupId: number): Promise<void> => {
      try {
        await useCases.deleteById(userId, categoryGroupId);
      } catch (error) {
        return mapDomainError(error);
      }
    },
  };
};

export type CategoryGroupsService = ReturnType<typeof createCategoryGroupsService>;
