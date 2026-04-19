import { APP_CHANNELS } from '@shared/handlers/app.types';
import { contextBridge, ipcRenderer } from 'electron';

import type { RendererApi } from './shared/ipc';
import { IPC_CHANNELS } from './shared/ipc';

const api: RendererApi = {
  appGetMeta: () => ipcRenderer.invoke(APP_CHANNELS.getMeta),
  appGetLocale: () => ipcRenderer.invoke(APP_CHANNELS.getLocale),
  listTypes: (filters) => ipcRenderer.invoke(IPC_CHANNELS.typesList, filters),
  insertType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesInsert, input),
  updateType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesUpdate, input),
  removeType: (input) => ipcRenderer.invoke(IPC_CHANNELS.typesRemove, input),
};

contextBridge.exposeInMainWorld('fortuna', api);
