import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('fortuna', {
  appName: 'Fortuna',
});
