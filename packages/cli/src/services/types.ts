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

export interface LocalAdapter {
  readonly mode: 'local';
}

export interface RemoteAdapter {
  readonly mode: 'remote';
  readonly apiBaseUrl: string;
}

export type CliAdapterByMode = {
  local: LocalAdapter;
  remote: RemoteAdapter;
};

export interface CliContext {
  mode: CliMode;
  config: CliConfig;
  logger: CliLogger;
  clock: Clock;
  sessionStore: SessionStore;
  adapter: LocalAdapter | RemoteAdapter;
}

