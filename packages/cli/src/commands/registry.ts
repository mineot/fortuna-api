import { PHASE_6_COMMAND_MATRIX } from '../plan/command-matrix.js';
import type { CliCommandSpec } from '../plan/command-matrix.js';
import type { CliContext } from '../services/types.js';
import {
  authLoginHandler,
  authLogoutHandler,
  authMeHandler,
  authRefreshHandler
} from './auth.js';
import { transactionsCreateHandler, transactionsListHandler } from './transactions.js';

export interface CliCommandHandler {
  execute(args: readonly string[], context: CliContext): Promise<unknown>;
}

export interface CliCommandRegistration {
  spec: CliCommandSpec;
  handler?: CliCommandHandler;
}

const commandHandlers: Record<string, CliCommandHandler> = {
  'auth login': authLoginHandler,
  'auth refresh': authRefreshHandler,
  'auth logout': authLogoutHandler,
  'auth me': authMeHandler,
  'transactions create': transactionsCreateHandler,
  'transactions list': transactionsListHandler
};

export const COMMAND_REGISTRY: ReadonlyArray<CliCommandRegistration> = PHASE_6_COMMAND_MATRIX.map(
  (spec) => {
    const handler = commandHandlers[spec.command];
    if (!handler) {
      return { spec };
    }
    return { spec, handler };
  }
);

export function findCommand(command: string): CliCommandRegistration | undefined {
  return COMMAND_REGISTRY.find((entry) => entry.spec.command === command);
}

export function listAvailableCommands(): ReadonlyArray<string> {
  return COMMAND_REGISTRY.map((entry) => entry.spec.command);
}
