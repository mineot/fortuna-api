import { ipcMain } from 'electron';
import { registerLanguageHandler } from './_language.handler';
import { registerListAllTypes } from './_types.handler';

export function registerAppHandlers(): void {
  ipcMain.handle('app:get-system-language', registerLanguageHandler);
  ipcMain.handle('types:list-all', registerListAllTypes);
}
