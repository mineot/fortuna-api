import { ipcMain } from 'electron';
import { registerLanguageHandler } from './_language.handler';

export function registerAppHandlers(): void {
  ipcMain.handle('app:get-system-language', registerLanguageHandler);
}
