import { Selectable, Insertable, Updateable } from 'kysely';
import { BaseTable } from '.';

export interface TypeTable extends BaseTable {
  group: number;
  name: string;
}

export type FilterTypes = { group?: number; name?: string };
export type NewType = Insertable<TypeTable>;
export type Type = Selectable<TypeTable>;
export type TypeUpdate = Updateable<TypeTable>;
