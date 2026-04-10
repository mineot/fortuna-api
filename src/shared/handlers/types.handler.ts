import type { Database } from '@db';
import { IPC_CHANNELS } from '@shared/ipc';
import { ipcMain } from 'electron';
import type { Kysely } from 'kysely';

export function registerTypesHandlers(db: Kysely<Database>): void {
  ipcMain.removeHandler(IPC_CHANNELS.typesList);
  ipcMain.handle(IPC_CHANNELS.typesList, async () => {
    return db.selectFrom('types').selectAll().execute();
  });
}
