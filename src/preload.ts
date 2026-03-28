import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
  app: {
    getSystemLanguage: (): Promise<string[]> => {
      return ipcRenderer.invoke('app:get-system-language');
    },
  },
});