import type { CliLogger, Clock, SessionStore, SessionProvider } from './types.js';

export const systemClock: Clock = {
  now: () => new Date()
};

export const consoleLogger: CliLogger = {
  info: (message, details) => {
    if (details === undefined) {
      console.log(message);
      return;
    }
    console.log(message, details);
  },
  error: (message, details) => {
    if (details === undefined) {
      console.error(message);
      return;
    }
    console.error(message, details);
  }
};

export function createInMemorySessionStore(): SessionStore {
  let token: string | null = null;
  return {
    async getAccessToken() {
      return token;
    },
    async setAccessToken(nextToken: string) {
      token = nextToken;
    },
    async clear() {
      token = null;
    }
  };
}

export function createSessionProvider(sessionStore: SessionStore): SessionProvider {
  return {
    readToken: () => sessionStore.getAccessToken(),
    writeToken: (token: string) => sessionStore.setAccessToken(token),
    clearToken: () => sessionStore.clear()
  };
}
