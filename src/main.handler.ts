import { ipcMain } from 'electron';
import { registerLanguageHandler } from './handlers/language.handler';
import { registerListAllTypes } from './handlers/types.handler';

export function registerHandlers(): void {
  ipcMain.handle('app:get-system-language', registerLanguageHandler);
  ipcMain.handle('types:list-all', registerListAllTypes);
}
