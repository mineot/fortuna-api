import type { Category, CategoryUpdate, NewCategory } from '@db/schema';

import { CrudService } from './crud.service';

class CategoriesService extends CrudService<Category, NewCategory, CategoryUpdate> {
  constructor() {
    super(window.fortuna.categories);
  }
}

export const categoriesService = new CategoriesService();
