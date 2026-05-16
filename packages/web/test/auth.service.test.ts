import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { firstValueFrom } from 'rxjs';
import { of, throwError } from 'rxjs';

import { AuthService } from '../src/app/core/auth/auth.service.js';
import { AuthSessionService } from '../src/app/core/auth/auth-session.service.js';

interface MemoryStorage {
  clear: () => void;
  getItem: (key: string) => string | null;
  key: (index: number) => string | null;
  length: number;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

const createMemoryStorage = (): MemoryStorage => {
  const map = new Map<string, string>();

  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
};

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
});

test('AuthService.login stores access token in session', async () => {
  const storage = createMemoryStorage();
  Reflect.set(globalThis, 'window', { sessionStorage: storage });

  const session = new AuthSessionService();
  const apiClient = {
    post: () => of({ access_token: 'jwt-token' }),
    get: () => of(undefined),
  };

  const service = new AuthService(apiClient as never, session);
  await firstValueFrom(service.login({ email: 'user@local', password: 'secret' }));

  assert.equal(session.getAccessToken(), 'jwt-token');
  assert.equal(session.isAuthenticated(), true);
});

test('AuthService.logout clears session even when API fails', async () => {
  const storage = createMemoryStorage();
  Reflect.set(globalThis, 'window', { sessionStorage: storage });

  const session = new AuthSessionService();
  session.setAccessToken('jwt-token');

  const apiClient = {
    post: () => throwError(() => new Error('network error')),
    get: () => of(undefined),
  };

  const service = new AuthService(apiClient as never, session);

  await assert.rejects(
    async () => firstValueFrom(service.logout()),
    /network error/,
  );

  assert.equal(session.getAccessToken(), null);
  assert.equal(session.isAuthenticated(), false);
});
