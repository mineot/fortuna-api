import { existsSync } from 'node:fs';
import { SqliteDialect } from 'kysely';

import {
  DatabaseSync,
  type DatabaseSyncOptions,
  type SQLInputValue,
  type StatementSync,
} from 'node:sqlite';

import { createDatabaseClient, destroyDatabaseClient, type DatabaseClient } from '../../client';

const DEFAULT_PRAGMAS = ['foreign_keys = ON'] as const;

export interface CreateSqliteDatabaseOptions {
  filename: string;
  readonly?: boolean;
  fileMustExist?: boolean;
  timeout?: number;
  pragmas?: readonly string[];
}

type SqliteStatementLike = {
  readonly reader: boolean;
  all(parameters: ReadonlyArray<unknown>): unknown[];
  run(parameters: ReadonlyArray<unknown>): {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  };
  iterate(parameters: ReadonlyArray<unknown>): IterableIterator<unknown>;
};

type SqliteDatabaseLike = {
  close(): void;
  prepare(sql: string): SqliteStatementLike;
};

class NodeSqliteStatementAdapter implements SqliteStatementLike {
  #statement: StatementSync;
  #isReader: boolean | undefined;

  constructor(statement: StatementSync) {
    this.#statement = statement;
  }

  get reader(): boolean {
    if (this.#isReader === undefined) {
      this.#isReader = this.#statement.columns().length > 0;
    }

    return this.#isReader;
  }

  #toSqlInputValues(parameters: ReadonlyArray<unknown>): SQLInputValue[] {
    return parameters as SQLInputValue[];
  }

  all(parameters: ReadonlyArray<unknown>): unknown[] {
    return this.#statement.all(...this.#toSqlInputValues(parameters));
  }

  run(parameters: ReadonlyArray<unknown>): { changes: number | bigint; lastInsertRowid: number | bigint } {
    return this.#statement.run(...this.#toSqlInputValues(parameters));
  }

  iterate(parameters: ReadonlyArray<unknown>): IterableIterator<unknown> {
    return this.#statement.iterate(...this.#toSqlInputValues(parameters));
  }
}

class NodeSqliteDatabaseAdapter implements SqliteDatabaseLike {
  #database: DatabaseSync;

  constructor(database: DatabaseSync) {
    this.#database = database;
  }

  close(): void {
    this.#database.close();
  }

  prepare(sql: string): SqliteStatementLike {
    return new NodeSqliteStatementAdapter(this.#database.prepare(sql));
  }

  exec(sql: string): void {
    this.#database.exec(sql);
  }
}

export const createSqliteDatabase = (
  options: CreateSqliteDatabaseOptions,
): DatabaseClient => {
  if (options.fileMustExist === true && !existsSync(options.filename)) {
    throw new Error(`SQLite database file does not exist: ${options.filename}`);
  }

  const sqliteOptions: DatabaseSyncOptions = {
    readOnly: options.readonly ?? false,
    timeout: options.timeout,
  };

  const sqlite = new NodeSqliteDatabaseAdapter(new DatabaseSync(options.filename, sqliteOptions));

  const pragmas = options.pragmas ?? DEFAULT_PRAGMAS;
  for (const pragma of pragmas) {
    sqlite.exec(`PRAGMA ${pragma}`);
  }

  return createDatabaseClient({
    dialect: new SqliteDialect({
      database: sqlite as never,
    }),
  });
};

export const destroySqliteDatabase = destroyDatabaseClient;
