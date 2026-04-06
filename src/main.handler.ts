import { ipcMain } from 'electron';
import { registerLanguageHandler } from './handlers/language.handler';

import {
  registerCreateType,
  registerDeleteType,
  registerFindType,
  registerListAllTypes,
  registerUpdateType,
} from './handlers/types.handler';

export function registerHandlers(): void {
  ipcMain.handle('app:get-system-language', registerLanguageHandler);
  ipcMain.handle('types:list-all', registerListAllTypes);
  ipcMain.handle('types:find', registerFindType);
  ipcMain.handle('types:create', registerCreateType);
  ipcMain.handle('types:update', registerUpdateType);
  ipcMain.handle('types:delete', registerDeleteType);
}
