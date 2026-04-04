import { Selectable, Insertable, Updateable } from 'kysely';

interface BaseTable {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface TypeTable extends BaseTable {
  group: number;
  name: string;
}

export type FilterTypes = { group?: number; name?: string };
export type NewType = Insertable<TypeTable>;
export type TypeSelect = Selectable<TypeTable>;
export type TypeUpdate = Updateable<TypeTable>;
