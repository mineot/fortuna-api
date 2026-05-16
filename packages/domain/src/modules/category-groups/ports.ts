import type { CategoryGroupResponse, CategoryGroupUpdate, NewCategoryGroup } from '@repo/shared';

export interface CategoryGroupsListFilters {
  limit?: number;
  offset?: number;
}

export interface CategoryGroupsPort {
  create(payload: NewCategoryGroup): Promise<CategoryGroupResponse>;
  findById(userId: number, categoryGroupId: number): Promise<CategoryGroupResponse | undefined>;
  listByUser(userId: number, filters?: CategoryGroupsListFilters): Promise<CategoryGroupResponse[]>;
  updateById(userId: number, categoryGroupId: number, payload: CategoryGroupUpdate): Promise<CategoryGroupResponse | undefined>;
  deleteById(userId: number, categoryGroupId: number): Promise<boolean>;
}
