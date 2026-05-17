export interface LocalListCreditCardsInput {
  user_id: number;
  page: number;
  page_size: number;
}

export interface LocalPurchaseCreditCardInput {
  credit_card_id: number;
  category_id: number;
  payee_id: number | null;
  description: string;
  total_amount: number;
  installment_count: number;
  purchase_date: string;
}

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createCreditCardsRepository: (db: unknown) => {
    listByUser: (userId: number, filters: { limit: number; offset: number }) => Promise<unknown[]>;
  };
  createCreditCardPurchasesRepository: (db: unknown) => {
    create: (payload: LocalPurchaseCreditCardInput) => Promise<unknown>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function listLocalCreditCards(
  query: LocalListCreditCardsInput
): Promise<{ data: unknown[]; page: number; page_size: number; total: number }> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createCreditCardsRepository(db);
    const page = Math.max(query.page, 1);
    const limit = Math.max(query.page_size, 1);
    const offset = (page - 1) * limit;
    const data = await repo.listByUser(query.user_id, { limit, offset });
    return { data, page, page_size: limit, total: data.length };
  } finally {
    await db.destroy();
  }
}

export async function createLocalCreditCardPurchase(
  payload: LocalPurchaseCreditCardInput
): Promise<unknown> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createCreditCardPurchasesRepository(db);
    return await repo.create(payload);
  } finally {
    await db.destroy();
  }
}

