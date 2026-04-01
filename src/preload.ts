import { contextBridge, ipcRenderer } from 'electron';
import { Type } from './database/schema';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => {
      return ipcRenderer.invoke('app:get-system-language');
    },
    types: {
      listAll: (): Promise<Type[]> => {
        return ipcRenderer.invoke('types:list-all');
      },
    },
  },
});
