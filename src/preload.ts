import { contextBridge, ipcRenderer } from 'electron';

import type { RendererApi } from './shared/ipc';
import { IPC_CHANNELS } from './shared/ipc';

const api: RendererApi = {
  listTypes: () => ipcRenderer.invoke(IPC_CHANNELS.typesList),
};

contextBridge.exposeInMainWorld('fortuna', api);
