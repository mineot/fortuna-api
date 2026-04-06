import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { FilterTypes, NewType, Type, TypeUpdate } from './models';

type SystemLanguage = () => Promise<string[]>;

export type Types = {
  listAll: (params?: FilterTypes) => Promise<Type[]>;
  find(id: number): Promise<Type | undefined>;
  create: (type: NewType) => Promise<InsertResult[]>;
  update: (type: TypeUpdate, id: number) => Promise<UpdateResult[]>;
  delete: (id: number) => Promise<DeleteResult[]>;
};

export type Api = {
  getSystemLanguage: SystemLanguage;
  types: Types;
};

export interface OnApi {
  getSystemLanguage: SystemLanguage;
  types: Types;
}
