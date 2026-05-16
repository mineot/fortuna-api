import type { CategoryGroupResponse, CategoryGroupUpdate, NewCategoryGroup } from '@repo/shared';
import { DomainError } from '../../../errors/domain-error.js';
import type { CategoryGroupsListFilters, CategoryGroupsPort } from '../ports.js';

export const createCategoryGroupsUseCases = (categoryGroups: CategoryGroupsPort) => ({
  create: (payload: NewCategoryGroup): Promise<CategoryGroupResponse> => categoryGroups.create(payload),
  findById: async (userId: number, categoryGroupId: number): Promise<CategoryGroupResponse> => {
    const item = await categoryGroups.findById(userId, categoryGroupId);
    if (!item) throw new DomainError({ code: 'CATEGORY_GROUP_NOT_FOUND', message: 'Category group not found.' });
    return item;
  },
  listByUser: (userId: number, filters: CategoryGroupsListFilters): Promise<CategoryGroupResponse[]> => categoryGroups.listByUser(userId, filters),
  updateById: async (userId: number, categoryGroupId: number, payload: CategoryGroupUpdate): Promise<CategoryGroupResponse> => {
    const item = await categoryGroups.updateById(userId, categoryGroupId, payload);
    if (!item) throw new DomainError({ code: 'CATEGORY_GROUP_NOT_FOUND', message: 'Category group not found.' });
    return item;
  },
  deleteById: async (userId: number, categoryGroupId: number): Promise<void> => {
    const deleted = await categoryGroups.deleteById(userId, categoryGroupId);
    if (!deleted) throw new DomainError({ code: 'CATEGORY_GROUP_NOT_FOUND', message: 'Category group not found.' });
  },
});
