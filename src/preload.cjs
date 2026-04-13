const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fortuna', {
  getLocale: () => ipcRenderer.invoke('app:get-locale'),
  listTypes: (filters) => ipcRenderer.invoke('types:list', filters),
  insertType: (input) => ipcRenderer.invoke('types:insert', input),
  updateType: (input) => ipcRenderer.invoke('types:update', input),
  removeType: (input) => ipcRenderer.invoke('types:remove', input),
});
