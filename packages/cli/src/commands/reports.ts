import {
  getLocalAccountBalances,
  getLocalReportsSummary
} from '../adapters/local/reports-client.js';
import {
  getRemoteAccountBalances,
  getRemoteReportsSummary
} from '../adapters/remote/reports-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid value for ${flag}`);
  return n;
}

export const reportsSummaryHandler: CliCommandHandler = {
  async execute(args, context) {
    const from = getFlagValue(args, '--from');
    const to = getFlagValue(args, '--to');
    if (context.mode === 'remote') {
      return getRemoteReportsSummary(context, { ...(from ? { from } : {}), ...(to ? { to } : {}) });
    }
    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    return getLocalReportsSummary({ user_id, ...(from ? { from } : {}), ...(to ? { to } : {}) });
  }
};

export const reportsAccountBalancesHandler: CliCommandHandler = {
  async execute(args, context) {
    if (context.mode === 'remote') {
      return getRemoteAccountBalances(context);
    }
    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    return getLocalAccountBalances({ user_id });
  }
};

