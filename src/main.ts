import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveHtmlPath(): string {
  const distHtmlPath = path.join(__dirname, 'index.html');
  const devHtmlPath = path.join(__dirname, 'renderer', 'index.html');
  return __dirname.endsWith(path.sep + 'dist') ? distHtmlPath : devHtmlPath;
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(resolveHtmlPath());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
