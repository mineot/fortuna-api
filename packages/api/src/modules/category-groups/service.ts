import type {
  CategoryGroupUpdate,
  CategoryGroupResponse,
  CreateCategoryGroupDto,
  UpdateCategoryGroupDto,
} from '@repo/shared';

import { DomainError } from '../../lib/errors.js';
import { omitUndefined } from '../../lib/object.js';
import { getOffsetFromPagination, toPaginatedResponse, type PaginationInput } from '../../lib/pagination.js';
import type { ApiRepositories } from '../../lib/repositories.js';

export type CategoryGroupsListQuery = PaginationInput;

type CreateCategoryGroupPayload = Omit<CreateCategoryGroupDto, 'user_id'>;
type UpdateCategoryGroupPayload = Omit<UpdateCategoryGroupDto, 'user_id'>;

export const createCategoryGroupsService = (repositories: ApiRepositories) => ({
  create: async (
    userId: number,
    payload: CreateCategoryGroupPayload,
  ): Promise<CategoryGroupResponse> => {
    return repositories.categoryGroups.create({
      user_id: userId,
      ...payload,
    });
  },

  findById: async (userId: number, categoryGroupId: number): Promise<CategoryGroupResponse> => {
    const categoryGroup = await repositories.categoryGroups.findById(userId, categoryGroupId);

    if (!categoryGroup) {
      throw new DomainError(404, {
        code: 'CATEGORY_GROUP_NOT_FOUND',
        message: 'Category group not found.',
      });
    }

    return categoryGroup;
  },

  listByUser: async (userId: number, query: CategoryGroupsListQuery) => {
    const data = await repositories.categoryGroups.listByUser(userId, {
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
    const categoryGroup = await repositories.categoryGroups.updateById(
      userId,
      categoryGroupId,
      omitUndefined(payload) as CategoryGroupUpdate,
    );

    if (!categoryGroup) {
      throw new DomainError(404, {
        code: 'CATEGORY_GROUP_NOT_FOUND',
        message: 'Category group not found.',
      });
    }

    return categoryGroup;
  },

  deleteById: async (userId: number, categoryGroupId: number): Promise<void> => {
    const deleted = await repositories.categoryGroups.deleteById(userId, categoryGroupId);

    if (!deleted) {
      throw new DomainError(404, {
        code: 'CATEGORY_GROUP_NOT_FOUND',
        message: 'Category group not found.',
      });
    }
  },
});

export type CategoryGroupsService = ReturnType<typeof createCategoryGroupsService>;
