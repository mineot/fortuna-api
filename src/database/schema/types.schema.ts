import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface TypeTable {
  id: Generated<number>;
  group: string;
  value: string;
}

export type NewType = Insertable<TypeTable>;
export type Types = Selectable<TypeTable>;
export type TypeUpdate = Updateable<TypeTable>;
