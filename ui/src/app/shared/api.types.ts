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

export type Api = {
  getSystemLanguage: () => Promise<string | null>;
  types: {
    listAll: (params?: ListAllTypes) => Promise<Type[]>;
  };
};

export interface OnApi {
  getSystemLanguage: () => Promise<string | null>;
  types: {
    listAll: (params?: ListAllTypes) => Promise<Type[]>;
  };
}
