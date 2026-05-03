import type { CategoryGroup, CategoryGroupUpdate, NewCategoryGroup } from '@db/schema';

import { CrudService } from './crud.service';

class CategoryGroupsService extends CrudService<CategoryGroup, NewCategoryGroup, CategoryGroupUpdate> {
  constructor() {
    super(window.fortuna.categoryGroups);
  }
}

export const categoryGroupsService = new CategoryGroupsService();
