export interface LocalSummaryQuery {
  user_id: number;
  from?: string;
  to?: string;
}

export interface LocalAccountBalancesQuery {
  user_id: number;
}

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createReportsRepository: (db: unknown) => {
    getUserFinanceSummary: (
      userId: number,
      filter?: { dateFrom?: string; dateTo?: string }
    ) => Promise<unknown>;
    getAccountBalancesByUser: (userId: number) => Promise<unknown>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function getLocalReportsSummary(query: LocalSummaryQuery): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createReportsRepository(db);
    return await repo.getUserFinanceSummary(query.user_id, {
      ...(query.from ? { dateFrom: query.from } : {}),
      ...(query.to ? { dateTo: query.to } : {})
    });
  } finally {
    await db.destroy();
  }
}

export async function getLocalAccountBalances(
  query: LocalAccountBalancesQuery
): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createReportsRepository(db);
    return await repo.getAccountBalancesByUser(query.user_id);
  } finally {
    await db.destroy();
  }
}

