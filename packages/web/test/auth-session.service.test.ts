import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

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

test('AuthSessionService stores and restores access token', () => {
  const storage = createMemoryStorage();
  Reflect.set(globalThis, 'window', { sessionStorage: storage });

  const session = new AuthSessionService();
  session.setAccessToken('token-123');

  assert.equal(session.isAuthenticated(), true);
  assert.equal(session.getAccessToken(), 'token-123');

  const restored = new AuthSessionService();
  restored.initializeFromStorage();
  assert.equal(restored.getAccessToken(), 'token-123');
});

test('AuthSessionService does not crash without window/sessionStorage', () => {
  const session = new AuthSessionService();

  session.setAccessToken('token-abc');
  assert.equal(session.isAuthenticated(), true);

  session.clear();
  assert.equal(session.isAuthenticated(), false);
});
