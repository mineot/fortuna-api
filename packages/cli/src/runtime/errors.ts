export type CliErrorCode =
  | 'UNKNOWN_COMMAND'
  | 'COMMAND_NOT_IMPLEMENTED'
  | 'VALIDATION_ERROR'
  | 'MODE_ERROR'
  | 'AUTH_REQUIRED'
  | 'API_ERROR'
  | 'INTERNAL_ERROR';

export interface CliErrorPayload {
  code: CliErrorCode;
  message: string;
}

export interface CliErrorEnvelope {
  ok: false;
  error: CliErrorPayload;
}

export interface CliSuccessEnvelope<T> {
  ok: true;
  data: T;
}

export const CLI_EXIT_CODE = {
  SUCCESS: 0,
  USAGE: 2,
  MODE: 3,
  AUTH: 4,
  API: 5,
  INTERNAL: 1
} as const;

export function normalizeCliError(error: unknown): CliErrorPayload {
  const message = error instanceof Error ? error.message : 'Unexpected CLI runtime error';

  if (message.includes('No saved session token')) {
    return { code: 'AUTH_REQUIRED', message };
  }

  if (message.includes('Remote adapter required') || message.includes('requires remote mode')) {
    return { code: 'MODE_ERROR', message };
  }

  if (message.startsWith('Missing required flag') || message.startsWith('Invalid ')) {
    return { code: 'VALIDATION_ERROR', message };
  }

  if (/^[A-Z0-9_]+:\s/.test(message) || message.includes('API_ERROR')) {
    return { code: 'API_ERROR', message };
  }

  return { code: 'INTERNAL_ERROR', message };
}

export function exitCodeForError(code: CliErrorCode): number {
  if (code === 'UNKNOWN_COMMAND' || code === 'COMMAND_NOT_IMPLEMENTED' || code === 'VALIDATION_ERROR') {
    return CLI_EXIT_CODE.USAGE;
  }
  if (code === 'MODE_ERROR') return CLI_EXIT_CODE.MODE;
  if (code === 'AUTH_REQUIRED') return CLI_EXIT_CODE.AUTH;
  if (code === 'API_ERROR') return CLI_EXIT_CODE.API;
  return CLI_EXIT_CODE.INTERNAL;
}

