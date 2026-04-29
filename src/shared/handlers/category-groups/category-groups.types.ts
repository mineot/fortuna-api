import type { CategoryGroupsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CATEGORY_GROUPS_CHANNELS = {
  list: 'category-groups:list',
  listAll: 'category-groups:list-all',
  findOne: 'category-groups:find-one',
  add: 'category-groups:add',
  change: 'category-groups:change',
  remove: 'category-groups:remove',
} as const;

export type CategoryGroupsRow = Selectable<CategoryGroupsTable>;
export type CategoryGroupsAddInput = Insertable<CategoryGroupsTable>;
export type CategoryGroupsChangeInput = { id: number; changes: Updateable<CategoryGroupsTable> };
