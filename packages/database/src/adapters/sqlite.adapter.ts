import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, resolve } from 'node:path';
import { env } from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import type { Database as FortunaDatabase } from '@repo/shared';
import { Kysely, SqliteDialect, type SqliteDatabase, type SqliteStatement } from 'kysely';

export const SQLITE_FILE_PROTOCOL = 'file:';

export const SQLITE_DEFAULT_FILENAME_BY_ENV = {
  DEV: 'dev.db',
  PROD: '.fortuna/fortuna.db',
} as const;

export const SQLITE_DEFAULT_PRAGMAS = ['foreign_keys = ON', 'journal_mode = WAL'] as const;

const PROJECT_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

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

  return resolve(PROJECT_ROOT, SQLITE_DEFAULT_FILENAME_BY_ENV.DEV);
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

  return resolve(PROJECT_ROOT, normalizedUrl);
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

  if (!isMemoryDatabase(filename) && fileMustExist && !existsSync(filename)) {
    throw new Error(`SQLite database file does not exist: ${filename}`);
  }

  const nativeDatabase = new DatabaseSync(filename, {
    readOnly: readonly ?? false,
  });

  for (const pragma of pragmas) {
    nativeDatabase.exec(`PRAGMA ${pragma}`);
  }

  return {
    close: () => nativeDatabase.close(),
    prepare: (sql): SqliteStatement => {
      const statement = nativeDatabase.prepare(sql);
      const asPositional = (parameters: ReadonlyArray<unknown>): unknown[] => [...parameters];

      return {
        reader: statement.columns().length > 0,
        all: (parameters) => statement.all(...asPositional(parameters) as []),
        run: (parameters) => statement.run(...asPositional(parameters) as []),
        iterate: (parameters) => statement.iterate(...asPositional(parameters) as []),
      };
    },
  };
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

export const createSqliteKysely = <TDatabase extends object = FortunaDatabase>(
  options: CreateSqliteAdapterOptions = {},
): Kysely<TDatabase> => {
  const { dialect } = createSqliteAdapter(options);

  return new Kysely<TDatabase>({ dialect });
};
