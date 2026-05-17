import { PHASE_6_COMMAND_MATRIX } from '../plan/command-matrix.js';
import type { CliCommandSpec } from '../plan/command-matrix.js';
import type { CliContext } from '../services/types.js';

export interface CliCommandHandler {
  execute(args: readonly string[], context: CliContext): Promise<unknown>;
}

export interface CliCommandRegistration {
  spec: CliCommandSpec;
  handler?: CliCommandHandler;
}

export const COMMAND_REGISTRY: ReadonlyArray<CliCommandRegistration> =
  PHASE_6_COMMAND_MATRIX.map((spec) => ({ spec }));

export function findCommand(command: string): CliCommandRegistration | undefined {
  return COMMAND_REGISTRY.find((entry) => entry.spec.command === command);
}

export function listAvailableCommands(): ReadonlyArray<string> {
  return COMMAND_REGISTRY.map((entry) => entry.spec.command);
}
