import { createCliConfig } from '../config/cli-config.js';
import { createLocalAdapter } from '../adapters/local/local-adapter.js';
import { createRemoteAdapter } from '../adapters/remote/remote-adapter.js';
import { consoleLogger, createSessionProvider, systemClock } from './defaults.js';
import type { CliContext, CliLogger, Clock, SessionStore } from './types.js';
import type { EnvMap } from '../config/cli-config.js';
import { createFileSessionStore } from './session/file-session-store.js';

export interface CreateCliContextInput {
  args: readonly string[];
  env?: EnvMap;
  logger?: CliLogger;
  clock?: Clock;
  sessionStore?: SessionStore;
}

function createRequestId(clock: Clock): string {
  const timestamp = clock.now().toISOString();
  const random = Math.random().toString(36).slice(2, 10);
  return `cli-${timestamp}-${random}`;
}

export function createCliContext(input: CreateCliContextInput): CliContext {
  const clock = input.clock ?? systemClock;
  const config = createCliConfig(input.args, input.env);
  const sessionStore =
    input.sessionStore ?? createFileSessionStore(config.sessionFilePath);

  const adapter =
    config.mode === 'local'
      ? createLocalAdapter(config.environment)
      : createRemoteAdapter(config.apiBaseUrl, config.environment);

  return {
    requestId: createRequestId(clock),
    startedAt: clock.now(),
    mode: config.mode,
    config,
    logger: input.logger ?? consoleLogger,
    clock,
    sessionStore,
    sessionProvider: createSessionProvider(sessionStore),
    adapter
  };
}
