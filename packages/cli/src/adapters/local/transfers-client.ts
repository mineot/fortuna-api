export interface LocalCreateTransferInput {
  user_id: number;
  source_account_id: number;
  destination_account_id: number;
  amount: number;
  date: string;
  description: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface LocalListTransfersInput {
  user_id: number;
  page: number;
  page_size: number;
  source_account_id?: number;
  destination_account_id?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  date_from?: string;
  date_to?: string;
}

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createTransfersRepository: (db: unknown) => {
    create: (payload: LocalCreateTransferInput) => Promise<unknown>;
    listByUser: (
      userId: number,
      filters: {
        limit: number;
        offset: number;
        sourceAccountId?: number;
        destinationAccountId?: number;
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

export async function createLocalTransfer(payload: LocalCreateTransferInput): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createTransfersRepository(db);
    return await repo.create(payload);
  } finally {
    await db.destroy();
  }
}

export async function listLocalTransfers(
  query: LocalListTransfersInput
): Promise<{ data: unknown[]; page: number; page_size: number; total: number }> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createTransfersRepository(db);
    const page = Math.max(query.page, 1);
    const limit = Math.max(query.page_size, 1);
    const offset = (page - 1) * limit;
    const data = await repo.listByUser(query.user_id, {
      limit,
      offset,
      ...(query.source_account_id !== undefined ? { sourceAccountId: query.source_account_id } : {}),
      ...(query.destination_account_id !== undefined
        ? { destinationAccountId: query.destination_account_id }
        : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.date_from !== undefined ? { dateFrom: query.date_from } : {}),
      ...(query.date_to !== undefined ? { dateTo: query.date_to } : {})
    });
    return { data, page, page_size: limit, total: data.length };
  } finally {
    await db.destroy();
  }
}

