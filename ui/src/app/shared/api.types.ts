import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { ApiMessage } from './api-message';
import { FilterTypes, NewType, TypeSelect, TypeUpdate } from './models/types.model';

type SystemLanguage = () => ApiMessage<string[]>;

export type Types = {
  listAll: (params?: FilterTypes) => ApiMessage<TypeSelect[]>;
  create: (type: NewType) => ApiMessage<InsertResult[]>;
  update: (type: TypeUpdate, id: number) => ApiMessage<UpdateResult[]>;
  delete: (id: number) => ApiMessage<DeleteResult[]>;
};

export type Api = {
  getSystemLanguage: SystemLanguage;
  types: Types;
};

export interface OnApi {
  getSystemLanguage: SystemLanguage;
  types: Types;
}
