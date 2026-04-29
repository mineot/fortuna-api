import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { CATEGORY_GROUPS_CHANNELS } from './category-groups.types';

export function registerCategoryGroupsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'category_groups', CATEGORY_GROUPS_CHANNELS);
}
