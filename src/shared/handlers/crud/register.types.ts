import type { Database } from '@db';
import type { Insertable, Selectable, Updateable } from 'kysely';

export type CrudChannels = {
  list: string;
  findOne: string;
  add: string;
  change: string;
  remove: string;
};

export type Filter = {
  column: string;
  operator: string;
  value: unknown;
};

export type Order = {
  column: string;
  order: 'asc' | 'desc';
};

export type ListInput = {
  page?: number;
  pageSize?: number;
  orders?: Order[];
  filters?: Filter[];
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startItem: number;
  endItem: number;
};

export type TableWithId = { id: unknown };

export type CrudTableName = {
  [K in keyof Database]: Database[K] extends TableWithId ? K : never;
}[keyof Database];

export type CrudRow<TTable extends CrudTableName> = Selectable<Database[TTable]>;
export type CrudInsert<TTable extends CrudTableName> = Insertable<Database[TTable]>;
export type CrudUpdate<TTable extends CrudTableName> = Updateable<Database[TTable]>;

export const ALLOWED_OPERATORS = new Set([
  '=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'like',
  'not like',
  'ilike',
  'not ilike',
  'in',
  'not in',
  'is',
  'is not',
  'is distinct from',
  'is not distinct from',
]);
