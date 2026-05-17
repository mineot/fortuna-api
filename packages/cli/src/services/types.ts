import type { CliConfig } from '../config/cli-config.js';
import type { CliMode } from '../plan/command-matrix.js';

export interface CliLogger {
  info(message: string, details?: unknown): void;
  error(message: string, details?: unknown): void;
}

export interface Clock {
  now(): Date;
}

export interface SessionStore {
  getAccessToken(): Promise<string | null>;
  setAccessToken(token: string): Promise<void>;
  clear(): Promise<void>;
}

export interface SessionProvider {
  readToken(): Promise<string | null>;
  writeToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

export interface LocalAdapter {
  readonly mode: 'local';
  readonly environment: 'DEV' | 'PROD';
}

export interface RemoteAdapter {
  readonly mode: 'remote';
  readonly environment: 'DEV' | 'PROD';
  readonly apiBaseUrl: string;
}

export type CliAdapterByMode = {
  local: LocalAdapter;
  remote: RemoteAdapter;
};

export interface CliContext {
  requestId: string;
  startedAt: Date;
  mode: CliMode;
  config: CliConfig;
  logger: CliLogger;
  clock: Clock;
  sessionStore: SessionStore;
  sessionProvider: SessionProvider;
  adapter: LocalAdapter | RemoteAdapter;
}
