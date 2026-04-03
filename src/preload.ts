import { contextBridge, ipcRenderer } from 'electron';
import { ListAllParams } from './handlers/types.handler';
import { Type } from './database/schema';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => ipcRenderer.invoke('app:get-system-language'),
    types: {
      listAll: async (params?: ListAllParams): Promise<Type[]> =>
        ipcRenderer.invoke('types:list-all', params),
      create: async (type: Type): Promise<InsertResult[]> =>
        ipcRenderer.invoke('types:create', type),
      update: async (type: Type): Promise<UpdateResult[]> =>
        ipcRenderer.invoke('types:update', type),
      delete: async (id: number): Promise<DeleteResult[]> => ipcRenderer.invoke('types:delete', id),
    },
  },
});
