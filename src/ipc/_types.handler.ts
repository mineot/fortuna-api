import { getDatabase } from '@db';
import type { Type } from 'src/database/schema';

export function registerListAllTypes(): Promise<Type[]> {
  const db = getDatabase();
  return db.selectFrom('types').selectAll().execute();
}
