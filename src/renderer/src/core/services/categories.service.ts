import type { Category,CategoryUpdate, NewCategory } from '@db/schema';

class CategoriesService {
  list(input?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' }) {
    return window.fortuna.categories.list(input);
  }

  listAll(): Promise<Category[]> {
    return window.fortuna.categories.listAll() as Promise<Category[]>;
  }

  findOne(id: number): Promise<Category | undefined> {
    return window.fortuna.categories.findOne(id) as Promise<Category | undefined>;
  }

  add(input: NewCategory): Promise<Category> {
    return window.fortuna.categories.add(input) as Promise<Category>;
  }

  change(input: { id: number; changes: Partial<CategoryUpdate> }): Promise<Category | undefined> {
    return window.fortuna.categories.change(input) as Promise<Category | undefined>;
  }

  remove(id: number): Promise<boolean> {
    return window.fortuna.categories.remove(id) as Promise<boolean>;
  }
}

export const categoriesService = new CategoriesService();
