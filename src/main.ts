import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { destroyDb, getDb, migrateToLatest } from '@db';
import { registerIpcHandlers } from '@shared/handlers';
import { app, BrowserWindow } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'dev';

function resolveHtmlPath(): string {
  return path.join(__dirname, 'index.html');
}

function resolvePreloadPath(): string {
  if (isDev) {
    return path.join(__dirname, 'preload.cjs');
  }

  return path.join(__dirname, 'preload.cjs');
}

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: resolvePreloadPath(),
    },
  });

  if (isDev) {
    await mainWindow.loadURL('http://127.0.0.1:5173');
    return;
  }

  await mainWindow.loadFile(resolveHtmlPath());
}

app
  .whenReady()
  .then(async () => {
    const db = getDb();
    await migrateToLatest();
    registerIpcHandlers(db);

    await createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void createWindow();
      }
    });
  })
  .catch((error: unknown) => {
    console.error('Failed to start Electron app:', error);
    app.exit(1);
  });

let isQuitting = false;

app.on('before-quit', (event) => {
  if (isQuitting) {
    return;
  }

  event.preventDefault();
  isQuitting = true;

  destroyDb()
    .catch(() => {})
    .finally(() => {
      app.quit();
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
