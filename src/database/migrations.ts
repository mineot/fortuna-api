export type Migration = {
  version: number;
  name: string;
  statements: string[];
};

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'create migrations table',
    statements: [
      `
      CREATE TABLE IF NOT EXISTS migrations (
        version     INTEGER PRIMARY KEY,
        name        TEXT NOT NULL,
        applied_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );
      `,
    ],
  },
];
