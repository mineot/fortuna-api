import { IPC_CHANNELS } from '@shared/ipc';
import { app, ipcMain } from 'electron';

export function registerAppHandlers(): void {
  ipcMain.removeHandler(IPC_CHANNELS.appGetLocale);
  ipcMain.handle(IPC_CHANNELS.appGetLocale, async () => app.getLocale());
}
