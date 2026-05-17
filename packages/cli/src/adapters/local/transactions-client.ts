export interface LocalCreateTransactionInput {
  user_id: number;
  account_id: number;
  category_id: number;
  payee_id: number | null;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string | null;
}

export interface LocalListTransactionsInput {
  user_id: number;
  page: number;
  page_size: number;
  account_id?: number;
  category_id?: number;
  payee_id?: number;
  type?: 'income' | 'expense';
  status?: 'pending' | 'confirmed' | 'cancelled';
  date_from?: string;
  date_to?: string;
}

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createTransactionsRepository: (db: unknown) => {
    create: (payload: LocalCreateTransactionInput) => Promise<unknown>;
    listByUser: (
      userId: number,
      filters: {
        limit: number;
        offset: number;
        accountId?: number;
        categoryId?: number;
        payeeId?: number;
        type?: 'income' | 'expense';
        status?: 'pending' | 'confirmed' | 'cancelled';
        dateFrom?: string;
        dateTo?: string;
      }
    ) => Promise<unknown[]>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function createLocalTransaction(payload: LocalCreateTransactionInput): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repository = dbModule.createTransactionsRepository(db);
    const created = await repository.create(payload);
    return created;
  } finally {
    await db.destroy();
  }
}

export async function listLocalTransactions(
  query: LocalListTransactionsInput
): Promise<{ data: unknown[]; page: number; page_size: number; total: number }> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repository = dbModule.createTransactionsRepository(db);
    const offset = (Math.max(query.page, 1) - 1) * Math.max(query.page_size, 1);
    const limit = Math.max(query.page_size, 1);
    const data = await repository.listByUser(query.user_id, {
      limit,
      offset,
      ...(query.account_id !== undefined ? { accountId: query.account_id } : {}),
      ...(query.category_id !== undefined ? { categoryId: query.category_id } : {}),
      ...(query.payee_id !== undefined ? { payeeId: query.payee_id } : {}),
      ...(query.type !== undefined ? { type: query.type } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
      ...(query.date_to !== undefined ? { dateTo: query.date_to } : {})
    });

    return {
      data,
      page: Math.max(query.page, 1),
      page_size: limit,
      total: data.length
    };
  } finally {
    await db.destroy();
  }
}
