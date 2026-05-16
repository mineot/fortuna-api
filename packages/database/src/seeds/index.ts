export * from './global';
export * from './user';

import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { createSqliteDatabase, destroySqliteDatabase } from '../adapters/sqlite';

import { seedAccountTypes } from './global';
import { seedUserCategoryGroupsAndCategories } from './user';

export interface RunSeedsOptions {
  dbFilePath?: string;
  userId?: number;
}

export interface RunSeedsResult {
  accountTypes: Awaited<ReturnType<typeof seedAccountTypes>>;
  userCategories?: Awaited<ReturnType<typeof seedUserCategoryGroupsAndCategories>>;
}

const DEFAULT_DB_FILE_PATH = join(process.cwd(), 'data', 'fortuna.sqlite');

const parseUserId = (input: string | undefined): number | undefined => {
  if (input === undefined) {
    return undefined;
  }

  const parsed = Number(input);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid user id: ${input}. Use a positive integer.`);
  }

  return parsed;
};

const isPositiveIntegerText = (value: string): boolean => /^[1-9]\d*$/.test(value);

export const runSeeds = async (options: RunSeedsOptions = {}): Promise<RunSeedsResult> => {
  const dbFilePath = options.dbFilePath ?? DEFAULT_DB_FILE_PATH;
  await mkdir(dirname(dbFilePath), { recursive: true });

  const db = createSqliteDatabase({ filename: dbFilePath });

  try {
    const accountTypes = await seedAccountTypes(db);
    const userCategories =
      options.userId === undefined
        ? undefined
        : await seedUserCategoryGroupsAndCategories(db, options.userId);

    if (userCategories === undefined) {
      return {
        accountTypes,
      };
    }

    return {
      accountTypes,
      userCategories,
    };
  } finally {
    await destroySqliteDatabase(db);
  }
};

const runCli = async (): Promise<void> => {
  const firstArg = process.argv[2];
  const secondArg = process.argv[3];
  const userId = firstArg !== undefined && isPositiveIntegerText(firstArg) ? parseUserId(firstArg) : undefined;
  const dbFilePath =
    firstArg === undefined
      ? undefined
      : userId === undefined
        ? firstArg
        : secondArg;
  const options: RunSeedsOptions = {};

  if (userId !== undefined) {
    options.userId = userId;
  }

  if (dbFilePath !== undefined) {
    options.dbFilePath = dbFilePath;
  }

  const result = await runSeeds(options);
  console.info(`[database:seed] Account types inserted: ${result.accountTypes.inserted.length}`);

  if (result.userCategories !== undefined) {
    console.info(
      `[database:seed] User ${result.userCategories.userId} groups inserted: ${result.userCategories.insertedGroups.length}`,
    );
    console.info(
      `[database:seed] User ${result.userCategories.userId} categories inserted: ${result.userCategories.insertedCategories.length}`,
    );
  }
};

if (process.argv[1]?.endsWith('/src/seeds/index.ts')) {
  await runCli();
}
