import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export type FortunaEnv = 'dev' | 'prod';

function getEnvironment(): FortunaEnv {
  const env = process.env.FORTUNA_ENV;
  return env === 'dev' ? 'dev' : 'prod';
}

export function getDatabasePath(): string {
  const env = getEnvironment();

  if (env === 'dev') {
    return path.resolve(process.cwd(), 'dev.db');
  }

  const prodDirectory = path.resolve(os.homedir(), '.fortuna');
  fs.mkdirSync(prodDirectory, { recursive: true });

  return path.resolve(prodDirectory, 'fortuna.db');
}
