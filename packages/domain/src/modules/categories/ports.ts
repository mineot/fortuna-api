import type { CategoryResponse, CategoryUpdate, NewCategory, TransactionType } from '@repo/shared';

export interface CategoriesListFilters {
  limit?: number;
  offset?: number;
  categoryGroupId?: number;
  type?: TransactionType;
}

export interface CategoriesPort {
  create(payload: NewCategory): Promise<CategoryResponse>;
  findById(userId: number, categoryId: number): Promise<CategoryResponse | undefined>;
  listByUser(userId: number, filters?: CategoriesListFilters): Promise<CategoryResponse[]>;
  updateById(userId: number, categoryId: number, payload: CategoryUpdate): Promise<CategoryResponse | undefined>;
  deleteById(userId: number, categoryId: number): Promise<boolean>;
}
