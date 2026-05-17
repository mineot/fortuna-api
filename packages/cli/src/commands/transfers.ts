import {
  createLocalTransfer,
  listLocalTransfers
} from '../adapters/local/transfers-client.js';
import {
  createRemoteTransfer,
  listRemoteTransfers
} from '../adapters/remote/transfers-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

type TransferStatus = 'pending' | 'confirmed' | 'cancelled';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid value for ${flag}. Expected positive integer.`);
  }
  return parsed;
}

function asStatus(value: string | undefined): TransferStatus {
  if (value === 'pending' || value === 'confirmed' || value === 'cancelled') {
    return value;
  }
  throw new Error('Invalid --status. Use pending, confirmed or cancelled.');
}

export const transfersCreateHandler: CliCommandHandler = {
  async execute(args, context) {
    const source_account_id = asPositiveInt(
      getFlagValue(args, '--source-account-id'),
      '--source-account-id'
    );
    const destination_account_id = asPositiveInt(
      getFlagValue(args, '--destination-account-id'),
      '--destination-account-id'
    );
    const amount = asPositiveInt(getFlagValue(args, '--amount'), '--amount');
    const date = (getFlagValue(args, '--date') ?? '').trim();
    const status = asStatus(getFlagValue(args, '--status'));
    const description = getFlagValue(args, '--description') ?? null;

    if (!date) throw new Error('Missing required flag: --date');

    if (context.mode === 'remote') {
      const transfer = await createRemoteTransfer(context, {
        source_account_id,
        destination_account_id,
        amount,
        date,
        status,
        description
      });
      return { transfer };
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    const transfer = await createLocalTransfer({
      user_id,
      source_account_id,
      destination_account_id,
      amount,
      date,
      status,
      description
    });
    return { transfer };
  }
};

export const transfersListHandler: CliCommandHandler = {
  async execute(args, context) {
    const sourceAccountFlag = getFlagValue(args, '--source-account-id');
    const destinationAccountFlag = getFlagValue(args, '--destination-account-id');
    const statusFlag = getFlagValue(args, '--status');
    const dateFromFlag = getFlagValue(args, '--from');
    const dateToFlag = getFlagValue(args, '--to');
    const page = Number(getFlagValue(args, '--page') ?? '1');
    const page_size = Number(getFlagValue(args, '--page-size') ?? '20');

    const base = {
      page,
      page_size,
      ...(sourceAccountFlag
        ? { source_account_id: asPositiveInt(sourceAccountFlag, '--source-account-id') }
        : {}),
      ...(destinationAccountFlag
        ? { destination_account_id: asPositiveInt(destinationAccountFlag, '--destination-account-id') }
        : {}),
      ...(statusFlag ? { status: asStatus(statusFlag) } : {}),
      ...(dateFromFlag ? { date_from: dateFromFlag } : {}),
      ...(dateToFlag ? { date_to: dateToFlag } : {})
    };

    if (context.mode === 'remote') {
      return listRemoteTransfers(context, base);
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    return listLocalTransfers({ user_id, ...base });
  }
};

