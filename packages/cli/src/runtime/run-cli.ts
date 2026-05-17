import { findCommand, listAvailableCommands } from '../commands/registry.js';
import { formatOutput } from '../formatters/output.js';
import { createCliContext } from '../services/container.js';
import { parseArgv } from './argv.js';
import {
  CLI_EXIT_CODE,
  exitCodeForError,
  normalizeCliError,
  type CliErrorEnvelope,
  type CliSuccessEnvelope
} from './errors.js';

export interface RunCliInput {
  argv: readonly string[];
  env?: Record<string, string | undefined>;
}

export interface RunCliResult {
  exitCode: number;
  output: string;
}

export async function runCli(input: RunCliInput): Promise<RunCliResult> {
  const context = createCliContext({
    args: input.argv,
    env: input.env ?? {}
  });
  const parsed = parseArgv(input.argv);

  if (!parsed.command || parsed.command === 'help' || parsed.command === '--help') {
    const payload: CliSuccessEnvelope<{
      mode: string;
      output: string;
      commands: ReadonlyArray<string>;
    }> = {
      ok: true,
      data: {
        mode: context.mode,
        output: context.config.output,
        commands: listAvailableCommands()
      }
    };
    return {
      exitCode: CLI_EXIT_CODE.SUCCESS,
      output: formatOutput(payload, context.config.output)
    };
  }

  const registration = findCommand(parsed.command);
  if (!registration) {
    const payload: CliErrorEnvelope = {
      ok: false,
      error: {
        code: 'UNKNOWN_COMMAND',
        message: `Unknown command: ${parsed.command}`
      }
    };
    return {
      exitCode: exitCodeForError(payload.error.code),
      output: formatOutput({ ...payload, commands: listAvailableCommands() }, context.config.output)
    };
  }

  if (!registration.handler) {
    const payload: CliErrorEnvelope = {
      ok: false,
      error: {
        code: 'COMMAND_NOT_IMPLEMENTED',
        message: `Command not implemented yet: ${registration.spec.command}`
      }
    };
    return {
      exitCode: exitCodeForError(payload.error.code),
      output: formatOutput(
        {
          ...payload,
          milestone: registration.spec.milestone,
          modes: registration.spec.modes
        },
        context.config.output
      )
    };
  }

  try {
    const payload = await registration.handler.execute(parsed.commandArgs, context);
    const success: CliSuccessEnvelope<unknown> = {
      ok: true,
      data: payload ?? { ok: true }
    };
    return {
      exitCode: CLI_EXIT_CODE.SUCCESS,
      output: formatOutput(success, context.config.output)
    };
  } catch (error: unknown) {
    const normalized = normalizeCliError(error);
    const payload: CliErrorEnvelope = {
      ok: false,
      error: normalized
    };
    return {
      exitCode: exitCodeForError(normalized.code),
      output: formatOutput(payload, context.config.output)
    };
  }
}
