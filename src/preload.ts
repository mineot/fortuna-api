import { contextBridge, ipcRenderer } from 'electron';
import { Type } from './database/schema';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => ipcRenderer.invoke('app:get-system-language'),
    types: {
      listAll: (): Promise<Type[]> => ipcRenderer.invoke('types:list-all'),
    },
  },
});
