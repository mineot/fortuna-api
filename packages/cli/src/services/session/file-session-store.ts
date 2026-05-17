import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join } from 'node:path';
import { homedir } from 'node:os';

import type { SessionStore } from '../types.js';

interface SessionPayload {
  access_token: string;
}

function resolveSessionPath(pathValue: string): string {
  if (isAbsolute(pathValue)) {
    return pathValue;
  }
  return join(homedir(), pathValue);
}

export function createFileSessionStore(pathValue: string): SessionStore {
  const resolvedPath = resolveSessionPath(pathValue);

  return {
    async getAccessToken(): Promise<string | null> {
      try {
        const raw = await readFile(resolvedPath, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<SessionPayload>;
        if (typeof parsed.access_token !== 'string' || parsed.access_token.length === 0) {
          return null;
        }
        return parsed.access_token;
      } catch {
        return null;
      }
    },

    async setAccessToken(token: string): Promise<void> {
      const parent = dirname(resolvedPath);
      await mkdir(parent, { recursive: true });
      const payload: SessionPayload = { access_token: token };
      await writeFile(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
    },

    async clear(): Promise<void> {
      await rm(resolvedPath, { force: true });
    }
  };
}

