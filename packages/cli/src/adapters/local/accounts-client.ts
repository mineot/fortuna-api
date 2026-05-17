type AccountType = {
  id: number;
  user_id: number;
  account_type_id: number;
  name: string;
  initial_balance: number;
  notes: string | null;
};

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createAccountsRepository: (db: unknown) => {
    create: (payload: {
      user_id: number;
      account_type_id: number;
      name: string;
      initial_balance: number;
      notes: string | null;
    }) => Promise<AccountType>;
    listByUser: (
      userId: number,
      filters: { limit: number; offset: number; accountTypeId?: number }
    ) => Promise<AccountType[]>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function createLocalAccount(payload: {
  user_id: number;
  account_type_id: number;
  name: string;
  initial_balance: number;
  notes: string | null;
}): Promise<AccountType> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createAccountsRepository(db);
    return await repo.create(payload);
  } finally {
    await db.destroy();
  }
}

export async function listLocalAccounts(query: {
  user_id: number;
  page: number;
  page_size: number;
  account_type_id?: number;
}): Promise<{ data: AccountType[]; page: number; page_size: number; total: number }> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createAccountsRepository(db);
    const limit = Math.max(query.page_size, 1);
    const offset = (Math.max(query.page, 1) - 1) * limit;
    const data = await repo.listByUser(query.user_id, {
      limit,
      offset,
      ...(query.account_type_id !== undefined ? { accountTypeId: query.account_type_id } : {})
    });
    return { data, page: Math.max(query.page, 1), page_size: limit, total: data.length };
  } finally {
    await db.destroy();
  }
}

