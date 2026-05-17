import type { CliMode } from '../plan/command-matrix.js';

export type CliOutputFormat = 'human' | 'json';
export type EnvMap = Record<string, string | undefined>;

export interface CliConfig {
  mode: CliMode;
  output: CliOutputFormat;
  environment: 'DEV' | 'PROD';
  apiBaseUrl: string;
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function readFlagValue(flag: string, args: readonly string[]): string | undefined {
  const index = args.findIndex((arg) => arg === flag);
  if (index < 0) return undefined;
  return args[index + 1];
}

export function resolveCliMode(args: readonly string[], env: EnvMap): CliMode {
  const modeArg = readFlagValue('--mode', args);
  const mode = modeArg ?? env.FORTUNA_CLI_MODE ?? 'local';
  if (mode === 'local' || mode === 'remote') return mode;
  return 'local';
}

export function resolveOutputFormat(
  args: readonly string[],
  env: EnvMap
): CliOutputFormat {
  const outputArg = readFlagValue('--output', args);
  const output = outputArg ?? env.FORTUNA_CLI_OUTPUT ?? 'human';
  if (output === 'human' || output === 'json') return output;
  return 'human';
}

export function createCliConfig(
  args: readonly string[],
  env: EnvMap = {}
): CliConfig {
  const environment = env.FORTUNA_ENV === 'PROD' ? 'PROD' : 'DEV';
  return {
    mode: resolveCliMode(args, env),
    output: resolveOutputFormat(args, env),
    environment,
    apiBaseUrl: env.FORTUNA_API_BASE_URL ?? DEFAULT_API_BASE_URL
  };
}
