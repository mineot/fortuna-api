import { createLocalAccount, listLocalAccounts } from '../adapters/local/accounts-client.js';
import { createRemoteAccount, listRemoteAccounts } from '../adapters/remote/accounts-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid value for ${flag}`);
  return n;
}

export const accountsCreateHandler: CliCommandHandler = {
  async execute(args, context) {
    const account_type_id = asPositiveInt(getFlagValue(args, '--account-type-id'), '--account-type-id');
    const name = (getFlagValue(args, '--name') ?? '').trim();
    const initial_balance = Number(getFlagValue(args, '--initial-balance') ?? '0');
    const notes = getFlagValue(args, '--notes') ?? null;
    if (!name) throw new Error('Missing required flag: --name');
    if (!Number.isInteger(initial_balance)) throw new Error('Invalid --initial-balance. Expected integer cents.');

    if (context.mode === 'remote') {
      const account = await createRemoteAccount(context, { account_type_id, name, initial_balance, notes });
      return { account };
    }

    const user_id = asPositiveInt(getFlagValue(args, '--user-id') ?? String(context.config.localUserId), '--user-id');
    const account = await createLocalAccount({ user_id, account_type_id, name, initial_balance, notes });
    return { account };
  }
};

export const accountsListHandler: CliCommandHandler = {
  async execute(args, context) {
    const page = Number(getFlagValue(args, '--page') ?? '1');
    const page_size = Number(getFlagValue(args, '--page-size') ?? '20');
    const accountTypeFlag = getFlagValue(args, '--account-type-id');
    if (context.mode === 'remote') {
      return listRemoteAccounts(context, {
        page,
        page_size,
        ...(accountTypeFlag ? { account_type_id: asPositiveInt(accountTypeFlag, '--account-type-id') } : {})
      });
    }
    const user_id = asPositiveInt(getFlagValue(args, '--user-id') ?? String(context.config.localUserId), '--user-id');
    return listLocalAccounts({
      user_id,
      page,
      page_size,
      ...(accountTypeFlag ? { account_type_id: asPositiveInt(accountTypeFlag, '--account-type-id') } : {})
    });
  }
};

