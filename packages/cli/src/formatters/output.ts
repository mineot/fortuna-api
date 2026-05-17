import type { CliOutputFormat } from '../config/cli-config.js';

export function formatOutput(payload: unknown, format: CliOutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(payload, null, 2);
  }

  if (payload === null || payload === undefined) {
    return '';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  return JSON.stringify(payload, null, 2);
}

