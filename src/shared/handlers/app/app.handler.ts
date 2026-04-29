import { app, ipcMain } from 'electron';

import meta from '../../../../package.json';
import { APP_CHANNELS, type GetLocaleResponse, type GetMetaResponse } from './app.types';

export function registerAppHandlers(): void {
  ipcMain.removeHandler(APP_CHANNELS.getLocale);
  ipcMain.handle(APP_CHANNELS.getLocale, async (): Promise<GetLocaleResponse> => app.getLocale());

  ipcMain.removeHandler(APP_CHANNELS.getMeta);
  ipcMain.handle(
    APP_CHANNELS.getMeta,
    async (): Promise<GetMetaResponse> => ({
      name: meta.name.charAt(0).toUpperCase() + meta.name.slice(1).toLowerCase(),
      version: meta.version,
    }),
  );
}
