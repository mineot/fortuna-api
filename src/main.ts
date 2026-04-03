#!/usr/bin/env node

import { app, BrowserWindow } from 'electron';
import { migrateDatabase } from './database/migrator';
import { registerHandlers } from './main.handler';
import path from 'node:path';

async function bootstrap(): Promise<void> {
  await migrateDatabase();
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    void win.loadURL('http://localhost:4200/');
    win.webContents.openDevTools();
    return;
  }

  void win.loadFile(path.join(__dirname, 'index.html'));
}

async function initApp(): Promise<void> {
  await app.whenReady();

  registerHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

bootstrap()
  .then(initApp)
  .catch((error) => {
    console.error('Failed to bootstrap app');
    console.error(error);
    process.exit(1);
  });
