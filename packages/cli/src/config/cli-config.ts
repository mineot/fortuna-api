import type { CliMode } from '../plan/command-matrix.js';

export type CliOutputFormat = 'human' | 'json';
export type EnvMap = Record<string, string | undefined>;

export interface CliConfig {
  mode: CliMode;
  output: CliOutputFormat;
  environment: 'DEV' | 'PROD';
  apiBaseUrl: string;
  sessionFilePath: string;
  localUserId: number;
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_SESSION_FILE_DEV = '.fortuna/session.dev.json';
const DEFAULT_SESSION_FILE_PROD = '.fortuna/session.prod.json';

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
  const sessionFilePath =
    env.FORTUNA_CLI_SESSION_FILE ??
    (environment === 'PROD' ? DEFAULT_SESSION_FILE_PROD : DEFAULT_SESSION_FILE_DEV);
  const localUserIdRaw = env.FORTUNA_CLI_USER_ID ?? '1';
  const localUserId = Number(localUserIdRaw);
  return {
    mode: resolveCliMode(args, env),
    output: resolveOutputFormat(args, env),
    environment,
    apiBaseUrl: env.FORTUNA_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    sessionFilePath,
    localUserId:
      Number.isFinite(localUserId) && Number.isInteger(localUserId) && localUserId > 0
        ? localUserId
        : 1
  };
}
