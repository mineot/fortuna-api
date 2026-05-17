import { findCommand, listAvailableCommands } from '../commands/registry.js';
import { formatOutput } from '../formatters/output.js';
import { createCliContext } from '../services/container.js';
import { parseArgv } from './argv.js';

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
    return {
      exitCode: 0,
      output: formatOutput(
        {
          mode: context.mode,
          output: context.config.output,
          commands: listAvailableCommands()
        },
        context.config.output
      )
    };
  }

  const registration = findCommand(parsed.command);
  if (!registration) {
    return {
      exitCode: 1,
      output: formatOutput(
        {
          error: `Unknown command: ${parsed.command}`,
          commands: listAvailableCommands()
        },
        context.config.output
      )
    };
  }

  if (!registration.handler) {
    return {
      exitCode: 2,
      output: formatOutput(
        {
          error: `Command not implemented yet: ${registration.spec.command}`,
          milestone: registration.spec.milestone,
          modes: registration.spec.modes
        },
        context.config.output
      )
    };
  }

  const payload = await registration.handler.execute(parsed.commandArgs, context);
  return {
    exitCode: 0,
    output: formatOutput(payload ?? { ok: true }, context.config.output)
  };
}
