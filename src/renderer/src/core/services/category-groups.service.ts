import type { CategoryGroup,CategoryGroupUpdate, NewCategoryGroup } from '@db/schema';

class CategoryGroupsService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.categoryGroups.list(input);
  }

  listAll(): Promise<CategoryGroup[]> {
    return window.fortuna.categoryGroups.listAll() as Promise<CategoryGroup[]>;
  }

  findOne(id: number): Promise<CategoryGroup | undefined> {
    return window.fortuna.categoryGroups.findOne(id) as Promise<CategoryGroup | undefined>;
  }

  add(input: NewCategoryGroup): Promise<CategoryGroup> {
    return window.fortuna.categoryGroups.add(input) as Promise<CategoryGroup>;
  }

  change(input: { id: number; changes: Partial<CategoryGroupUpdate> }): Promise<CategoryGroup | undefined> {
    return window.fortuna.categoryGroups.change(input) as Promise<CategoryGroup | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.categoryGroups.remove(id) as Promise<boolean>;
  }
}

export const categoryGroupsService = new CategoryGroupsService();
