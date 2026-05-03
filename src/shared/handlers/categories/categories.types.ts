import type { CategoriesTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CATEGORIES_CHANNELS = {
  list: 'categories:list',
  findOne: 'categories:find-one',
  add: 'categories:add',
  change: 'categories:change',
  remove: 'categories:remove',
} as const;

export type CategoriesRow = Selectable<CategoriesTable>;
export type CategoriesAddInput = Insertable<CategoriesTable>;
export type CategoriesChangeInput = { id: number; changes: Updateable<CategoriesTable> };
