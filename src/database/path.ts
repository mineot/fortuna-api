import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function getDatabasePath(): string {
  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    return path.join(process.cwd(), 'dev.db');
  }

  const homeDir = os.homedir();
  const fortunaDir = path.join(homeDir, '.fortuna');

  if (!fs.existsSync(fortunaDir)) {
    fs.mkdirSync(fortunaDir, { recursive: true });
  }

  return path.join(fortunaDir, 'fortuna.db');
}
