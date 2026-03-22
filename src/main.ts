#!/usr/bin/env node

import { app, BrowserWindow } from "electron";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    backgroundColor: "#111827",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Fortuna</title>
        <style>
          :root {
            color-scheme: dark;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
            background: #111827;
            color: #f9fafb;
          }

          main {
            text-align: center;
            padding: 32px;
          }

          h1 {
            margin: 0 0 12px;
            font-size: 32px;
          }

          p {
            margin: 0;
            opacity: 0.85;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Fortuna</h1>
          <p>Electron configurado com sucesso.</p>
        </main>
      </body>
    </html>
  `;

  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
