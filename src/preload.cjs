const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fortuna', {
  getLocale: () => ipcRenderer.invoke('app:get-locale'),
  listTypes: () => ipcRenderer.invoke('types:list'),
});
