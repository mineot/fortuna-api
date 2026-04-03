import { contextBridge, ipcRenderer } from 'electron';
import { ListAllParams } from './handlers/types.handler';
import { Type } from './database/schema';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => ipcRenderer.invoke('app:get-system-language'),
    types: {
      listAll: (params?: ListAllParams): Promise<Type[]> =>
        ipcRenderer.invoke('types:list-all', params),
    },
  },
});
