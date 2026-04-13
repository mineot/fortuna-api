import { contextBridge, ipcRenderer } from 'electron';

import type { RendererApi } from './shared/ipc';
import { IPC_CHANNELS } from './shared/ipc';

const api: RendererApi = {
  getLocale: () => ipcRenderer.invoke(IPC_CHANNELS.appGetLocale),
  listTypes: (filters) => ipcRenderer.invoke(IPC_CHANNELS.typesList, filters),
  insertType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesInsert, input),
  updateType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesUpdate, input),
  removeType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesRemove, input),
};

contextBridge.exposeInMainWorld('fortuna', api);
