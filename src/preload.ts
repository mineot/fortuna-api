import { ApiMessage } from './api-message';
import { contextBridge, ipcRenderer } from 'electron';
import { FilterTypes, NewType, TypeSelect, TypeUpdate } from './database/schema';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): ApiMessage<string[]> => ipcRenderer.invoke('app:get-system-language'),
    types: {
      listAll: async (params?: FilterTypes): ApiMessage<TypeSelect[]> =>
        ipcRenderer.invoke('types:list-all', params),
      create: async (type: NewType): ApiMessage<InsertResult[]> =>
        ipcRenderer.invoke('types:create', type),
      update: async (type: TypeUpdate, id: number): ApiMessage<UpdateResult[]> =>
        ipcRenderer.invoke('types:update', type, id),
      delete: async (id: number): ApiMessage<DeleteResult[]> =>
        ipcRenderer.invoke('types:delete', id),
    },
  },
});
