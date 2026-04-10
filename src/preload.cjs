const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fortuna', {
  listTypes: () => ipcRenderer.invoke('types:list'),
});
