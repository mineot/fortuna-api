import { contextBridge, ipcRenderer } from 'electron';
import { FilterTypes, NewType, Type, TypeUpdate } from './database/schemas';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => ipcRenderer.invoke('app:get-system-language'),
    types: {
      listAll: async (params?: FilterTypes): Promise<Type[]> =>
        ipcRenderer.invoke('types:list-all', params),
      find: async (id: number): Promise<Type | undefined> => ipcRenderer.invoke('types:find', id),
      create: async (type: NewType): Promise<InsertResult[]> =>
        ipcRenderer.invoke('types:create', type),
      update: async (type: TypeUpdate, id: number): Promise<UpdateResult[]> =>
        ipcRenderer.invoke('types:update', type, id),
      delete: async (id: number): Promise<DeleteResult[]> => ipcRenderer.invoke('types:delete', id),
    },
  },
});
