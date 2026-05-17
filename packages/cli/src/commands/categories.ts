import {
  createLocalCategory,
  listLocalCategories
} from '../adapters/local/categories-client.js';
import {
  createRemoteCategory,
  listRemoteCategories
} from '../adapters/remote/categories-client.js';
import { getFlagValue } from '../services/args.js';
import type { CliCommandHandler } from './registry.js';

function asPositiveInt(value: string | undefined, flag: string): number {
  if (!value) throw new Error(`Missing required flag: ${flag}`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid value for ${flag}`);
  return n;
}

function asCategoryType(value: string | undefined): 'income' | 'expense' {
  if (value !== 'income' && value !== 'expense') {
    throw new Error('Invalid --type. Use income or expense.');
  }
  return value;
}

export const categoriesCreateHandler: CliCommandHandler = {
  async execute(args, context) {
    const category_group_id = asPositiveInt(
      getFlagValue(args, '--category-group-id'),
      '--category-group-id'
    );
    const name = (getFlagValue(args, '--name') ?? '').trim();
    const type = asCategoryType(getFlagValue(args, '--type'));
    if (!name) throw new Error('Missing required flag: --name');

    if (context.mode === 'remote') {
      const category = await createRemoteCategory(context, { category_group_id, name, type });
      return { category };
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    const category = await createLocalCategory({ user_id, category_group_id, name, type });
    return { category };
  }
};

export const categoriesListHandler: CliCommandHandler = {
  async execute(args, context) {
    const page = Number(getFlagValue(args, '--page') ?? '1');
    const page_size = Number(getFlagValue(args, '--page-size') ?? '20');
    const groupFlag = getFlagValue(args, '--category-group-id');
    const typeFlag = getFlagValue(args, '--type');
    const type = typeFlag ? asCategoryType(typeFlag) : undefined;

    if (context.mode === 'remote') {
      return listRemoteCategories(context, {
        page,
        page_size,
        ...(groupFlag ? { category_group_id: asPositiveInt(groupFlag, '--category-group-id') } : {}),
        ...(type ? { type } : {})
      });
    }

    const user_id = asPositiveInt(
      getFlagValue(args, '--user-id') ?? String(context.config.localUserId),
      '--user-id'
    );
    return listLocalCategories({
      user_id,
      page,
      page_size,
      ...(groupFlag ? { category_group_id: asPositiveInt(groupFlag, '--category-group-id') } : {}),
      ...(type ? { type } : {})
    });
  }
};

