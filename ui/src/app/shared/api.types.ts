export type Type = {
  id?: number;
  name: string;
  group: number;
  created_at: string;
  updated_at: string;
};

export type Api = {
  getSystemLanguage: () => Promise<string | null>;
  types: {
    listAll: () => Promise<Type[]>;
  };
};

export interface OnApi {
  getSystemLanguage: () => Promise<string | null>;
  types: {
    listAll: () => Promise<Type[]>;
  };
}
