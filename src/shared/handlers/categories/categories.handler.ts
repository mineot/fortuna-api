import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { CATEGORIES_CHANNELS } from './categories.types';

export function registerCategoriesHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'categories', CATEGORIES_CHANNELS);
}
