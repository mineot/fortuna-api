import { contextBridge, ipcRenderer } from 'electron';

import type { RendererApi } from './shared/ipc';
import { IPC_CHANNELS } from './shared/ipc';

const api: RendererApi = {
  getLocale: () => ipcRenderer.invoke(IPC_CHANNELS.appGetLocale),
  listTypes: () => ipcRenderer.invoke(IPC_CHANNELS.typesList),
};

contextBridge.exposeInMainWorld('fortuna', api);
