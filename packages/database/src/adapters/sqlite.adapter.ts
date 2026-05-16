import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { cwd, env } from 'node:process';

import type { Database as FortunaDatabase } from '@repo/shared';
import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect, type SqliteDatabase } from 'kysely';

export const SQLITE_FILE_PROTOCOL = 'file:';

export const SQLITE_DEFAULT_FILENAME_BY_ENV = {
  DEV: 'dev.db',
  PROD: '.fortuna/fortuna.db',
} as const;

export const SQLITE_DEFAULT_PRAGMAS = ['foreign_keys = ON', 'journal_mode = WAL'] as const;

export interface CreateSqliteAdapterOptions {
  databaseUrl?: string;
  pragmas?: readonly string[];
  readonly?: boolean;
  fileMustExist?: boolean;
}

export interface SqliteConnectionArtifacts {
  database: SqliteDatabase;
  dialect: SqliteDialect;
}

const isMemoryDatabase = (value: string): boolean =>
  value === ':memory:' || value.startsWith('file::memory:');

const resolveFortunaEnvironment = (): keyof typeof SQLITE_DEFAULT_FILENAME_BY_ENV =>
  env.FORTUNA_ENV === 'PROD' ? 'PROD' : 'DEV';

const isValidDatabasePath = (value: string): boolean => {
  if (!value) {
    return false;
  }

  const baseName = value.split('/').pop();

  return Boolean(baseName && baseName.includes('.'));
};

const resolveProdDatabaseUrl = (): string => {
  const configuredPath = env.FORTUNA_DB?.trim() ?? '';

  if (isValidDatabasePath(configuredPath)) {
    return configuredPath;
  }

  return resolve(homedir(), SQLITE_DEFAULT_FILENAME_BY_ENV.PROD);
};

const getDefaultDatabaseUrl = (): string => {
  const fortunaEnvironment = resolveFortunaEnvironment();

  if (fortunaEnvironment === 'PROD') {
    return resolveProdDatabaseUrl();
  }

  return resolve(cwd(), SQLITE_DEFAULT_FILENAME_BY_ENV.DEV);
};

const stripFileProtocol = (value: string): string => value.slice(SQLITE_FILE_PROTOCOL.length);

const normalizeSqliteFilename = (databaseUrl: string): string => {
  if (isMemoryDatabase(databaseUrl)) {
    return databaseUrl;
  }

  const normalizedUrl = databaseUrl.startsWith(SQLITE_FILE_PROTOCOL)
    ? stripFileProtocol(databaseUrl)
    : databaseUrl;

  if (isAbsolute(normalizedUrl)) {
    return normalizedUrl;
  }

  return resolve(cwd(), normalizedUrl);
};

const ensureSqliteDirectory = (filename: string): void => {
  if (isMemoryDatabase(filename)) {
    return;
  }

  mkdirSync(dirname(filename), { recursive: true });
};

const createSqliteDatabase = ({
  databaseUrl,
  pragmas = SQLITE_DEFAULT_PRAGMAS,
  readonly,
  fileMustExist,
}: CreateSqliteAdapterOptions): SqliteDatabase => {
  const effectiveDatabaseUrl =
    databaseUrl?.trim() || getDefaultDatabaseUrl();
  const filename = normalizeSqliteFilename(effectiveDatabaseUrl);

  ensureSqliteDirectory(filename);

  const sqlite = new BetterSqlite3(filename, {
    readonly,
    fileMustExist,
  }) as unknown as SqliteDatabase & {
    pragma: (command: string) => unknown;
  };

  for (const pragma of pragmas) {
    sqlite.pragma(pragma);
  }

  return sqlite;
};

export const createSqliteAdapter = (
  options: CreateSqliteAdapterOptions = {},
): SqliteConnectionArtifacts => {
  const database = createSqliteDatabase(options);
  const dialect = new SqliteDialect({ database });

  return {
    database,
    dialect,
  };
};

export const createSqliteKysely = (
  options: CreateSqliteAdapterOptions = {},
): Kysely<FortunaDatabase> => {
  const { dialect } = createSqliteAdapter(options);

  return new Kysely<FortunaDatabase>({ dialect });
};
