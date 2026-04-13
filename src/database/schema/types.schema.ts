import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface TypeTable {
  id: Generated<number>;
  group: string;
  value: string;
}

type NewType = Insertable<TypeTable>;
type TypeUpdate = Updateable<TypeTable>;

export type TypeFilters = { group?: string; name?: string };
export type TypeInsertInput = Omit<NewType, 'id'>;
export type TypeRemoveInput = { id: number };
export type Types = Selectable<TypeTable>;
export type TypeUpdateInput = { id: number } & Omit<TypeUpdate, 'id'>;
