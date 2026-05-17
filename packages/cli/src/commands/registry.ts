import { PHASE_6_COMMAND_MATRIX } from '../plan/command-matrix.js';
import type { CliCommandSpec } from '../plan/command-matrix.js';

export interface CliCommandHandler {
  execute(args: readonly string[]): Promise<void>;
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

