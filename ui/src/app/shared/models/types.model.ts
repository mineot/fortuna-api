export type Type = {
  id?: number;
  name: string;
  group: number;
  created_at: string;
  updated_at: string;
};

export type ListAllTypes = {
  group?: number;
  name?: string;
};

export type CreateType = {
  group: number;
  name: string;
};

export type UpdateType = {
  id: number;
  group: number;
  name: string;
};

export type DeleteType = {
  id: number;
};

export type RegisterTypes = {
  listAll: (params?: ListAllTypes) => Promise<Type[]>;
  create: (type: CreateType) => Promise<unknown[]>;
  update: (type: UpdateType) => Promise<unknown[]>;
  delete: (id: number) => Promise<unknown[]>;
};
