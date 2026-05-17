import { createCliConfig } from '../config/cli-config.js';
import { createLocalAdapter } from '../adapters/local/local-adapter.js';
import { createRemoteAdapter } from '../adapters/remote/remote-adapter.js';
import { consoleLogger, createInMemorySessionStore, systemClock } from './defaults.js';
import type { CliContext, CliLogger, Clock, SessionStore } from './types.js';
import type { EnvMap } from '../config/cli-config.js';

export interface CreateCliContextInput {
  args: readonly string[];
  env?: EnvMap;
  logger?: CliLogger;
  clock?: Clock;
  sessionStore?: SessionStore;
}

export function createCliContext(input: CreateCliContextInput): CliContext {
  const config = createCliConfig(input.args, input.env);
  const adapter =
    config.mode === 'local'
      ? createLocalAdapter()
      : createRemoteAdapter(config.apiBaseUrl);

  return {
    mode: config.mode,
    config,
    logger: input.logger ?? consoleLogger,
    clock: input.clock ?? systemClock,
    sessionStore: input.sessionStore ?? createInMemorySessionStore(),
    adapter
  };
}
