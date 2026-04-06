import { FilterTypes, NewType, Type, TypeTable, TypeUpdate } from './_types.model';

export interface BaseTable {
  id?: number;
  created_at: string;
  updated_at: string;
}

export type { FilterTypes, NewType, Type, TypeTable, TypeUpdate };
